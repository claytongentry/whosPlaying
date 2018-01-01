'use strict';

export function getDate(date) {
  date = date ? new Date(`${date}T12:00:00.000Z`) : new Date();

  const day   = ('0' + (date.getDate())).slice(-2)
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const year  = date.getFullYear();

  return `${year}${month}${day}`;
}

export function getMonth(index) {
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
