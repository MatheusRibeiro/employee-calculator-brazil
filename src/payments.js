const { INSS } = require('./inss')
const { IRRF } = require('./irrf')
const { roundCurrency } = require('./currencyHelper')

const {
  addDays,
  completedYears,
  completedDaysFromMonth,
  completedMonthsFromYear
} = require('./dateHelper')

function salaryRemainer ({ grossSalary, endDate }) {
  const daysForSalaryRemainer = completedDaysFromMonth(endDate)

  const grossValue = roundCurrency(grossSalary * daysForSalaryRemainer / 30)
  const fgts = roundCurrency(grossValue * 0.08)
  const inss = INSS(grossValue)
  const irrf = IRRF(grossValue - inss)
  const netValue = grossValue - inss - irrf

  return {
    grossValue,
    fgts,
    inss,
    irrf,
    netValue,
    details: {
      days: daysForSalaryRemainer
    }
  }
}

function advanceNoticeSalary ({ grossSalary, startDate, endDate }) {
  const days = advanceNoticeDays({ startDate, endDate })
  const endDateWithAdvanceNotice = addDays(endDate, days)

  const grossValue = roundCurrency(grossSalary * days / 30)
  const fgts = roundCurrency(grossValue * 0.08)
  const inss = INSS(grossValue)
  const irrf = 0
  const netValue = grossValue - inss - irrf

  return {
    grossValue,
    fgts,
    inss,
    irrf,
    netValue,
    details: {
      advanceNoticeDays: days,
      endDateWithAdvanceNotice
    }
  }
}

function advanceNoticeThirteenthSalary ({ grossSalary, startDate, endDate, firstInstallment }) {
  const days = advanceNoticeDays({ startDate, endDate })
  const endDateWithAdvanceNotice = addDays(endDate, days)
  const completedMonths = completedMonthsFromYear(endDateWithAdvanceNotice)

  const grossValue = roundCurrency(grossSalary * completedMonths / 12)
  const inss = INSS(grossValue)
  const irrf = IRRF(grossValue - inss)
  const netValue = roundCurrency(grossValue - inss - irrf - firstInstallment)

  return {
    grossValue,
    firstInstallment,
    inss,
    irrf,
    netValue,
    details: {
      startDate,
      endDateWithAdvanceNotice,
      completedMonths
    }
  }
}

function advanceNoticeDays ({ startDate, endDate }) {
  return 30 + 3 * completedYears(startDate, endDate)
}

module.exports = {
  salaryRemainer,
  advanceNoticeSalary,
  advanceNoticeThirteenthSalary
}
