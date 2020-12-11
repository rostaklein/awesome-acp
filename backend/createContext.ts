import { NowRequest } from "@now/node";

import { verifyToken } from "./controllers/auth.controller";
import { AccountRepository, IAccount } from "./repositories/account";
import { CharactersRepository } from "./repositories/character";
import { DonateRepository } from "./repositories/donate";

export type RepositoriesContext = {
  account: AccountRepository;
  characters: CharactersRepository;
  donate: DonateRepository;
};

const getRepositoriesContext = (): RepositoriesContext => {
  const accountRepository = new AccountRepository();
  const characters = new CharactersRepository();
  const donate = new DonateRepository();
  return {
    account: accountRepository,
    characters,
    donate,
  };
};

export type UnauthenticatedContext = {
  repositories: RepositoriesContext;
  account: null;
};

export const createUnauthenticatedContext = async (): Promise<
  UnauthenticatedContext
> => {
  return {
    repositories: getRepositoriesContext(),
    account: null,
  };
};

export type AuthenticatedContext = {
  repositories: RepositoriesContext;
  account: IAccount;
};

export const createAuthenticatedContext = async (
  req: NowRequest
): Promise<AuthenticatedContext> => {
  const unAuthCtx = await createUnauthenticatedContext();
  const account = await verifyToken(req, unAuthCtx);

  return {
    ...unAuthCtx,
    account,
  };
};
