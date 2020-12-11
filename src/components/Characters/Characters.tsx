import Axios from "axios";
import React, { useEffect, useState } from "react";

import { CharactersApiResponse } from "../../../backend/controllers/characters.controller";
import { CenteredSpinner } from "../common.styles";

import {
  CharLastAccessed,
  CharMainInfo,
  CharName,
  CharOnlineStatus,
  CharWrapper,
  TopLine,
} from "./Characters.styles";

export const useCharacters = () => {
  const [characters, setCharacters] = useState<CharactersApiResponse>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Axios.get<CharactersApiResponse>("/api/characters").then((res) => {
      setCharacters(res.data);
      setIsLoading(false);
    });
  }, []);

  return { characters, isLoading };
};

export const Characters: React.FC = () => {
  const { characters, isLoading } = useCharacters();

  if (isLoading) {
    return <CenteredSpinner />;
  }

  return (
    <>
      {characters.map((char) => (
        <CharWrapper key={char.characterId}>
          <TopLine>
            <CharName>{char.charName}</CharName>
            <div style={{ flex: 1 }}>
              <CharMainInfo>
                <li>
                  <span>Level:</span> {char.level}
                </li>
                <li>
                  <span>Class:</span> {char.className}
                </li>
                <li>
                  <span>Clan:</span> {char.clanName}
                </li>
                <li>
                  <span>PvP/PK:</span> {char.pvp}/{char.pk}
                </li>
              </CharMainInfo>
            </div>
            <div>
              <CharOnlineStatus>
                {char.online === 0 ? (
                  <span className="off">Offline</span>
                ) : (
                  <span className="on">Online</span>
                )}
              </CharOnlineStatus>
              <CharLastAccessed>
                Last accessed at:{" "}
                {new Date(char.lastAccess * 1000).toLocaleString()}
              </CharLastAccessed>
            </div>
          </TopLine>
        </CharWrapper>
      ))}
    </>
  );
};
