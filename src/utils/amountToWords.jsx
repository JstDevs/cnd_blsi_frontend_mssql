/**
 * Convert a peso amount to words, e.g. 1234.56 ➜
 *   "ONE THOUSAND TWO HUNDRED THIRTY‑FOUR PESOS AND 56/100"
 */
export function convertAmountToWords(amount) {
  const parsed = Number(amount);
  if (Number.isNaN(parsed)) return '';

  const integerPart = Math.floor(parsed);
  const decimalPart = Math.round((parsed - integerPart) * 100);

  let words = `${convertIntegerToWords(integerPart)} PESOS`;

  if (decimalPart > 0) {
    words += ` AND ${decimalPart.toString().padStart(2, '0')}/100`;
  }
  return words.trim();
}

function convertIntegerToWords(num) {
  if (num === 0) return 'ZERO';
  if (num < 0)  return `MINUS ${convertIntegerToWords(Math.abs(num))}`;

  const units  = [
    '', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN',
    'EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN',
    'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'
  ];
  const tens   = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY',
                  'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];

  let words = '';

  const pushChunk = (value, label) => {
    if (value > 0) {
      words += `${convertIntegerToWords(value)} ${label} `;
    }
  };

  pushChunk(Math.floor(num / 1_000_000_000_000), 'TRILLION');
  num %= 1_000_000_000_000;

  pushChunk(Math.floor(num / 1_000_000_000), 'BILLION');
  num %= 1_000_000_000;

  pushChunk(Math.floor(num / 1_000_000), 'MILLION');
  num %= 1_000_000;

  pushChunk(Math.floor(num / 1_000), 'THOUSAND');
  num %= 1_000;

  pushChunk(Math.floor(num / 100), 'HUNDRED');
  num %= 100;

  if (num > 0) {
    if (words) words += 'AND ';
    if (num < 20) {
      words += units[num];
    } else {
      words += tens[Math.floor(num / 10)];
      if (num % 10) words += `-${units[num % 10]}`;
    }
  }

  return words.trim();
}
