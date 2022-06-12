import { GameDocTemplate } from "../types/game";
import { GameShowTemplate } from "../types/game-show";

export function isGameShowTemplate(
  template: GameDocTemplate
): template is GameShowTemplate {
  return template.__typename === "GAME_SHOW";
}
