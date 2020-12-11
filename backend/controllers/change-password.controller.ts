import { ResponseError } from "../errors";
import { AuthenticatedContext } from "../createContext";

import { changePwdSchema, ChangePwdArgs } from "./user.validation";
import { hashAndEncodePassword } from "./auth.controller";

export const ChangePassword = async (
  body: ChangePwdArgs,
  ctx: AuthenticatedContext
): Promise<void> => {
  await changePwdSchema.validateAsync(body);

  const { newPassword, oldPassword } = body;

  const hashedPwdOld = hashAndEncodePassword(oldPassword);
  const hashedPwdNew = hashAndEncodePassword(newPassword);

  const account = await ctx.repositories.account.findByLogin(ctx.account.login);

  if (account?.password !== hashedPwdOld) {
    throw new ResponseError("Incorrect old password", 401);
  }

  await ctx.repositories.account.updatePassword(
    ctx.account.login,
    hashedPwdNew
  );
};
