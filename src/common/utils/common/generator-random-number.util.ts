export const generateRandomNumber = (symbols: number) => {
  const min = 10 ** (symbols - 1);
  const max = 10 ** symbols - 1;
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
};
