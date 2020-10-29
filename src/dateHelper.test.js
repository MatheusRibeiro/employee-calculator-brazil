describe('Date Helper', function () {
  const { expect } = require('chai')

  const { completedYears } = require('./dateHelper')

  const testValues = [
    {
      startDate: '2013-09-13',
      endDate: '2020-11-04',
      expectedCompletedYears: 7
    },
    {
      startDate: '2019-11-04',
      endDate: '2020-11-04',
      expectedCompletedYears: 1
    },
    {
      startDate: '2019-11-05',
      endDate: '2020-11-04',
      expectedCompletedYears: 0
    }
  ]

  testValues.forEach(function ({ startDate, endDate, expectedCompletedYears }) {
    it(`calculates the number of years completed between ${startDate} and ${endDate}`, function () {
      const years = completedYears(startDate, endDate)
      expect(years).to.equals(expectedCompletedYears)
    })
  })
})