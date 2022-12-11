module.exports.getDate = getDate;

function getDate() {

  var today = new Date();

  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };

  return today.toLocaleDateString("en-US", options);


}

module.exports.getDay = getDay;

function getDay() {

  var today = new Date();

  const options = {
    weekday: "long",
  };

  return today.toLocaleDateString("en-US", options);
}
