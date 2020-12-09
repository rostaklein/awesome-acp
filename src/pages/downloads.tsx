import { Button } from "antd";
import React from "react";
import { DownloadOutlined } from "@ant-design/icons";

import { MainTemplate } from "../templates/main";

const Download: React.FC = () => {
  return (
    <MainTemplate title="Download">
      <h1>Ahoj zmrdi.</h1>
      <p>Nebojte, nejede to na hamachi.</p>
      <a href="https://mega.nz/file/Zs5G0Q4D#vArZ9QgOg-fYQxq8VWUrHkpLrI3YSu7T-dV3Ef6Asz0">
        <Button type="ghost" size="large" icon={<DownloadOutlined />}>
          Beta patch v0.1
        </Button>
      </a>
    </MainTemplate>
  );
};

export default Download;
