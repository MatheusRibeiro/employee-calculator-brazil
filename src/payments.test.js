describe('Payment Functions', function () {
  const { expect } = require('chai')

  const {
    salaryRemainer,
    advanceNoticeSalary
  } = require('./payments')

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

  const advanceNoticeSalaryTests = [
    {
      grossSalary: 5000,
      startDate: '2014-11-06',
      endDate: '2020-10-12',
      expectedResult: {
        grossValue: 7500,
        fgts: 600,
        inss: 713.09,
        irrf: 0,
        netValue: 6786.91,
        details: {
          advanceNoticeDays: 45,
          endDateWithAdvanceNotice: '2020-11-26'
        }
      }
    }
  ]

  advanceNoticeSalaryTests.forEach(function ({ grossSalary, startDate, endDate, expectedResult }) {
    it(`calculates advance notice salary for ${grossSalary} gross salary, working between ${startDate} and ${endDate}`, function () {
      const result = advanceNoticeSalary({ grossSalary, startDate, endDate })
      expect(result).to.eql(expectedResult)
    })
  })
})
