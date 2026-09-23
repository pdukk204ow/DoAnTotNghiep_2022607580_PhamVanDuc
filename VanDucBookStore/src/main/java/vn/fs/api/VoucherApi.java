package vn.fs.api;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vn.fs.entity.Voucher;
import vn.fs.repository.VoucherRepository;

@CrossOrigin("*")
@RestController
@RequestMapping("api/vouchers")
public class VoucherApi {

	@Autowired
	private VoucherRepository repo;

	@GetMapping
	public ResponseEntity<List<Voucher>> getAll() {
		return ResponseEntity.ok(repo.findAllByOrderByVoucherIdDesc());
	}

	@GetMapping("/active")
	public ResponseEntity<List<Voucher>> getActiveVouchers() {
		LocalDate today = LocalDate.now();
		List<Voucher> active = repo.findByStatusTrueOrderByVoucherIdDesc().stream()
				.filter(v -> {
					boolean notFull = v.getUsedCount() < v.getQuantity();
					boolean afterStart = (v.getStartDate() == null || !today.isBefore(v.getStartDate()));
					boolean beforeEnd = (v.getEndDate() == null || !today.isAfter(v.getEndDate()));
					return notFull && afterStart && beforeEnd;
				})
				.collect(Collectors.toList());
		return ResponseEntity.ok(active);
	}

	@GetMapping("{id}")
	public ResponseEntity<Voucher> getById(@PathVariable("id") Long id) {
		Optional<Voucher> opt = repo.findById(id);
		if (!opt.isPresent()) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(opt.get());
	}

	@GetMapping("/code/{code}")
	public ResponseEntity<Voucher> getByCode(@PathVariable("code") String code) {
		Optional<Voucher> opt = repo.findByCode(code.trim().toUpperCase());
		if (!opt.isPresent()) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(opt.get());
	}

	@PostMapping
	public ResponseEntity<?> create(@RequestBody Voucher voucher) {
		if (voucher.getCode() == null || voucher.getCode().trim().isEmpty()) {
			return ResponseEntity.badRequest().body("Mã giảm giá không được để trống");
		}
		String code = voucher.getCode().trim().toUpperCase();
		if (repo.existsByCode(code)) {
			return ResponseEntity.badRequest().body("Mã giảm giá đã tồn tại");
		}
		voucher.setCode(code);
		if (voucher.getName() != null) {
			voucher.setName(voucher.getName().trim());
		}
		if (voucher.getUsedCount() < 0) {
			voucher.setUsedCount(0);
		}
		if (voucher.getStatus() == null) {
			voucher.setStatus(true);
		}
		return ResponseEntity.ok(repo.save(voucher));
	}

	@PutMapping("{id}")
	public ResponseEntity<?> update(@PathVariable("id") Long id, @RequestBody Voucher voucher) {
		Optional<Voucher> opt = repo.findById(id);
		if (!opt.isPresent()) {
			return ResponseEntity.notFound().build();
		}
		Voucher existing = opt.get();
		String newCode = voucher.getCode() != null ? voucher.getCode().trim().toUpperCase() : existing.getCode();

		// Kiểm tra trùng code với voucher khác
		Optional<Voucher> sameCode = repo.findByCode(newCode);
		if (sameCode.isPresent() && !sameCode.get().getVoucherId().equals(id)) {
			return ResponseEntity.badRequest().body("Mã giảm giá đã được sử dụng bởi voucher khác");
		}

		existing.setCode(newCode);
		existing.setName(voucher.getName());
		existing.setDiscount(voucher.getDiscount());
		existing.setDiscountType(voucher.getDiscountType());
		existing.setMinOrderAmount(voucher.getMinOrderAmount());
		existing.setMaxDiscountAmount(voucher.getMaxDiscountAmount());
		existing.setQuantity(voucher.getQuantity());
		existing.setStartDate(voucher.getStartDate());
		existing.setEndDate(voucher.getEndDate());
		if (voucher.getStatus() != null) {
			existing.setStatus(voucher.getStatus());
		}

		return ResponseEntity.ok(repo.save(existing));
	}

	@PutMapping("/toggle/{id}")
	public ResponseEntity<?> toggleStatus(@PathVariable("id") Long id) {
		Optional<Voucher> opt = repo.findById(id);
		if (!opt.isPresent()) {
			return ResponseEntity.notFound().build();
		}
		Voucher voucher = opt.get();
		voucher.setStatus(voucher.getStatus() == null || !voucher.getStatus());
		repo.save(voucher);
		return ResponseEntity.ok(voucher);
	}

	@DeleteMapping("{id}")
	public ResponseEntity<?> delete(@PathVariable("id") Long id) {
		if (!repo.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		repo.deleteById(id);
		return ResponseEntity.ok().build();
	}

	@PostMapping("/use/{code}")
	public ResponseEntity<?> useVoucher(@PathVariable("code") String code) {
		Optional<Voucher> opt = repo.findByCode(code.trim().toUpperCase());
		if (!opt.isPresent()) {
			return ResponseEntity.notFound().build();
		}
		Voucher voucher = opt.get();
		voucher.setUsedCount(voucher.getUsedCount() + 1);
		repo.save(voucher);
		return ResponseEntity.ok(voucher);
	}

}
