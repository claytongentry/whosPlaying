'use strict';

import chalk from 'chalk';

export function color(string, color) {
  return chalk.hex(color)(string);
}

export function maybeBold(string, bool) {
  return bool ? chalk.bold(string) : string;
}
