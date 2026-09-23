import { Component, OnInit } from '@angular/core';
import { LocationService, MergedProvince, District, Ward } from 'src/app/services/location.service';

import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { CartService } from 'src/app/services/cart.service';
import { NotificationService } from 'src/app/services/notification.service';
import { AddressService } from 'src/app/services/address.service';
import { ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  activeTab = 'info';

  // --- Personal info ---
  editName = '';
  editPhone = '';
  infoError = '';

  // --- Avatar ---
  previewAvatar = '';

  // --- Addresses ---
  addresses: any[] = [];
  showAddressForm = false;
  editingAddressId: number | null = null;
  addressForm = {
    label: '',
    name: '',
    phone: '',
    street: ''
  };
  addressError = '';

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


  // --- Change password ---
  currentPwd = '';
  newPwd = '';
  confirmPwd = '';
  passwordError = '';

  // --- Statistics ---
  stats = {
    totalOrders: 0,
    totalSpent: 0,
    totalReviews: 0,
    cartCount: 0
  };

  // --- Order summary ---
  recentOrders: any[] = [];

  constructor(
    public authService: AuthService,
    private orderService: OrderService,
    private cartService: CartService,
    private notification: NotificationService,
    private locationService: LocationService,
    private addressService: AddressService,
    private reviewService: ReviewService,
    private router: Router
  ) {}

  ngOnInit(): void {

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const user = this.authService.currentUser;

    this.editName = user.name || '';
    this.editPhone = user.phone || '';
    this.previewAvatar = user.avatar || '';

    this.loadAddresses();
    this.loadStats();
    this.loadRecentOrders();

  }

  setTab(tab: string): void {
    this.activeTab = tab;
  }

  // ===== PERSONAL INFO =====

  saveInfo(): void {

    this.infoError = '';

    if (!this.editName.trim()) {
      this.infoError = 'Vui lòng nhập họ và tên';
      return;
    }

    if (!this.editPhone.trim()) {
      this.infoError = 'Vui lòng nhập số điện thoại';
      return;
    }

    this.authService.updateUser({
      name: this.editName.trim(),
      phone: this.editPhone.trim()
    });

    this.notification.success('Cập nhật thông tin thành công 😄');

  }

  // ===== AVATAR =====

  onAvatarSelected(event: any): void {

    const file: File = event.target.files && event.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      this.previewAvatar = reader.result as string;
    };

    reader.readAsDataURL(file);

  }

  saveAvatar(): void {

    if (!this.previewAvatar) {
      return;
    }

    this.authService.updateUser({ avatar: this.previewAvatar });

    this.notification.success('Cập nhật ảnh đại diện thành công 😄');

  }

  removeAvatar(): void {

    this.previewAvatar = '';
    this.authService.updateUser({ avatar: '' });

    this.notification.success('Đã xoá ảnh đại diện');

  }

  // ===== ADDRESSES =====

  private get email(): string {
    return this.authService.currentUser.email;
  }

  loadAddresses(): void {
    this.addresses = this.addressService.getAddresses(this.email);
  }

  loadProvinces(): void {
    if (this.provinces.length > 0) return;
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
    this.syncAddressStreet();

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
    this.syncAddressStreet();

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
    this.syncAddressStreet();
  }

  onSpecificAddressChange(): void {
    this.syncAddressStreet();
  }

  syncAddressStreet(): void {
    const prov = this.provinces.find((p) => p.code === this.selectedProvinceCode);
    const dist = this.districts.find((d) => d.code == Number(this.selectedDistrictCode));
    const ward = this.wards.find((w) => w.code == Number(this.selectedWardCode));

    const parts = [
      (this.specificAddress || '').trim(),
      ward ? ward.name : '',
      dist ? dist.name : '',
      prov ? prov.name : ''
    ].filter(Boolean);

    if (parts.length > 0) {
      this.addressForm.street = parts.join(', ');
    }
  }

  openAddAddress(): void {

    this.editingAddressId = null;
    this.addressForm = { label: '', name: '', phone: '', street: '' };
    this.addressError = '';
    this.selectedProvinceCode = '';
    this.selectedDistrictCode = '';
    this.selectedWardCode = '';
    this.specificAddress = '';
    this.districts = [];
    this.wards = [];
    this.loadProvinces();
    this.showAddressForm = true;

  }

  editAddress(address: any): void {

    this.editingAddressId = address.id;
    this.addressForm = {
      label: address.label,
      name: address.name,
      phone: address.phone,
      street: address.street
    };
    this.addressError = '';
    this.selectedProvinceCode = '';
    this.selectedDistrictCode = '';
    this.selectedWardCode = '';
    this.specificAddress = address.street || '';
    this.loadProvinces();
    this.showAddressForm = true;

  }

  cancelAddressForm(): void {
    this.showAddressForm = false;
    this.editingAddressId = null;
  }

  saveAddress(): void {

    this.addressError = '';

    if (
      !this.addressForm.name.trim() ||
      !this.addressForm.phone.trim() ||
      !this.addressForm.street.trim()
    ) {
      this.addressError = 'Vui lòng nhập đầy đủ thông tin';
      return;
    }

    if (this.editingAddressId !== null) {
      this.addressService.updateAddress(
        this.email,
        this.editingAddressId,
        this.addressForm
      );
    } else {
      this.addressService.addAddress(this.email, this.addressForm);
    }

    this.loadAddresses();
    this.showAddressForm = false;
    this.editingAddressId = null;
    this.notification.success('Lưu địa chỉ thành công 😄');

  }

  deleteAddress(address: any): void {

    this.addressService.deleteAddress(this.email, address.id);
    this.loadAddresses();
    this.notification.success('Đã xoá địa chỉ');

  }

  setDefaultAddress(address: any): void {

    this.addressService.setDefault(this.email, address.id);
    this.loadAddresses();

  }

  // ===== CHANGE PASSWORD =====

  changePassword(): void {

    this.passwordError = '';

    if (!this.currentPwd) {
      this.passwordError = 'Vui lòng nhập mật khẩu hiện tại';
      return;
    }

    if (this.newPwd.length < 6) {
      this.passwordError = 'Mật khẩu mới phải có ít nhất 6 ký tự';
      return;
    }

    if (this.newPwd !== this.confirmPwd) {
      this.passwordError = 'Mật khẩu xác nhận không khớp';
      return;
    }

    this.authService
      .changePassword(this.currentPwd, this.newPwd)
      .subscribe(result => {

        if (!result.success) {
          this.passwordError = result.error!;
          return;
        }

        this.currentPwd = '';
        this.newPwd = '';
        this.confirmPwd = '';

        this.notification.success('Đổi mật khẩu thành công 😄');

      });

  }

  // ===== STATISTICS =====

  loadStats(): void {

    this.stats.totalReviews = this.countReviews();
    this.stats.cartCount = this.cartService.getCartCount();

    this.orderService.getOrders(this.email).subscribe(orders => {

      this.stats.totalOrders = orders.length;

      this.stats.totalSpent = orders.reduce(
        (total: number, order: any) => total + (order.total || 0),
        0
      );

    });

  }

  private countReviews(): number {
    // Đếm số review của chính user này từ cache rates backend
    return this.reviewService.countByEmail(this.email);
  }

  // ===== ORDER SUMMARY =====

  loadRecentOrders(): void {
    this.orderService.getOrders(this.email).subscribe(orders => {
      this.recentOrders = orders.slice(0, 5);
    });
  }

  // ===== LOGOUT =====

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
