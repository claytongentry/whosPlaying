'use strict';

import fetch from 'node-fetch';

import { getDate, getMonth, getTime } from './dates';
import { color, maybeBold, safeJoin }  from './helpers';

export async function who(args) {
  const prefix   = "https://cfb-scoreboard-api.herokuapp.com/v1";
  const date     = getDate(args[0]);
  const response = await fetch(`${prefix}/date/${date}`);
  const data     = await response.json();

  return renderGamesForDate(date, data.games);
}

function renderGamesForDate(date, games) {
  return safeJoin([
    renderDate(date),
    '----------------------------',
    renderGames(games)
  ], "\n");
}

function renderDate(date) {
  const year  = date.slice(0, 4);
  const month = parseInt(date.slice(4, 6));
  const day   = parseInt(date.slice(6, 8));

  return `${getMonth(month)} ${day}, ${year}`;
}

function renderGames(games) {
  return safeJoin(games.map((game) => renderGame(game)), "\n\n")
}

function renderGame(game) {

  const time    = renderTime(game.date);

  const awayTeam = game.awayTeam;
  const homeTeam = game.homeTeam;

  const compare = game.status.type == "STATUS_FINAL" ? final : vs;

  return safeJoin([
    time,
    game.headline,
    compare(awayTeam, homeTeam, game),
    spread(game.odds.spread, awayTeam, homeTeam)
  ], "\n")
}

function renderTime(dateTime) {
  const date    = new Date(dateTime);
  const hours   = date.getHours();
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const suffix  = hours < 12 ? 'am' : 'pm';

  return `${(hours + 11) % 12 + 1}:${minutes} ${suffix}`;
}

function vs(away, home, _game) {
  return `${renderTeamWithRank(away)} vs. ${renderTeamWithRank(home)}`;
}

function final(away, home, game) {
  const winner = game.winner == 'home' ? home : away;

  const awayScore = game.scores.away;
  const homeScore = game.scores.home;

  return [
    maybeBold(`${renderTeamWithRank(away)} ${awayScore}, `, away === winner),
    maybeBold(`${renderTeamWithRank(home)} ${homeScore}`,   home === winner),
  ].join("")
}

function spread(spread, away, home) {
  const [ abbr, diff ] = spread.split(" ");
  const favorite       = [ away, home ].find((team) => team.abbreviation == abbr)

  if (favorite) {
    return `${renderTeam(favorite)} is favored by ${Math.round(-diff)} points.\n`;
  } else {
    return ``;
  }
}

function renderTeamWithRank(team) {
  const rank = team.rank <= 25 ? `(${team.rank}) ` : ``;

  return `${rank}${renderTeam(team)}`;
}

function renderTeam(team) {
  return color(team.location, team.color);
}
