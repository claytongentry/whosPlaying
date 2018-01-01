'use strict';

import chalk from 'chalk';

export function color(string, color) {
  return chalk.hex(color)(string);
}

export function maybeBold(string, bool) {
  return bool ? chalk.bold(string) : string;
}

export function safeJoin(array, element) {
  return array.filter(n => n).join(element);
}
