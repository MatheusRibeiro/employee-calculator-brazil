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

const {
  salaryRemainer,
  advanceNoticeSalary,
  paidTimeOffIndemnified,
  advanceNoticePaidTimeOff,
  proportionalThirteenthSalary,
  indemnifiedThirteenthSalary
} = require('./partialPayments')

const terminationOfEmploymentCalculus = require('./terminationOfEmploymentCalculus')

module.exports = {
  terminationOfEmploymentCalculus,
  salaryRemainer,
  advanceNoticeSalary,
  paidTimeOffIndemnified,
  advanceNoticePaidTimeOff,
  proportionalThirteenthSalary,
  indemnifiedThirteenthSalary,
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
