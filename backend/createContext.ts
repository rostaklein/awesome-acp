import { NowRequest } from "@now/node";

import { UserRepository, IUser } from "./repositories/user";
import { OrderRepository } from "./repositories/order";
import { getUserModel } from "./models/user";
import { getOrderModel } from "./models/order";
import { verifyToken } from "./controllers/auth.controller";

export type RepositoriesContext = {
  user: UserRepository;
  order: OrderRepository;
};

const getRepositoriesContext = (): RepositoriesContext => {
  const userRepository = new UserRepository(getUserModel, "user");
  const orderRepository = new OrderRepository(getOrderModel, "order");
  return {
    user: userRepository,
    order: orderRepository,
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
  user: IUser;
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
