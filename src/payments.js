const { INSS } = require('./inss')
const { IRRF } = require('./irrf')
const { roundCurrency } = require('./currencyHelper')

const { completedDaysFromMonth } = require('./dateHelper')

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

module.exports = {
  salaryRemainer
}
