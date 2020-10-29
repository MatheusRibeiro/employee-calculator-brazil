const deductionPerDependent = 189.59

const irrfRanges = [
  { maxValue: 1903.98, percentual: 0 },
  { maxValue: 2826.65, percentual: 0.075 },
  { maxValue: 3751.05, percentual: 0.15 },
  { maxValue: 4664.68, percentual: 0.225 },
  { percentual: 0.275 }
]

module.exports = {
  IRRF: function IRRF (baseValue, deductions) {
    const { totalDeductions } = calculateDeductions(deductions)

    const baseValueWithDeductions = baseValue - totalDeductions

    const initialValuesForReduce = {
      baseValue: baseValueWithDeductions,
      accumulatedValue: 0,
      rangeBottomValue: 0,
      calculusMemory: []
    }
    const { accumulatedValue } = irrfRanges.reduce(addIrrfFromRange, initialValuesForReduce)
    return roundCurrency(accumulatedValue)
  },

  detailedIRRF: function detailedIRRF (baseValue, deductions) {
    const { totalDeductions } = calculateDeductions(deductions)

    const baseValueWithDeductions = baseValue - totalDeductions

    const initialValuesForReduce = {
      baseValue: baseValueWithDeductions,
      accumulatedValue: 0,
      rangeBottomValue: 0,
      calculusMemory: []
    }
    const { accumulatedValue, calculusMemory } = irrfRanges.reduce(addIrrfFromRange, initialValuesForReduce)
    return `${calculusMemory.join(' + ')} = ${roundCurrency(accumulatedValue)}`
  }
}

function calculateDeductions (deductions) {
  const {
    numberOfDependents = 0,
    alimony = 0,
    otherDeductions = 0
  } = deductions || {}

  const dependentsDeductions = numberOfDependents * deductionPerDependent

  return {
    totalDeductions: dependentsDeductions + alimony + otherDeductions,
    detailedDeductions: `(${numberOfDependents} dependentes x ${deductionPerDependent}) + ${alimony} pensão + ${otherDeductions} outras deduções`
  }
}

function addIrrfFromRange (accumulated, currentRange) {
  const { baseValue, accumulatedValue, rangeBottomValue, calculusMemory } = accumulated

  const rangeUpperValue = currentRange.maxValue ? Math.min(baseValue, currentRange.maxValue) : baseValue

  const rangeValue = rangeUpperValue - rangeBottomValue
  if (rangeValue <= 0) {
    return accumulated
  }
  const rangeValueToPay = rangeValue * currentRange.percentual
  calculusMemory.push(
    `(${rangeValue.toFixed(2)} x ${(currentRange.percentual * 100).toFixed(1)}%)`
  )

  return {
    baseValue,
    accumulatedValue: accumulatedValue + rangeValueToPay,
    rangeBottomValue: rangeUpperValue,
    calculusMemory
  }
}

function roundCurrency (currency) {
  return Math.floor((currency + Number.EPSILON) * 100) / 100
}
