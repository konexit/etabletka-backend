import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';
import { Repository, IsNull } from 'typeorm';
import {
  TRADE_CODE_ERROR_ALREADY_HAS_BEEN_SAVED,
  TRADE_PROVIDER_MANAGER,
  TradeProvider,
  TradeOrders,
  TradeOrderMode,
  StateOrderPickOption,
  StateOrdersOptions,
  TRADE_STATE_ORDER_LIMIT_DEFAULT
} from 'src/providers/trade';
import { Order } from './entities/order.entity';
import { OrderTypes } from 'src/common/config/common.constants';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @Inject(TRADE_PROVIDER_MANAGER) private tradeProvider: TradeProvider,
  ) { }

  @Cron('0 * * * * *', {
    name: 'asynchronously sending order to trade',
    waitForCompletion: true
  })
  async processOrders(): Promise<void> {
    try {
      const orders = await this.orderRepository.find({
        select: {
          id: true,
          orderTypeId: true,
          order: true as any,
          integrationTime: true
        },
        where: { integrationTime: IsNull() },
      });

      if (orders.length === 0) {
        this.logger.log('No new orders to process');
        return;
      }

      const ordersByType: Map<number, TradeOrders> = new Map();

      for (const order of orders) {
        if (ordersByType.has(order.orderTypeId)) {
          ordersByType
            .get(order.orderTypeId)
            .orders
            .push({
              aggregatorOrderId: String(order.id),
              tradeOrderId: 0,
              order: order.order
            });
        } else {
          ordersByType
            .set(order.orderTypeId, {
              orders: [{
                aggregatorOrderId: String(order.id),
                tradeOrderId: 0,
                order: order.order
              }]
            });
        }
      }

      for (const [orderType, tradeOrders] of ordersByType) {
        try {
          const response = await this.tradeProvider.createOrders(tradeOrders, {
            orderType,
            action: TradeOrderMode.Forward,
          });

          const integrationTime = new Date();

          for (const order of response.handled_orders) {
            try {
              await this.orderRepository.update(Number(order.aggregatorOrderId), {
                integrationTime,
                tradeOrderId: order.tradeOrderId
              });
              this.logger.log(`order ID: ${order.aggregatorOrderId}, trade ID: ${order.tradeOrderId} successfully sent`);
            } catch (error) {
              this.logger.error(`error when saving a processed order ID: ${order.aggregatorOrderId}`);
            }
          }

          for (const order of response.error_orders) {
            if (order.codeError === TRADE_CODE_ERROR_ALREADY_HAS_BEEN_SAVED) {
              try {
                await this.orderRepository.update(Number(order.aggregatorOrderId), {
                  integrationTime,
                  tradeOrderId: order.tradeOrderId
                });
                this.logger.log(`order ID: ${order.aggregatorOrderId}, trade ID: ${order.tradeOrderId} successfully sent`);
              } catch (error) {
                this.logger.error(`error when saving a processed order ID: ${order.aggregatorOrderId}`);
              }
            } else {
              this.logger.error(`error handled order ID: ${order.aggregatorOrderId}, type: ${orderType}, message: ${order.message}`);
            }
          }
        } catch (error) {
          this.logger.error(`error sending orders, type: ${orderType}`);
        }
      }
    } catch (error) {
      this.logger.error('error processing orders:', error.message);
    }
  }

  @Cron('*/15 * * * * *', {
    name: 'asynchronously receiving order state from trading',
    waitForCompletion: true
  })
  async processStateOrders(): Promise<void> {
    try {
      const stateOrders = await this.tradeProvider.getStateOrders(new StateOrdersOptions(
        StateOrderPickOption.One,
        TRADE_STATE_ORDER_LIMIT_DEFAULT,
        [OrderTypes.Common]
      ));

      console.log(stateOrders)
    } catch (error) {
      this.logger.error('error processing state orders:', error.message);
    }
  }
}