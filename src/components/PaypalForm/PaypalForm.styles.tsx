import styled from "@emotion/styled";
import { Input, Select } from "antd";

export const StyledInput = styled(Input)`
  margin-bottom: 10px;
`;

export const StyledSelect = styled(Select)`
  &.ant-select {
    margin-bottom: 10px;
  }

  background: #2a2a2a;
  width: 100%;
`;

export const FormWrapper = styled.div`
  max-width: 180px;
  margin: 0 auto;
`;

export const CenteredParagraph = styled.div`
  text-align: center;
`;

export const PayPalLogo = styled.img`
  width: 90px;
  margin: 10px auto;
  opacity: 0.3;
`;
