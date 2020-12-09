import { captureException, flush, captureMessage } from "@sentry/node";

import { createPaypalOrder, capturePaypalOrder } from "../paypalClient";
import { ResponseError } from "../errors";
import { getCoinsCount } from "../getCoinsCount";
import { IUser } from "../repositories/user";
import { AuthenticatedContext } from "../createContext";
import { IOrder } from "../repositories/order";

import {
  createOrderValidationSchema,
  CreateOrderArgs,
  CaptureOrderArgs,
  captureOrderValidationSchema,
} from "./order.validation";

export const CreateOrder = async (
  body: CreateOrderArgs,
  ctx: AuthenticatedContext
): Promise<IOrder> => {
  await createOrderValidationSchema.validateAsync(body || {});

  const { amount } = body;

  const CURRENCY = "EUR";

  try {
    const paypalOrder = await createPaypalOrder(amount, CURRENCY);

    const createdOrder = await ctx.repositories.order.create({
      createdBy: ctx.user.id,
      amount,
      currency: CURRENCY,
      paypalOrderId: paypalOrder.id,
      paypalLogs: null,
    });

    return createdOrder;
  } catch (err) {
    captureException(err);
    await flush(1000);
    throw new ResponseError(
      "Something went wrong while creating a new order.",
      500
    );
  }
};

export type CaptureOrderApiResponse = ReturnType<typeof CaptureOrder>;

export const CaptureOrder = async (
  body: CaptureOrderArgs,
  ctx: AuthenticatedContext
): Promise<{ order: IOrder; user: IUser }> => {
  await captureOrderValidationSchema.validateAsync(body || {});

  const { paypalOrderId } = body;

  const order = await ctx.repositories.order.findDocument({ paypalOrderId });

  if (!order) {
    throw new ResponseError(
      `Could not find an order with PayPal ID: ${paypalOrderId}`,
      404
    );
  }

  try {
    const captureResult = await capturePaypalOrder(paypalOrderId);

    await ctx.repositories.order.update(
      { paypalOrderId },
      {
        paypalLogs: captureResult,
      }
    );

    const { coins } = getCoinsCount(order.amount);

    const updatedUser = await ctx.repositories.user.addCoinsToUser(
      order.createdBy,
      coins
    );
    const updatedOrder = await ctx.repositories.order.findOne({
      paypalOrderId,
    });

    captureMessage("Added coins to user", {
      extra: { coins },
      user: updatedUser,
    });
    await flush(2000);

    return { order: updatedOrder, user: updatedUser };
  } catch (err) {
    captureException(err);
    await flush(1000);
    throw new ResponseError(
      "Something went wrong while creating a new order.",
      500
    );
  }
};
