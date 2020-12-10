import React, { useState } from "react";
import { Formik } from "formik";
import {
  LockFilled,
  UserAddOutlined,
  UserOutlined,
  MailFilled,
} from "@ant-design/icons";
import { Button, message } from "antd";
import * as Yup from "yup";
import axios from "axios";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { setUser } from "@sentry/react";

import { FormItem } from "../FormItem/FormItem";
import { useAppDispatch } from "../../context/userContext";
import { useAuthToken } from "../../utils/useAuthToken";
import { UserAuthApiResponse } from "../../../backend/controllers/account.controller";

type FormValues = {
  email: string;
  login: string;
  password: string;
  repeatPassword: string;
};

const initialValues: FormValues = {
  email: "",
  login: "",
  password: "",
  repeatPassword: "",
};

const validationSchema = Yup.object().shape<FormValues>({
  login: Yup.string().required("Login is required"),
  email: Yup.string()
    .email("This is not a valid email!")
    .required("Email is required"),
  password: Yup.string().required("Password is required").min(6),
  repeatPassword: Yup.string()
    .required("You have to repeat the password")
    .when("password", {
      is: (val) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf(
        [Yup.ref("password")],
        "Both password need to be the same"
      ),
    }),
});

export const Register: React.FC = () => {
  const [, setAuthToken] = useAuthToken();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const onSubmit = async ({ repeatPassword, ...values }: FormValues) => {
    if (!executeRecaptcha) {
      throw new Error("Recpatcha execution function not found");
    }

    setIsLoading(true);
    let recaptchaToken = "";
    try {
      recaptchaToken = (await executeRecaptcha("register")) ?? "";
    } catch (err) {
      message.error("Recaptcha failed. Please, try again.");
      return;
    }

    try {
      const { data } = await axios.post<UserAuthApiResponse>(
        "/api/account",
        values,
        {
          headers: { "x-recaptcha-token": recaptchaToken },
        }
      );

      setAuthToken(data.token);

      const { account } = data;

      dispatch({
        type: "SET_CURRENT_USER",
        user: account,
      });

      setUser({ email: account.email, username: account.login });
    } catch (err) {
      console.error(err);
      message.error(
        err?.response?.data?.message ??
          "Creating account failed. Please, try again."
      );
    }

    setIsLoading(false);
  };

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <FormItem name="email" label="Email" icon={<MailFilled />} />
          <FormItem name="login" label="Login" icon={<UserOutlined />} />
          <FormItem
            name="password"
            label="Password"
            icon={<LockFilled />}
            type="password"
          />
          <FormItem
            name="repeatPassword"
            label="Repeat Password"
            icon={<LockFilled />}
            type="password"
          />
          <Button
            icon={<UserAddOutlined />}
            loading={isLoading}
            htmlType="submit"
          >
            Register
          </Button>
        </form>
      )}
    </Formik>
  );
};
