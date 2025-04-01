import * as dayjs from 'dayjs';
import {
  Injectable,
  Inject,
  Logger,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { type Repository, In, IsNull } from 'typeorm';
import {
  TRADE_CODE_ERROR_ALREADY_HAS_BEEN_SAVED,
  TRADE_PROVIDER_MANAGER,
  type TradeProvider,
  type TradeOrders,
  TradeOrderMode,
  TradeStateOrderPickOption,
  StateOrdersOptions,
  TRADE_STATE_ORDER_LIMIT_DEFAULT,
  TradeOrderStatusDescription,
  TradeOrdersResponse,
  TradeOrderChangeAutoApliedMode,
  TradeOrderChangeType,
  TradeOrderChangeActionType,
  TradeOrderStatusOwners,
  TradeStatusActions,
  TradeOrderStatusCodes,
} from 'src/providers/trade';
import { Order } from './entities/order.entity';
import { OrderStatus } from './entities/order-status.entity';
import { OrderStatusDescription } from './entities/order-statuses-description.entity';
import {
  COMPANY_BOOKING_DATE,
  COMPANY_MARKETPLACE,
  COMPANY_ORDER_COMPANY_INFO,
  COMPANY_ORDER_DATE_FORMAT,
  OrderTypes,
  PaymentStatus,
  PaymentType,
} from 'src/common/config/common.constants';
import { ORDER_STATE_RECEIVER_LIMIT, TRADE_SEARCH_STATUS_DESCRIPTION_QUERY, } from './order.constants';
import type { PaginationDto } from 'src/common/dto/pagination.dto';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/products/product/entities/product.entity';
import { Store } from 'src/store/entities/store.entity';
import { CheckoutDto } from './dto/checkout.dto';
import {
  JwtCheckoutResponse,
  JwtPayload,
} from 'src/common/types/jwt/jwt.interfaces';
import { JwtTokenService } from 'src/auth/jwt/jwt-token.service';
import { OrderCart } from './entities/order-cart.entity';
import { BodyList, OrderJSON, SentStatus } from 'src/common/types/order';
import { CancelDto } from './dto/cancel.dto';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private readonly jwtTokenService: JwtTokenService,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderStatus)
    private orderStatusRepository: Repository<OrderStatus>,
    @InjectRepository(OrderStatusDescription)
    private orderStatusDescriptionRepository: Repository<OrderStatusDescription>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(OrderCart)
    private orderCartRepository: Repository<OrderCart>,
    @Inject(TRADE_PROVIDER_MANAGER)
    private tradeProvider: TradeProvider,
  ) { }


  async processOrders(): Promise<void> {
    try {
      const orders = await this.orderRepository.find({
        where: {
          integrationTime: IsNull(),
          sentStatus: SentStatus.PENDING,
        },
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
                  sentStatus: SentStatus.SENT,
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
                    sentStatus: SentStatus.SENT,
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

  async processStateOrders(): Promise<void> {
    try {
      const stateOrders = await this.tradeProvider.getStateOrders(
        new StateOrdersOptions(
          TradeStateOrderPickOption.One,
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
          if (status.code == `${TradeOrderStatusCodes.Collected}${TradeOrderStatusOwners.Pharmacist}`) {
            const orderChanges = this.tradeProvider
              .createOrderChangesAggregatorBuilder()
              .addOrderChange(
                status.order_id,
                TradeOrderChangeAutoApliedMode.Aggregator,
                { allow_additional_change: true }
              )
              .addChange(
                TradeOrderChangeType.StatusCode,
                TradeOrderChangeActionType.Update,
                { status_code: `${TradeOrderStatusCodes.WaitClient}${TradeOrderStatusOwners.Aggregator}` },
              )
              .end()
              .build();

            const response = await this.tradeProvider.changeOrders(orderChanges);
            if (!response.handled_orders.includes(status.order_id)) {
              const errorMsg = `Orders${response.error_orders.map((order) => `: ID ${order.order_id} - ${order.message}`)}`;
              this.logger.error(errorMsg);
              throw new Error(errorMsg);
            }
          }

          await this.orderStatusRepository.upsert(
            {
              orderId: Number(status.aggregator_order_id),
              tradeOrderId: status.order_id,
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

  async processOrderStatusDescriptions(): Promise<void> {
    try {
      const statusDescriptions = await this.tradeProvider.search<
        TradeOrderStatusDescription[]
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

  async getOrder(userId: User['id'], orderId: Order['id']) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    if (userId !== order.userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return order;
  }

  async getOrderStatusDescriptions(type: OrderStatusDescription['type']) {
    const statusActions = await this.orderStatusDescriptionRepository.find({
      where: {
        type: type,
      },
    });

    if (!statusActions.length) {
      throw new HttpException(
        'Order status descriptions not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return statusActions;
  }

  async getOrders(
    userId: User['id'],
    pagination: PaginationDto = {},
    lang = 'uk',
  ) {
    const { take = 15, skip = 0 } = pagination;

    const [orders, total] = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.userId = :userId', { userId })
      .orderBy('created_at', 'DESC')
      .skip(+skip)
      .take(+take)
      .getManyAndCount();

    const statuses = await this.orderStatusRepository
      .createQueryBuilder('status')
      .distinctOn(['status.orderId'])
      .where('status.orderId IN (:...orderIds)', {
        orderIds: orders.map((order) => order.id),
      })
      .orderBy('status.orderId', 'ASC')
      .addOrderBy('status.id', 'DESC')
      .getMany();

    const productIds = new Set<Product['id']>();

    for (let i = 0; i < orders.length; i++) {
      for (let j = 0; j < orders[i].order.body_list.length; j++) {
        productIds.add(orders[i].order.body_list[j].goods_id);
      }
    }

    const products: Pick<Product, 'id' | 'syncId' | 'cdnData' | 'name'>[] =
      await this.productRepository.find({
        where: {
          syncId: In(Array.from(productIds)),
        },
        select: ['id', 'syncId', 'name', 'cdnData'],
      });

    const statusesResult: { [key in Order['id']]: OrderStatus } = {};

    for (let i = 0; i < statuses.length; i++) {
      statusesResult[statuses[i].orderId] = statuses[i];
    }

    type TruncatedProduct = Pick<Product, 'id' | 'syncId' | 'cdnData'> & {
      name: string;
      price: (typeof orders)[number]['order']['body_list'][number]['price_amount'];
      count: (typeof orders)[number]['order']['body_list'][number]['count'];
    };

    const productsResult: { [key in Order['id']]: TruncatedProduct[] } = {};

    for (let i = 0; i < orders.length; i++) {
      const orderProducts: TruncatedProduct[] = [];

      for (let j = 0; j < orders[i].order.body_list.length; j++) {
        const orderProduct = products.find(
          (product) => product.syncId === orders[i].order.body_list[j].goods_id,
        );

        if (!orderProduct) continue;

        const serializedOrderProduct = {
          ...orderProduct,
          name: orderProduct.name[lang] as string,
          price: orders[i].order.body_list[j].price_amount,
          count: orders[i].order.body_list[j].count,
        };

        orderProducts.push(serializedOrderProduct);
      }

      if (!orderProducts.length) continue;

      productsResult[orders[i].id] = orderProducts;
    }

    return {
      orders,
      statuses: statusesResult,
      products: productsResult,
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
      select: ['id', 'userId'],
    });

    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    if (userId !== order.userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const { take = 5, skip = 0 } = pagination;

    const [statuses, total] = await this.orderStatusRepository
      .createQueryBuilder('status')
      .where('status.orderId = :orderId', { orderId: order.id })
      .orderBy('status_time', 'ASC')
      .skip(+skip)
      .take(+take)
      .getManyAndCount();

    return {
      statuses,
      pagination: { total, take: +take, skip: +skip },
    };
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

    type TruncatedProduct = Pick<Product, 'id' | 'syncId' | 'cdnData'> & {
      name: string;
      price: (typeof orders)[number]['order']['body_list'][number]['price_amount'];
      count: (typeof orders)[number]['order']['body_list'][number]['count'];
    };

    const products: Pick<Product, 'id' | 'syncId' | 'cdnData' | 'name'>[] =
      await this.productRepository.find({
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
          name: orderProduct.name[lang] as string,
          price: orders[i].order.body_list[j].price_amount,
          count: orders[i].order.body_list[j].count,
        };

        orderProducts.push(serializedOrderProduct);
      }

      if (!orderProducts.length) continue;

      result[orders[i].id] = orderProducts;
    }

    return result;
  }

  async createOrderFromCart(
    jwtPayload: JwtPayload,
    checkoutDto: CheckoutDto,
  ): Promise<JwtCheckoutResponse> {
    try {
      this.jwtTokenService.validateCartAccess(jwtPayload, checkoutDto.cartId);

      const cart = await this.orderCartRepository.findOneBy({
        id: checkoutDto.cartId,
      });
      if (!cart) {
        throw new NotFoundException(
          `Cart with ID ${checkoutDto.cartId} not found`,
        );
      }

      const integrationTime = new Date();
      const orderTime = dayjs();
      let rowId = 1;
      let tradeOrderId = 0;
      let orderAmountSum = 0;
      const bodyList: BodyList[] = [];

      const tradePoint = await this.storeRepository.findOne({
        where: { id: cart.storeId },
        select: ['syncId'],
      });
      if (!tradePoint) {
        throw new NotFoundException(`Store with ID ${cart.storeId} not found`);
      }

      for (const item of cart.order.items) {
        const product = await this.productRepository.findOne({
          where: { id: item.id },
        });
        if (!product) {
          throw new NotFoundException(`Product with ID ${item.id} not found`);
        }

        const priceAmount = product.price * item.quantity;
        orderAmountSum += priceAmount;

        bodyList.push(
          this.tradeProvider
            .createCommonBodyListBuilder()
            .setRowId(rowId)
            .setName(product.name['uk'])
            .setProducer(
              product.attributes['manufacturer']?.name?.uk || 'unknown',
            )
            .setCount(item.quantity)
            .setGoodsId(product.syncId)
            .setPriceInternet(product.price)
            .setPriceAmount(priceAmount)
            .build(),
        );
        rowId++;
      }

      const order = this.orderRepository.create({
        userId: jwtPayload.userId,
        orderTypeId: cart.orderTypeId,
        storeId: cart.storeId,
        katottgId: cart.katottgId,
        companyId: cart.companyId,
        order: null,
        sentStatus: SentStatus.IN_PROGRESS,
      });
      const savedOrder = await this.orderRepository.save(order);

      const expiration = orderTime
        .add(COMPANY_BOOKING_DATE, 'day')
        .format(COMPANY_ORDER_DATE_FORMAT);
      let targetOrder: OrderJSON;

      switch (cart.orderTypeId) {
        case OrderTypes.Common:
          targetOrder = this.tradeProvider
            .createCommonOrderBuilder()
            .setAggregatorOrderId(String(savedOrder.id))
            .setMarketplace(COMPANY_MARKETPLACE)
            .setOrderTime(orderTime.format(COMPANY_ORDER_DATE_FORMAT))
            .setExpiration(expiration)
            .setStatusCode(
              `${TradeOrderStatusCodes.Confirmed}${TradeOrderStatusOwners.Trade}${TradeStatusActions.Process.ReadyForPharmacy}`,
            )
            .setOrderSum(orderAmountSum)
            .setBodyList(bodyList)
            .setClientInfo(checkoutDto.clientInfo)
            .setCompanyInfo(COMPANY_ORDER_COMPANY_INFO)
            .setDeliveryInfo({ delivery_type_id: 0, delivery_status_id: 0 })
            .setPaymentInfo({
              payment_type_id: PaymentType.Cash,
              payment_status_id: PaymentStatus.Pending,
            })
            .setTradePointId(tradePoint.syncId)
            .build();
          break;
        case OrderTypes.Insurance:
          targetOrder = this.tradeProvider
            .createInsuranceOrderBuilder()
            .build();
          break;
        case OrderTypes.ToOrder:
          targetOrder = this.tradeProvider.createToOrderBuilder().build();
          break;
        default:
          await this.orderRepository.update(savedOrder.id, {
            sentStatus: SentStatus.FAILED,
          });
          throw new NotFoundException(
            `Order type ${cart.orderTypeId} is not supported`,
          );
      }

      await this.orderRepository.update(savedOrder.id, { order: targetOrder });

      let response: TradeOrdersResponse;
      try {
        response = await this.tradeProvider.createOrders(
          {
            orders: [
              {
                tradeOrderId: 0,
                aggregatorOrderId: String(savedOrder.id),
                order: targetOrder,
              },
            ],
          },
          { orderType: cart.orderTypeId, action: TradeOrderMode.Forward },
        );
      } catch (error) {
        this.logger.error(error);

        await this.orderRepository.update(savedOrder.id, {
          sentStatus: SentStatus.PENDING,
        });
        await this.orderCartRepository.remove(cart);

        const token = await this.jwtTokenService.generateToken(
          this.jwtTokenService.removeCartsFromJwt(jwtPayload, [
            checkoutDto.cartId,
          ]),
          !!jwtPayload.carts.length,
        );

        return {
          ...token,
          cartId: checkoutDto.cartId,
          aggregatorOrderId: savedOrder.id,
          tradeOrderId: null,
          bookingDate: expiration,
        };
      }

      for (const order of response.handled_orders) {
        await this.orderRepository.update(order.aggregatorOrderId, {
          integrationTime,
          tradeOrderId: order.tradeOrderId,
          sentStatus: SentStatus.SENT,
        });
        tradeOrderId = order.tradeOrderId;
      }

      for (const order of response.error_orders) {
        if (order.codeError === TRADE_CODE_ERROR_ALREADY_HAS_BEEN_SAVED) {
          await this.orderRepository.update(order.aggregatorOrderId, {
            integrationTime,
            tradeOrderId: order.tradeOrderId,
            sentStatus: SentStatus.SENT,
          });
          tradeOrderId = order.tradeOrderId;
        } else {
          throw new Error(
            `Order processing error: ID ${order.aggregatorOrderId}, type ${cart.orderTypeId}, message: ${order.message}`,
          );
        }
      }

      await this.orderCartRepository.remove(cart);

      this.logger.log(
        `Cart ID ${checkoutDto.cartId} successfully converted to Order ID ${savedOrder.id}, Trade Order ID ${tradeOrderId}`,
      );

      const token = await this.jwtTokenService.generateToken(
        this.jwtTokenService.removeCartsFromJwt(jwtPayload, [
          checkoutDto.cartId,
        ]),
        !!jwtPayload.carts.length,
      );

      return {
        ...token,
        cartId: checkoutDto.cartId,
        aggregatorOrderId: savedOrder.id,
        tradeOrderId,
        bookingDate: expiration,
      };
    } catch (error) {
      this.logger.error(`Order creation failed: ${error.message}`, error);
      throw new HttpException(
        error.message || 'Order processing failed',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async cancelOrder(
    jwtPayload: JwtPayload,
    cancelDto: CancelDto,
  ): Promise<void> {
    if (!jwtPayload.userId) {
      throw new HttpException(
        `Order ID: ${cancelDto.orderId} not found or access denied.`,
        HttpStatus.CONFLICT,
      );
    }

    const orderStatus = await this.orderStatusRepository.findOne({
      where: { orderId: cancelDto.orderId },
      order: { id: 'DESC' },
    });

    if (!orderStatus) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    const { statusCode, tradeOrderId } = orderStatus;

    const code = `${statusCode ? statusCode.slice(0, 2) : TradeOrderStatusCodes.Created}${TradeOrderStatusOwners.Aggregator}${TradeStatusActions.Cancel.Customer}`;

    const orderChanges = this.tradeProvider
      .createOrderChangesAggregatorBuilder()
      .addOrderChange(tradeOrderId, TradeOrderChangeAutoApliedMode.None)
      .addChange(
        TradeOrderChangeType.StatusCode,
        TradeOrderChangeActionType.Update,
        { status_code: code },
      )
      .addChange(
        TradeOrderChangeType.Comment,
        TradeOrderChangeActionType.Update,
        { status_msg: cancelDto.reason },
      )
      .end()
      .build();

    const response = await this.tradeProvider.changeOrders(orderChanges);
    if (!response.handled_orders.includes(tradeOrderId)) {
      const errorMsg = `Orders${response.error_orders.map((order) => `: ID ${order.order_id} - ${order.message}`)}`;
      this.logger.error(errorMsg);
      throw new HttpException(errorMsg, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
}
