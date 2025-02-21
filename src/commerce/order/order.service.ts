import {
  Injectable,
  Inject,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';
import { type Repository, In, IsNull } from 'typeorm';
import {
  type Trade,
  TRADE_CODE_ERROR_ALREADY_HAS_BEEN_SAVED,
  TRADE_PROVIDER_MANAGER,
  type TradeProvider,
  type TradeOrders,
  TradeOrderMode,
  StateOrderPickOption,
  StateOrdersOptions,
  TRADE_STATE_ORDER_LIMIT_DEFAULT,
} from 'src/providers/trade';
import { Order } from './entities/order.entity';
import { OrderStatus } from './entities/order-status.entity';
import { OrderStatusDescription } from './entities/order-statuses-description.entity';
import { OrderTypes } from 'src/common/config/common.constants';
import {
  ORDER_ASYNC_SENDER_SCHEDULER,
  ORDER_ASYNC_SENDER_SCHEDULER_ENABLED,
  ORDER_STATE_RECEIVER_LIMIT,
  ORDER_STATE_RECEIVER_SCHEDULER,
  ORDER_STATUS_DESCRIPTION_SCHEDULER,
  ORDER_STATUS_DESCRIPTION_SCHEDULER_ENABLED,
  TRADE_SEARCH_STATUS_DESCRIPTION_QUERY,
} from './order.constants';
import type { PaginationDto } from 'src/common/dto/pagination.dto';
import { User } from 'src/users/user/entities/user.entity';
import { Product } from 'src/products/product/entities/product.entity';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderStatus)
    private orderStatusRepository: Repository<OrderStatus>,
    @InjectRepository(OrderStatusDescription)
    private orderStatusDescriptionRepository: Repository<OrderStatusDescription>,
    @InjectRepository(Product)
    private productrepository: Repository<Product>,
    @Inject(TRADE_PROVIDER_MANAGER) private tradeProvider: TradeProvider,
  ) {}

  @Cron(process.env[ORDER_ASYNC_SENDER_SCHEDULER] || '0 * * * * *', {
    name: 'asynchronously sending order to trade',
    waitForCompletion: true,
    disabled: !JSON.parse(
      process.env[ORDER_ASYNC_SENDER_SCHEDULER_ENABLED] || 'true',
    ),
  })
  async processOrders(): Promise<void> {
    try {
      const orders = await this.orderRepository.find({
        select: {
          id: true,
          orderTypeId: true,
          order: {},
          integrationTime: true,
        },
        where: { integrationTime: IsNull() },
      });

      if (!orders.length) {
        this.logger.log('no new orders to process');
        return;
      }

      const ordersByType: Map<number, TradeOrders> = new Map();

      for (const order of orders) {
        if (ordersByType.has(order.orderTypeId)) {
          ordersByType.get(order.orderTypeId).orders.push({
            aggregatorOrderId: String(order.id),
            tradeOrderId: 0,
            order: order.order,
          });
        } else {
          ordersByType.set(order.orderTypeId, {
            orders: [
              {
                aggregatorOrderId: String(order.id),
                tradeOrderId: 0,
                order: order.order,
              },
            ],
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
              await this.orderRepository.update(
                Number(order.aggregatorOrderId),
                {
                  integrationTime,
                  tradeOrderId: order.tradeOrderId,
                },
              );
              this.logger.log(
                `order id: ${order.aggregatorOrderId}, trade id: ${order.tradeOrderId} successfully sent`,
              );
            } catch (error) {
              this.logger.error(
                `error when saving a processed order id: ${order.aggregatorOrderId}`,
              );
            }
          }

          for (const order of response.error_orders) {
            if (order.codeError === TRADE_CODE_ERROR_ALREADY_HAS_BEEN_SAVED) {
              try {
                await this.orderRepository.update(
                  Number(order.aggregatorOrderId),
                  {
                    integrationTime,
                    tradeOrderId: order.tradeOrderId,
                  },
                );
                this.logger.log(
                  `order id: ${order.aggregatorOrderId}, trade id: ${order.tradeOrderId} successfully sent`,
                );
              } catch (error) {
                this.logger.error(
                  `error when saving a processed order id: ${order.aggregatorOrderId}`,
                );
              }
            } else {
              this.logger.error(
                `error handled order id: ${order.aggregatorOrderId}, type: ${orderType}, message: ${order.message}`,
              );
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

  @Cron(process.env[ORDER_STATE_RECEIVER_SCHEDULER] || '*/15 * * * * *', {
    name: 'asynchronously receiving order state from trading',
    waitForCompletion: true,
    disabled: !JSON.parse(
      process.env[ORDER_ASYNC_SENDER_SCHEDULER_ENABLED] || 'true',
    ),
  })
  async processStateOrders(): Promise<void> {
    try {
      const stateOrders = await this.tradeProvider.getStateOrders(
        new StateOrdersOptions(
          StateOrderPickOption.One,
          this.configService.get<number>(
            ORDER_STATE_RECEIVER_LIMIT,
            TRADE_STATE_ORDER_LIMIT_DEFAULT,
          ),
          [OrderTypes.Common],
        ),
      );

      if (!stateOrders.statuses.length && !stateOrders.changed_orders.length) {
        this.logger.log('no new state orders to process');
        return;
      }

      const sentStatusTime = new Date();
      const appliedStatuses: number[] = [];

      for (const status of stateOrders.statuses) {
        try {
          await this.orderStatusRepository.upsert(
            {
              orderId: status.order_id,
              tradeStatusId: status.status_id,
              statusCode: status.code,
              orderTypeId: status.order_type_id,
              statusMsg: status.comment,
              statusTime: status.date,
              sentStatusTime,
            },
            {
              conflictPaths: ['tradeStatusId'],
              skipUpdateIfNoValuesChanged: true,
            },
          );

          this.logger.log(
            `order id: ${status.order_id} save status code: ${status.code}`,
          );
          appliedStatuses.push(status.status_id);
        } catch (error) {
          this.logger.error(
            `error status when saving a processed order id: ${status.aggregator_order_id}`,
          );
        }
      }

      const appliedChanges: number[] = [];

      for (const changeOrder of stateOrders.changed_orders) {
        appliedChanges.push(changeOrder.change_id);
      }

      if (appliedStatuses.length) {
        const appliedStateOrders = await this.tradeProvider.applyStateOrders({
          handled_statuses_ids: appliedStatuses,
          handled_change_ids: appliedChanges,
        });

        if (!appliedStateOrders.applied_changes) {
          throw new Error(
            `handled_statuses_ids: [${appliedStatuses.join(',')}] or handled_change_ids: [${appliedChanges.join(',')}] not applied`,
          );
        }
      }
    } catch (error) {
      this.logger.error('error processing state orders:', error.message);
    }
  }

  @Cron(process.env[ORDER_STATUS_DESCRIPTION_SCHEDULER] || '0 0 */6 * * *', {
    name: 'synchronization trade order statuses',
    waitForCompletion: true,
    disabled: !JSON.parse(
      process.env[ORDER_STATUS_DESCRIPTION_SCHEDULER_ENABLED] || 'true',
    ),
  })
  async processOrderStatusDescription(): Promise<void> {
    try {
      const statusDescriptions = await this.tradeProvider.search<
        Trade.OrderStatusDescription[]
      >({
        query: TRADE_SEARCH_STATUS_DESCRIPTION_QUERY,
      });

      for (const status of statusDescriptions) {
        const existingRecord =
          await this.orderStatusDescriptionRepository.findOne({
            where: { tradeStatusId: status.status_id },
          });

        if (existingRecord) {
          Object.assign(existingRecord, {
            code: status.code,
            type: status.type,
            description: status.description,
            orderIndex: status.order_index,
            isManual: status.is_manual,
          });

          await this.orderStatusDescriptionRepository.save(existingRecord);
        } else {
          await this.orderStatusDescriptionRepository.insert({
            tradeStatusId: status.status_id,
            code: status.code,
            type: status.type,
            description: status.description,
            orderIndex: status.order_index,
            isManual: status.is_manual,
          });
        }
      }

      this.logger.log('synchronization of trading statuses was successful');
    } catch (error) {
      this.logger.error(
        'error processing order status description',
        error.message,
      );
    }
  }

  async getOrders(userId: User['id'], pagination: PaginationDto = {}) {
    const { take = 15, skip = 0 } = pagination;

    const [orders, total] = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.userId = :userId', { userId })
      .orderBy('created_at', 'DESC')
      .skip(+skip)
      .take(+take)
      .getManyAndCount();

    return {
      orders,
      pagination: { total, take: +take, skip: +skip },
    };
  }

  async getOrderStatuses(
    userId: User['id'],
    orderId: Order['id'],
    pagination: PaginationDto = {},
  ) {
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId,
      },
      select: ['tradeOrderId', 'userId'],
    });

    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    if (userId !== order.userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const { take = 5, skip = 0 } = pagination;

    const [statuses, total] = await this.orderStatusRepository
      .createQueryBuilder('order_status')
      .where('order_status.orderId = :orderId', { orderId: order.tradeOrderId })
      .orderBy('status_time', 'ASC')
      .skip(+skip)
      .take(+take)
      .getManyAndCount();

    return {
      statuses,
      pagination: { total, take: +take, skip: +skip },
    };
  }

  async getOrdersStatus(userId: User['id'], orderIds: Order['id'][]) {
    const orders = await this.orderRepository.find({
      where: {
        id: In(orderIds),
        userId: userId,
      },
      select: ['id', 'tradeOrderId'],
    });

    if (!orders.length) {
      throw new HttpException('Orders not found', HttpStatus.NOT_FOUND);
    }

    const statuses = await this.orderStatusRepository
      .createQueryBuilder('status')
      .distinctOn(['status.orderId'])
      .where('status.orderId IN (:...orderIds)', {
        orderIds: orders.map((order) => order.tradeOrderId),
      })
      .orderBy('status.orderId', 'ASC')
      .addOrderBy('status.statusTime', 'DESC')
      .getMany();

    const result: {
      [key in string]: OrderStatus;
    } = {};

    for (let i = 0; i < statuses.length; i++) {
      const orderId = orders.find(
        (order) => order.tradeOrderId === statuses[i].orderId,
      ).id;

      result[orderId] = statuses[i];
    }

    return result;
  }

  async getOrdersProducts(
    userId: User['id'],
    orderIds: Order['id'][],
    lang = 'uk',
  ) {
    const orders = await this.orderRepository.find({
      where: {
        id: In(orderIds),
        userId: userId,
      },
      select: ['id', 'order'],
    });

    if (!orders.length) {
      throw new HttpException('Orders not found', HttpStatus.NOT_FOUND);
    }

    const productIds = new Set();

    for (let i = 0; i < orders.length; i++) {
      for (let j = 0; j < orders[i].order.body_list.length; j++) {
        productIds.add(orders[i].order.body_list[j].goods_id);
      }
    }

    type TruncatedProduct = Pick<
      Product,
      'id' | 'syncId' | 'name' | 'cdnData'
    >;

    const products: TruncatedProduct[] = await this.productrepository.find({
      where: {
        syncId: In(Array.from(productIds)),
      },
      select: ['id', 'syncId', 'name', 'cdnData'],
    });

    const result: {
      [key in string]: TruncatedProduct[];
    } = {};

    for (let i = 0; i < orders.length; i++) {
      const orderProducts: TruncatedProduct[] = [];

      for (let j = 0; j < orders[i].order.body_list.length; j++) {
        const orderProduct = products.find(
          (product) => product.syncId === orders[i].order.body_list[j].goods_id,
        );

        if (!orderProduct) continue;

        const serializedOrderProduct = {
            ...orderProduct,
            name: orderProduct.name[lang]
        }

        orderProducts.push(serializedOrderProduct);
      }

      if (!orderProducts.length) continue;

      result[orders[i].id] = orderProducts;
    }

    return result;
  }
}
