describe('Partial Payments', function () {
  const { expect } = require('chai')

  const {
    salaryRemainer,
    advanceNoticeSalary,
    thirteenthSalary,
    paidTimeOff
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

  describe('Thirteenth Salary', function () {
    const fixtures = [
      {
        grossSalary: 6000,
        startDate: '2014-11-06',
        endDate: '2020-10-12',
        firstInstallment: 2500,
        expectedResult: {
          proportional: 4500,
          indemnified: 1000,
          grossValue: 5500,
          firstInstallment: 2500,
          fgtsProportional: 360,
          fgtsIndemnified: 80,
          inss: 628.94,
          irrf: 470.18,
          netValue: 1900.87,
          details: {
            proportional: '13º proporcional para 9 meses',
            indemnified: '13º indenizado para 2 meses',
            grossValue: 'R$ 4500 + R$ 1000',
            firstInstallment: 'Valor líquido do 13º adiantado',
            fgtsProportional: '8% sobre 4500',
            fgtsIndemnified: '8% sobre 1000',
            inss: '(1045.00 x 7.5%) + (1044.60 x 9.0%) + (1044.80 x 12.0%) + (2365.60 x 14.0%) = 628.94',
            irrf: '(1903.98 x 0.0%) + (922.67 x 7.5%) + (924.40 x 15.0%) + (913.63 x 22.5%) + (206.38 x 27.5%) = 470.18'
          }
        }
      }
    ]

    fixtures.forEach(function ({ grossSalary, startDate, endDate, firstInstallment, expectedResult }) {
      it(`calculates the thirteenth salary for ${grossSalary} gross salary, giving a firstInstallment of ${firstInstallment} and working between ${startDate} and ${endDate}`, function () {
        const result = thirteenthSalary({ grossSalary, startDate, endDate, firstInstallment })
        expect(result).to.eql(expectedResult)
      })
    })
  })

  describe('Paid Time Off', function () {
    const fixtures = [
      {
        grossSalary: 9000,
        remainingDaysPaidTimeOff: 10,
        startDate: '2013-01-06',
        endDate: '2019-10-12',
        expectedResult: {
          baseValue: 11250,
          third: 3750,
          grossValue: 15000,
          inss: 713.09,
          irrf: 3059.54,
          netValue: 11227.37,
          details: {
            baseValue: 'R$ 3000 (10 dias de férias vencidas) + R$ 8250 (11 meses completos)',
            third: 'R$ 3000 * 1/3 (10 dias de férias vencidas) + R$ 8250 * 1/3 (11 meses completos)',
            grossValue: 'R$ 4000 (10 dias de férias vencidas) + R$ 11000 (11 meses completos)',
            inss: 'Para salários acima de 6101.06, paga-se o teto de 713.09',
            irrf: '(1903.98 x 0.0%) + (922.67 x 7.5%) + (924.40 x 15.0%) + (913.63 x 22.5%) + (9622.23 x 27.5%) = 3059.54'
          }
        }
      }
    ]

    fixtures.forEach(function ({ grossSalary, startDate, endDate, remainingDaysPaidTimeOff, expectedResult }) {
      it(`calculates the paid time off for ${grossSalary} gross salary`, function () {
        const result = paidTimeOff({ grossSalary, startDate, endDate, remainingDaysPaidTimeOff })
        expect(result).to.eql(expectedResult)
      })
    })
  })
})
