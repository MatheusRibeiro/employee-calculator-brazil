const { INSS } = require('./inss')
const { IRRF } = require('./irrf')
const { roundCurrency } = require('./currencyHelper')

const {
  addDays,
  completedYears,
  completedDaysFromMonth
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

function advanceNoticeDays ({ startDate, endDate }) {
  return 30 + 3 * completedYears(startDate, endDate)
}

module.exports = {
  salaryRemainer,
  advanceNoticeSalary
}
