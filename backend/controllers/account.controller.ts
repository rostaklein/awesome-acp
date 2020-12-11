import { NowRequest } from "@now/node";

import { ResponseError } from "../errors";
import { UnauthenticatedContext, AuthenticatedContext } from "../createContext";
import { IAccount } from "../repositories/account";

import {
  createAccountValidationSchema,
  LoginArgs,
  loginSchema,
  CreateAccountArgs,
} from "./user.validation";
import { getAuthToken, hashAndEncodePassword } from "./auth.controller";

export type UserAuthApiResponse = {
  token: string;
  account: IAccount;
};

export const CreateAccount = async (
  body: CreateAccountArgs,
  ctx: UnauthenticatedContext
): Promise<UserAuthApiResponse> => {
  await createAccountValidationSchema.validateAsync(body);

  const account = await ctx.repositories.account.findByLogin(body.login);
  if (account) {
    throw new ResponseError(`That account already exists`);
  }

  const { login, password, email } = body;

  const hashedPwd = hashAndEncodePassword(password);

  const createdAcc = await ctx.repositories.account.createAccount(
    login,
    hashedPwd,
    email
  );

  const token = getAuthToken(createdAcc);

  return {
    token,
    account: createdAcc,
  };
};

export const Login = async (
  body: LoginArgs,
  ctx: UnauthenticatedContext
): Promise<UserAuthApiResponse> => {
  await loginSchema.validateAsync(body);

  const account = await ctx.repositories.account.findByLogin(body.login);

  if (!account) {
    throw new ResponseError("Account not found", 404);
  }

  const hashedPwd = hashAndEncodePassword(body.password);
  const isPwdValid = hashedPwd === account.password;

  if (!isPwdValid) {
    throw new ResponseError("Password not valid", 401);
  }

  const token = getAuthToken(account);

  return {
    token,
    account,
  };
};

export const Me = async (
  req: NowRequest,
  ctx: AuthenticatedContext
): Promise<UserAuthApiResponse> => {
  const newToken = getAuthToken(ctx.account);

  return {
    token: newToken,
    account: ctx.account,
  };
};
