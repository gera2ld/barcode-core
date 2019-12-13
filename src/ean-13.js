// https://en.wikipedia.org/wiki/International_Article_Number
// EAN-13

const BIT_LEN = 7;
const L_CODES = [
  0b0001101, // 0
  0b0011001, // 1
  0b0010011, // 2
  0b0111101, // 3
  0b0100011, // 4
  0b0110001, // 5
  0b0101111, // 6
  0b0111011, // 7
  0b0110111, // 8
  0b0001011, // 9
];
const R_CODES = L_CODES.map(l => 0b1111111 - l);
// Reversed R
const G_CODES = R_CODES.map(r => {
  let g = 0;
  for (let i = 0; i < BIT_LEN; i += 1) {
    const x = r & (1 << i);
    if (x) g |= (1 << (BIT_LEN - i - 1));
  }
  return g;
});
const F_CODES = [
  0b000000, // 0
  0b001011, // 1
  0b001101, // 2
  0b001110, // 3
  0b010011, // 4
  0b011001, // 5
  0b011100, // 6
  0b010101, // 7
  0b010110, // 8
  0b011010, // 9
];

const PATTERN = /^\d{13}$/;

export function getCheckDigit(str) {
  let result = 0;
  for (let i = 0; i < str.length; i += 1) {
    const weight = (str.length - i) % 2 ? 3 : 1;
    result += weight * str[i];
  }
  result %= 10;
  return result ? 10 - result : result;
}

export function check(str) {
  if (!PATTERN.test(str)) throw new Error(`Invalid string: ${str}`);
  const c = getCheckDigit(str.slice(0, -1));
  const actual = +str.slice(-1);
  if (c !== actual) throw new Error(`Invalid check digit: ${actual}, expected ${c}`);
}

export function encode(str) {
  check(str);
  const first = F_CODES[str[0]];
  const result = [];
  for (let i = 0; i < 6; i += 1) {
    const lCodes = (first & (1 << (5 - i))) ? G_CODES : L_CODES;
    result[i] = lCodes[str[i + 1]];
    result[i + 6] = R_CODES[str[i + 7]];
  }
  return result;
}
