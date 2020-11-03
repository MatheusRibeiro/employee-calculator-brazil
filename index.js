const { INSS, detailedINSS } = require('./src/inss')
const { IRRF, detailedIRRF } = require('./src/irrf')
const { roundCurrency } = require('./src/currencyHelper')

const {
  addDays,
  completedYears,
  completedDaysFromMonth,
  completedMonthsFromYear,
  completedMonthsFromAniversary
} = require('./src/dateHelper')

const {
  salaryRemainer,
  advanceNoticeSalary,
  paidTimeOff,
  thirteenthSalary
} = require('./src/partialPayments')

const terminationOfEmploymentCalculus = require('./src/terminationOfEmploymentCalculus')

module.exports = {
  terminationOfEmploymentCalculus,
  salaryRemainer,
  advanceNoticeSalary,
  paidTimeOff,
  thirteenthSalary,
  INSS,
  detailedINSS,
  IRRF,
  detailedIRRF,
  addDays,
  completedYears,
  completedDaysFromMonth,
  completedMonthsFromYear,
  completedMonthsFromAniversary,
  roundCurrency
}
