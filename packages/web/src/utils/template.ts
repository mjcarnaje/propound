import {
  GameDocTemplate,
  GameShowTemplate,
  MatchUpTemplate,
  MissingWordTemplate,
} from "@propound/types";

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
