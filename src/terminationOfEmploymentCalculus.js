const { roundCurrency } = require('./currencyHelper')
const {
  salaryRemainer,
  advanceNoticeSalary,
  paidTimeOff,
  thirteenthSalary
} = require('./partialPayments')

function sumNetValues (total, { netValue }) {
  total += netValue
  return total
}

function sumSalaries (salaryResults) {
  return roundCurrency(salaryResults.reduce(sumNetValues, 0))
}

function terminationOfEmploymentCalculus ({
  grossSalary,
  startDate,
  endDate,
  currentFgtsBalance,
  cashedFgts,
  remainingDaysPaidTimeOff,
  thirteenthSalaryFirstInstallment,
  irrfDeductions
}) {
  const salaryRemainerResult = salaryRemainer({ grossSalary, endDate, irrfDeductions })
  const advanceNoticeResult = advanceNoticeSalary({ grossSalary, startDate, endDate, irrfDeductions })

  const paidTimeOffResult = paidTimeOff({ grossSalary, startDate, endDate, remainingDaysPaidTimeOff, irrfDeductions })
  const thirteenthSalaryResult = thirteenthSalary({
    grossSalary,
    startDate,
    endDate,
    firstInstallment: thirteenthSalaryFirstInstallment,
    irrfDeductions
  })

  const salaryTotal = sumSalaries([
    salaryRemainerResult,
    advanceNoticeResult,
    paidTimeOffResult,
    thirteenthSalaryResult
  ])

  const depositedFgts = roundCurrency(currentFgtsBalance + cashedFgts)
  const baseFgts = roundCurrency(depositedFgts + salaryRemainerResult.fgts + thirteenthSalaryResult.fgtsProportional)
  const fgtsPenalty = roundCurrency(baseFgts * 0.4)

  const fgtsTotal = roundCurrency(
    currentFgtsBalance +
    fgtsPenalty +
    salaryRemainerResult.fgts +
    advanceNoticeResult.fgts +
    thirteenthSalaryResult.fgtsProportional +
    thirteenthSalaryResult.fgtsIndemnified
  )

  return {
    salary: {
      remainer: salaryRemainerResult,
      advanceNotice: advanceNoticeResult,
      total: roundCurrency(salaryRemainerResult.netValue + advanceNoticeResult.netValue)
    },
    thirteenthSalary: thirteenthSalaryResult,
    paidTimeOff: paidTimeOffResult,
    fgts: {
      base: {
        deposited: depositedFgts,
        overSalaryRemainer: salaryRemainerResult.fgts,
        overProportionalThirteenthSalary: thirteenthSalaryResult.fgtsProportional,
        netValue: baseFgts,
        details: {
          deposited: 'Saldo atual + valor sacado',
          overProportionalThirteenthSalary: thirteenthSalaryResult.details.fgtsProportional,
          overSalaryRemainer: salaryRemainerResult.details.fgts
        }
      },
      total: {
        base: baseFgts,
        fourtyPercentPenalty: fgtsPenalty,
        cashedFgts: cashedFgts,
        overAdvanceNoticeSalary: advanceNoticeResult.fgts,
        overIndemnifiedThirteenthSalary: thirteenthSalaryResult.fgtsIndemnified,
        netValue: fgtsTotal,
        details: {
          base: 'Valor base para multa de 40%',
          fourtyPercentPenalty: `40% de ${baseFgts}`,
          cashedFgts: 'Valor já sacado',
          overAdvanceNoticeSalary: `${advanceNoticeResult.details.fgts} (verba indenizatória, não entra no cálculo da multa)`,
          overIndemnifiedThirteenthSalary: `${thirteenthSalaryResult.details.fgtsIndemnified} (verba indenizatória, não entra no cálculo da multa)`
        }
      }
    },
    total: {
      salary: salaryTotal,
      fgts: fgtsTotal,
      netValue: roundCurrency(salaryTotal + fgtsTotal)
    }
  }
}

module.exports = terminationOfEmploymentCalculus
