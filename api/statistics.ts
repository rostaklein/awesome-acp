import { NowRequest, NowResponse } from "@now/node";

import { handleErrors } from "../backend/errors";
import { createAuthenticatedContext } from "../backend/createContext";
import { GetAllStats } from "../backend/controllers/statistics.controller";

export default handleErrors(async (_req: NowRequest, res: NowResponse) => {
  const ctx = await createAuthenticatedContext(_req);

  const stats = await GetAllStats(ctx);
  return res.status(200).json(stats);
});
