import { NowRequest, NowResponse } from "@now/node";

import { Login } from "../backend/controllers/user.controller";
import { verifyCaptcha } from "../backend/controllers/auth.controller";
import { handleErrors } from "../backend/errors";
import { createUnauthenticatedContext } from "../backend/createContext";

export default handleErrors(async (_req: NowRequest, res: NowResponse) => {
  const ctx = await createUnauthenticatedContext();
  if (_req.method === "POST") {
    await verifyCaptcha(_req);
    const loginCredentials = await Login(_req.body, ctx);
    return res.status(200).send(loginCredentials);
  }
});
