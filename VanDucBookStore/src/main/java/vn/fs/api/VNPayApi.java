
package vn.fs.api;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import vn.fs.entity.Notification;
import vn.fs.entity.Order;
import vn.fs.handler.NotificationWebSocketHandle;
import vn.fs.repository.NotificationRepository;
import vn.fs.repository.OrderRepository;
import vn.fs.service.VNPayService;

/**
 * REST API for VNPay payment integration.
 *
 * Endpoints:
 * - GET /api/vnpay/create-payment/{orderId} : Create payment URL
 * - GET /api/vnpay/payment-info : Verify payment result from VNPay
 */
@CrossOrigin("*")
@RestController
@RequestMapping("api/vnpay")
public class VNPayApi {

    @Autowired
    private VNPayService vnPayService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationWebSocketHandle notificationWebSocketHandle;

    @Autowired
    private vn.fs.utils.SendMailUtil senMail;

    /**
     * Create VNPay payment URL for a given order.
     * Frontend will redirect the user to this URL.
     */
    @GetMapping("create-payment/{orderId}")
    public ResponseEntity<?> createPayment(
            @PathVariable("orderId") Long orderId,
            HttpServletRequest request) {

        if (!orderRepository.existsById(orderId)) {
            return ResponseEntity.notFound().build();
        }

        Order order = orderRepository.findById(orderId).get();

        // Only allow payment for unpaid orders
        if (order.getPaymentMethod() != 1) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Đơn hàng này không sử dụng thanh toán VNPay");
            return ResponseEntity.badRequest().body(error);
        }

        String paymentUrl = vnPayService.createPaymentUrl(order, request);

        // Save the transaction reference
        order.setVnpTxnRef(String.valueOf(order.getOrdersId()));
        orderRepository.save(order);

        Map<String, String> response = new HashMap<>();
        response.put("paymentUrl", paymentUrl);
        return ResponseEntity.ok(response);
    }

    /**
     * Verify VNPay payment result.
     * Called by the frontend after VNPay redirects back with query params.
     * Validates the signature and updates the order status.
     */
    @GetMapping("payment-info")
    public ResponseEntity<?> getPaymentInfo(@RequestParam Map<String, String> params) {

        Map<String, Object> result = new HashMap<>();

        // Validate signature
        boolean isValid = vnPayService.validateSignature(params);
        if (!isValid) {
            result.put("status", "INVALID_SIGNATURE");
            result.put("message", "Chữ ký không hợp lệ");
            return ResponseEntity.ok(result);
        }

        String responseCode = params.get("vnp_ResponseCode");
        String txnRef = params.get("vnp_TxnRef");
        String amount = params.get("vnp_Amount");
        String orderInfo = params.get("vnp_OrderInfo");
        String transactionNo = params.get("vnp_TransactionNo");
        String bankCode = params.get("vnp_BankCode");
        String payDate = params.get("vnp_PayDate");

        // Update order if payment was successful
        if ("00".equals(responseCode)) {
            try {
                Long orderId = Long.parseLong(txnRef);
                if (orderRepository.existsById(orderId)) {
                    Order order = orderRepository.findById(orderId).get();
                    order.setVnpTxnRef(transactionNo != null ? transactionNo : txnRef);
                    orderRepository.save(order);

                    try {
                        String userName = order.getUser() != null ? order.getUser().getName() : "Khách hàng";
                        String msg = "đã thanh toán thành công đơn hàng #" + orderId + " qua VNPay.";

                        Notification notification = new Notification();
                        notification.setMessage(msg);
                        notification.setTime(new Date());
                        notification.setStatus(false);
                        notificationRepository.save(notification);

                        String wsPayload = "{\"user\":\"" + userName + "\",\"message\":\"" + msg + "\"}";
                        notificationWebSocketHandle.broadcast(wsPayload);
                    } catch (Exception ex) {
                        ex.printStackTrace();
                    }
                }
            } catch (NumberFormatException e) {
                // txnRef is not a valid order ID, skip update
            }

            result.put("status", "SUCCESS");
            result.put("message", "Thanh toán thành công");
        } else {
            // Thanh toán thất bại hoặc người dùng hủy giao dịch
            try {
                Long orderId = Long.parseLong(txnRef);
                if (orderRepository.existsById(orderId)) {
                    Order order = orderRepository.findById(orderId).get();
                    order.setStatus(3); // 3 = Đã hủy
                    orderRepository.save(order);
                    // senMail.sendMailOrderCancel(order);

                    try {
                        String userName = order.getUser() != null ? order.getUser().getName() : "Khách hàng";
                        String reason = "24".equals(responseCode)
                                ? "đã hủy thanh toán đơn hàng #" + orderId + " qua VNPay."
                                : "thanh toán thất bại đơn hàng #" + orderId + " qua VNPay.";

                        Notification notification = new Notification();
                        notification.setMessage(reason);
                        notification.setTime(new Date());
                        notification.setStatus(false);
                        notificationRepository.save(notification);

                        String wsPayload = "{\"user\":\"" + userName + "\",\"message\":\"" + reason + "\"}";
                        notificationWebSocketHandle.broadcast(wsPayload);
                    } catch (Exception ex) {
                        ex.printStackTrace();
                    }
                }
            } catch (NumberFormatException e) {
                // txnRef is not a valid order ID, skip update
            }

            result.put("status", "FAILED");
            result.put("message", "24".equals(responseCode) ? "Giao dịch thanh toán đã bị hủy bởi người dùng"
                    : ("Thanh toán thất bại. Mã lỗi: " + responseCode));
        }

        result.put("txnRef", txnRef);
        result.put("amount", amount != null ? Long.parseLong(amount) / 100 : 0);
        result.put("orderInfo", orderInfo);
        result.put("transactionNo", transactionNo);
        result.put("bankCode", bankCode);
        result.put("payDate", payDate);

        return ResponseEntity.ok(result);
    }
}
