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
  paidTimeOffIndemnified,
  advanceNoticePaidTimeOff,
  thirteenthSalary
} = require('./src/partialPayments')

const terminationOfEmploymentCalculus = require('./src/terminationOfEmploymentCalculus')

module.exports = {
  terminationOfEmploymentCalculus,
  salaryRemainer,
  advanceNoticeSalary,
  paidTimeOffIndemnified,
  advanceNoticePaidTimeOff,
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
