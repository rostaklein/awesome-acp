import { Col, Row } from "antd";
import Axios from "axios";
import React, { useEffect, useState } from "react";

import { CharactersApiResponse } from "../../../backend/controllers/characters.controller";
import { CenteredSpinner, SecondaryParagraph } from "../common.styles";

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

  if (characters.length === 0) {
    return (
      <SecondaryParagraph>
        You have not created any characters on this account yet. Whats wrong
        bro? Come on, its time to start farming!
      </SecondaryParagraph>
    );
  }

  return (
    <>
      {characters.map((char) => (
        <CharWrapper key={char.characterId}>
          <Row>
            <Col xs={24} md={4} lg={4}>
              <CharName>{char.charName}</CharName>
            </Col>
            <Col xs={24} md={14} lg={14}>
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
            </Col>
            <Col xs={24} md={6} lg={6}>
              <Row justify="end">
                <Col>
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
                </Col>
              </Row>
            </Col>
          </Row>
        </CharWrapper>
      ))}
    </>
  );
};
