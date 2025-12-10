export const calculateInterestRate = () => {
  const now = new Date();
  const month = now.getMonth(); // 0 = Jan, 1 = Feb, ... 11 = Dec

  const interestRates = [
    0, // Jan
    0, // Feb
    6, // Mar
    8, // Apr
    10, // May
    12, // Jun
    14, // Jul
    16, // Aug
    18, // Sep
    20, // Oct
    22, // Nov
    24, // Dec
  ];

  return interestRates[month];
};
