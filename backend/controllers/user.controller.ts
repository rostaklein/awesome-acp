import { Whirlpool, encoders } from "whirlpool-hash";
import { NowRequest } from "@now/node";

import { ResponseError } from "../errors";
import { UnauthenticatedContext, AuthenticatedContext } from "../createContext";

import {
  createUserValidationSchema,
  LoginArgs,
  loginSchema,
  CreateUserArgs,
} from "./user.validation";
import { getAuthToken } from "./auth.controller";

const whirlpool = new Whirlpool();

export type UserAuthApiResponse = {
  token: string;
  login: string;
};

export const CreateUser = async (
  body: CreateUserArgs,
  ctx: UnauthenticatedContext
): Promise<UserAuthApiResponse> => {
  await createUserValidationSchema.validateAsync(body);

  const user = await ctx.repositories.user.findOne({
    $or: [{ username: body.username }, { email: body.email }],
  });

  if (user) {
    throw new ResponseError(`User with that email or username already exists`);
  }

  const { username, password, email } = body;

  const hashedPwd = whirlpool.getHash(password);

  const createdUser = await ctx.repositories.user.create({
    email,
    password: hashedPwd,
    username,
    coins: 0,
  });

  const token = getAuthToken(createdUser);

  return {
    token,
    user: createdUser,
  };
};

export const Login = async (
  body: LoginArgs,
  ctx: UnauthenticatedContext
): Promise<UserAuthApiResponse> => {
  await loginSchema.validateAsync(body);

  const { password, login } = await ctx.repositories.account.findByLogin(
    body.login
  );

  console.log({ password, login });

  const hashedPwd = whirlpool.getHash(body.password) as string;
  const base64HashedPwd = encoders.toBase64(hashedPwd);
  const isPwdValid = base64HashedPwd === password;

  if (!isPwdValid) {
    throw new ResponseError("Password not valid", 401);
  }

  const token = getAuthToken(login);

  return {
    token,
    login,
  };
};

export const Me = async (
  req: NowRequest,
  ctx: AuthenticatedContext
): Promise<UserAuthApiResponse> => {
  const newToken = getAuthToken(ctx.user);

  return {
    token: newToken,
    user: ctx.user,
  };
};
