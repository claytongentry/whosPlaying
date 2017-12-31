'use strict';

import chalk from 'chalk';
import fetch from 'node-fetch';

export async function who(args) {
  const prefix   = "https://cfb-scoreboard-api.herokuapp.com/v1"
  const date     = getDate(args[0])
  const response = await fetch(`${prefix}/date/${date}`);
  const data     = await response.json();

  return renderGamesForDate(date, data.games);
}

function renderGamesForDate(date, games) {
  return [
    renderDate(date),
    '----------------------------',
    renderGames(games)
  ].join("\n");
}

function renderDate(date) {
  const year  = date.slice(0, 4);
  const month = parseInt(date.slice(4, 6));
  const day   = parseInt(date.slice(6, 8));

  return `${getMonth(month)} ${day}, ${year}`;
}

function renderGames(games) {
  return games.map((game) => renderGame(game)).join("\n\n");
}

function renderGame(game) {
  const awayTeam = game.awayTeam;
  const homeTeam = game.homeTeam;

  const compare = game.status.type == "STATUS_FINAL" ? final : vs;

  return [
    game.headline,
    compare(awayTeam, homeTeam, game),
    spread(game.odds.spread, awayTeam, homeTeam)
  ].join('\n')
}

function vs(away, home, _game) {
  return `${renderTeamWithRank(away)} vs. ${renderTeamWithRank(home)}`
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

function getDate(date) {
  date = date ? new Date(`${date}T12:00:00.000Z`) : new Date();

  const day   = ('0' + (date.getDate())).slice(-2)
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const year  = date.getFullYear();

  return `${year}${month}${day}`;
}

function getMonth(index) {
  let month = []
  month[1]  = "January";
  month[2]  = "February";
  month[3]  = "March";
  month[4]  = "April";
  month[5]  = "May";
  month[6]  = "June";
  month[7]  = "July";
  month[8]  = "August";
  month[9]  = "September";
  month[10] = "October";
  month[11] = "November";
  month[12] = "December";

  return month[index];
}

function color(string, color) {
  return chalk.hex(color)(string);
}

function maybeBold(string, bool) {
  return bool ? chalk.bold(string) : string;
}
