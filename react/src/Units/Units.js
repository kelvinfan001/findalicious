const getUnitSetting = () => localStorage.getItem("units");

export const Unit = (val, types) =>
  getUnitSetting() === "metric"
    ? `${val}${types["metric"]}`
    : `${val}${types["imperial"]}`;
