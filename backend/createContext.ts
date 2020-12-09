import { NowRequest } from "@now/node";

import { verifyToken } from "./controllers/auth.controller";
import { AccountRepository, IAccount } from "./repositories/account";

export type RepositoriesContext = {
  account: AccountRepository;
};

const getRepositoriesContext = (): RepositoriesContext => {
  const accountRepository = new AccountRepository();
  return {
    account: accountRepository,
  };
};

export type UnauthenticatedContext = {
  repositories: RepositoriesContext;
  user: null;
};

export const createUnauthenticatedContext = async (): Promise<
  UnauthenticatedContext
> => {
  return {
    repositories: getRepositoriesContext(),
    user: null,
  };
};

export type AuthenticatedContext = {
  repositories: RepositoriesContext;
  user: IAccount;
};

export const createAuthenticatedContext = async (
  req: NowRequest
): Promise<AuthenticatedContext> => {
  const unAuthCtx = await createUnauthenticatedContext();
  const user = await verifyToken(req, unAuthCtx);

  return {
    ...unAuthCtx,
    user,
  };
};
