import React from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import { MainContextProvider } from "./MainContextProvider";

// eslint-disable-next-line @typescript-eslint/ban-types
export const rootElementWrapper = (element: object): React.ReactNode => {
  return (
    <GoogleReCaptchaProvider reCaptchaKey="6Lf0EwAaAAAAAN0oV_uOtZ0E2PQ6qL6GQRKWk76i">
      <MainContextProvider>{element}</MainContextProvider>
    </GoogleReCaptchaProvider>
  );
};
