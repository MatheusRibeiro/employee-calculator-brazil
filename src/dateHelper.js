const moment = require('moment')

module.exports = {
  completedYears: function completedYears (startDate, endDate) {
    const startsAt = moment(`${startDate} 00:00`)
    const endsAt = moment(`${endDate} 23:59`)
    return endsAt.diff(startsAt, 'years')
  },
  completedMonthsFromAniversary: function completedMonthsFromAniversary (startDate, endDate) {
    const startsAt = moment(`${startDate} 00:00`)
    const endsAt = moment(`${endDate} 23:59`)
    return endsAt.diff(startsAt, 'months') % 12
  },

  completedMonthsFromYear: function completedMonthsFromYear (referenceDate) {
    const date = moment(referenceDate)
    const month = date.month()
    const day = date.date()

    if (day >= 15) {
      return month + 1
    }
    return month
  },

  completedDaysFromMonth: function completedDaysFromMonth (referenceDate) {
    const date = moment(referenceDate)
    return date.date()
  },

  addDays: function addDays (referenceDate, daysToAdd) {
    return moment(referenceDate)
      .add(daysToAdd, 'days')
      .format('YYYY-MM-DD')
  }
}
