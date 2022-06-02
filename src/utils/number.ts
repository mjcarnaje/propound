export const round = (value: number, decimals: number = 2) => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};
