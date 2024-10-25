const { describe, it, assert } = require('node:test')

const { hasRequiredFields } = require('../src/utils/validators');

describe('hasRequiredFields', function () {
  it('should return false if data is empty', function () {
    assert.strictEqual(hasRequiredFields(['name'], {}), false);
    assert.strictEqual(hasRequiredFields(['name'], null), false);
  });

  it('should return false if any required field is missing', function () {
    assert.strictEqual(hasRequiredFields(['name', 'age'], { name: 'John' }), false);
  });

  it('should return false if any required field is empty', function () {
    assert.strictEqual(hasRequiredFields(['name', 'age'], { name: '', age: 30 }), false);
  });

  it('should return true if all required fields are present and not empty', function () {
    assert.strictEqual(hasRequiredFields(['name', 'age'], { name: 'John', age: 30 }), true);
  });
});
