import { NowRequest, NowResponse } from "@now/node";

import {
  CreateOrder,
  CaptureOrder,
} from "../backend/controllers/orders.controller";
import { handleErrors } from "../backend/errors";
import { createAuthenticatedContext } from "../backend/createContext";

export default handleErrors(async (_req: NowRequest, res: NowResponse) => {
  const ctx = await createAuthenticatedContext(_req);
  if (_req.method == "POST") {
    if (_req.query.action === "capture") {
      const order = await CaptureOrder(_req.body, ctx);
      return res.status(200).json(order);
    }
    const order = await CreateOrder(_req.body, ctx);
    return res.status(200).json(order);
  }
  return res.send(200);
});
