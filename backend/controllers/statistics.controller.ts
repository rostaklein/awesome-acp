import { captureException, flush } from "@sentry/node";

import { ResponseError } from "../errors";
import { AuthenticatedContext } from "../createContext";
import { ITopClans, ITopPvpStats } from "../repositories/statistics";

export type StatsApiResponse = {
  pvp: ITopPvpStats[];
  clans: ITopClans[];
};

export const GetAllStats = async (
  ctx: AuthenticatedContext
): Promise<StatsApiResponse> => {
  try {
    const clans = await ctx.repositories.statistics.getTopClans();
    const pvp = await ctx.repositories.statistics.getTopPvpStats();

    return {
      clans,
      pvp,
    };
  } catch (err) {
    captureException(err);
    await flush(1000);
    throw new ResponseError(
      "Something went wrong while getting statistics.",
      500
    );
  }
};
