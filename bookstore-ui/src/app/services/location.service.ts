import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface MergedProvince {
  code: string;
  name: string;
  isCity?: boolean;
  originalCodes: number[];
}

export interface District {
  code: number;
  name: string;
  division_type?: string;
  codename?: string;
  province_code?: number;
}

export interface Ward {
  code: number;
  name: string;
  division_type?: string;
  codename?: string;
  district_code?: number;
}

/**
 * Danh sách 34 đơn vị hành chính cấp tỉnh sau sáp nhập
 * (06 Thành phố trực thuộc Trung ương + 28 Tỉnh)
 */
export const VIETNAM_34_PROVINCES: MergedProvince[] = [
  // 6 Thành phố trực thuộc Trung ương
  { code: 'hn', name: 'Thành phố Hà Nội', isCity: true, originalCodes: [1] },
  { code: 'hcm', name: 'Thành phố Hồ Chí Minh', isCity: true, originalCodes: [79, 74, 77] },
  { code: 'dn', name: 'Thành phố Đà Nẵng', isCity: true, originalCodes: [48, 49] },
  { code: 'hp', name: 'Thành phố Hải Phòng', isCity: true, originalCodes: [31, 30] },
  { code: 'ct', name: 'Thành phố Cần Thơ', isCity: true, originalCodes: [92, 93, 94] },
  { code: 'hue', name: 'Thành phố Huế', isCity: true, originalCodes: [46] },

  // 28 Tỉnh (Sắp xếp A - Z)
  { code: 'ag', name: 'Tỉnh An Giang', originalCodes: [89, 91] },
  { code: 'bn', name: 'Tỉnh Bắc Ninh', originalCodes: [27, 24] },
  { code: 'cm', name: 'Tỉnh Cà Mau', originalCodes: [96, 95] },
  { code: 'cb', name: 'Tỉnh Cao Bằng', originalCodes: [4] },
  { code: 'dl', name: 'Tỉnh Đắk Lắk', originalCodes: [66, 54] },
  { code: 'db', name: 'Tỉnh Điện Biên', originalCodes: [11] },
  { code: 'dnai', name: 'Tỉnh Đồng Nai', originalCodes: [75, 70] },
  { code: 'dt', name: 'Tỉnh Đồng Tháp', originalCodes: [87, 82] },
  { code: 'gl', name: 'Tỉnh Gia Lai', originalCodes: [64, 52] },
  { code: 'ht', name: 'Tỉnh Hà Tĩnh', originalCodes: [42] },
  { code: 'hy', name: 'Tỉnh Hưng Yên', originalCodes: [33, 34] },
  { code: 'kh', name: 'Tỉnh Khánh Hòa', originalCodes: [56, 58] },
  { code: 'lc', name: 'Tỉnh Lai Châu', originalCodes: [12] },
  { code: 'ld', name: 'Tỉnh Lâm Đồng', originalCodes: [68, 67, 60] },
  { code: 'ls', name: 'Tỉnh Lạng Sơn', originalCodes: [20] },
  { code: 'lcai', name: 'Tỉnh Lào Cai', originalCodes: [10, 15] },
  { code: 'na', name: 'Tỉnh Nghệ An', originalCodes: [40] },
  { code: 'nb', name: 'Tỉnh Ninh Bình', originalCodes: [37, 35, 36] },
  { code: 'pt', name: 'Tỉnh Phú Thọ', originalCodes: [25, 26, 17] },
  { code: 'qng', name: 'Tỉnh Quảng Ngãi', originalCodes: [51, 62] },
  { code: 'qn', name: 'Tỉnh Quảng Ninh', originalCodes: [22] },
  { code: 'qt', name: 'Tỉnh Quảng Trị', originalCodes: [45, 44] },
  { code: 'sl', name: 'Tỉnh Sơn La', originalCodes: [14] },
  { code: 'tn', name: 'Tỉnh Tây Ninh', originalCodes: [72, 80] },
  { code: 'tng', name: 'Tỉnh Thái Nguyên', originalCodes: [19, 6] },
  { code: 'th', name: 'Tỉnh Thanh Hóa', originalCodes: [38] },
  { code: 'tq', name: 'Tỉnh Tuyên Quang', originalCodes: [8, 2] },
  { code: 'vl', name: 'Tỉnh Vĩnh Long', originalCodes: [86, 83, 84] }
];

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private baseUrl = 'https://provinces.open-api.vn/api/v1';

  private districtsCache: Map<string, District[]> = new Map();
  private wardsCache: Map<number, Ward[]> = new Map();

  constructor(private http: HttpClient) {}

  /**
   * Lấy danh sách 34 tỉnh/thành phố sau sáp nhập
   */
  getProvinces(): Observable<MergedProvince[]> {
    const sorted = [...VIETNAM_34_PROVINCES].sort((a, b) => {
      const cleanA = a.name.replace(/^(Thành phố|Tỉnh)\s+/i, '');
      const cleanB = b.name.replace(/^(Thành phố|Tỉnh)\s+/i, '');
      return cleanA.localeCompare(cleanB, 'vi');
    });
    return of(sorted);
  }

  /**
   * Lấy danh sách quận/huyện tương ứng với tỉnh thành sau sáp nhập
   */
  getDistricts(provinceCode: string): Observable<District[]> {
    if (this.districtsCache.has(provinceCode)) {
      return of(this.districtsCache.get(provinceCode)!);
    }

    const province = VIETNAM_34_PROVINCES.find(p => p.code === provinceCode);
    if (!province || !province.originalCodes || province.originalCodes.length === 0) {
      return of([]);
    }

    const requests = province.originalCodes.map(code =>
      this.http.get<any>(`${this.baseUrl}/p/${code}?depth=2`).pipe(
        map(res => (res && Array.isArray(res.districts) ? res.districts : [])),
        catchError(() => of([]))
      )
    );

    return forkJoin(requests).pipe(
      map(arrays => {
        const merged: District[] = [].concat(...arrays as any);
        return merged.sort((a: District, b: District) => a.name.localeCompare(b.name, 'vi'));
      }),
      tap(districts => this.districtsCache.set(provinceCode, districts)),
      catchError(error => {
        console.error(`Lỗi khi tải quận/huyện cho ${province.name}:`, error);
        return of([]);
      })
    );
  }

  /**
   * Lấy danh sách phường/xã theo mã quận/huyện
   */
  getWards(districtCode: number): Observable<Ward[]> {
    if (this.wardsCache.has(districtCode)) {
      return of(this.wardsCache.get(districtCode)!);
    }
    return this.http.get<any>(`${this.baseUrl}/d/${districtCode}?depth=2`).pipe(
      map(res => (res && Array.isArray(res.wards) ? res.wards : [])),
      map(wards => (wards as Ward[]).sort((a: Ward, b: Ward) => a.name.localeCompare(b.name, 'vi'))),
      tap(wards => this.wardsCache.set(districtCode, wards)),
      catchError(error => {
        console.error(`Lỗi khi tải phường/xã cho huyện ${districtCode}:`, error);
        return of([]);
      })
    );
  }
}
