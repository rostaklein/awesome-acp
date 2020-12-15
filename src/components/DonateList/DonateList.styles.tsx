import styled from "@emotion/styled";
import { Table } from "antd";

import { green, red } from "../common.styles";

export const StyledTable = styled(Table)`
  .ant-table {
    background-color: transparent;
    .ant-table-content {
      overflow: auto;
    }
  }
  .status {
    .rewarded {
      color: ${green};
    }
    .failed {
      color: ${red};
    }
  }
`;
