import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  orderId: string;

  @IsOptional()
  @IsString()
  paymentMethodId?: string; // Stripe payment method ID
}
