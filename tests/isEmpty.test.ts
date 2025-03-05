import assert from 'node:assert'
import { describe, it } from 'node:test'


import { isEmpty } from '../src/utils/validators';

describe('isEmpty', function () {
  it('should return true for empty array', function () {
    assert.strictEqual(isEmpty([]), true);
  });

  it('should return false for non-empty array', function () {
    assert.strictEqual(isEmpty([1, 2, 3]), false);
  });

  it('should return true for empty object', function () {
    assert.strictEqual(isEmpty({}), true);
  });

  it('should return false for non-empty object', function () {
    assert.strictEqual(isEmpty({ key: 'value' }), false);
  });

  it('should return true for null', function () {
    assert.strictEqual(isEmpty(null), true);
  });

  it('should return true for undefined', function () {
    assert.strictEqual(isEmpty(undefined), true);
  });

  it('should return false for a non-empty string', function () {
    assert.strictEqual(isEmpty('Hello'), false);
  });

  it('should return true for an empty string', function () {
    assert.strictEqual(isEmpty(''), true);
  });
});
