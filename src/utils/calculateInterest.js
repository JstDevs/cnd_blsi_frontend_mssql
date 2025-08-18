export const calculateInterestRate = () => {
  const now = new Date();
  const month = now.getMonth(); // 0 = Jan, 1 = Feb, 2 = Mar ...

  const marchIndex = 2; // March is index 2
  // Normalize months so that March = 0
  let monthsSinceMarch = month - marchIndex;
  if (monthsSinceMarch < 0) {
    monthsSinceMarch += 12; // Wrap around for Jan/Feb
  }

  return 6 + monthsSinceMarch * 2;
};
