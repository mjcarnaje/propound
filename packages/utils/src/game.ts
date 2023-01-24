import {
  GameDocTemplate,
  GameShowTemplate,
  GameType,
  MatchUpTemplate,
  MissingWordTemplate,
  StatusAndScore,
} from "@propound/types";

export const defaultStatusAndScore: StatusAndScore = {
  status: {
    preGameDone: false,
    learningDone: false,
    postGameDone: false,
  },
  scores: {
    PRE_TEST: {
      scores: [],
      average: { score: null, time: null },
      latestScore: 0,
      latestDate: null,
      baseDate: null,
    },
    POST_TEST: {
      scores: [],
      average: { score: null, time: null },
      latestScore: 0,
      latestDate: null,
      baseDate: null,
    },
  },
};

export function isGameShowTemplate(
  template: GameDocTemplate
): template is GameShowTemplate {
  return template.__typename === "GAME_SHOW";
}

export function isMissingWordTemplate(
  template: GameDocTemplate
): template is MissingWordTemplate {
  return template.__typename === "MISSING_WORD";
}

export function isMatchUpTemplate(
  template: GameDocTemplate
): template is MatchUpTemplate {
  return template.__typename === "MATCH_UP";
}

export const getGameType = (gameType: GameType): string => {
  const obj: Record<GameType, string> = {
    POST_TEST: "Post-game",
    PRE_TEST: "Pre-game",
  };
  return obj[gameType];
};
