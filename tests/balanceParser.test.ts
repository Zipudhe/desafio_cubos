const { describe, it, assert } = require('node:test')

const { parseBalanceToFloat } = require('../src/utils/balanceParser');

describe('parseBalanceToFloat', function () {
  it('should parse a balance string with a currency symbol', function () {
    assert.strictEqual(parseBalanceToFloat('$123.45'), 123.45);
  });

  it('should parse a balance string with a euro symbol', function () {
    assert.strictEqual(parseBalanceToFloat('456.78'), 456.78);
  });

  it('should parse a balance string with a negative sign', function () {
    assert.strictEqual(parseBalanceToFloat('-123.45'), -123.45);
  });

  it('should return NaN for invalid input', function () {
    assert(isNaN(parseBalanceToFloat('invalid')));
    assert(isNaN(parseBalanceToFloat('abc')));
  });

  it('should handle zero balance', function () {
    assert.strictEqual(parseBalanceToFloat('0.00'), 0);
  });

  it('should handle large balance numbers', function () {
    assert.strictEqual(parseBalanceToFloat('1,000,000.00'), 1000000);
  });

  it('should remove leading spaces', function () {
    assert.strictEqual(parseBalanceToFloat('   $123.45'), 123.45);
  });
});
