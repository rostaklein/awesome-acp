import { Table } from "antd";
import Axios from "axios";
import React, { useEffect, useState } from "react";

import { GetAllOrdersApiResponse } from "../../../backend/controllers/order.controller";

import { StyledTable } from "./DonateList.styles";

export const DonateList: React.FC = () => {
  const [orders, setOrders] = useState<GetAllOrdersApiResponse>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Axios.get<GetAllOrdersApiResponse>("/api/orders").then((res) => {
      setOrders(res.data);
      setIsLoading(false);
    });
  }, []);

  return (
    <StyledTable bordered dataSource={orders} loading={isLoading}>
      <Table.Column title="Character Name" dataIndex="char_name" />
      <Table.Column
        title="Amount"
        dataIndex="amount_eur"
        render={(val) => `${val} €`}
      />
      <Table.Column title="Coins reward" dataIndex="amount_coins" />
      <Table.Column title="PayPal Order ID" dataIndex="paypal_order_id" />
      <Table.Column
        title="Date"
        dataIndex="created_at"
        render={(val) => new Date(val).toLocaleString()}
      />
      <Table.Column title="Status" dataIndex="status" />
    </StyledTable>
  );
};
