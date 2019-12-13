import test from 'tape';
import { getCheckDigit, encode } from '#/ean-13';

test('src/barcode', t => {
  t.test('EAN-13', q => {
    q.equal(getCheckDigit('400638133393'), 1);
    q.deepEqual(encode('4006381333931'), [13, 39, 47, 61, 9, 51, 66, 66, 66, 116, 66, 102]);
    q.end();
  });
});
