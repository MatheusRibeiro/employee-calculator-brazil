const moment = require('moment')
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

const daysInMonth = 30
const monthsInYear = 12
const fgtsRate = 0.08
const maxAdvanceNoticeDays = 90

function fgtsDescription (grossValue) {
  return `${fgtsRate * 100}% sobre ${grossValue}`
}

function porportinalSalaryDescription (days) {
  return `Salário proporcional para ${days} dias`
}

function porportinalThirteenthSalaryDescription (months) {
  return `13º proporcional para ${months} meses`
}

function salaryRemainer ({ grossSalary, endDate, irrfDeductions }) {
  const days = completedDaysFromMonth(endDate)

  const grossValue = roundCurrency(grossSalary * days / daysInMonth)
  const fgts = roundCurrency(grossValue * fgtsRate)
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

  const grossValue = roundCurrency(grossSalary * days / daysInMonth)
  const fgts = roundCurrency(grossValue * fgtsRate)
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

  const grossValue = roundCurrency(grossSalary * completedMonths / monthsInYear)
  const fgts = roundCurrency(grossValue * fgtsRate)
  const inss = INSS(grossValue)
  const irrf = IRRF(grossValue - inss, irrfDeductions)
  const netValue = roundCurrency(grossValue - inss - irrf - firstInstallment)

  return {
    grossValue,
    firstInstallment,
    fgts,
    inss,
    irrf,
    netValue,
    details: {
      grossValue: porportinalThirteenthSalaryDescription(completedMonths),
      firstInstallment: 'Valor líquido do 13º adiantado',
      fgts: fgtsDescription(grossValue),
      inss: detailedINSS(grossValue),
      irrf: detailedIRRF(grossValue - inss, irrfDeductions)
    }
  }
}

function indemnifiedThirteenthSalary ({ grossSalary, startDate, endDate }) {
  const days = advanceNoticeDays({ startDate, endDate })
  const endDateWithAdvanceNotice = addDays(endDate, days)

  // as there is a chance that the projected advance notice date ends next year,
  // we fix it by add 12 and get the remainer of the division by 12
  // ex1: 31/01/2019 - 31/05/2020 => ((5 month - 1 month ) + 12) % 12 = (4 + 12) % 12 = 4
  // ex2: 31/11/2019 - 31/01/2020 => ((1 month - 11 month ) + 12) % 12 = (-10 + 12) % 12 = 2
  const monthsDiff = completedMonthsFromYear(endDateWithAdvanceNotice) - completedMonthsFromYear(endDate)
  const completedMonths = (monthsDiff + monthsInYear) % monthsInYear

  const grossValue = roundCurrency(grossSalary * completedMonths / monthsInYear)
  const fgts = roundCurrency(grossValue * fgtsRate)
  const inss = 0
  const irrf = 0
  const netValue = roundCurrency(grossValue - inss - irrf)

  return {
    grossValue,
    fgts,
    inss,
    irrf,
    netValue,
    details: {
      grossValue: porportinalThirteenthSalaryDescription(completedMonths),
      fgts: fgtsDescription(grossValue),
      inss: 'Não há incidência de INSS para décimo terceiro indenizado',
      irrf: 'Não há IRRF para décimo terceiro indenizado'
    }
  }
}

function paidTimeOffIndemnified ({ grossSalary, remainingDaysPaidTimeOff }) {
  // TODO: include skip days to discount on remainingDaysPaidTimeOff
  const proportionalGrossSalary = grossSalary * remainingDaysPaidTimeOff / daysInMonth
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
      grossValue: `Férias vencidas com ${remainingDaysPaidTimeOff} dias não utilizados`,
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

  const grossValue = roundCurrency(grossTimeOff * completedMonths / monthsInYear)
  const inss = 0
  const irrf = 0
  const netValue = grossValue - inss - irrf

  const lastAniversaryBrFormat = `${moment(startDate).format('DD/MM')}/${moment(endDate).format('YYYY')}`
  const endDateWithAdvanceNoticeBrFormat = moment(endDateWithAdvanceNotice).format('DD/MM/YYYY')

  return {
    grossValue,
    inss,
    irrf,
    netValue,
    details: {
      grossValue: `Férias proporcionais do ano aquisitivo vigente, referente ao período de ${lastAniversaryBrFormat} até ${endDateWithAdvanceNoticeBrFormat} (após acréscimo de ${days} dias do aviso prévio) totalizando ${completedMonths} meses`,
      inss: 'Não há incidência de INSS para férias indenizadas',
      irrf: 'Não há IRRF para férias indenizadas'
    }
  }
}

function advanceNoticeDays ({ startDate, endDate }) {
  const extraDayPerCompletedYear = 3
  return Math.min(daysInMonth + extraDayPerCompletedYear * completedYears(startDate, endDate), maxAdvanceNoticeDays)
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
