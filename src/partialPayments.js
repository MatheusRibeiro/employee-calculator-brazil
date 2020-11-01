const { INSS, detailedINSS } = require('./inss')
const { IRRF, detailedIRRF } = require('./irrf')
const { roundCurrency } = require('./currencyHelper')

const {
  addDays,
  completedYears,
  completedDaysFromMonth,
  completedMonthsFromYear,
  completedMonthsFromAniversary
} = require('./dateHelper')

function fgtsDescription (grossValue) {
  return `8% sobre ${grossValue}`
}

function porportinalSalaryDescription (days) {
  return `Salário proporcional para ${days} dias`
}

function porportinalThirteenthSalaryDescription (months) {
  return `13º proporcional para ${months} meses`
}

function porportinalPaidTimeOffDescription (days) {
  return `Férias proporcionais para ${days} dias`
}

function salaryRemainer ({ grossSalary, endDate, irrfDeductions }) {
  const days = completedDaysFromMonth(endDate)

  const grossValue = roundCurrency(grossSalary * days / 30)
  const fgts = roundCurrency(grossValue * 0.08)
  const inss = INSS(grossValue)
  const irrf = IRRF(grossValue - inss, irrfDeductions)
  const netValue = grossValue - inss - irrf

  return {
    grossValue,
    fgts,
    inss,
    irrf,
    netValue,
    details: {
      grossValue: porportinalSalaryDescription(days),
      fgts: fgtsDescription(grossValue),
      inss: detailedINSS(grossValue),
      irrf: detailedIRRF(grossValue - inss, irrfDeductions)
    }
  }
}

function advanceNoticeSalary ({ grossSalary, startDate, endDate }) {
  const days = advanceNoticeDays({ startDate, endDate })

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
      grossValue: porportinalSalaryDescription(days),
      fgts: fgtsDescription(grossValue),
      inss: detailedINSS(grossValue),
      irrf: 'Não há IRRF para aviso prévio'
    }
  }
}

function proportionalThirteenthSalary ({ grossSalary, startDate, endDate, firstInstallment, irrfDeductions }) {
  const completedMonths = completedMonthsFromYear(endDate)

  const grossValue = roundCurrency(grossSalary * completedMonths / 12)
  const inss = INSS(grossValue)
  const irrf = IRRF(grossValue - inss, irrfDeductions)
  const netValue = roundCurrency(grossValue - inss - irrf - firstInstallment)

  return {
    grossValue,
    firstInstallment,
    inss,
    irrf,
    netValue,
    details: {
      grossValue: porportinalThirteenthSalaryDescription(completedMonths),
      firstInstallment: 'Valor líquido do 13º adiantado',
      inss: detailedINSS(grossValue),
      irrf: detailedIRRF(grossValue - inss, irrfDeductions)
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
      grossValue: porportinalThirteenthSalaryDescription(completedMonths),
      inss: 'Não há incidência de INSS para décimo terceiro indenizado',
      irrf: 'Não há IRRF para décimo terceiro indenizado'
    }
  }
}

function paidTimeOffIndemnified ({ grossSalary, remainingDaysPaidTimeOff }) {
  const proportionalGrossSalary = grossSalary * (remainingDaysPaidTimeOff / 30)
  const grossTimeOff = grossPaidTimeOffSalary({
    grossSalary: proportionalGrossSalary
  })

  const grossValue = roundCurrency(grossTimeOff)
  const inss = 0
  const irrf = 0
  const netValue = grossValue - inss - irrf

  return {
    grossValue,
    inss,
    irrf,
    netValue,
    details: {
      grossValue: porportinalPaidTimeOffDescription(remainingDaysPaidTimeOff),
      inss: 'Não há incidência de INSS para férias indenizadas',
      irrf: 'Não há IRRF para férias indenizadas'
    }
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
      grossValue: porportinalPaidTimeOffDescription(days),
      inss: 'Não há incidência de INSS para férias indenizadas',
      irrf: 'Não há IRRF para férias indenizadas'
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
