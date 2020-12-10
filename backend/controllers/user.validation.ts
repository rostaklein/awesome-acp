import Joi from "joi";

const email = Joi.string().email({ minDomainSegments: 2 }).required();
const password = Joi.string().min(6).max(30).required();
const login = Joi.string().alphanum().min(3).max(30).required();

export type CreateAccountArgs = {
  email: string;
  login: string;
  password: string;
};

export const createAccountValidationSchema = Joi.object<CreateAccountArgs>({
  email,
  login: Joi.string(),
  password,
});

export type LoginArgs = {
  login: string;
  password: string;
};

export const loginSchema = Joi.object<LoginArgs>({
  login,
  password,
});
