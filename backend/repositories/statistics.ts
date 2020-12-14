import mysql from "mysql";

import { getMysqlConnection } from "../connect";

export type ITopPvpStats = {
  char_name: string;
  level: number;
  pvpkills: number;
  pkkills: number;
  ClassName: string;
  clan_name: string;
};

export type ITopClans = {
  clan_name: string;
  ally_name: string;
  clan_level: number;
  reputation_score: number;
  leader_name: string;
  ccount: number;
  pvp_sum: number;
};

export type IEpicsDbResult = {
  clan_name: string;
  id: number;
  count: number;
};

export class StatisticsRepository {
  private connection: mysql.Connection;
  constructor() {
    this.connection = getMysqlConnection();
  }

  public getTopPvpStats(): Promise<ITopPvpStats[]> {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `
        SELECT
            characters.char_name,
            character_subclasses.level,
            characters.pvpkills,
            characters.pkkills,
            characters.online,
            char_templates.ClassName,
            clan_subpledges.name AS clan_name
        FROM
            characters
        LEFT JOIN character_subclasses ON characters.obj_Id = character_subclasses.char_obj_id AND character_subclasses.isBase = '1'
        LEFT JOIN char_templates ON character_subclasses.class_id = char_templates.ClassId
        LEFT JOIN clan_subpledges ON characters.clanid = clan_subpledges.clan_id AND clan_subpledges.type = 0
        WHERE
            characters.accesslevel = '0'
        ORDER BY
            characters.pvpkills
        DESC
        LIMIT 20
        `,
        [],
        (err, results) => {
          console.log(err);
          if (err) return reject(err);
          if (results.length === 0) {
            return resolve([]);
          }
          return resolve(results);
        }
      );
    });
  }
  public getTopClans(): Promise<ITopClans[]> {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `
        SELECT
            clan_subpledges.name AS clan_name,
            ally_data.ally_name,
            clan_data.clan_level,
            clan_data.reputation_score,
            characters.char_name AS leader_name,
            ccount,
            pvp_sum
        FROM
            clan_data
        LEFT JOIN clan_subpledges ON clan_data.clan_id = clan_subpledges.clan_id AND clan_subpledges.type = 0
        LEFT JOIN characters ON characters.obj_Id = clan_subpledges.leader_id
        LEFT JOIN(
            SELECT
                clanid,
                COUNT(0) AS ccount,
                SUM(pvpkills) AS pvp_sum
            FROM
                characters
            WHERE
                clanid
            GROUP BY
                clanid
        ) AS levels
        ON
            clan_data.clan_id = levels.clanid
        LEFT JOIN ally_data ON clan_data.ally_id = ally_data.ally_id
        ORDER BY
            pvp_sum
        DESC
            ,
            ccount
        DESC
            ,
            clan_data.clan_level
        DESC
            ,
            clan_data.reputation_score
        DESC
        LIMIT 10
        `,
        [],
        (err, results) => {
          console.log(err);
          if (err) return reject(err);
          if (results.length === 0) {
            return resolve([]);
          }
          return resolve(results);
        }
      );
    });
  }
  public getEpicsTop(): Promise<IEpicsDbResult[]> {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `
        SELECT
            clan_subpledges.name AS clan_name,
            items.item_type as id,
            count(items.item_id) as count
        FROM
            characters
        LEFT JOIN clan_subpledges ON characters.clanid = clan_subpledges.clan_id
        LEFT JOIN items ON items.owner_id = characters.obj_Id AND clan_subpledges.type = 0
        WHERE
            items.item_type in (6660,6661,6662,6658,6659,8191,6656,6657)
        GROUP BY clan_name, items.item_type
        ORDER BY item_type
        `,
        [],
        (err, results) => {
          if (err) return reject(err);
          return resolve(results);
        }
      );
    });
  }
}
