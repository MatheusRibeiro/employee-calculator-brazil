describe('IRRF', function () {
  const { expect } = require('chai')

  const { IRRF, detailedIRRF } = require('./irrf')

  const testValues = [
    {
      baseValue: 1500,
      deductions: null,
      expectedIrrf: 0,
      expectedCalculusMemory: '(1500.00 x 0.0%) = 0'
    },
    {
      baseValue: 3000,
      deductions: { numberOfDependents: 2, alimony: 200, otherDeductions: 50 },
      expectedIrrf: 35.01,
      expectedCalculusMemory: '(1903.98 x 0.0%) + (466.84 x 7.5%) = 35.01'
    },
    {
      baseValue: 5000,
      deductions: { alimony: 200 },
      expectedIrrf: 450.63,
      expectedCalculusMemory: '(1903.98 x 0.0%) + (922.67 x 7.5%) + (924.40 x 15.0%) + (913.63 x 22.5%) + (135.32 x 27.5%) = 450.63'
    },
    {
      baseValue: 10000,
      deductions: { otherDeductions: 1462.08 },
      expectedIrrf: 1478.56,
      expectedCalculusMemory: '(1903.98 x 0.0%) + (922.67 x 7.5%) + (924.40 x 15.0%) + (913.63 x 22.5%) + (3873.24 x 27.5%) = 1478.56'
    }
  ]

  testValues.forEach(function ({ baseValue, deductions, expectedIrrf }) {
    it(`calculates IRRF with ${testDetails(baseValue, deductions)}`, function () {
      const calculated = IRRF(baseValue, deductions)
      expect(calculated).to.equals(expectedIrrf)
    })
  })

  testValues.forEach(function ({ baseValue, deductions, expectedCalculusMemory }) {
    it(`details the calculus of the IRRF with ${testDetails(baseValue, deductions)}`, function () {
      const detailed = detailedIRRF(baseValue, deductions)
      expect(detailed).to.equals(expectedCalculusMemory)
    })
  })
})

function testDetails (baseValue, deductions) {
  const { numberOfDependents, alimony, otherDeductions } = deductions || {}
  const baseValueDescription = `base value of ${baseValue}`
  const deductionsDetails = []
  if (numberOfDependents) {
    deductionsDetails.push(`${numberOfDependents} dependents`)
  }
  if (alimony) {
    deductionsDetails.push(`${alimony} alimony`)
  }
  if (otherDeductions) {
    deductionsDetails.push(`${otherDeductions} other deductions`)
  }

  return `${baseValueDescription}${deductionsDetails.length ? ` (${deductionsDetails.join(', ')})` : ''}`
}
