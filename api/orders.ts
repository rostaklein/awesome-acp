import { NowRequest, NowResponse } from "@now/node";

import {
  CreateOrder,
  CaptureOrder,
  GetAllOrders,
  CancelOrder,
} from "../backend/controllers/order.controller";
import { handleErrors } from "../backend/errors";
import { createAuthenticatedContext } from "../backend/createContext";

export default handleErrors(async (_req: NowRequest, res: NowResponse) => {
  const ctx = await createAuthenticatedContext(_req);
  if (_req.method == "POST") {
    if (_req.query.action === "capture") {
      const order = await CaptureOrder(_req.body, ctx);
      return res.status(200).json(order);
    }
    if (_req.query.action === "cancel") {
      await CancelOrder(_req.body, ctx);
      return res.status(200).json({ success: true });
    }
    const order = await CreateOrder(_req.body, ctx);
    return res.status(200).json(order);
  }
  if (_req.method == "GET") {
    const allOrders = await GetAllOrders(ctx);
    return res.status(200).json(allOrders);
  }
  return res.send(200);
});
