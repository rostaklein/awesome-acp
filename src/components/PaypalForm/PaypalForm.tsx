import React, { useState } from "react";
import { PayPalButton } from "react-paypal-button-v2";
import styled from "@emotion/styled";
import { Input, message, Row, Col } from "antd";
import axios from "axios";
import { captureMessage } from "@sentry/react";

import paypalLogo from "../../images/paypal.svg";
import { IOrder } from "../../../backend/repositories/order";

import { CoinsCounter } from "./CoinsCounter";

const StyledInput = styled(Input)`
  margin-bottom: 10px;
`;

const FormWrapper = styled.div`
  max-width: 180px;
  margin: 0 auto;
`;

const CenteredParagraph = styled.div`
  text-align: center;
`;

const PayPalLogo = styled.img`
  width: 90px;
  margin: 10px auto;
  opacity: 0.3;
`;

export const PaypalForm: React.FC = () => {
  const [amount, setAmount] = useState<string>();

  const createOrder = async () => {
    if (!amount) {
      return message.warn("You have to specify the amount to donate.", 2000);
    }
    captureMessage("User initiated Create order process.");
    const { data } = await axios.post<IOrder>("/api/orders", {
      amount: getParsedAmount(),
    });
    captureMessage("Successfully created order.");
    return data.paypalOrderId;
  };

  const captureOrder = async ({
    orderID: paypalOrderId,
  }: {
    orderID: string;
  }) => {
    captureMessage("User initiated Capture order process.");
    const { data } = await axios.post<IOrder>("/api/orders?action=capture", {
      paypalOrderId,
    });
    captureMessage("Successfully captured order.", { extra: data });
  };

  const getParsedAmount = (): number => {
    const integer = parseInt(amount || "0", 10);
    const parsedAmount = Math.floor(integer * 10) / 10;
    return parsedAmount;
  };

  const isAmountValid = getParsedAmount() >= 1;

  return (
    <Row justify="center">
      <Col sm={12}>
        <FormWrapper>
          <StyledInput
            size="large"
            placeholder="Amount"
            suffix="€"
            onChange={(e) => setAmount(e.target.value)}
          />
        </FormWrapper>
        {isAmountValid ? (
          <FormWrapper>
            <PayPalButton
              amount={amount}
              shippingPreference="NO_SHIPPING"
              currency="EUR"
              style={{ height: 35 }}
              createOrder={createOrder}
              onApprove={captureOrder}
              options={{ clientId: "sb", currency: "EUR" }}
            />
          </FormWrapper>
        ) : (
          <>
            <CenteredParagraph>
              Enter the amount you wish to donate.
            </CenteredParagraph>
            <CenteredParagraph>The minimum is 1 EUR.</CenteredParagraph>
            <CenteredParagraph>
              <PayPalLogo src={paypalLogo} />
            </CenteredParagraph>
          </>
        )}
      </Col>
      <Col sm={8}>
        <CoinsCounter eurAmount={getParsedAmount()} />
      </Col>
    </Row>
  );
};
