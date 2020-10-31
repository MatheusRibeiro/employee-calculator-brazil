describe('Full Termination Calculus', function () {
  const { expect } = require('chai')

  const terminationOfEmploymentCalculus = require('./terminationOfEmploymentCalculus')

  const fixtures = [
    {
      input: {
        grossSalary: 6000,
        startDate: '2013-09-23',
        endDate: '2020-11-04',
        currentFgtsBalance: 39800,
        cashedFgts: 200,
        remainingDaysPaidTimeOff: 30,
        thirteenthSalaryFirstInstallment: 0
      },
      expectedOutput: {
        salary: {
          remainer: {
            grossValue: 800,
            fgts: 64,
            inss: 60,
            irrf: 0,
            netValue: 740,
            details: {
              days: 4,
              inss: '(800.00 x 7.5%) = 60',
              irff: '(740.00 x 0.0%) = 0'
            }
          },
          advanceNotice: {
            grossValue: 10200,
            fgts: 816,
            inss: 713.09,
            irrf: 0,
            netValue: 9486.91,
            details: {
              advanceNoticeDays: 51,
              endDateWithAdvanceNotice: '2020-12-25',
              inss: 'para salários acima de 6101.06, paga-se o teto de 713.09'
            }
          },
          total: 10226.91
        },
        thirteenthSalary: {
          proportional: {
            grossValue: 5000,
            firstInstallment: 0,
            inss: 558.94,
            irrf: 363.11,
            netValue: 4077.94,
            details: {
              startDate: '2013-09-23',
              endDate: '2020-11-04',
              completedMonths: 10,
              inss: '(1045.00 x 7.5%) + (1044.60 x 9.0%) + (1044.80 x 12.0%) + (1865.60 x 14.0%) = 558.94',
              irff: '(1903.98 x 0.0%) + (922.67 x 7.5%) + (924.40 x 15.0%) + (690.01 x 22.5%) = 363.11'
            }
          },
          indemnified: {
            grossValue: 1000,
            inss: 0,
            irrf: 0,
            netValue: 1000,
            details: {
              startDate: '2013-09-23',
              endDate: '2020-11-04',
              endDateWithAdvanceNotice: '2020-12-25',
              completedMonths: 2
            }
          },
          total: 5077.94
        },
        paidTimeOff: {
          full: {
            grossValue: 8000,
            inss: 0,
            irrf: 0,
            netValue: 8000
          },
          advanceNotice: {
            grossValue: 2000,
            inss: 0,
            irrf: 0,
            netValue: 2000,
            details: {
              startDate: '2013-09-23',
              endDateWithAdvanceNotice: '2020-12-25',
              completedMonths: 3
            }
          },
          total: 10000
        },
        fgts: {
          total: 56680,
          details: {
            base: 40000,
            fourtyPercentPenalty: 16000,
            cashedFgts: 200,
            overSalaryRemainer: 64,
            overAdvanceNoticeSalary: 816
          }
        },
        total: {
          salary: 25304.85,
          fgts: 56680,
          netValue: 81984.85
        }
      }
    }
  ]

  fixtures.forEach(function ({ input, expectedOutput }) {
    const output = terminationOfEmploymentCalculus(input)

    it('returns salary remainer', function () {
      expect(output.salary.remainer).to.eql(expectedOutput.salary.remainer)
    })
    it('returns advance notice salary', function () {
      expect(output.salary.advanceNotice).to.eql(expectedOutput.salary.advanceNotice)
    })
    it('returns the total salary', function () {
      expect(output.salary.total).to.equal(expectedOutput.salary.total)
    })

    it('returns proportional thirteenth salary', function () {
      expect(output.thirteenthSalary.proportional).to.eql(expectedOutput.thirteenthSalary.proportional)
    })
    it('returns indemnified thirteenth salary', function () {
      expect(output.thirteenthSalary.indemnified).to.eql(expectedOutput.thirteenthSalary.indemnified)
    })
    it('returns the total thirteenth salary', function () {
      expect(output.thirteenthSalary.total).to.equal(expectedOutput.thirteenthSalary.total)
    })

    it('returns paid time off not taken', function () {
      expect(output.paidTimeOff.full).to.eql(expectedOutput.paidTimeOff.full)
    })
    it('returns advance notice paid time off', function () {
      expect(output.paidTimeOff.advanceNotice).to.eql(expectedOutput.paidTimeOff.advanceNotice)
    })
    it('returns the total paid time off', function () {
      expect(output.paidTimeOff.total).to.equal(expectedOutput.paidTimeOff.total)
    })

    it('returns the FGTS total', function () {
      expect(output.fgts.total).to.equal(expectedOutput.fgts.total)
    })
    it('returns the details of FGTS calculus', function () {
      expect(output.fgts.details).to.eql(expectedOutput.fgts.details)
    })

    it('returns the amount to be received, detailing what is from salary and fgts', function () {
      expect(output.total.salary).to.equal(expectedOutput.total.salary)
      expect(output.total.fgts).to.equal(expectedOutput.total.fgts)
      expect(output.total.netValue).to.equal(expectedOutput.total.netValue)
    })
  })
})
