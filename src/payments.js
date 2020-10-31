const { INSS } = require('./inss')
const { IRRF } = require('./irrf')
const { roundCurrency } = require('./currencyHelper')

const {
  addDays,
  completedYears,
  completedDaysFromMonth,
  completedMonthsFromYear,
  completedMonthsFromAniversary
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

function proportionalThirteenthSalary ({ grossSalary, startDate, endDate, firstInstallment }) {
  const completedMonths = completedMonthsFromYear(endDate)

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
      endDate,
      completedMonths
    }
  }
}

function indemnifiedThirteenthSalary ({ grossSalary, startDate, endDate }) {
  const days = advanceNoticeDays({ startDate, endDate })
  const endDateWithAdvanceNotice = addDays(endDate, days)
  const completedMonths = completedMonthsFromYear(endDateWithAdvanceNotice) - completedMonthsFromYear(endDate)

  const grossValue = roundCurrency(grossSalary * completedMonths / 12)
  const inss = 0
  const irrf = 0
  const netValue = roundCurrency(grossValue - inss - irrf)

  return {
    grossValue,
    inss,
    irrf,
    netValue,
    details: {
      startDate,
      endDate,
      endDateWithAdvanceNotice,
      completedMonths
    }
  }
}

function paidTimeOffIndemnified ({ grossSalary, hasTimeOff }) {
  const grossTimeOff = grossPaidTimeOffSalary({ grossSalary })

  const grossValue = hasTimeOff ? roundCurrency(grossTimeOff) : 0
  const inss = 0
  const irrf = 0
  const netValue = grossValue - inss - irrf

  return {
    grossValue,
    inss,
    irrf,
    netValue
  }
}

function advanceNoticePaidTimeOff ({ grossSalary, startDate, endDate }) {
  const grossTimeOff = grossPaidTimeOffSalary({ grossSalary })

  const days = advanceNoticeDays({ startDate, endDate })
  const endDateWithAdvanceNotice = addDays(endDate, days)
  const completedMonths = completedMonthsFromAniversary(startDate, endDateWithAdvanceNotice)

  const grossValue = roundCurrency(grossTimeOff * completedMonths / 12)
  const inss = 0
  const irrf = 0
  const netValue = grossValue - inss - irrf

  return {
    grossValue,
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

function grossPaidTimeOffSalary ({ grossSalary }) {
  return grossSalary + grossSalary / 3
}

module.exports = {
  salaryRemainer,
  advanceNoticeSalary,
  proportionalThirteenthSalary,
  indemnifiedThirteenthSalary,
  paidTimeOffIndemnified,
  advanceNoticePaidTimeOff
}
