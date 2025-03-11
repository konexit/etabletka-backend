import { BodyList } from "src/common/types/order";

export class BodyListBuilder {
  private bodyList: BodyList;

  constructor() {
    this.bodyList = {
      name: '',
      producer: '',
      nds: 0,
      count: 1,
      row_id: 0,
      goods_id: 0,
      franchise: 0,
      price_amount: 0,
      price_income: 0,
      price_outcome: 0,
      price_internet: 0,
    };
  }

  setName(name: string): this {
    this.bodyList.name = name;
    return this;
  }

  setProducer(producer: string): this {
    this.bodyList.producer = producer;
    return this;
  }

  setNds(nds: number): this {
    this.bodyList.nds = nds;
    return this;
  }

  setCount(count: number): this {
    this.bodyList.count = count;
    return this;
  }

  setRowId(rowId: number): this {
    this.bodyList.row_id = rowId;
    return this;
  }

  setGoodsId(goodsId: number): this {
    this.bodyList.goods_id = goodsId;
    return this;
  }

  setFranchise(franchise: number): this {
    this.bodyList.franchise = franchise;
    return this;
  }

  setPriceAmount(priceAmount: number): this {
    this.bodyList.price_amount = priceAmount;
    return this;
  }

  setPriceIncome(priceIncome: number): this {
    this.bodyList.price_income = priceIncome;
    return this;
  }

  setPriceOutcome(priceOutcome: number): this {
    this.bodyList.price_outcome = priceOutcome;
    return this;
  }

  setPriceInternet(priceInternet: number): this {
    this.bodyList.price_internet = priceInternet;
    return this;
  }

  build(): BodyList {
    return { ...this.bodyList };
  }
}
