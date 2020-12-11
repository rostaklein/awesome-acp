import { NowRequest, NowResponse } from "@now/node";

import { handleErrors } from "../backend/errors";
import { createAuthenticatedContext } from "../backend/createContext";
import { GetAllCharacters } from "../backend/controllers/characters.controller";

export default handleErrors(async (_req: NowRequest, res: NowResponse) => {
  const ctx = await createAuthenticatedContext(_req);

  const characters = await GetAllCharacters(ctx);
  return res.status(200).json(characters);
});
