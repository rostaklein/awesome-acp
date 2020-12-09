import React, { useState } from "react";
import { FormikErrors, Formik } from "formik";
import { LockFilled, LoginOutlined, UserOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import axios from "axios";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { setUser } from "@sentry/react";

import { FormItem } from "../FormItem/FormItem";
import { UserAuthApiResponse } from "../../../backend/controllers/user.controller";
import { useAuthToken } from "../../utils/useAuthToken";
import { useAppDispatch } from "../../context/userContext";

type FormValues = {
  username: string;
  password: string;
};

export const Login: React.FC = () => {
  const [, setAuthToken] = useAuthToken();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const onSubmit = async (values: FormValues) => {
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
        "/api/login",
        values,
        {
          headers: { "x-recaptcha-token": recaptchaToken },
        }
      );

      setAuthToken(data.token);

      const { user } = data;

      dispatch({
        type: "SET_CURRENT_USER",
        user,
      });

      setUser({ id: user.id, email: user.email, username: user.username });
    } catch (err) {
      console.error(err);
      message.error(
        err?.response?.data?.message ?? "Could not log in. Please, try again."
      );
    }

    setIsLoading(false);
  };

  return (
    <Formik<FormValues>
      initialValues={{
        username: "",
        password: "",
      }}
      validate={(values) => {
        const errors: FormikErrors<FormValues> = {};
        if (!values.password) {
          errors.password = "Password required";
        }
        if (!values.username) {
          errors.username = "Username required";
        }
        return errors;
      }}
      onSubmit={onSubmit}
    >
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <FormItem name="username" label="Username" icon={<UserOutlined />} />
          <FormItem
            name="password"
            label="Password"
            icon={<LockFilled />}
            type="password"
          />
          <Button
            icon={<LoginOutlined />}
            loading={isLoading}
            htmlType="submit"
            data-test-id="login-submit-button"
          >
            Log In
          </Button>
        </form>
      )}
    </Formik>
  );
};
