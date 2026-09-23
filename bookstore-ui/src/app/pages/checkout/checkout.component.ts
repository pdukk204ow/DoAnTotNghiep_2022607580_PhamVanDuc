import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocationService, MergedProvince, District, Ward } from 'src/app/services/location.service';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { NotificationService } from 'src/app/services/notification.service';
import { AuthService } from 'src/app/services/auth.service';
import { AddressService } from 'src/app/services/address.service';
import { VnpayService } from 'src/app/services/vnpay.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {

  cartItems: any[] = [];
  placing = false;

  // 'form' | 'single' | 'select'
  mode = 'form';
  addresses: any[] = [];
  selectedAddress: any = null;

  // Payment method: 'cod' or 'vnpay'
  paymentMethod: 'cod' | 'vnpay' = 'cod';

  // Inline new-address form
  showNewForm = false;
  shippingForm = {
    label: '',
    name: '',
    phone: '',
    street: ''
  };
  saveToProfile = true;
  formError = '';

  // Vietnam Location State
  provinces: MergedProvince[] = [];
  districts: District[] = [];
  wards: Ward[] = [];
  selectedProvinceCode: number | string = '';
  selectedDistrictCode: number | string = '';
  selectedWardCode: number | string = '';
  specificAddress: string = '';
  loadingProvinces = false;
  loadingDistricts = false;
  loadingWards = false;

  get popularProvinces(): MergedProvince[] {
    return this.provinces.filter(p => p.isCity);
  }

  get provinceList(): MergedProvince[] {
    return this.provinces.filter(p => !p.isCity);
  }

  get sortedDistricts(): District[] {
    return [...this.districts].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  }

  get sortedWards(): Ward[] {
    return [...this.wards].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  }


  // Voucher / Discount
  voucherCode: string = '';
  appliedVoucher: any = null;
  voucherError: string = '';
  voucherSuccess: string = '';

  availableVouchers: any[] = [
    {
      code: 'VANDUC',
      name: 'Ưu đãi Văn Đức (Giảm 20% tối đa 50k)',
      discount: 20,
      discountType: 'PERCENT',
      minOrderAmount: 100000,
      maxDiscountAmount: 50000
    },
    {
      code: 'VANDUC10',
      name: 'Giảm 10% (đơn từ 150k)',
      discount: 10,
      discountType: 'PERCENT',
      minOrderAmount: 150000,
      maxDiscountAmount: 30000
    },
    {
      code: 'FREESHIP',
      name: 'Miễn phí vận chuyển (Giảm 20k)',
      discount: 20000,
      discountType: 'FIXED',
      minOrderAmount: 200000,
      maxDiscountAmount: 20000
    },
    {
      code: 'CHAOBANMOI',
      name: 'Giảm 20k khách mới (đơn từ 100k)',
      discount: 20000,
      discountType: 'FIXED',
      minOrderAmount: 100000,
      maxDiscountAmount: 20000
    },
    {
      code: 'BOOKLOVER',
      name: 'Giảm 15% tối đa 50k (đơn từ 250k)',
      discount: 15,
      discountType: 'PERCENT',
      minOrderAmount: 250000,
      maxDiscountAmount: 50000
    }
  ];

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private addressService: AddressService,
    private vnpayService: VnpayService,
    private router: Router,
    private notification: NotificationService,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    if (this.cartService.buyNowItem) {
      this.cartItems = [this.cartService.buyNowItem];
    } else {
      this.cartItems = this.cartService
        .getCartItems()
        .filter(item => item.selected && !item.discontinued);
    }
    this.loadAddresses();
    this.loadProvinces();
    this.fetchActiveVouchersFromApi();
  }

  ngOnDestroy(): void {
    this.cartService.clearBuyNowItem();

          // Tăng lượt dùng voucher trong MySQL nếu có áp dụng
          if (this.appliedVoucher && this.appliedVoucher.code) {
            fetch('http://localhost:8080/api/vouchers/use/' + this.appliedVoucher.code, { method: 'POST' }).catch(() => {});
          }
  }

  public fetchActiveVouchersFromApi(): void {
    fetch('http://localhost:8080/api/vouchers/active')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          this.availableVouchers = data;
        }
      })
      .catch(() => {
        // Fallback to storage
        this.syncVouchersFromStorage();
      });
  }

  public syncVouchersFromStorage(): void {
    // 1. Read from shared cross-port cookie (set from Admin port 4201)
    try {
      const match = document.cookie.match(/(^| )vanducstore_vouchers_cookie=([^;]+)/);
      if (match) {
        const decoded = decodeURIComponent(match[2]);
        const parsed = JSON.parse(decoded);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach((item: any) => {
            if (item.status) {
              const existingIdx = this.availableVouchers.findIndex(v => v.code === item.code);
              if (existingIdx !== -1) {
                this.availableVouchers[existingIdx] = item;
              } else {
                this.availableVouchers.unshift(item);
              }
            }
          });
        }
      }
    } catch (e) {}

    // 2. Read from localStorage fallback
    try {
      const stored = localStorage.getItem('vanducstore_vouchers_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach((item: any) => {
            if (item.status && !this.availableVouchers.some(v => v.code === item.code)) {
              this.availableVouchers.push(item);
            }
          });
        }
      }
    } catch (e) {}
  }

  private get email(): string {
    return this.authService.currentUser
      ? this.authService.currentUser.email
      : '';
  }

  loadAddresses(): void {
    if (!this.email) {
      this.mode = 'form';
      this.showNewForm = true;
      return;
    }

    this.addresses = this.addressService.getAddresses(this.email);

    if (this.addresses.length === 0) {
      this.mode = 'form';
      this.showNewForm = true;
    } else if (this.addresses.length === 1) {
      this.mode = 'single';
      this.selectedAddress = this.addresses[0];
    } else {
      this.mode = 'select';
      this.selectedAddress =
        this.addressService.getDefault(this.email) || this.addresses[0];
    }
  }

  selectAddress(address: any): void {
    this.selectedAddress = address;
  }

  loadProvinces(): void {
    this.loadingProvinces = true;
    this.locationService.getProvinces().subscribe(
      (data) => {
        this.provinces = data;
        this.loadingProvinces = false;
      },
      () => {
        this.loadingProvinces = false;
      }
    );
  }

  onProvinceChange(): void {
    this.districts = [];
    this.wards = [];
    this.selectedDistrictCode = '';
    this.selectedWardCode = '';
    this.syncStreetAddress();

    if (this.selectedProvinceCode) {
      this.loadingDistricts = true;
      this.locationService.getDistricts(String(this.selectedProvinceCode)).subscribe(
        (data) => {
          this.districts = data;
          this.loadingDistricts = false;
        },
        () => {
          this.loadingDistricts = false;
        }
      );
    }
  }

  onDistrictChange(): void {
    this.wards = [];
    this.selectedWardCode = '';
    this.syncStreetAddress();

    if (this.selectedDistrictCode) {
      this.loadingWards = true;
      this.locationService.getWards(Number(this.selectedDistrictCode)).subscribe(
        (data) => {
          this.wards = data;
          this.loadingWards = false;
        },
        () => {
          this.loadingWards = false;
        }
      );
    }
  }

  onWardChange(): void {
    this.syncStreetAddress();
  }

  onSpecificAddressChange(): void {
    this.syncStreetAddress();
  }

  syncStreetAddress(): void {
    const prov = this.provinces.find((p) => p.code === this.selectedProvinceCode);
    const dist = this.districts.find((d) => d.code == Number(this.selectedDistrictCode));
    const ward = this.wards.find((w) => w.code == Number(this.selectedWardCode));

    const parts = [
      (this.specificAddress || '').trim(),
      ward ? ward.name : '',
      dist ? dist.name : '',
      prov ? prov.name : ''
    ].filter(Boolean);

    this.shippingForm.street = parts.join(', ');
  }

  useNewAddress(): void {
    this.showNewForm = true;
    this.formError = '';
    this.shippingForm = { label: '', name: '', phone: '', street: '' };
    this.selectedProvinceCode = '';
    this.selectedDistrictCode = '';
    this.selectedWardCode = '';
    this.specificAddress = '';
    this.districts = [];
    this.wards = [];
  }

  cancelNewAddress(): void {
    this.showNewForm = false;
    this.formError = '';
  }

  getSubtotal() {
    return this.cartItems
      .filter(item => item.selected)
      .reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
  }

  getShipping() {
    if (this.getSubtotal() > 0) {
      return 20000;
    }
    return 0;
  }

  getDiscount(): number {
    if (!this.appliedVoucher) {
      return 0;
    }
    const subtotal = this.getSubtotal();
    let discount = 0;
    if (this.appliedVoucher.discountType === 'PERCENT') {
      discount = (subtotal * this.appliedVoucher.discount) / 100;
      if (this.appliedVoucher.maxDiscountAmount && discount > this.appliedVoucher.maxDiscountAmount) {
        discount = this.appliedVoucher.maxDiscountAmount;
      }
    } else {
      discount = this.appliedVoucher.discount;
    }
    return Math.min(subtotal + this.getShipping(), Math.round(discount));
  }

  getTotal() {
    return Math.max(0, this.getSubtotal() + this.getShipping() - this.getDiscount());
  }

  applyVoucher(overrideCode?: string): void {
    this.voucherError = '';
    this.voucherSuccess = '';
    this.syncVouchersFromStorage();

    const raw = (overrideCode || this.voucherCode || '').trim().toUpperCase();

    if (!raw) {
      this.voucherError = 'Vui lòng nhập mã giảm giá!';
      return;
    }

    const subtotal = this.getSubtotal();
    if (subtotal <= 0) {
      this.voucherError = 'Chưa có sản phẩm nào trong đơn hàng.';
      return;
    }

    // Match code
    let voucher = this.availableVouchers.find(v => v.code.toUpperCase() === raw);
    if (!voucher) {
      this.voucherError = `Mã giảm giá "${raw}" không hợp lệ hoặc đã hết hạn.`;
      return;
    }

    if (voucher.minOrderAmount && subtotal < voucher.minOrderAmount) {
      this.voucherError = `Mã "${voucher.code}" chỉ áp dụng cho đơn từ ${voucher.minOrderAmount.toLocaleString('vi-VN')}đ (Đơn hiện tại: ${subtotal.toLocaleString('vi-VN')}đ).`;
      return;
    }

    this.appliedVoucher = voucher;
    this.voucherCode = voucher.code;
    const discountVal = this.getDiscount();
    this.voucherSuccess = `Áp dụng thành công mã "${voucher.code}"! Bạn được giảm ${discountVal.toLocaleString('vi-VN')}đ.`;
    this.notification.success(this.voucherSuccess);
  }

  quickApply(code: string): void {
    this.voucherCode = code;
    this.applyVoucher(code);
  }

  removeVoucher(): void {
    const prevCode = this.appliedVoucher ? this.appliedVoucher.code : '';
    this.appliedVoucher = null;
    this.voucherCode = '';
    this.voucherSuccess = '';
    this.voucherError = '';
    if (prevCode) {
      this.notification.success(`Đã huỷ mã giảm giá ${prevCode}`);
    }
  }

  placeOrder() {
    this.formError = '';

    if (!this.email) {
      this.notification.success('Vui lòng đăng nhập để đặt hàng');
      this.router.navigate(['/login']);
      return;
    }

    const selectedItems = this.cartItems.filter(item => item.selected && !item.discontinued);

    if (selectedItems.length === 0) {
      this.notification.success('Hãy chọn sản phẩm đã');
      return;
    }

    // Determine the shipping address (snapshot)
    let shippingAddress: any;
    let isNewAddress = false;

    if (this.mode === 'form' || this.showNewForm) {
      if (!this.shippingForm.name.trim() || !this.shippingForm.phone.trim()) {
        this.formError = 'Vui lòng nhập đầy đủ họ tên và số điện thoại người nhận';
        return;
      }

      if (!this.selectedProvinceCode || !this.selectedDistrictCode || !this.selectedWardCode) {
        this.formError = 'Vui lòng chọn Tỉnh/Thành phố, Quận/Huyện và Phường/Xã';
        return;
      }

      if (!this.specificAddress.trim()) {
        this.formError = 'Vui lòng nhập địa chỉ cụ thể (số nhà, tên đường)';
        return;
      }

      this.syncStreetAddress();

      if (!this.shippingForm.street.trim()) {
        this.formError = 'Vui lòng nhập đầy đủ thông tin giao hàng';
        return;
      }

      shippingAddress = {
        label: this.shippingForm.label.trim() || 'Địa chỉ',
        name: this.shippingForm.name.trim(),
        phone: this.shippingForm.phone.trim(),
        street: this.shippingForm.street.trim()
      };

      isNewAddress = true;
    } else {
      if (!this.selectedAddress) {
        this.formError = 'Vui lòng chọn địa chỉ giao hàng';
        return;
      }

      shippingAddress = {
        label: this.selectedAddress.label,
        name: this.selectedAddress.name,
        phone: this.selectedAddress.phone,
        street: this.selectedAddress.street
      };
    }

    const voucherSuffix = this.appliedVoucher 
      ? ` [Mã KM: ${this.appliedVoucher.code} - Giảm ${this.getDiscount().toLocaleString('vi-VN')}đ]` 
      : '';

    const addressLine =
      shippingAddress.street + ' (Người nhận: ' + shippingAddress.name + ')' + voucherSuffix;

    this.placing = true;

    // paymentMethod: 0 = COD, 1 = VNPay
    const pmCode = this.paymentMethod === 'vnpay' ? 1 : 0;
    const discountAmount = this.getDiscount();

    this.orderService
      .placeOrder(
        this.email,
        addressLine,
        shippingAddress.phone,
        selectedItems,
        pmCode,
        discountAmount
      )
      .subscribe(
        (order: any) => {
          // Save a brand-new address into the user's profile
          if (isNewAddress && this.saveToProfile && this.email) {
            this.addressService.addAddress(this.email, this.shippingForm);
          }

          // Remove purchased items from the cart
          if (!this.cartService.buyNowItem) {
            selectedItems.forEach(item => this.cartService.removeItem(item));
          }

          this.cartService.clearBuyNowItem();

          // If VNPay payment, redirect to VNPay
          if (this.paymentMethod === 'vnpay' && order && order.ordersId) {
            this.vnpayService.createPayment(order.ordersId).subscribe(
              (res) => {
                window.location.href = res.paymentUrl;
              },
              () => {
                this.placing = false;
                this.notification.success('Đặt hàng thành công nhưng không tạo được link thanh toán VNPay');
                this.router.navigate(['/orders']);
              }
            );
          } else {
            // COD: go to orders
            this.notification.success('Đặt hàng thành công!');
            this.router.navigate(['/orders']);
          }
        },
        () => {
          this.placing = false;
          this.formError =
            'Đặt hàng thất bại, vui lòng kiểm tra kết nối và thử lại';
        }
      );
  }
}
