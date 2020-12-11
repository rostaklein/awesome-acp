import { captureException, flush } from "@sentry/node";

import { ResponseError } from "../errors";
import { AuthenticatedContext } from "../createContext";
import { ICharacter } from "../repositories/character";

export const GetAllCharacters = async (
  ctx: AuthenticatedContext
): Promise<ICharacter[]> => {
  try {
    const characters = await ctx.repositories.characters.findAllCharactersByLogin(
      ctx.account.login
    );

    return characters;
  } catch (err) {
    captureException(err);
    await flush(1000);
    throw new ResponseError(
      "Something went wrong while getting characters.",
      500
    );
  }
};
