package vn.fs.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.fs.entity.Voucher;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Long> {

	Optional<Voucher> findByCode(String code);

	boolean existsByCode(String code);

	List<Voucher> findAllByOrderByVoucherIdDesc();

	List<Voucher> findByStatusTrueOrderByVoucherIdDesc();

}
