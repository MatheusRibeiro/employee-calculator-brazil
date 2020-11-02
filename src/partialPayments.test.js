describe('Partial Payments', function () {
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
            grossValue: 'Salário proporcional para 12 dias',
            fgts: '8% sobre 2000',
            inss: '(1045.00 x 7.5%) + (955.00 x 9.0%) = 164.32',
            irrf: '(1835.68 x 0.0%) = 0'
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
            grossValue: 'Salário proporcional para 45 dias',
            fgts: '8% sobre 7500',
            inss: 'Para salários acima de 6101.06, paga-se o teto de 713.09',
            irrf: 'Não há IRRF para aviso prévio'
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
          fgts: 360,
          inss: 488.94,
          irrf: 266.36,
          netValue: 1244.69,
          details: {
            grossValue: '13º proporcional para 9 meses',
            firstInstallment: 'Valor líquido do 13º adiantado',
            fgts: '8% sobre 4500',
            inss: '(1045.00 x 7.5%) + (1044.60 x 9.0%) + (1044.80 x 12.0%) + (1365.60 x 14.0%) = 488.94',
            irrf: '(1903.98 x 0.0%) + (922.67 x 7.5%) + (924.40 x 15.0%) + (260.01 x 22.5%) = 266.36'
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
          fgts: 80,
          inss: 0,
          irrf: 0,
          netValue: 1000,
          details: {
            grossValue: '13º proporcional para 2 meses',
            fgts: '8% sobre 1000',
            inss: 'Não há incidência de INSS para décimo terceiro indenizado',
            irrf: 'Não há IRRF para décimo terceiro indenizado'
          }
        }
      },
      {
        grossSalary: 6000,
        startDate: '2012-12-12',
        endDate: '2020-11-14',
        expectedResult: {
          grossValue: 1000,
          fgts: 80,
          inss: 0,
          irrf: 0,
          netValue: 1000,
          details: {
            grossValue: '13º proporcional para 2 meses',
            fgts: '8% sobre 1000',
            inss: 'Não há incidência de INSS para décimo terceiro indenizado',
            irrf: 'Não há IRRF para décimo terceiro indenizado'
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
        grossSalary: 9000,
        remainingDaysPaidTimeOff: 10,
        expectedResult: {
          grossValue: 4000,
          inss: 0,
          irrf: 0,
          netValue: 4000,
          details: {
            grossValue: 'Férias vencidas com 10 dias não utilizados',
            inss: 'Não há incidência de INSS para férias indenizadas',
            irrf: 'Não há IRRF para férias indenizadas'
          }
        }
      }
    ]

    fixtures.forEach(function ({ grossSalary, remainingDaysPaidTimeOff, expectedResult }) {
      it(`calculates the indemnified paid time off for ${grossSalary} gross salary`, function () {
        const result = paidTimeOffIndemnified({ grossSalary, remainingDaysPaidTimeOff })
        expect(result).to.eql(expectedResult)
      })
    })

    it('return empty values when there is no time off', function () {
      const grossSalary = 10000
      const remainingDaysPaidTimeOff = 0

      const expectedResult = {
        grossValue: 0,
        inss: 0,
        irrf: 0,
        netValue: 0,
        details: {
          grossValue: 'Férias vencidas com 0 dias não utilizados',
          inss: 'Não há incidência de INSS para férias indenizadas',
          irrf: 'Não há IRRF para férias indenizadas'
        }
      }
      const result = paidTimeOffIndemnified({ grossSalary, remainingDaysPaidTimeOff })
      expect(result).to.eql(expectedResult)
    })
  })

  describe('Advance Notice Paid Time Off', function () {
    const fixtures = [
      {
        grossSalary: 5000,
        startDate: '2013-01-06',
        endDate: '2019-10-12',
        expectedResult: {
          grossValue: 6111.11,
          inss: 0,
          irrf: 0,
          netValue: 6111.11,
          details: {
            grossValue: 'Férias proporcionais referente ao período de 06/01/2019 até 29/11/2019 (após acréscimo de 48 dias do aviso prévio) totalizando 11 meses',
            inss: 'Não há incidência de INSS para férias indenizadas',
            irrf: 'Não há IRRF para férias indenizadas'
          }
        }
      },
      {
        grossSalary: 1200,
        startDate: '2018-09-11',
        endDate: '2020-04-10',
        expectedResult: {
          grossValue: 1066.66,
          inss: 0,
          irrf: 0,
          netValue: 1066.66,
          details: {
            grossValue: 'Férias proporcionais referente ao período de 11/09/2020 até 13/05/2020 (após acréscimo de 33 dias do aviso prévio) totalizando 8 meses',
            inss: 'Não há incidência de INSS para férias indenizadas',
            irrf: 'Não há IRRF para férias indenizadas'
          }
        }
      },
      {
        grossSalary: 2500,
        startDate: '2018-11-01',
        endDate: '2020-03-20',
        expectedResult: {
          grossValue: 1666.66,
          inss: 0,
          irrf: 0,
          netValue: 1666.66,
          details: {
            grossValue: 'Férias proporcionais referente ao período de 01/11/2020 até 22/04/2020 (após acréscimo de 33 dias do aviso prévio) totalizando 6 meses',
            inss: 'Não há incidência de INSS para férias indenizadas',
            irrf: 'Não há IRRF para férias indenizadas'
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
