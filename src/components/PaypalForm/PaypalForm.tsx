import React, { useState } from "react";
import { PayPalButton } from "react-paypal-button-v2";
import { message, Row, Col, Select } from "antd";
import axios from "axios";
import { captureMessage } from "@sentry/react";

import paypalLogo from "../../images/paypal.svg";
import { useCharacters } from "../Characters/Characters";
import { IDonate } from "../../../backend/repositories/donate";

import { CoinsCounter } from "./CoinsCounter";
import {
  CenteredParagraph,
  FormWrapper,
  PayPalLogo,
  StyledInput,
  StyledSelect,
} from "./PaypalForm.styles";

export const PaypalForm: React.FC = () => {
  const { characters, isLoading } = useCharacters();
  const [amount, setAmount] = useState<string>();
  const [charId, setCharId] = useState<number>();

  const createOrder = async () => {
    if (!amount) {
      return message.warn("You have to specify the amount to donate.", 2000);
    }
    if (!charId) {
      return message.warn(
        "You have to select a character for the transfer.",
        2000
      );
    }
    captureMessage("User initiated Create order process.");
    const { data } = await axios.post<IDonate>("/api/orders", {
      characterId: charId,
      amount: getParsedAmount(),
    });
    captureMessage("Successfully created order.");
    return data.paypal_order_id;
  };

  const captureOrder = async ({
    orderID: paypalOrderId,
  }: {
    orderID: string;
  }) => {
    captureMessage("User initiated Capture order process.");
    const { data } = await axios.post<IDonate>("/api/orders?action=capture", {
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
  const isValid = charId && isAmountValid;

  return (
    <Row justify="center">
      <Col sm={12}>
        <FormWrapper>
          <StyledSelect
            placeholder="Select a character"
            size="large"
            loading={isLoading}
            onChange={(val) => setCharId(Number(val))}
          >
            {characters.map((char) => (
              <Select.Option key={char.characterId} value={char.characterId}>
                {char.charName}
              </Select.Option>
            ))}
          </StyledSelect>
          <StyledInput
            size="large"
            placeholder="Amount"
            suffix="€"
            onChange={(e) => setAmount(e.target.value)}
          />
        </FormWrapper>
        {isValid ? (
          <FormWrapper>
            <PayPalButton
              amount={amount}
              shippingPreference="NO_SHIPPING"
              currency="EUR"
              style={{ height: 35 }}
              catchError={captureMessage}
              createOrder={createOrder}
              onApprove={captureOrder}
              options={{
                clientId:
                  "AWrIrkDeOQnR9_F3tBf5CLDrhFKpYVpYm6Yi_d4VQBRMpUSS2ZZenIeswMhgQj9hJ1K_kTgQ_3_RFphN",
                currency: "EUR",
              }}
            />
          </FormWrapper>
        ) : (
          <>
            <CenteredParagraph>
              Select a character and enter the amount you wish to donate.
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
