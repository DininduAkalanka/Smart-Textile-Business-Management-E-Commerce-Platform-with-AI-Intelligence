import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentStatus, PaymentMethod, OrderStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async createPaymentIntent(orderId: string, userId: string) {
    // Find the order
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { payment: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.payment?.status === PaymentStatus.COMPLETED) {
      throw new BadRequestException('Order is already paid');
    }

    // For now, create a simple payment record
    // Stripe integration can be added when API keys are configured
    const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');

    if (stripeKey && stripeKey !== 'sk_test_your_stripe_secret_key') {
      // TODO: Integrate actual Stripe API
      // const stripe = new Stripe(stripeKey);
      // const paymentIntent = await stripe.paymentIntents.create({...});
      this.logger.log('Stripe integration would be used here');
    }

    // Create or update payment record
    const payment = await this.prisma.payment.upsert({
      where: { orderId },
      create: {
        orderId,
        amount: order.total,
        currency: 'USD',
        status: PaymentStatus.PENDING,
        method: PaymentMethod.STRIPE,
      },
      update: {
        status: PaymentStatus.PENDING,
      },
    });

    return {
      paymentId: payment.id,
      orderId: payment.orderId,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      // clientSecret would come from Stripe in production
      clientSecret: `pi_simulated_${payment.id}`,
    };
  }

  async confirmPayment(orderId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { orderId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Update payment and order status
    const [updatedPayment] = await this.prisma.$transaction([
      this.prisma.payment.update({
        where: { orderId },
        data: {
          status: PaymentStatus.COMPLETED,
          paidAt: new Date(),
          transactionId: `txn_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        },
      }),
      this.prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CONFIRMED },
      }),
    ]);

    return updatedPayment;
  }

  async getPaymentByOrderId(orderId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { orderId },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            total: true,
            status: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found for this order');
    }

    return payment;
  }

  async handleWebhook(payload: any) {
    // Handle Stripe webhook events
    this.logger.log(`Received webhook event: ${payload?.type}`);

    switch (payload?.type) {
      case 'payment_intent.succeeded':
        const orderId = payload.data?.object?.metadata?.orderId;
        if (orderId) {
          await this.confirmPayment(orderId);
        }
        break;

      case 'payment_intent.payment_failed':
        this.logger.warn('Payment failed:', payload.data?.object?.id);
        break;

      default:
        this.logger.log(`Unhandled webhook event type: ${payload?.type}`);
    }

    return { received: true };
  }
}
