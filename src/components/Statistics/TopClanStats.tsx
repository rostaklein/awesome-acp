import { Table } from "antd";
import React from "react";

import { StatsApiResponse } from "../../../backend/controllers/statistics.controller";
import { StyledTable } from "../DonateList/DonateList.styles";

type Props = {
  stats: StatsApiResponse["clans"];
  isLoading: boolean;
};

export const TopClanStats: React.FC<Props> = ({ stats, isLoading }) => {
  return (
    <StyledTable
      bordered
      dataSource={stats}
      loading={isLoading}
      pagination={false}
      size="small"
    >
      <Table.Column render={(_, __, i) => `${i + 1}.`} width={20} />
      <Table.Column title="Clan Name" dataIndex="clan_name" />
      <Table.Column title="Ally Name" dataIndex="ally_name" />
      <Table.Column title="Clan Level" dataIndex="clan_level" />
      <Table.Column title="Reputation Score" dataIndex="reputation_score" />
      <Table.Column title="Clan Leader" dataIndex="leader_name" />
      <Table.Column title="Members" dataIndex="ccount" />
      <Table.Column title="Total PvP" dataIndex="pvp_sum" />
    </StyledTable>
  );
};
