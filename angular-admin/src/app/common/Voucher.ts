export class Voucher {
    voucherId!: number;
    code!: string;
    name!: string;
    discount!: number;
    discountType!: 'PERCENT' | 'FIXED';
    minOrderAmount!: number;
    maxDiscountAmount!: number;
    quantity!: number;
    usedCount!: number;
    startDate!: string;
    endDate!: string;
    status!: boolean;
}
