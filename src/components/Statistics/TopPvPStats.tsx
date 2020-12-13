import { Table } from "antd";
import React from "react";

import { StatsApiResponse } from "../../../backend/controllers/statistics.controller";
import { StyledTable } from "../DonateList/DonateList.styles";

type Props = {
  stats: StatsApiResponse["pvp"];
  isLoading: boolean;
};

export const TopPvPStats: React.FC<Props> = ({ stats, isLoading }) => {
  const statsEnriched = stats.map((item, i) => ({ ...item, position: i + 1 }));
  return (
    <StyledTable bordered dataSource={statsEnriched} loading={isLoading}>
      <Table.Column render={(item) => `${item.position}.`} width={20} />
      <Table.Column title="Character Name" dataIndex="char_name" />
      <Table.Column
        title="Level"
        dataIndex="level"
        render={(val) => `${val} lvl`}
        responsive={["lg", "sm"]}
      />
      <Table.Column
        title="Class"
        dataIndex="ClassName"
        responsive={["lg", "sm"]}
      />
      <Table.Column
        title="Clan Name"
        dataIndex="clan_name"
        responsive={["lg", "sm"]}
      />
      <Table.Column title="PvP" dataIndex="pvpkills" />
      <Table.Column title="PK" dataIndex="pkkills" />
    </StyledTable>
  );
};
