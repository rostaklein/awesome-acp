import { captureException, flush } from "@sentry/node";

import { ResponseError } from "../errors";
import { AuthenticatedContext } from "../createContext";
import { ITopClans, ITopPvpStats } from "../repositories/statistics";

export type StatsApiResponse = {
  pvp: ITopPvpStats[];
  clans: ITopClans[];
  epics: {
    [itemId: number]: { clan_name: string; count: number }[];
  };
};

export const GetAllStats = async (
  ctx: AuthenticatedContext
): Promise<StatsApiResponse> => {
  try {
    const clans = await ctx.repositories.statistics.getTopClans();
    const pvp = await ctx.repositories.statistics.getTopPvpStats();
    const epicsRaw = await ctx.repositories.statistics.getEpicsTop();

    const epics = epicsRaw.reduce<StatsApiResponse["epics"]>((acc, curr) => {
      const item = { clan_name: curr.clan_name, count: curr.count };
      if (!acc[curr.id]) {
        acc[curr.id] = [item];
      } else {
        acc[curr.id].push(item);
      }

      return acc;
    }, {});

    return {
      clans,
      pvp,
      epics,
    };
  } catch (err) {
    console.log(err);
    captureException(err);
    await flush(1000);
    throw new ResponseError(
      "Something went wrong while getting statistics.",
      500
    );
  }
};
