import { captureException, flush, captureMessage } from "@sentry/node";

import { createPaypalOrder, capturePaypalOrder } from "../paypalClient";
import { ResponseError } from "../errors";
import { getCoinsCount } from "../getCoinsCount";
import { AuthenticatedContext } from "../createContext";
import { IDonate } from "../repositories/donate";

import {
  createOrderValidationSchema,
  CreateOrderArgs,
  CaptureOrderArgs,
  captureOrderValidationSchema,
} from "./order.validation";

export const CoinOfLuckID = 4037;

export const CreateOrder = async (
  body: CreateOrderArgs,
  ctx: AuthenticatedContext
): Promise<IDonate> => {
  await createOrderValidationSchema.validateAsync(body || {});

  captureMessage("Initializing donate order", {
    extra: { body, account: ctx.account },
  });

  try {
    const paypalOrder = await createPaypalOrder(body.amount);
    const { coins } = getCoinsCount(body.amount);

    await ctx.repositories.donate.addTransaction({
      account_login: ctx.account.login,
      character_id: body.characterId,
      amount_eur: body.amount,
      amount_coins: coins,
      paypal_order_id: paypalOrder.id,
    });

    const createdOrder = await ctx.repositories.donate.findTransactionByPaypalId(
      paypalOrder.id
    );

    if (!createdOrder) {
      throw new ResponseError("Could not create/find the PayPal order");
    }

    return createdOrder;
  } catch (err) {
    console.error(err);
    captureException(err);
    await flush(1000);
    throw new ResponseError(
      "Something went wrong while creating a new order.",
      500
    );
  }
};

export type CaptureOrderApiResponse = IDonate;

export const CaptureOrder = async (
  body: CaptureOrderArgs,
  ctx: AuthenticatedContext
): Promise<CaptureOrderApiResponse> => {
  await captureOrderValidationSchema.validateAsync(body || {});

  const { paypalOrderId } = body;

  const donate = await ctx.repositories.donate.findTransactionByPaypalId(
    paypalOrderId
  );

  if (!donate) {
    throw new ResponseError(
      `Could not find a donate with PayPal ID: ${paypalOrderId}`,
      404
    );
  }

  try {
    const captureResult = await capturePaypalOrder(paypalOrderId);

    await ctx.repositories.donate.updateTransactionByPaypalId(
      paypalOrderId,
      captureResult
    );

    await ctx.repositories.characters.addItemToInventory(
      donate.character_id,
      CoinOfLuckID,
      donate.amount_coins
    );

    await ctx.repositories.donate.setTransactionStatus(
      paypalOrderId,
      "rewarded"
    );
    captureMessage("Added coins to user", {
      extra: { donate },
    });
    await flush(2000);

    return donate;
  } catch (err) {
    await ctx.repositories.donate.setTransactionStatus(paypalOrderId, "failed");
    captureException(err);
    await flush(1000);
    throw new ResponseError(
      "Something went wrong while capturing an order.",
      500
    );
  }
};

export type CancelOrderApiResponse = IDonate;

export const CancelOrder = async (
  body: CaptureOrderArgs,
  ctx: AuthenticatedContext
): Promise<CancelOrderApiResponse> => {
  await captureOrderValidationSchema.validateAsync(body || {});

  const { paypalOrderId } = body;

  await ctx.repositories.donate.setTransactionStatus(
    paypalOrderId,
    "cancelled"
  );

  const order = await ctx.repositories.donate.findTransactionByPaypalId(
    body.paypalOrderId
  );

  if (!order) {
    throw new ResponseError(
      `Could not find a donate with PayPal ID: ${paypalOrderId}`,
      404
    );
  }

  return order;
};

export type GetAllOrdersApiResponse = Omit<IDonate, "paypal_logs">[];

export const GetAllOrders = async (
  ctx: AuthenticatedContext
): Promise<GetAllOrdersApiResponse> => {
  const donates = await ctx.repositories.donate.getAllTransactionsByLogin(
    ctx.account.login
  );

  return donates.map(({ paypal_logs, ...rest }) => rest);
};
