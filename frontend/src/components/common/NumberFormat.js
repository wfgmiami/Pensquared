export function strTwoDecimalComma(num) {
  return (Math.round(num * 100) / 100).toLocaleString();
}

export function numTwoDecimal(num) {
  return Math.round(num * 100) / 100;
}

export function strRemoveComma(str) {
  return str.replace(/,/g, "");
}
