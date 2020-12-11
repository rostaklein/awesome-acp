import axios from "axios";
import { NowRequest } from "@now/node";
import jsonwebtoken, {
  TokenExpiredError,
  JsonWebTokenError,
} from "jsonwebtoken";

import { ResponseError } from "../errors";
import { UnauthenticatedContext } from "../createContext";
import { IAccount } from "../repositories/account";

type RecaptchaResponse = {
  success: boolean;
  hostname: string;
  score: number;
  action: string;
};

export const verifyCaptcha = async (req: NowRequest): Promise<void> => {
  if (process.env.SKIP_RECAPTCHA === "true") {
    return;
  }
  try {
    const captchaToken = req.headers["x-recaptcha-token"];
    if (!process.env.RECAPTCHA_KEY) {
      throw new Error("Recaptcha secret key not set");
    }
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_KEY}&response=${captchaToken}`;
    const response = await axios.get<RecaptchaResponse>(verificationUrl);
    if (!response.data.success) {
      throw new Error("Captcha response didnt succeed.");
    }
  } catch (err) {
    console.error(err);
    throw new ResponseError("Recaptcha verification failed.", 401);
  }
};

export const getAuthToken = (account: IAccount): string => {
  if (!process.env.SECRET_KEY) {
    throw new ResponseError(
      "Could not log in, secret key missing in web setup to issue token.",
      500
    );
  }

  const token = jsonwebtoken.sign(account, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });

  return token;
};

export type TokenPayload = IAccount;

export const verifyToken = async (
  req: NowRequest,
  ctx: UnauthenticatedContext
): Promise<IAccount> => {
  let token = req.headers["x-authorization-token"] ?? "";

  if (Array.isArray(token)) {
    token = token[0];
  }

  if (!token) {
    throw new ResponseError("No authorization token found in the headers", 401);
  }

  if (!process.env.SECRET_KEY) {
    throw new ResponseError(
      "Could not verify token, secret key missing in web setup.",
      500
    );
  }

  try {
    const { login } = jsonwebtoken.verify(
      token,
      process.env.SECRET_KEY
    ) as TokenPayload;

    const user = await ctx.repositories.account.findByLogin(login);

    if (!user) {
      throw new ResponseError("Account does not exist", 404);
    }

    return user;
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw new ResponseError(`Token expired at ${err.expiredAt}`, 401);
    }
    if (err instanceof JsonWebTokenError) {
      throw new ResponseError(`Invalid auth token`, 401);
    }

    throw err;
  }
};
