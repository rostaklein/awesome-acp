import Joi from "joi";

const email = Joi.string().email({ minDomainSegments: 2 }).required();

const password = Joi.string().min(6).max(30).required();

const username = Joi.string().alphanum().min(3).max(30).required();

export type CreateUserArgs = {
  email: string;
  username: string;
  password: string;
};

export const createUserValidationSchema = Joi.object<CreateUserArgs>({
  email,
  username,
  password,
});

export type LoginArgs = {
  username: string;
  password: string;
};

export const loginSchema = Joi.object<LoginArgs>({
  username,
  password,
});
