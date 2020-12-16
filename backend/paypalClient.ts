import * as paypal from "@paypal/checkout-server-sdk";
import { captureMessage, flush } from "@sentry/node";

export const getPaypalClient = () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (process.env.VERCEL_ENV === "production") {
    const environment = new paypal.core.LiveEnvironment(clientId, clientSecret);
    return new paypal.core.PayPalHttpClient(environment);
  }

  const environment = new paypal.core.SandboxEnvironment(
    clientId,
    clientSecret
  );
  return new paypal.core.PayPalHttpClient(environment);
};

export const createPaypalOrder = async (amount: number) => {
  const request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: "CAPTURE",
    application_context: {
      brand_name: "100ka Awesome ACP",
      shipping_preference: "NO_SHIPPING",
    },
    purchase_units: [
      {
        description: "100ka donate coins",
        amount: {
          currency_code: "EUR",
          value: amount,
        },
      },
    ],
  });

  const client = getPaypalClient();

  const response = await client.execute(request);

  captureMessage("Created a PayPal order", { extra: response });
  await flush(1000);
  return response.result;
};

export const capturePaypalOrder = async (orderId: string) => {
  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  const client = getPaypalClient();

  const capture = await client.execute(request);

  captureMessage("Captured a PayPal order", { extra: capture });
  await flush(1000);
  return capture.result;
};
