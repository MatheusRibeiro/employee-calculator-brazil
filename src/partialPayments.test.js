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
          inss: 488.94,
          irrf: 266.36,
          netValue: 1244.69,
          details: {
            grossValue: '13º proporcional para 9 meses',
            firstInstallment: 'Valor líquido do 13º adiantado',
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
          inss: 0,
          irrf: 0,
          netValue: 1000,
          details: {
            grossValue: '13º proporcional para 2 meses',
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
          inss: 0,
          irrf: 0,
          netValue: 1000,
          details: {
            grossValue: '13º proporcional para 2 meses',
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
            grossValue: 'Férias proporcionais para 10 dias',
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
          grossValue: 'Férias proporcionais para 0 dias',
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
        startDate: '2014-01-06',
        endDate: '2020-10-12',
        expectedResult: {
          grossValue: 5555.55,
          inss: 0,
          irrf: 0,
          netValue: 5555.55,
          details: {
            grossValue: 'Férias proporcionais para 48 dias',
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
