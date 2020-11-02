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

  const indemnifiedThirteenthSalaryResult = indemnifiedThirteenthSalary({
    grossSalary,
    startDate,
    endDate
  })
  const proportionalThirteenthSalaryResult = proportionalThirteenthSalary({
    grossSalary,
    startDate,
    endDate,
    firstInstallment: thirteenthSalaryFirstInstallment,
    irrfDeductions
  })

  const baseFgts = currentFgtsBalance + cashedFgts
  const fgtsPenalty = baseFgts * 0.4
  const finalFgtsBalance = roundCurrency(
    currentFgtsBalance +
    fgtsPenalty +
    salaryRemainerResult.fgts +
    advanceNoticeResult.fgts
  )

  const salaryResults = [
    salaryRemainerResult,
    advanceNoticeResult,
    paidTimeOffResult,
    advanceNoticePaidTimeOffResult,
    proportionalThirteenthSalaryResult,
    indemnifiedThirteenthSalaryResult
  ]
  const totalSalary = roundCurrency(salaryResults.reduce(sumNetValues, 0))

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
      total: finalFgtsBalance,
      details: {
        base: baseFgts,
        fourtyPercentPenalty: fgtsPenalty,
        cashedFgts: cashedFgts,
        overSalaryRemainer: salaryRemainerResult.fgts,
        overAdvanceNoticeSalary: advanceNoticeResult.fgts
      }
    },
    total: {
      salary: totalSalary,
      fgts: finalFgtsBalance,
      netValue: roundCurrency(totalSalary + finalFgtsBalance)
    }
  }
}

module.exports = terminationOfEmploymentCalculus
