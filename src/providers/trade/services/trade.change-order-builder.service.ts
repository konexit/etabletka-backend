import {
  OrderChangeActionMap,
  OrderChangeOptions,
  OrderChangePayloadMap,
  TradeOrderChangeAggregator,
  TradeOrderChangesAggregator
} from "../interfaces";
import { TradeOrderChangeAutoApliedMode, TradeOrderChangeType } from "../trade.constants";

export class TradeOrderChangesAggregatorBuilder {
  private tradeOrderChangesAggregator: TradeOrderChangesAggregator;

  constructor() {
    this.tradeOrderChangesAggregator = {
      order_changes: [],
    };
  }

  addOrderChange(
    orderId: number,
    autoApplied: TradeOrderChangeAutoApliedMode = TradeOrderChangeAutoApliedMode.Aggregator,
    options?: OrderChangeOptions
  ): TradeOrderChangeBuilder {
    const builder = new TradeOrderChangeBuilder(orderId, autoApplied, this, options);
    this.tradeOrderChangesAggregator.order_changes.push(builder.getTradeOrderChange());
    return builder;
  }

  build(): TradeOrderChangesAggregator {
    return this.tradeOrderChangesAggregator;
  }
}

export class TradeOrderChangeBuilder {
  private tradeOrderChangeAggregator: TradeOrderChangeAggregator;
  private parent: TradeOrderChangesAggregatorBuilder;

  constructor(
    orderId: number,
    autoApplied: TradeOrderChangeAutoApliedMode,
    parent: TradeOrderChangesAggregatorBuilder,
    options?: OrderChangeOptions
  ) {
    this.tradeOrderChangeAggregator = {
      order_id: orderId,
      auto_applied: autoApplied,
      changes: [],
    };
    if (options) {
      this.tradeOrderChangeAggregator.options = options;
    }
    this.parent = parent;
  }

  addChange<T extends TradeOrderChangeType>(
    type: T,
    action: OrderChangeActionMap[T],
    payload: OrderChangePayloadMap[T]
  ): this {
    this.tradeOrderChangeAggregator.changes.push({ type, action, payload });
    return this;
  }

  getTradeOrderChange(): TradeOrderChangeAggregator {
    return this.tradeOrderChangeAggregator;
  }

  end(): TradeOrderChangesAggregatorBuilder {
    return this.parent;
  }
}
