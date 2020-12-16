import { Divider } from "antd";
import Axios from "axios";
import React, { useEffect, useState } from "react";

import { GetAllOrdersApiResponse } from "../../backend/controllers/order.controller";
import { IDonate } from "../../backend/repositories/donate";
import { SecondaryParagraph } from "../components/common.styles";
import { DonateList } from "../components/DonateList/DonateList";
import { PaypalForm } from "../components/PaypalForm/PaypalForm";
import { MainTemplate } from "../templates/main";

const Donate: React.FC = () => {
  const [orders, setOrders] = useState<GetAllOrdersApiResponse>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const addOrder = (order: IDonate) => {
    setOrders([order, ...orders]);
  };

  const loadOrders = () => {
    setIsLoading(true);
    Axios.get<GetAllOrdersApiResponse>("/api/orders").then((res) => {
      setOrders(res.data);
      setIsLoading(false);
    });
  };

  const updateOrder = () => {
    loadOrders();
  };

  return (
    <MainTemplate title="Donate">
      <h2>Donate</h2>
      <SecondaryParagraph>
        When donating coins to a character, <b>log off the character</b> and
        leave it offline!
      </SecondaryParagraph>
      <SecondaryParagraph>
        Otherwise a <b>restart</b> might be required to get the coins.
      </SecondaryParagraph>
      <PaypalForm addOrder={addOrder} updateOrder={updateOrder} />
      <Divider />
      <h2>Previous donates</h2>
      <DonateList isLoading={isLoading} orders={orders} />
    </MainTemplate>
  );
};

export default Donate;
