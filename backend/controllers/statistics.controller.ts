import { captureException, flush } from "@sentry/node";

import { ResponseError } from "../errors";
import { AuthenticatedContext } from "../createContext";
import { ITopClans, ITopPvpStats } from "../repositories/statistics";

export type StatsApiResponse = {
  pvp: ITopPvpStats[];
  clans: ITopClans[];
  epics: { clan_name: string; [epicItemId: number]: number }[];
};

export const GetAllStats = async (
  ctx: AuthenticatedContext
): Promise<StatsApiResponse> => {
  try {
    const clans = await ctx.repositories.statistics.getTopClans();
    const pvp = await ctx.repositories.statistics.getTopPvpStats();
    const epicsRaw = await ctx.repositories.statistics.getEpicsTop();

    const epics = epicsRaw.reduce<StatsApiResponse["epics"]>((acc, curr) => {
      let item = { clan_name: curr.clan_name, [curr.id]: curr.count };
      const clanExists = acc.find((i) => i.clan_name === curr.clan_name);

      if (clanExists) {
        item = { ...item, ...clanExists };
        return acc.map((i) => (i.clan_name === curr.clan_name ? item : i));
      } else {
        acc.push(item);
      }

      return acc;
    }, []);

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
