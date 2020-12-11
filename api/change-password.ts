import { NowRequest, NowResponse } from "@now/node";

import { verifyCaptcha } from "../backend/controllers/auth.controller";
import { handleErrors } from "../backend/errors";
import { createAuthenticatedContext } from "../backend/createContext";
import { ChangePassword } from "../backend/controllers/change-password.controller";

export default handleErrors(async (_req: NowRequest, res: NowResponse) => {
  const ctx = await createAuthenticatedContext(_req);
  if (_req.method == "POST") {
    await verifyCaptcha(_req);
    await ChangePassword(_req.body, ctx);
    return res.status(200).json({ success: true });
  }

  return res.status(200).json({
    msg: "It works!",
    ip: _req.headers["x-forwarded-for"] || _req.connection.remoteAddress,
  });
});
