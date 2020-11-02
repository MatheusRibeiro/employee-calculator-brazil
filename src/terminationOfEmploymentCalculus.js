const { roundCurrency } = require('./currencyHelper')
const {
  salaryRemainer,
  advanceNoticeSalary,
  paidTimeOffIndemnified,
  advanceNoticePaidTimeOff,
  proportionalThirteenthSalary,
  indemnifiedThirteenthSalary
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
  const advanceNoticeResult = advanceNoticeSalary({ grossSalary, startDate, endDate })

  const paidTimeOffResult = paidTimeOffIndemnified({ grossSalary, remainingDaysPaidTimeOff })
  const advanceNoticePaidTimeOffResult = advanceNoticePaidTimeOff({ grossSalary, startDate, endDate })
  const proportionalThirteenthSalaryResult = proportionalThirteenthSalary({
    grossSalary,
    startDate,
    endDate,
    firstInstallment: thirteenthSalaryFirstInstallment,
    irrfDeductions
  })
  const indemnifiedThirteenthSalaryResult = indemnifiedThirteenthSalary({
    grossSalary,
    startDate,
    endDate
  })

  const salaryTotal = sumSalaries([
    salaryRemainerResult,
    advanceNoticeResult,
    paidTimeOffResult,
    advanceNoticePaidTimeOffResult,
    proportionalThirteenthSalaryResult,
    indemnifiedThirteenthSalaryResult
  ])

  const depositedFgts = roundCurrency(currentFgtsBalance + cashedFgts)
  const baseFgts = roundCurrency(depositedFgts + salaryRemainerResult.fgts + proportionalThirteenthSalaryResult.fgts)
  const fgtsPenalty = roundCurrency(baseFgts * 0.4)

  const fgtsTotal = roundCurrency(
    currentFgtsBalance +
    fgtsPenalty +
    salaryRemainerResult.fgts +
    advanceNoticeResult.fgts +
    proportionalThirteenthSalaryResult.fgts +
    indemnifiedThirteenthSalaryResult.fgts
  )

  return {
    salary: {
      remainer: salaryRemainerResult,
      advanceNotice: advanceNoticeResult,
      total: roundCurrency(salaryRemainerResult.netValue + advanceNoticeResult.netValue)
    },
    thirteenthSalary: {
      proportional: proportionalThirteenthSalaryResult,
      indemnified: indemnifiedThirteenthSalaryResult,
      total: roundCurrency(proportionalThirteenthSalaryResult.netValue + indemnifiedThirteenthSalaryResult.netValue)
    },
    paidTimeOff: {
      full: paidTimeOffResult,
      advanceNotice: advanceNoticePaidTimeOffResult,
      total: roundCurrency(paidTimeOffResult.netValue + advanceNoticePaidTimeOffResult.netValue)
    },
    fgts: {
      base: {
        deposited: depositedFgts,
        overSalaryRemainer: salaryRemainerResult.fgts,
        overProportionalThirteenthSalary: proportionalThirteenthSalaryResult.fgts,
        netValue: baseFgts,
        details: {
          deposited: 'Saldo atual + valor sacado',
          overProportionalThirteenthSalary: proportionalThirteenthSalaryResult.details.fgts,
          overSalaryRemainer: salaryRemainerResult.details.fgts
        }
      },
      total: {
        base: baseFgts,
        fourtyPercentPenalty: fgtsPenalty,
        cashedFgts: cashedFgts,
        overAdvanceNoticeSalary: advanceNoticeResult.fgts,
        overIndemnifiedThirteenthSalary: indemnifiedThirteenthSalaryResult.fgts,
        netValue: fgtsTotal,
        details: {
          base: 'Valor base para multa de 40%',
          fourtyPercentPenalty: `40% de ${baseFgts}`,
          cashedFgts: 'Valor já sacado',
          overAdvanceNoticeSalary: `${advanceNoticeResult.details.fgts} (verba indenizatória, não entra no cálculo da multa)`,
          overIndemnifiedThirteenthSalary: `${indemnifiedThirteenthSalaryResult.details.fgts} (verba indenizatória, não entra no cálculo da multa)`
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
