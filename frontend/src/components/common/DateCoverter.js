export default function DateConverter(dt, dtFormat) {
  let tradeDate = "";

  const trDate = new Date(Date.parse(dt));

  const dd = ("0" + trDate.getDate()).slice(-2);
  const mm = ("0" + (trDate.getMonth() + 1)).slice(-2);
  const yyyy = trDate.getFullYear();
  const yy = trDate.getFullYear().toString().substr(2, 2);

  if (dtFormat === "yyyy-mm-dd") {
    tradeDate = `${yyyy}-${mm}-${dd}`;
  } else if (dtFormat === "mm/dd/yy") {
    tradeDate = `${mm}/${dd}/${yy}`;
  }

  return tradeDate;
}
