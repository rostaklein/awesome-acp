import React from "react";
import styled from "@emotion/styled";
import { Divider } from "antd";

import { getCoinsCount } from "../../../backend/getCoinsCount";
import webCoin from "../../images/web_coin.svg";

const LabelWrapper = styled.div`
  width: 150px;
`;

const ValueWrapper = styled.div`
  text-align: right;
  flex: 1;
  margin-right: 15px;
`;

const Row = styled.div<{ isHighlighted?: boolean }>`
  display: flex;
  color: ${({ isHighlighted }) => isHighlighted && "#ffc439"};
`;

const TotalRow = styled(Row)`
  font-weight: bold;
  font-size: 16px;
`;

const CoinsImage = styled.img`
  width: 16px;
  height: 16px;
`;

interface Props {
  eurAmount: number;
}

export const CoinsCounter: React.FC<Props> = ({ eurAmount }) => {
  const { coins, bonusPercent, bonusCoins } = getCoinsCount(eurAmount);
  const baseCoins = coins - bonusCoins;
  return (
    <div>
      <Row>
        <ValueWrapper>{eurAmount} EUR</ValueWrapper>
        <LabelWrapper>amount donated</LabelWrapper>
      </Row>
      <Row>
        <ValueWrapper>{baseCoins}</ValueWrapper>
        <LabelWrapper>web coins</LabelWrapper>
      </Row>
      <Row isHighlighted={bonusCoins > 0}>
        <ValueWrapper>{bonusCoins}</ValueWrapper>
        <LabelWrapper>+ {bonusPercent}% bonus</LabelWrapper>
      </Row>
      <Divider style={{ margin: "5px 0 5px 0" }} />
      <TotalRow>
        <ValueWrapper>
          <CoinsImage src={webCoin} /> {coins}
        </ValueWrapper>
        <LabelWrapper>web coins</LabelWrapper>
      </TotalRow>
    </div>
  );
};
