import { NowRequest, NowResponse } from "@now/node";

import { CreateAccount } from "../backend/controllers/account.controller";
import { verifyCaptcha } from "../backend/controllers/auth.controller";
import { handleErrors } from "../backend/errors";
import { createUnauthenticatedContext } from "../backend/createContext";

export default handleErrors(async (_req: NowRequest, res: NowResponse) => {
  const ctx = await createUnauthenticatedContext();
  if (_req.method == "POST") {
    await verifyCaptcha(_req);
    const user = await CreateAccount(_req.body, ctx);
    return res.status(200).json(user);
  }

  return res.status(200).json({
    msg: "It works!",
    ip: _req.headers["x-forwarded-for"] || _req.connection.remoteAddress,
  });
});
