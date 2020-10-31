describe('Payment Functions', function () {
  const { expect } = require('chai')

  const {
    salaryRemainer,
    advanceNoticeSalary,
    proportionalThirteenthSalary,
    indemnifiedThirteenthSalary,
    paidTimeOffIndemnified,
    advanceNoticePaidTimeOff
  } = require('./partialPayments')

  describe('Salary Remainer', function () {
    const fixtures = [
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

    fixtures.forEach(function ({ grossSalary, endDate, expectedResult }) {
      it(`calculates salary remainer for ${grossSalary} gross salary and termination date ${endDate}`, function () {
        const result = salaryRemainer({ grossSalary, endDate })
        expect(result).to.eql(expectedResult)
      })
    })
  })

  describe('Advance Notice Salary', function () {
    const fixtures = [
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

    fixtures.forEach(function ({ grossSalary, startDate, endDate, expectedResult }) {
      it(`calculates advance notice salary for ${grossSalary} gross salary, working between ${startDate} and ${endDate}`, function () {
        const result = advanceNoticeSalary({ grossSalary, startDate, endDate })
        expect(result).to.eql(expectedResult)
      })
    })
  })

  describe('Proportional Thirteenth Salary', function () {
    const fixtures = [
      {
        grossSalary: 6000,
        startDate: '2014-11-06',
        endDate: '2020-10-12',
        firstInstallment: 2500,
        expectedResult: {
          grossValue: 4500,
          firstInstallment: 2500,
          inss: 488.94,
          irrf: 266.36,
          netValue: 1244.69,
          details: {
            startDate: '2014-11-06',
            endDate: '2020-10-12',
            completedMonths: 9
          }
        }
      }
    ]

    fixtures.forEach(function ({ grossSalary, startDate, endDate, firstInstallment, expectedResult }) {
      it(`calculates the proportional thirteenth salary for ${grossSalary} gross salary, giving a firstInstallment of ${firstInstallment} and working between ${startDate} and ${endDate}`, function () {
        const result = proportionalThirteenthSalary({ grossSalary, startDate, endDate, firstInstallment })
        expect(result).to.eql(expectedResult)
      })
    })
  })

  describe('Indemnified Thirteenth Salary', function () {
    const fixtures = [
      {
        grossSalary: 6000,
        startDate: '2014-11-06',
        endDate: '2020-10-12',
        expectedResult: {
          grossValue: 1000,
          inss: 0,
          irrf: 0,
          netValue: 1000,
          details: {
            startDate: '2014-11-06',
            endDate: '2020-10-12',
            endDateWithAdvanceNotice: '2020-11-26',
            completedMonths: 2
          }
        }
      }
    ]

    fixtures.forEach(function ({ grossSalary, startDate, endDate, expectedResult }) {
      it(`calculates the indemnified thirteenth salary for ${grossSalary} gross salary, working between ${startDate} and ${endDate}`, function () {
        const result = indemnifiedThirteenthSalary({ grossSalary, startDate, endDate })
        expect(result).to.eql(expectedResult)
      })
    })
  })

  describe('Indemnified Paid Time Off', function () {
    const fixtures = [
      {
        grossSalary: 6000,
        hasTimeOff: true,
        expectedResult: {
          grossValue: 8000,
          inss: 0,
          irrf: 0,
          netValue: 8000
        }
      }
    ]

    fixtures.forEach(function ({ grossSalary, hasTimeOff, expectedResult }) {
      it(`calculates the indemnified paid time off for ${grossSalary} gross salary`, function () {
        const result = paidTimeOffIndemnified({ grossSalary, hasTimeOff })
        expect(result).to.eql(expectedResult)
      })
    })

    it('return empty values when there is no time off', function () {
      const grossSalary = 'any'
      const hasTimeOff = false

      const expectedResult = {
        grossValue: 0,
        inss: 0,
        irrf: 0,
        netValue: 0
      }
      const result = paidTimeOffIndemnified({ grossSalary, hasTimeOff })
      expect(result).to.eql(expectedResult)
    })
  })

  describe('Advance Notice Paid Time Off', function () {
    const fixtures = [
      {
        grossSalary: 5000,
        startDate: '2014-01-06',
        endDate: '2020-10-12',
        expectedResult: {
          grossValue: 5555.55,
          inss: 0,
          irrf: 0,
          netValue: 5555.55,
          details: {
            completedMonths: 10,
            startDate: '2014-01-06',
            endDateWithAdvanceNotice: '2020-11-29'
          }
        }
      }
    ]

    fixtures.forEach(function ({ grossSalary, startDate, endDate, expectedResult }) {
      it(`calculates advance notice paid time off for ${grossSalary} gross salary, working between ${startDate} and ${endDate}`, function () {
        const result = advanceNoticePaidTimeOff({ grossSalary, startDate, endDate })
        expect(result).to.eql(expectedResult)
      })
    })
  })
})
