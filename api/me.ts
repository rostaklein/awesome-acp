import { NowRequest, NowResponse } from "@now/node";

import { Me } from "../backend/controllers/account.controller";
import { handleErrors } from "../backend/errors";
import { createAuthenticatedContext } from "../backend/createContext";

export default handleErrors(async (_req: NowRequest, res: NowResponse) => {
  const ctx = await createAuthenticatedContext(_req);
  const user = await Me(_req, ctx);
  return res.status(200).json(user);
});
