module.exports = {
  INSS: function INSS (salary) {
    if (salary > inssMaxRangeValue) {
      return inssMaxValueToPay
    }

    const initialValuesForReduce = {
      salary,
      accumulatedValue: 0,
      rangeBottomValue: 0,
      calculusMemory: []
    }
    const { accumulatedValue } = inssRanges.reduce(addInssFromRange, initialValuesForReduce)
    return roundCurrency(accumulatedValue)
  },

  detailedINSS: function detailedINSS (salary) {
    if (salary > inssMaxRangeValue) {
      return `para salários acima de ${inssMaxRangeValue}, paga-se o teto de ${inssMaxValueToPay}`
    }
    const initialValuesForReduce = {
      salary,
      accumulatedValue: 0,
      rangeBottomValue: 0,
      calculusMemory: []
    }
    const { accumulatedValue, calculusMemory } = inssRanges.reduce(addInssFromRange, initialValuesForReduce)
    return `${calculusMemory.join(' + ')} = ${roundCurrency(accumulatedValue)}`
  }
}
const inssMaxRangeValue = 6101.06
const inssMaxValueToPay = 713.09
const inssRanges = [
  { maxValue: 1045.00, percentual: 0.075 },
  { maxValue: 2089.60, percentual: 0.09 },
  { maxValue: 3134.40, percentual: 0.12 },
  { maxValue: inssMaxRangeValue, percentual: 0.14 }
]

function addInssFromRange (accumulated, currentRange) {
  const { salary, accumulatedValue, rangeBottomValue, calculusMemory } = accumulated

  const rangeUpperValue = Math.min(salary, currentRange.maxValue)
  const rangeValue = rangeUpperValue - rangeBottomValue
  if (rangeValue <= 0) {
    return accumulated
  }
  const rangeValueToPay = rangeValue * currentRange.percentual
  calculusMemory.push(
    `(${rangeValue.toFixed(2)} x ${(currentRange.percentual * 100).toFixed(1)}%)`
  )

  return {
    salary,
    accumulatedValue: accumulatedValue + rangeValueToPay,
    rangeBottomValue: rangeUpperValue,
    calculusMemory
  }
}

function roundCurrency (currency) {
  return Math.floor((currency + Number.EPSILON) * 100) / 100
}
