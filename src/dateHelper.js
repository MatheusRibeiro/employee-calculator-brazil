const moment = require('moment')

module.exports = {
  completedYears: function completedYears (startDate, endDate) {
    const startsAt = moment(`${startDate} 00:00`)
    const endsAt = moment(`${endDate} 23:59`)
    return endsAt.diff(startsAt, 'years')
  }
}
