import styled from "@emotion/styled";
import { Divider, Form } from "antd";

export const StyledForm = styled.form`
  padding: 15px 35px;
`;

export const StyledDivider = styled(Divider)`
  &.ant-divider-with-text-left {
    font-size: 14px;
    margin: 8px 0;
  }
`;

export const StyledFormItem = styled(Form.Item)`
  margin-bottom: 5px;
  line-height: normal;
  display: flex;
  flex-direction: column;
  .ant-form-item-label {
    text-align: left;
  }
  .ant-form-item-control {
    line-height: normal;
    margin-bottom: 8px;
  }
  .ant-input-prefix {
    margin-right: 8px;
  }
`;

export const StyledLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
`;

export const StyledFormLabel = styled.label`
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 4px;
  display: inline-block;
`;
