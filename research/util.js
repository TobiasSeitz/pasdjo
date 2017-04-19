/**
 * Created by Tobi on 19/04/2017.
 */


module.exports = {
  /* snatched from: https://derickbailey.com/2014/09/21/calculating-standard-deviation-with-array-map-and-array-reduce-in-javascript/ */
  sd: function(values) {
    var avg = this.average(values);

    var squareDiffs = values.map(function(value) {
      var diff = value - avg;
      var sqrDiff = diff * diff;
      return sqrDiff;
    });

    var avgSquareDiff = average(squareDiffs);

    var stdDev = Math.sqrt(avgSquareDiff);
    return stdDev;
  },

  average: function(data, fieldName) {
    var sum;

    if (fieldName) {
      sum = data.reduce(function(sum, value) {
        return sum + value[fieldName];
      }, 0);
    } else if (data instanceof Array) {
      sum = data.reduce(function(sum, value) {
        return sum + value;
      }, 0);
    }
    return sum / data.length;
  }
};