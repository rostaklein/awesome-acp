import { IOrderDocument } from "../models/order";

import { BaseRepository } from "./base";

export type IOrder = {
  id: string;
  amount: number;
  currency: string;
  paypalOrderId: string | null;
};

export class OrderRepository extends BaseRepository<IOrder, IOrderDocument> {
  parseDocument(order: IOrderDocument): IOrder {
    const { _id, amount, currency, paypalOrderId } = order;
    return { id: _id, amount, currency, paypalOrderId };
  }
}
