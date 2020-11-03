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
          proportional: 5000,
          indemnified: 1000,
          grossValue: 6000,
          firstInstallment: 0,
          fgtsProportional: 400,
          fgtsIndemnified: 80,
          inss: 698.94,
          irrf: 467.54,
          netValue: 4833.51,
          details: {
            proportional: '13º proporcional para 10 meses',
            indemnified: '13º indenizado para 2 meses',
            grossValue: 'R$ 5000 + R$ 1000',
            firstInstallment: 'Valor líquido do 13º adiantado',
            fgtsProportional: '8% sobre 5000',
            fgtsIndemnified: '8% sobre 1000',
            inss: '(1045.00 x 7.5%) + (1044.60 x 9.0%) + (1044.80 x 12.0%) + (2865.60 x 14.0%) = 698.94',
            irrf: '(1903.98 x 0.0%) + (922.67 x 7.5%) + (924.40 x 15.0%) + (913.63 x 22.5%) + (196.79 x 27.5%) = 467.54'
          }
        },
        paidTimeOff: {
          baseValue: 7500,
          third: 2500,
          grossValue: 10000,
          // inss: 713.09,
          // irrf: 1563.65,
          // netValue: 7723.26,
          inss: 0,
          irrf: 0,
          netValue: 10000,
          details: {
            baseValue: 'R$ 6000 (30 dias de férias vencidas) + R$ 1500 (3 meses completos, referente à 23/09/2020 até 25/12/2020)',
            third: 'R$ 6000 * 1/3 (30 dias de férias vencidas) + R$ 1500 * 1/3 (3 meses completos, referente à 23/09/2020 até 25/12/2020)',
            grossValue: 'R$ 8000 (30 dias de férias vencidas) + R$ 2000 (3 meses completos, referente à 23/09/2020 até 25/12/2020)',
            // inss: 'Para salários acima de 6101.06, paga-se o teto de 713.09',
            // irrf: '(1903.98 x 0.0%) + (922.67 x 7.5%) + (924.40 x 15.0%) + (913.63 x 22.5%) + (4182.64 x 27.5%) = 1563.65'
            inss: 'Férias indenizadas pagas na rescisão não sofrem incidência previdenciária',
            irrf: 'Férias indenizadas pagas na rescisão são isentas de imposto de renda'
          }
        },
        fgts: {
          base: {
            deposited: 40000,
            overProportionalThirteenthSalary: 400,
            overSalaryRemainer: 64,
            netValue: 40464,
            details: {
              deposited: 'Saldo atual + valor sacado',
              overProportionalThirteenthSalary: '8% sobre 5000',
              overSalaryRemainer: '8% sobre 800'
            }
          },
          total: {
            base: 40464,
            fourtyPercentPenalty: 16185.6,
            cashedFgts: 200,
            overAdvanceNoticeSalary: 816,
            overIndemnifiedThirteenthSalary: 80,
            netValue: 57345.6,
            details: {
              base: 'Valor base para multa de 40%',
              fourtyPercentPenalty: '40% de 40464',
              cashedFgts: 'Valor já sacado',
              overAdvanceNoticeSalary: '8% sobre 1000 (verba indenizatória, não entra no cálculo da multa)',
              overIndemnifiedThirteenthSalary: '8% sobre 10200 (verba indenizatória, não entra no cálculo da multa)'
            }
          }
        },
        total: {
          salary: 25060.42,
          fgts: 57345.6,
          netValue: 82406.01
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
    it('returns thirteenth salary', function () {
      expect(output.thirteenthSalary).to.eql(expectedOutput.thirteenthSalary)
    })
    it('returns paid time off', function () {
      expect(output.paidTimeOff).to.eql(expectedOutput.paidTimeOff)
    })
    it('returns the FGTS total', function () {
      expect(output.fgts.total.netValue).to.equal(expectedOutput.fgts.total.netValue)
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
