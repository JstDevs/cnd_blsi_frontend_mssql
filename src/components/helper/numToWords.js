// Simple number to words converter (for Philippine Peso format)
const numToWords = (num) => {
  const ones = [
    '',
    'ONE',
    'TWO',
    'THREE',
    'FOUR',
    'FIVE',
    'SIX',
    'SEVEN',
    'EIGHT',
    'NINE',
  ];
  const teens = [
    'TEN',
    'ELEVEN',
    'TWELVE',
    'THIRTEEN',
    'FOURTEEN',
    'FIFTEEN',
    'SIXTEEN',
    'SEVENTEEN',
    'EIGHTEEN',
    'NINETEEN',
  ];
  const tens = [
    '',
    'TEN',
    'TWENTY',
    'THIRTY',
    'FORTY',
    'FIFTY',
    'SIXTY',
    'SEVENTY',
    'EIGHTY',
    'NINETY',
  ];

  if (num === 0) return 'ZERO';

  let words = '';
  const numStr = num.toString().split('.');
  let wholeNum = parseInt(numStr[0]);

  if (wholeNum >= 1000) {
    words += ones[Math.floor(wholeNum / 1000)] + ' THOUSAND ';
    wholeNum %= 1000;
  }

  if (wholeNum >= 100) {
    words += ones[Math.floor(wholeNum / 100)] + ' HUNDRED ';
    wholeNum %= 100;
  }

  if (wholeNum >= 20) {
    words += tens[Math.floor(wholeNum / 10)] + ' ';
    wholeNum %= 10;
  } else if (wholeNum >= 10) {
    words += teens[wholeNum - 10] + ' ';
    wholeNum = 0;
  }

  if (wholeNum > 0) {
    words += ones[wholeNum] + ' ';
  }

  // Handle centavos if needed
  if (numStr.length > 1 && parseInt(numStr[1])) {
    words += 'AND ' + parseInt(numStr[1]) + '/100';
  }

  return words.trim();
};

export default numToWords;
