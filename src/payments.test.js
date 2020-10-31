describe('Payment Functions', function () {
  const { expect } = require('chai')

  const { salaryRemainer } = require('./payments')

  const salaryRemainerTests = [
    {
      grossSalary: 5000,
      endDate: '2020-10-12',
      expectedResult: {
        grossValue: 2000,
        fgts: 160,
        inss: 164.32,
        irrf: 0,
        netValue: 1835.68,
        details: {
          days: 12
        }
      }
    }
  ]

  salaryRemainerTests.forEach(function ({ grossSalary, endDate, expectedResult }) {
    it(`calculates salary remainer for ${grossSalary} gross salary and termination date ${endDate}`, function () {
      const result = salaryRemainer({ grossSalary, endDate })
      expect(result).to.eql(expectedResult)
    })
  })
})
