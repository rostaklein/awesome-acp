import Joi from "joi";

export type CreateOrderArgs = {
  amount: number;
  characterId: number;
};

export const createOrderValidationSchema = Joi.object<CreateOrderArgs>({
  amount: Joi.number().required(),
  characterId: Joi.number().required(),
});

export type CaptureOrderArgs = {
  paypalOrderId: string;
};

export const captureOrderValidationSchema = Joi.object<CaptureOrderArgs>({
  paypalOrderId: Joi.string().required(),
});
