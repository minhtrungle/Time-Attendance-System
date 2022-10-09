import dayjs from "dayjs";

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
}

export function convertDateTime(date, format = "ss:mm:HH DD/MM/YYYY") {
  return dayjs(date).format(format);
}

export function convertDate(date, format = "DD-MM-YYYY") {
  return dayjs(date).format(format);
}

export function convertDateDefault(date) {
  return date.split("-").reverse().join("-");
}

export function parseTime(time) {
  return time.split(".000")[0] || "";
}

export function numberWithDelimiter(number, delimiter = ".") {
  return Math.round(number)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, delimiter);
}

export function getDaysInMonth(month, year) {
  var date = new Date(year, month, 1);
  var days = [];
  while (date.getMonth() === month) {
    days.push(dayjs(new Date(date)));
    date.setDate(date.getDate() + 1);
  }
  return days;
}
