import { Schema, Document } from "mongoose";

import { getMongooseConnection } from "../connect";
import { IOrder } from "../repositories/order";

export type IOrderDocument = IOrder &
  Document & { paypalLogs: null | unknown; createdBy: string };

const OrderSchema = new Schema<IOrder>(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    paypalOrderId: { type: String },
    paypalLogs: { type: Object },
  },
  { timestamps: true }
);

export const getOrderModel = async () =>
  getMongooseConnection().then((conn) =>
    conn.model<IOrderDocument>("Order", OrderSchema)
  );
