export const round = (value: number, decimals: number = 2) => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

export const shuffle = <T>(array: T[]) => {
  const shuffled = array.slice(0);
  let i = array.length;
  let temp;
  let index;

  while (i--) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }

  return shuffled;
};

export const getUnique = <T>(item: T, index: number, array: T[]) => {
  return array.indexOf(item) === index;
};

export const unique = <T>(array: T[]) => {
  return array.filter(getUnique);
};
