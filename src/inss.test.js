describe('INSS', function () {
  const { expect } = require('chai')

  const { INSS, detailedINSS } = require('./inss')

  const testValues = [
    {
      salary: 500,
      expectedInss: 37.5,
      expectedCalculusMemory: '(500.00 x 7.5%) = 37.5'
    },
    {
      salary: 1000,
      expectedInss: 75,
      expectedCalculusMemory: '(1000.00 x 7.5%) = 75'
    },
    {
      salary: 2000,
      expectedInss: 164.32,
      expectedCalculusMemory: '(1045.00 x 7.5%) + (955.00 x 9.0%) = 164.32'
    },
    {
      salary: 3000,
      expectedInss: 281.63,
      expectedCalculusMemory: '(1045.00 x 7.5%) + (1044.60 x 9.0%) + (910.40 x 12.0%) = 281.63'
    },
    {
      salary: 4000,
      expectedInss: 418.94,
      expectedCalculusMemory: '(1045.00 x 7.5%) + (1044.60 x 9.0%) + (1044.80 x 12.0%) + (865.60 x 14.0%) = 418.94'
    },
    {
      salary: 5000,
      expectedInss: 558.94,
      expectedCalculusMemory: '(1045.00 x 7.5%) + (1044.60 x 9.0%) + (1044.80 x 12.0%) + (1865.60 x 14.0%) = 558.94'
    },
    {
      salary: 6000,
      expectedInss: 698.94,
      expectedCalculusMemory: '(1045.00 x 7.5%) + (1044.60 x 9.0%) + (1044.80 x 12.0%) + (2865.60 x 14.0%) = 698.94'
    },
    {
      salary: 6101.06,
      expectedInss: 713.09,
      expectedCalculusMemory: '(1045.00 x 7.5%) + (1044.60 x 9.0%) + (1044.80 x 12.0%) + (2966.66 x 14.0%) = 713.09'
    },
    {
      salary: 8000,
      expectedInss: 713.09,
      expectedCalculusMemory: 'para salários acima de 6101.06, paga-se o teto de 713.09'
    },
    {
      salary: 20000,
      expectedInss: 713.09,
      expectedCalculusMemory: 'para salários acima de 6101.06, paga-se o teto de 713.09'
    }
  ]

  testValues.forEach(function ({ salary, expectedInss }) {
    it(`calculates INSS for ${salary} salary`, function () {
      const calculated = INSS(salary)
      expect(calculated).to.equals(expectedInss)
    })
  })

  testValues.forEach(function ({ salary, expectedCalculusMemory }) {
    it(`show the calculus of the INSS for ${salary} salary`, function () {
      const detailed = detailedINSS(salary)
      expect(detailed).to.equals(expectedCalculusMemory)
    })
  })
})
