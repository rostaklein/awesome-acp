import { NowRequest, NowResponse } from "@now/node";
import { ValidationError } from "joi";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

Sentry.init({
  dsn:
    "https://3cb39c8efd934074babfeed1cac03aa9@o440643.ingest.sentry.io/5410467",
  tracesSampleRate: 1.0,
});

export class ResponseError {
  constructor(public message: string, public status: number = 400) {
    this.message = message;
    this.status = status;
  }
}

export const handleErrors = (fn: Function) => async (
  req: NowRequest,
  res: NowResponse
) => {
  try {
    return await fn(req, res);
  } catch (err) {
    console.error(err);
    Sentry.captureException(err);
    await Sentry.flush(2000);

    let status = 500;
    let message: string | object =
      "Ouch, something bad happened on the server. Try again later please.";

    if (err instanceof ValidationError) {
      status = 400;
      message = err.details;
    }

    if (err instanceof ResponseError) {
      status = err.status;
      message = err.message;
    }

    return res.status(status).json({ status, message });
  }
};
