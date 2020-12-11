import React, { useState } from "react";
import { Formik, FormikHelpers } from "formik";
import { LockFilled, CheckOutlined, LockOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import axios from "axios";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import * as Yup from "yup";

import { FormItem } from "../FormItem/FormItem";
import { ChangePwdArgs } from "../../../backend/controllers/user.validation";

type FormValues = {
  oldPassword: string;
  newPassword: string;
  newPasswordRepeat: string;
};

const validationSchema = Yup.object().shape<FormValues>({
  oldPassword: Yup.string().required("Old password is required"),
  newPassword: Yup.string().required("New password is required").min(6),
  newPasswordRepeat: Yup.string()
    .required("You have to repeat the password")
    .when("newPassword", {
      is: (val) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf(
        [Yup.ref("newPassword")],
        "Both password need to be the same"
      ),
    }),
});

export const ChangePassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const onSubmit = async (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => {
    if (!executeRecaptcha) {
      throw new Error("Recpatcha execution function not found");
    }
    setIsLoading(true);
    let recaptchaToken = "";
    try {
      recaptchaToken = (await executeRecaptcha("changepassword")) ?? "";
    } catch (err) {
      console.error(err);
      message.error("Recaptcha failed. Please, try again.");
      return;
    }

    try {
      await axios.post(
        "/api/change-password",
        {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        } as ChangePwdArgs,
        {
          headers: { "x-recaptcha-token": recaptchaToken },
        }
      );
      formikHelpers.resetForm();
      message.success("Password changed");
    } catch (err) {
      console.error(err?.response?.data);
      message.error(
        err?.response?.data?.message ??
          "Could not change password. Please, try again."
      );
    }

    setIsLoading(false);
  };

  return (
    <Formik<FormValues>
      initialValues={{
        oldPassword: "",
        newPassword: "",
        newPasswordRepeat: "",
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <FormItem
            name="oldPassword"
            label="Current Password"
            icon={<LockOutlined />}
            type="password"
          />
          <br />
          <FormItem
            name="newPassword"
            label="New Password"
            icon={<LockFilled />}
            type="password"
          />
          <FormItem
            name="newPasswordRepeat"
            label="New Password"
            icon={<LockFilled />}
            type="password"
          />
          <Button
            icon={<CheckOutlined />}
            loading={isLoading}
            htmlType="submit"
          >
            Change Password
          </Button>
        </form>
      )}
    </Formik>
  );
};
