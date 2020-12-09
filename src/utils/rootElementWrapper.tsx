import React from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import { MainContextProvider } from "./MainContextProvider";

// eslint-disable-next-line @typescript-eslint/ban-types
export const rootElementWrapper = (element: object): React.ReactNode => {
  return (
    <GoogleReCaptchaProvider reCaptchaKey="6Ldwr8QZAAAAABbru-2Kx2v6HR3MaFmHXmIzqhFs">
      <MainContextProvider>{element}</MainContextProvider>
    </GoogleReCaptchaProvider>
  );
};
