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

function thirteenthSalary ({ grossSalary, startDate, endDate, firstInstallment, irrfDeductions }) {
  const days = advanceNoticeDays({ startDate, endDate })
  const endDateWithAdvanceNotice = addDays(endDate, days)

  const monthsProportional = completedMonthsFromYear(endDate)
  const combinedMonths = completedMonthsFromYear(endDateWithAdvanceNotice)

  // getting indemnified months by diff and adjusting it for cases when combinedMonths is lower than monthsProportional
  const monthsIndemnified = ((combinedMonths - monthsProportional) + monthsInYear) % monthsInYear

  const grossValueProportional = roundCurrency(grossSalary * monthsProportional / monthsInYear)
  const grossValueIndemnified = roundCurrency(grossSalary * monthsIndemnified / monthsInYear)
  const grossValue = roundCurrency(grossValueProportional + grossValueIndemnified)

  // the fgts is divided because just the proportional applies 40% penalty
  const fgtsProportional = roundCurrency(grossValueProportional * fgtsRate)
  const fgtsIndemnified = roundCurrency(grossValueIndemnified * fgtsRate)

  const inss = INSS(grossValue)
  const irrf = IRRF(grossValue - inss, irrfDeductions)

  const netValue = roundCurrency(grossValue - inss - irrf - firstInstallment)

  return {
    proportional: grossValueProportional,
    indemnified: grossValueIndemnified,
    grossValue,
    firstInstallment,
    fgtsProportional,
    fgtsIndemnified,
    inss,
    irrf,
    netValue,
    details: {
      proportional: `13º proporcional para ${monthsProportional} meses`,
      indemnified: `13º indenizado para ${monthsIndemnified} meses`,
      grossValue: `R$ ${grossValueProportional} + R$ ${grossValueIndemnified}`,
      firstInstallment: 'Valor líquido do 13º adiantado',
      fgtsProportional: fgtsDescription(grossValueProportional),
      fgtsIndemnified: fgtsDescription(grossValueIndemnified),
      inss: detailedINSS(grossValue),
      irrf: detailedIRRF(grossValue - inss, irrfDeductions)
    }
  }
}

function fullPaidTimeOff ({ grossSalary, remainingDaysPaidTimeOff, irrfDeductions }) {
  // TODO: include skip days to discount on remainingDaysPaidTimeOff
  const baseValue = grossSalary * remainingDaysPaidTimeOff / daysInMonth
  const baseWithThird = grossPaidTimeOffSalary({
    grossSalary: baseValue
  })
  const third = roundCurrency(baseWithThird - baseValue)
  return {
    baseValue,
    grossValue: baseWithThird,
    third
  }
}

function indemnifiedPaidTimeOff ({ grossSalary, startDate, endDate }) {
  const daysToAdd = advanceNoticeDays({ startDate, endDate })
  const endDateWithAdvanceNotice = addDays(endDate, daysToAdd)
  const months = completedMonthsFromAniversary(startDate, endDateWithAdvanceNotice)

  const baseValue = grossSalary * months / monthsInYear
  const baseWithThird = grossPaidTimeOffSalary({
    grossSalary: baseValue
  })
  const third = roundCurrency(baseWithThird - baseValue)

  const startDateAniversaryBrFormat = `${moment(startDate).format('DD/MM')}/${moment(endDate).format('YYYY')}`
  const endDateWithAdvanceNoticeBrFormat = moment(endDateWithAdvanceNotice).format('DD/MM/YYYY')

  return {
    baseValue,
    grossValue: baseWithThird,
    third,
    months,
    interval: `${startDateAniversaryBrFormat} até ${endDateWithAdvanceNoticeBrFormat}`
  }
}

function paidTimeOff ({ grossSalary, startDate, endDate, remainingDaysPaidTimeOff, irrfDeductions }) {
  const full = fullPaidTimeOff({ grossSalary, remainingDaysPaidTimeOff, irrfDeductions })
  const indemnified = indemnifiedPaidTimeOff({ grossSalary, startDate, endDate })

  const baseValue = roundCurrency(full.baseValue + indemnified.baseValue)
  const third = roundCurrency(full.third + indemnified.third)
  const grossValue = roundCurrency(full.grossValue + indemnified.grossValue)
  const inss = INSS(grossValue)
  const irrf = IRRF(grossValue - inss, irrfDeductions)
  const netValue = roundCurrency(grossValue - inss - irrf)

  return {
    baseValue,
    third,
    grossValue,
    inss,
    irrf,
    netValue,
    details: {
      baseValue: `R$ ${full.baseValue} (${remainingDaysPaidTimeOff} dias de férias vencidas) + R$ ${indemnified.baseValue} (${indemnified.months} meses completos, referente à ${indemnified.interval})`,
      third: `R$ ${full.baseValue} * 1/3 (${remainingDaysPaidTimeOff} dias de férias vencidas) + R$ ${indemnified.baseValue} * 1/3 (${indemnified.months} meses completos, referente à ${indemnified.interval})`,
      grossValue: `R$ ${full.grossValue} (${remainingDaysPaidTimeOff} dias de férias vencidas) + R$ ${indemnified.grossValue} (${indemnified.months} meses completos, referente à ${indemnified.interval})`,
      inss: detailedINSS(grossValue),
      irrf: detailedIRRF(grossValue - inss, irrfDeductions)
    }
  }
}

function advanceNoticeDays ({ startDate, endDate }) {
  const extraDayPerCompletedYear = 3
  return Math.min(daysInMonth + extraDayPerCompletedYear * completedYears(startDate, endDate), maxAdvanceNoticeDays)
}

function grossPaidTimeOffSalary ({ grossSalary }) {
  return roundCurrency(grossSalary + grossSalary / 3)
}

module.exports = {
  salaryRemainer,
  advanceNoticeSalary,
  thirteenthSalary,
  paidTimeOff
}
