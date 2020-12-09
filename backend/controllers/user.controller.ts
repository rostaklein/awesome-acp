import bcrypt from "bcryptjs";
import { NowRequest } from "@now/node";

import { ResponseError } from "../errors";
import { IUser } from "../repositories/user";
import { UnauthenticatedContext, AuthenticatedContext } from "../createContext";

import {
  createUserValidationSchema,
  LoginArgs,
  loginSchema,
  CreateUserArgs,
} from "./user.validation";
import { getAuthToken } from "./auth.controller";

export type UserAuthApiResponse = {
  token: string;
  user: IUser;
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

  const hashedPwd = await bcrypt.hash(password, 8);

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

  const userWithPassword = await ctx.repositories.user.findDocument({
    username: body.username,
  });

  const isPwdValid = await bcrypt.compare(
    body.password,
    userWithPassword.password
  );

  if (!isPwdValid) {
    throw new ResponseError("Password not valid", 401);
  }

  const user = await ctx.repositories.user.findOne({ username: body.username });

  const token = getAuthToken(user);

  return {
    token,
    user,
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
