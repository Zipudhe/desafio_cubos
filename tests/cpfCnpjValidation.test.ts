const { describe, it, assert } = require('node:test')

const { getDocumentType } = require('../src/services/validadeDocument')

describe('getDocumentType', function () {
  it('should return "cpf" for valid CPF format', function () {
    assert.strictEqual(getDocumentType('123.456.789-00'), 'cpf');
  });

  it('should return "cnpj" for any other format', function () {
    assert.strictEqual(getDocumentType('12.345.678/0001-95'), 'cnpj');
  });

  it('should return "cnpj" for invalid CPF', function () {
    assert.strictEqual(getDocumentType('12345678900'), 'cnpj');
  });
});
