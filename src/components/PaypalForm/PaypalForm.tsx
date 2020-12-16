import React, { useState } from "react";
import { PayPalButton } from "react-paypal-button-v2";
import { message, Row, Col, Select, Spin } from "antd";
import axios from "axios";
import { captureMessage } from "@sentry/react";

import paypalLogo from "../../images/paypal.svg";
import { useCharacters } from "../Characters/Characters";
import { IDonate } from "../../../backend/repositories/donate";
import {
  CancelOrderApiResponse,
  CaptureOrderApiResponse,
} from "../../../backend/controllers/order.controller";

import { CoinsCounter } from "./CoinsCounter";
import {
  CenteredParagraph,
  FormWrapper,
  PayPalLogo,
  StyledInput,
  StyledSelect,
} from "./PaypalForm.styles";

type Props = {
  addOrder: (order: IDonate) => void;
  updateOrder: (paypalOrderId: string, order: IDonate) => void;
};

export const PaypalForm: React.FC<Props> = ({ addOrder, updateOrder }) => {
  const { characters, isLoading: isLoadingChars } = useCharacters();
  const [amount, setAmount] = useState<string>();
  const [charId, setCharId] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);

  const createOrder = async () => {
    if (!amount) {
      return message.warn("You have to specify the amount to donate.", 2000);
    }
    if (Number(amount) < 5) {
      return message.warn("The amount has to be at least 5 EUR", 2000);
    }
    if (!charId) {
      return message.warn(
        "You have to select a character for the transfer.",
        2000
      );
    }
    setIsLoading(true);
    captureMessage("User initiated Create order process.");
    const { data } = await axios.post<IDonate>("/api/orders", {
      characterId: charId,
      amount: getParsedAmount(),
    });
    addOrder(data);
    captureMessage("Successfully created order.");
    return data.paypal_order_id;
  };

  const captureOrder = async ({
    orderID: paypalOrderId,
  }: {
    orderID: string;
  }) => {
    captureMessage("User initiated Capture order process.");
    const response = await axios.post<CaptureOrderApiResponse>(
      "/api/orders?action=capture",
      {
        paypalOrderId,
      }
    );
    updateOrder(paypalOrderId, response.data);
    setAmount(undefined);
    setCharId(undefined);
    captureMessage("Successfully captured order.", { extra: response.data });
    setIsLoading(false);
  };

  const cancelOrder = async ({
    orderID: paypalOrderId,
  }: {
    orderID: string;
  }) => {
    captureMessage("User canceled the Capture order process.", {
      extra: { paypalOrderId },
    });
    const response = await axios.post<CancelOrderApiResponse>(
      "/api/orders?action=cancel",
      {
        paypalOrderId,
      }
    );
    updateOrder(paypalOrderId, response.data);
    setIsLoading(false);
  };

  const getParsedAmount = (): number => {
    const integer = parseInt(amount || "0", 10);
    const parsedAmount = Math.floor(integer * 10) / 10;
    return parsedAmount;
  };

  const isAmountValid = getParsedAmount() >= 5;
  const isValid = charId && isAmountValid;

  return (
    <Row justify="center">
      <Col sm={12}>
        <FormWrapper>
          <StyledSelect
            placeholder="Select a character"
            size="large"
            loading={isLoadingChars}
            onChange={(val) => setCharId(Number(val))}
            value={charId}
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
            value={amount}
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
              onError={cancelOrder}
              onCancel={cancelOrder}
              options={{
                clientId:
                  "AWrIrkDeOQnR9_F3tBf5CLDrhFKpYVpYm6Yi_d4VQBRMpUSS2ZZenIeswMhgQj9hJ1K_kTgQ_3_RFphN", // dev
                // "AZ8Asw7RidKh4LygBozhvFGh6j0SubaQxumACQuUEQuUIQsE8qj9zsqprZ0EjJjvtjBb8lr74xAw738h", // prod
                currency: "EUR",
              }}
            />
          </FormWrapper>
        ) : (
          <>
            <CenteredParagraph>
              Select a character and enter the amount you wish to donate.
            </CenteredParagraph>
            <CenteredParagraph>The minimum is 5 EUR.</CenteredParagraph>
            <CenteredParagraph>
              <PayPalLogo src={paypalLogo} />
            </CenteredParagraph>
          </>
        )}
        <CenteredParagraph>
          <Spin tip="Processing..." spinning={isLoading} />
        </CenteredParagraph>
      </Col>
      <Col sm={8}>
        <CoinsCounter eurAmount={getParsedAmount()} />
      </Col>
    </Row>
  );
};
