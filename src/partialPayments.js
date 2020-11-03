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
    grossValue,
    firstInstallment,
    fgtsProportional,
    fgtsIndemnified,
    inss,
    irrf,
    netValue,
    details: {
      grossValue: `R$ ${grossValueProportional} (proporcional para ${monthsProportional} meses) + R$ ${grossValueIndemnified} (indenizado para ${monthsIndemnified} meses)`,
      firstInstallment: 'Valor líquido do 13º adiantado',
      fgtsProportional: fgtsDescription(grossValueProportional),
      fgtsIndemnified: fgtsDescription(grossValueIndemnified),
      inss: detailedINSS(grossValue),
      irrf: detailedIRRF(grossValue - inss, irrfDeductions)
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
      grossValue: `Férias proporcionais referente ao período de ${lastAniversaryBrFormat} até ${endDateWithAdvanceNoticeBrFormat} (após acréscimo de ${days} dias do aviso prévio) totalizando ${completedMonths} meses`,
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
  thirteenthSalary,
  paidTimeOffIndemnified,
  advanceNoticePaidTimeOff
}
