import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Headers,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import {
  CreateFullPaymentDto,
  CreateInstallmentPaymentDto,
} from './dto/create-payment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // ─── Stripe Config ──────────────────────────────────────

  @Get('config')
  getStripeConfig() {
    return this.paymentsService.getStripeConfig();
  }

  // ─── Full Payment ───────────────────────────────────────

  @Post('full')
  @UseGuards(JwtAuthGuard)
  createFullPayment(
    @Request() req: any,
    @Body() dto: CreateFullPaymentDto,
  ) {
    return this.paymentsService.createFullPayment(dto.orderId, req.user.sub);
  }

  // ─── Installment Payment ────────────────────────────────

  @Post('installment')
  @UseGuards(JwtAuthGuard)
  createInstallmentPayment(
    @Request() req: any,
    @Body() dto: CreateInstallmentPaymentDto,
  ) {
    return this.paymentsService.createInstallmentPayment(
      dto.orderId,
      req.user.sub,
      dto.installmentCount,
    );
  }

  // ─── Pay Individual Installment ──────────────────────────

  @Post('installment/:installmentId/pay')
  @UseGuards(JwtAuthGuard)
  payInstallment(
    @Request() req: any,
    @Param('installmentId') installmentId: string,
  ) {
    return this.paymentsService.payInstallment(installmentId, req.user.sub);
  }

  // ─── Get Payment by Order ──────────────────────────────

  @Get(':orderId')
  @UseGuards(JwtAuthGuard)
  getPayment(@Param('orderId') orderId: string) {
    return this.paymentsService.getPaymentByOrderId(orderId);
  }

  // ─── Get Installment Schedule ──────────────────────────

  @Get(':orderId/installments')
  @UseGuards(JwtAuthGuard)
  getInstallmentSchedule(@Param('orderId') orderId: string) {
    return this.paymentsService.getInstallmentSchedule(orderId);
  }

  // ─── Confirm Payment (mock — for when Stripe is not configured) ──

  @Post('confirm/:orderId')
  @UseGuards(JwtAuthGuard)
  confirmPayment(@Param('orderId') orderId: string) {
    return this.paymentsService.confirmPayment(orderId);
  }

  // ─── Confirm Installment (mock) ─────────────────────────

  @Post('confirm-installment/:installmentId')
  @UseGuards(JwtAuthGuard)
  confirmInstallment(@Param('installmentId') installmentId: string) {
    return this.paymentsService.confirmInstallment(installmentId);
  }

  // ─── Stripe Webhook ─────────────────────────────────────

  @Post('webhook')
  handleWebhook(
    @Request() req: any,
    @Body() body: any,
    @Headers('stripe-signature') signature: string,
  ) {
    const rawBody = req.rawBody || Buffer.from(JSON.stringify(body));
    return this.paymentsService.handleWebhook(rawBody, signature);
  }
}
