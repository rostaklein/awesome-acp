import Axios from "axios";
import React, { useEffect, useState } from "react";

import { StatsApiResponse } from "../../backend/controllers/statistics.controller";
import { Epics } from "../components/Statistics/Epics";
import { TopClanStats } from "../components/Statistics/TopClanStats";
import { TopPvPStats } from "../components/Statistics/TopPvPStats";
import { MainTemplate } from "../templates/main";

export const useStats = () => {
  const [items, setItems] = useState<StatsApiResponse>({
    clans: [],
    pvp: [],
    epics: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Axios.get<StatsApiResponse>("/api/statistics").then((res) => {
      setItems(res.data);
      setIsLoading(false);
    });
  }, []);

  return { items, isLoading };
};

const Statistics: React.FC = () => {
  const { items, isLoading } = useStats();
  return (
    <MainTemplate title="Statistics">
      <h2>Top PvP</h2>
      <TopPvPStats stats={items.pvp} isLoading={isLoading} />
      <h2>Top Clans</h2>
      <TopClanStats stats={items.clans} isLoading={isLoading} />
      <h2 style={{ marginTop: 30 }}>Epics Clan Owners</h2>
      <Epics stats={items.epics} isLoading={isLoading} />
    </MainTemplate>
  );
};

export default Statistics;
