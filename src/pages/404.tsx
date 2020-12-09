import React from "react";
import { Result, Button } from "antd";
import { Link } from "gatsby";

import { MainTemplate } from "../templates/main";

const NotFound: React.FC = () => {
  return (
    <MainTemplate>
      <Result
        status="warning"
        title="Error 404, page not found"
        extra={
          <div>
            <p>Our gremlins are working on a fix already, dont worry.</p>
            <Link to="/">
              <Button type="primary">Get back home</Button>
            </Link>
          </div>
        }
      />
    </MainTemplate>
  );
};

export default NotFound;
