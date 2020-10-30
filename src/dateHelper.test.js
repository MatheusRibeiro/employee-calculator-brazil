describe('Date Helper', function () {
  const { expect } = require('chai')

  const {
    completedYears,
    completedMonthsFromYear,
    completedDaysFromMonth,
    completedMonthsFromAniversary
  } = require('./dateHelper')

  const dateDiffsInputs = [
    {
      startDate: '2013-09-13',
      endDate: '2020-11-04',
      expectedCompletedYears: 7,
      expectedMonthsAfterAniversary: 1
    },
    {
      startDate: '2019-11-05',
      endDate: '2020-11-04',
      expectedCompletedYears: 0,
      expectedMonthsAfterAniversary: 11
    },
    {
      startDate: '2019-11-05',
      endDate: '2020-11-05',
      expectedCompletedYears: 1,
      expectedMonthsAfterAniversary: 0
    },
    {
      startDate: '2018-10-05',
      endDate: '2020-01-04',
      expectedCompletedYears: 1,
      expectedMonthsAfterAniversary: 2
    }
  ]

  dateDiffsInputs.forEach(function ({ startDate, endDate, expectedCompletedYears }) {
    it(`calculates the number of years completed between ${startDate} and ${endDate}`, function () {
      const years = completedYears(startDate, endDate)
      expect(years).to.equals(expectedCompletedYears)
    })
  })

  dateDiffsInputs.forEach(function ({ startDate, endDate, expectedMonthsAfterAniversary }) {
    it(`calculates the number of months completed after aniversary between ${startDate} and ${endDate}`, function () {
      const years = completedMonthsFromAniversary(startDate, endDate)
      expect(years).to.equals(expectedMonthsAfterAniversary)
    })
  })

  const currentYearDiffs = [
    {
      referenceDate: '2010-01-07',
      expectedDaysOnMonth: 7,
      expectedMonthsInYear: 0
    },
    {
      referenceDate: '2020-11-04',
      expectedDaysOnMonth: 4,
      expectedMonthsInYear: 10
    },
    {
      referenceDate: '2020-09-23',
      expectedDaysOnMonth: 23,
      expectedMonthsInYear: 9
    }
  ]

  currentYearDiffs.forEach(function ({ referenceDate, expectedMonthsInYear }) {
    it(`calculates the number of months from year start for ${referenceDate}`, function () {
      const months = completedMonthsFromYear(referenceDate)
      expect(months).to.equals(expectedMonthsInYear)
    })
  })

  currentYearDiffs.forEach(function ({ referenceDate, expectedDaysOnMonth }) {
    it(`calculates the number of days from month start for ${referenceDate}`, function () {
      const days = completedDaysFromMonth(referenceDate)
      expect(days).to.equals(expectedDaysOnMonth)
    })
  })
})
