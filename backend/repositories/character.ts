import mysql from "mysql";

import { getMysqlConnection } from "../connect";

export type ICharacter = {
  characterId: number;
  charName: string;
  level: string;
  className: string;
  clanName: string;
  online: 0 | 1;
  lastAccess: number;
  pvp: number;
  pk: number;
};

export class CharactersRepository {
  private connection: mysql.Connection;
  constructor() {
    this.connection = getMysqlConnection();
  }

  public findAllCharactersByLogin(login: string): Promise<ICharacter[]> {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `
        SELECT    characters.account_name, 
            characters.obj_Id as characterId, 
            characters.char_name AS charName, 
            characters.pvpkills  AS pvp, 
            characters.pkkills   AS pk, 
            character_subclasses.level, 
            characters.lastAccess, 
            characters.online, 
            char_templates.className, 
            clan_subpledges.name AS clanName 
          FROM      characters 
          LEFT JOIN character_subclasses 
          ON        characters.obj_Id = character_subclasses.char_obj_id 
          LEFT JOIN char_templates 
          ON        character_subclasses.class_id = char_templates.ClassId 
          LEFT JOIN clan_subpledges 
          ON        characters.clanid = clan_subpledges.clan_id 
          AND       clan_subpledges.type = 0 
          WHERE     account_name = ? 
          AND       isBase = 1 
          ORDER BY  characters.char_name
        `,
        [login],
        (err, results) => {
          if (err) return reject(err);
          if (results.length === 0) {
            return resolve([]);
          }
          return resolve(results);
        }
      );
    });
  }

  public getDetailsAboutCharacter(characterId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `
      SELECT
        'characters'.'account_name',
        'characters'.'char_name',
        'character_subclasses'.'level',
        'characters'.'sex',
        'character_subclasses'.'class_id',
        'characters'.'online',
        'character_subclasses'.'exp',
        'character_subclasses'.'sp',
        'characters'.'karma',
        'characters'.'pvpkills' AS pvp,
        'characters'.'pkkills' AS pk,
        'characters'.'accesslevel',
        'characters'.'onlinetime',
        'characters'.'lastAccess',
        'char_templates'.'ClassName' AS class,
        'clan_subpledges'.'name' AS 'clanName'
    FROM 'characters'
    LEFT JOIN 'character_subclasses' ON 'characters'.'obj_Id' = 'character_subclasses'.'char_obj_id' AND 'character_subclasses'.'isBase' = '1'
    LEFT JOIN 'char_templates' ON 'character_subclasses'.'class_id' = 'char_templates'.'ClassId'
    LEFT JOIN 'clan_subpledges' ON 'characters'.'clanid' = 'clan_subpledges'.'clan_id' AND 'clan_subpledges'.'type' = 0
    WHERE 'characters'.'obj_Id' = ?`,
        [characterId],
        (err, results) => {
          if (err) {
            return reject("Failed to create an account, ${err}");
          }
          if (results.length === 0) {
            return reject("Character not found");
          }
          return resolve(results[0]);
        }
      );
    });
  }
  public async addItemToInventory(
    characterId: number,
    itemId: number,
    amount: number
  ): Promise<void> {
    const itemInInventory = await this.hasItemInInventory(characterId, itemId);
    if (!itemInInventory) {
      return await this.createItemInInventory(characterId, itemId, amount);
    } else {
      return await this.updateItemCountInInventory(
        itemInInventory.item_id,
        characterId,
        amount + itemInInventory.amount
      );
    }
  }

  private createItemInInventory(
    characterId: number,
    itemId: number,
    amount: number
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `
        INSERT LOW_PRIORITY INTO items(
            owner_id,
            item_type,
            amount,
            location,
            slot
        )
        VALUES(
            ?,
            ?,
            ?,
            'INVENTORY',
            '0'
        );
        `,
        [characterId, itemId, amount],
        (err, results) => {
          console.log("createItemInInventory", results);
          if (err) {
            return reject(`Failed to add an item to inventory ${err}`);
          }
          return resolve(undefined);
        }
      );
    });
  }

  private hasItemInInventory(
    characterId: number,
    itemId: number
  ): Promise<undefined | { item_id: number; amount: number }> {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `
         SELECT * from items where owner_id=? and item_type=? and amount>0 and location = "INVENTORY" LIMIT 1
        `,
        [characterId, itemId],
        (err, results) => {
          console.log("hasItemInInvetnory", results);
          if (err) {
            return reject(`Failed to add check if has in inventory ${err}`);
          }
          if (results.length === 0) {
            resolve(undefined);
          }
          return resolve(results[0]);
        }
      );
    });
  }

  public updateItemCountInInventory(
    itemId: number,
    ownerId: number,
    amount: number
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `
        UPDATE items set amount = ? where owner_id=? and item_id=?;
        `,
        [amount, ownerId, itemId],
        (err, results) => {
          console.log("updateItemCountInInventory", results);
          if (err) {
            return reject(
              `Failed to update item count ${itemId} ${ownerId} ${amount} ${err}`
            );
          }
          if (results.length === 0) {
            resolve(undefined);
          }
          return resolve(results[0]);
        }
      );
    });
  }
}
