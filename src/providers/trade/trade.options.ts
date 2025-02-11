import { IStateOrdersOptions } from "./interfaces";
import { StateOrderPickOption } from "./trade.constants";

export class StateOrdersOptions implements IStateOrdersOptions {
  constructor(
    public pick: StateOrderPickOption,
    public limit: number,
    public orderTypes: number[] = [],
    public tradePoints: number[] = []
  ) { }

  getQueryParams(): string {
    const query: string[] = [];

    if (this.pick) {
      query.push(`pick=${this.pick}`);
    }

    if (this.limit > 0) {
      query.push(`limit=${this.limit}`);
    }

    if (this.orderTypes.length > 0) {
      query.push(`orderTypes=${this.orderTypes.join(",")}`);
    }

    if (this.tradePoints.length > 0) {
      query.push(`tradePoints=${this.tradePoints.join(",")}`);
    }

    return query.length > 0 ? `?${query.join("&")}` : "";
  }
}
