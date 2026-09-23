package vn.fs.config;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import vn.fs.entity.Voucher;
import vn.fs.repository.VoucherRepository;

@Component
public class VoucherDataInit implements CommandLineRunner {

	@Autowired
	private VoucherRepository voucherRepository;

	@Override
	public void run(String... args) throws Exception {
		if (voucherRepository.count() == 0) {
			List<Voucher> defaultVouchers = Arrays.asList(
				new Voucher(null, "VANDUC", "Ưu đãi thương hiệu Văn Đức (Giảm 20%)", 20.0, "PERCENT", 100000.0, 50000.0, 500, 16, LocalDate.of(2026, 9, 1), LocalDate.of(2026, 12, 31), true),
				new Voucher(null, "VANDUC10", "Giảm 10% đơn từ 150.000₫", 10.0, "PERCENT", 150000.0, 30000.0, 100, 28, LocalDate.of(2026, 9, 1), LocalDate.of(2026, 10, 31), true),
				new Voucher(null, "FREESHIP", "Miễn phí vận chuyển toàn quốc", 30000.0, "FIXED", 200000.0, 30000.0, 200, 75, LocalDate.of(2026, 9, 1), LocalDate.of(2026, 12, 31), true),
				new Voucher(null, "CHAOBANMOI", "Ưu đãi chào mừng khách hàng mới", 20000.0, "FIXED", 100000.0, 20000.0, 50, 15, LocalDate.of(2026, 9, 1), LocalDate.of(2026, 11, 30), true),
				new Voucher(null, "BOOKLOVER", "Tri ân độc giả yêu sách", 15.0, "PERCENT", 250000.0, 50000.0, 100, 42, LocalDate.of(2026, 9, 5), LocalDate.of(2026, 10, 15), true),
				new Voucher(null, "VIPMEMBER", "Ưu đãi độc quyền thành viên VIP", 50000.0, "FIXED", 500000.0, 50000.0, 50, 50, LocalDate.of(2026, 8, 1), LocalDate.of(2026, 8, 31), false)
			);
			voucherRepository.saveAll(defaultVouchers);
			System.out.println(">>> Đã khởi tạo " + defaultVouchers.size() + " mã giảm giá mẫu vào cơ sở dữ liệu MySQL.");
		}
	}

}
