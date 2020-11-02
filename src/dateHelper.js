const moment = require('moment')

function completedYears (startDate, endDate) {
  const startsAt = moment(`${startDate} 00:00`)
  const endsAt = moment(`${endDate} 23:59`)
  return endsAt.diff(startsAt, 'years')
}

function completedMonthsFromAniversary (startDate, endDate) {
  const startsAt = moment(`${startDate} 00:00`)
  const endsAt = moment(`${endDate} 23:59`)
  return endsAt.diff(startsAt, 'months') % 12
}

function completedMonthsFromYear (referenceDate) {
  const date = moment(referenceDate)
  const month = date.month()
  const day = date.date()

  if (day >= 15) {
    return month + 1
  }
  return month
}

function completedDaysFromMonth (referenceDate) {
  const date = moment(referenceDate)
  return date.date()
}

function addDays (referenceDate, daysToAdd) {
  return moment(referenceDate)
    .add(daysToAdd, 'days')
    .format('YYYY-MM-DD')
}

module.exports = {
  completedYears,
  completedMonthsFromAniversary,
  completedMonthsFromYear,
  completedDaysFromMonth,
  addDays
}
