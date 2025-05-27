import Cookies from "js-cookie";
import { TeamData } from "../types/types";

const COOKIE_KEY = "team_data";

export const getTeamsFromCookies = (): TeamData => {
  const data = Cookies.get(COOKIE_KEY);
  return data ? JSON.parse(data) : {};
};

export const saveTeamsToCookies = (teams: TeamData) => {
  Cookies.set(COOKIE_KEY, JSON.stringify(teams), {
    expires: 30,
    sameSite: "strict",
  });
};
