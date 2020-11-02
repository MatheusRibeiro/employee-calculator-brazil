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
        thirteenthSalaryFirstInstallment: 0,
        irrfDeductions: {
          numberOfDependents: 1,
          alimony: 200,
          otherDeductions: 50
        }
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
              grossValue: 'Salário proporcional para 4 dias',
              inss: '(800.00 x 7.5%) = 60',
              irrf: '(300.41 x 0.0%) = 0',
              fgts: '8% sobre 800'
            }
          },
          advanceNotice: {
            grossValue: 10200,
            fgts: 816,
            inss: 713.09,
            irrf: 0,
            netValue: 9486.91,
            details: {
              grossValue: 'Salário proporcional para 51 dias',
              inss: 'Para salários acima de 6101.06, paga-se o teto de 713.09',
              irrf: 'Não há IRRF para aviso prévio',
              fgts: '8% sobre 10200'
            }
          },
          total: 10226.91
        },
        thirteenthSalary: {
          proportional: {
            grossValue: 5000,
            firstInstallment: 0,
            inss: 558.94,
            irrf: 264.2,
            netValue: 4176.85,
            details: {
              grossValue: '13º proporcional para 10 meses',
              firstInstallment: 'Valor líquido do 13º adiantado',
              inss: '(1045.00 x 7.5%) + (1044.60 x 9.0%) + (1044.80 x 12.0%) + (1865.60 x 14.0%) = 558.94',
              irrf: '(1903.98 x 0.0%) + (922.67 x 7.5%) + (924.40 x 15.0%) + (250.42 x 22.5%) = 264.2'
            }
          },
          indemnified: {
            grossValue: 1000,
            inss: 0,
            irrf: 0,
            netValue: 1000,
            details: {
              grossValue: '13º proporcional para 2 meses',
              inss: 'Não há incidência de INSS para décimo terceiro indenizado',
              irrf: 'Não há IRRF para décimo terceiro indenizado'
            }
          },
          total: 5176.85
        },
        paidTimeOff: {
          full: {
            grossValue: 8000,
            inss: 0,
            irrf: 0,
            netValue: 8000,
            details: {
              grossValue: 'Férias proporcionais para 30 dias',
              inss: 'Não há incidência de INSS para férias indenizadas',
              irrf: 'Não há IRRF para férias indenizadas'
            }
          },
          advanceNotice: {
            grossValue: 2000,
            inss: 0,
            irrf: 0,
            netValue: 2000,
            details: {
              grossValue: 'Férias proporcionais para 51 dias',
              inss: 'Não há incidência de INSS para férias indenizadas',
              irrf: 'Não há IRRF para férias indenizadas'
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
          salary: 25403.76,
          fgts: 56680,
          netValue: 82083.75
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
