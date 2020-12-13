import { Table } from "antd";
import React, { ReactNode } from "react";
import {
  FieldTimeOutlined,
  CloseOutlined,
  CheckOutlined,
} from "@ant-design/icons";

import { GetAllOrdersApiResponse } from "../../../backend/controllers/order.controller";
import { IDonate } from "../../../backend/repositories/donate";

import { StyledTable } from "./DonateList.styles";

type Props = {
  orders: GetAllOrdersApiResponse;
  isLoading: boolean;
};

export const DonateList: React.FC<Props> = ({ orders, isLoading }) => {
  return (
    <StyledTable bordered dataSource={orders} loading={isLoading}>
      <Table.Column title="Character Name" dataIndex="char_name" />
      <Table.Column
        title="Amount"
        dataIndex="amount_eur"
        render={(val) => `${val} €`}
        responsive={["lg", "sm"]}
      />
      <Table.Column title="Coins reward" dataIndex="amount_coins" />
      <Table.Column
        title="PayPal Order ID"
        dataIndex="paypal_order_id"
        responsive={["lg", "sm"]}
      />
      <Table.Column
        title="Date"
        dataIndex="created_at"
        render={(val) => new Date(val).toLocaleString()}
        responsive={["lg", "sm"]}
      />
      <Table.Column
        title="Status"
        dataIndex="status"
        className="status"
        render={(val: IDonate["status"]) => {
          if (val === "initiated") {
            return (
              <span className="init">
                <FieldTimeOutlined /> {val}
              </span>
            );
          }
          if (val === "cancelled" || val === "failed") {
            return (
              <span className="failed">
                <CloseOutlined /> {val}
              </span>
            );
          }
          if (val === "rewarded") {
            return (
              <span className="rewarded">
                <CheckOutlined /> {val}
              </span>
            );
          }
        }}
      />
    </StyledTable>
  );
};
