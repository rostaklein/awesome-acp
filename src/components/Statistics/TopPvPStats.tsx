import { Table } from "antd";
import React from "react";
import { TrophyOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";

import { StatsApiResponse } from "../../../backend/controllers/statistics.controller";
import { StyledTable } from "../DonateList/DonateList.styles";

type Props = {
  stats: StatsApiResponse["pvp"];
  isLoading: boolean;
};

const getColorByPos = (position: number) => {
  if (position === 1) {
    return "gold";
  }
  if (position === 2) {
    return "silver";
  }
  if (position === 3) {
    return "#a2662d";
  }
};

const Position = styled.span<{ position: number }>`
  svg {
    display: ${({ position }) => (position > 3 ? "none" : "inline-block")};
    fill: ${({ position }) => getColorByPos(position)};
  }
`;
const CharName = styled.span<{ position: number }>`
  color: ${({ position }) => getColorByPos(position)};
  font-weight: ${({ position }) => (position < 4 ? "bold" : "normal")};
`;

export const TopPvPStats: React.FC<Props> = ({ stats, isLoading }) => {
  const statsEnriched = stats.map((item, i) => ({ ...item, position: i + 1 }));
  return (
    <StyledTable
      bordered
      dataSource={statsEnriched}
      loading={isLoading}
      size="small"
    >
      <Table.Column
        render={(item) => (
          <Position position={item.position}>
            {item.position}. <TrophyOutlined />
          </Position>
        )}
        width={40}
      />
      <Table.Column
        title="Character Name"
        render={(item) => (
          <CharName position={item.position}>{item.char_name}</CharName>
        )}
      />
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
