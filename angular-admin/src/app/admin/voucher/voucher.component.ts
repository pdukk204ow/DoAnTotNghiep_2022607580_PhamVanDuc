import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Voucher } from '../../common/Voucher';
import { PageService } from '../../services/page.service';
import { VoucherService } from '../../services/voucher.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.css']
})
export class VoucherComponent implements OnInit {

  listData!: MatTableDataSource<Voucher>;
  vouchers: Voucher[] = [];
  vouchersLength: number = 0;
  columns: string[] = ['code', 'name', 'discount', 'minOrder', 'usage', 'expiry', 'status', 'action'];

  voucherForm!: FormGroup;
  isEditing: boolean = false;
  currentVoucherId: number = 0;

  // Stats
  totalCount: number = 0;
  activeCount: number = 0;
  totalUsedCount: number = 0;
  expiredCount: number = 0;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private pageService: PageService,
    private voucherService: VoucherService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.pageService.setPageActive('voucher');
    this.loadVouchers();
  }

  initForm(): void {
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    this.voucherForm = new FormGroup({
      voucherId: new FormControl(0),
      code: new FormControl('', [Validators.required, Validators.minLength(3)]),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      discountType: new FormControl('PERCENT', [Validators.required]),
      discount: new FormControl(10, [Validators.required, Validators.min(1)]),
      minOrderAmount: new FormControl(100000, [Validators.required, Validators.min(0)]),
      maxDiscountAmount: new FormControl(30000, [Validators.required, Validators.min(0)]),
      quantity: new FormControl(100, [Validators.required, Validators.min(1)]),
      startDate: new FormControl(today, [Validators.required]),
      endDate: new FormControl(nextMonth, [Validators.required]),
      status: new FormControl(true)
    });
  }

  loadVouchers(): void {
    this.voucherService.getVouchers().subscribe(data => {
      this.vouchers = data;
      this.listData = new MatTableDataSource(this.vouchers);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.vouchersLength = this.vouchers.length;

      // Calculate Stats
      this.totalCount = this.vouchers.length;
      this.activeCount = this.vouchers.filter(v => v.status && (v.usedCount < v.quantity)).length;
      this.totalUsedCount = this.vouchers.reduce((sum, v) => sum + (v.usedCount || 0), 0);
      this.expiredCount = this.vouchers.filter(v => !v.status || (v.usedCount >= v.quantity)).length;
    });
  }

  search(event: any): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.listData.filter = filterValue.trim().toLowerCase();
  }

  openCreateModal(content: TemplateRef<any>): void {
    this.isEditing = false;
    this.currentVoucherId = 0;
    this.initForm();
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  openEditModal(voucher: Voucher, content: TemplateRef<any>): void {
    this.isEditing = true;
    this.currentVoucherId = voucher.voucherId;
    this.voucherForm.patchValue({
      voucherId: voucher.voucherId,
      code: voucher.code,
      name: voucher.name,
      discountType: voucher.discountType,
      discount: voucher.discount,
      minOrderAmount: voucher.minOrderAmount,
      maxDiscountAmount: voucher.maxDiscountAmount,
      quantity: voucher.quantity,
      startDate: voucher.startDate,
      endDate: voucher.endDate,
      status: voucher.status
    });
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  generateRandomCode(): void {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = 'VD';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.voucherForm.patchValue({ code: result });
  }

  saveVoucher(): void {
    if (this.voucherForm.invalid) {
      this.toastr.error('Vui lòng điền đầy đủ và chính xác các trường!', 'Hệ thống');
      return;
    }

    const formVal = this.voucherForm.value;
    const existing = this.vouchers.find(v => v.voucherId === this.currentVoucherId);

    const voucher: Voucher = {
      voucherId: this.isEditing ? this.currentVoucherId : 0,
      code: formVal.code.toUpperCase().trim(),
      name: formVal.name.trim(),
      discount: Number(formVal.discount),
      discountType: formVal.discountType,
      minOrderAmount: Number(formVal.minOrderAmount),
      maxDiscountAmount: Number(formVal.maxDiscountAmount),
      quantity: Number(formVal.quantity),
      usedCount: existing ? existing.usedCount : 0,
      startDate: formVal.startDate,
      endDate: formVal.endDate,
      status: formVal.status
    };

    this.voucherService.saveVoucher(voucher).subscribe(() => {
      this.modalService.dismissAll();
      this.toastr.success(this.isEditing ? 'Cập nhật mã giảm giá thành công!' : 'Tạo mã giảm giá mới thành công!', 'Hệ thống');
      this.loadVouchers();
    });
  }

  toggleStatus(voucher: Voucher): void {
    this.voucherService.toggleStatus(voucher.voucherId).subscribe(() => {
      const msg = voucher.status ? 'Đã tạm dừng áp dụng mã!' : 'Đã kích hoạt áp dụng mã!';
      this.toastr.info(msg, 'Hệ thống');
      this.loadVouchers();
    });
  }

  deleteVoucher(voucher: Voucher): void {
    Swal.fire({
      title: `Bạn có chắc muốn xoá mã [${voucher.code}]?`,
      text: voucher.name,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xoá mã',
      cancelButtonText: 'Huỷ bỏ',
      confirmButtonColor: '#ef4444'
    }).then((result) => {
      if (result.isConfirmed) {
        this.voucherService.deleteVoucher(voucher.voucherId).subscribe(() => {
          this.toastr.success('Đã xoá mã giảm giá thành công!', 'Hệ thống');
          this.loadVouchers();
        });
      }
    });
  }

  copyCode(code: string): void {
    navigator.clipboard.writeText(code);
    this.toastr.info(`Đã sao chép mã [${code}] vào bộ nhớ tạm!`, 'Hệ thống');
  }

}
