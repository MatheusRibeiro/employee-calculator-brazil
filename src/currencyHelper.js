module.exports = {
  roundCurrency: function roundCurrency (currency) {
    return Math.floor((currency + Number.EPSILON) * 100) / 100
  }
}
