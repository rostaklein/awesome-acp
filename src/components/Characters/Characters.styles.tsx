import styled from "@emotion/styled";

import { gray, green, primaryColor, red } from "../common.styles";

export const CharWrapper = styled.div`
  border: solid 1px rgba(255, 255, 255, 0.05);
  padding: 12px 18px;
`;

export const TopLine = styled.div`
  display: flex;
  align-items: center;
`;

export const CharName = styled.h2`
  background-color: ${primaryColor};
  color: black;
  font-weight: bold;
  display: inline-block;
  padding: 2px 12px;
  margin: 0 auto;
`;

export const CharMainInfo = styled.ul`
  flex: 1;
  margin: 0;
  margin-left: 32px;
  padding: 0;
  list-style: none;
  display: flex;
  align-items: center;
  > li {
    > span {
      color: rgba(255, 255, 255, 0.4);
      margin-right: 4px;
    }
    margin-right: 32px;
  }
`;

export const CharOnlineStatus = styled.div`
  text-align: right;
  .on {
    color: ${green};
  }
  .off {
    color: ${red};
  }
`;

export const CharLastAccessed = styled.div`
  color: ${gray};
`;
