import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Voucher } from '../common/Voucher';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {

  private url = environment.apiUrl + '/api/vouchers';
  private storageKey = 'vanducstore_vouchers_data';

  constructor(private http: HttpClient) { }

  getVouchers(): Observable<Voucher[]> {
    return this.http.get<Voucher[]>(this.url).pipe(
      tap(vouchers => {
        this.saveStoredVouchers(vouchers);
      })
    );
  }

  getVoucherById(id: number): Observable<Voucher> {
    return this.http.get<Voucher>(`${this.url}/${id}`);
  }

  saveVoucher(voucher: Voucher): Observable<Voucher> {
    if (voucher.voucherId && voucher.voucherId > 0) {
      return this.http.put<Voucher>(`${this.url}/${voucher.voucherId}`, voucher).pipe(
        tap(() => this.syncToCookie())
      );
    } else {
      return this.http.post<Voucher>(this.url, voucher).pipe(
        tap(() => this.syncToCookie())
      );
    }
  }

  deleteVoucher(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`).pipe(
      tap(() => this.syncToCookie())
    );
  }

  toggleStatus(id: number): Observable<any> {
    return this.http.put(`${this.url}/toggle/${id}`, {}).pipe(
      tap(() => this.syncToCookie())
    );
  }

  private syncToCookie(): void {
    this.http.get<Voucher[]>(this.url).subscribe({
      next: (vouchers) => {
        this.saveStoredVouchers(vouchers);
      },
      error: (e) => console.error('Lỗi đồng bộ voucher cookie:', e)
    });
  }

  private saveStoredVouchers(vouchers: Voucher[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(vouchers));
      const compact = vouchers.map(v => ({
        id: v.voucherId,
        code: v.code,
        name: v.name,
        discount: v.discount,
        discountType: v.discountType,
        minOrderAmount: v.minOrderAmount,
        maxDiscountAmount: v.maxDiscountAmount,
        status: v.status
      }));
      document.cookie = `vanducstore_vouchers_cookie=${encodeURIComponent(JSON.stringify(compact))}; path=/; max-age=31536000; SameSite=Lax`;
    } catch (e) {
      console.error(e);
    }
  }

}
