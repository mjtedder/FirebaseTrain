// Initialize Firebase
var config = {
  apiKey: "AIzaSyDy94eHZEDMDNSCAmv75pE-shTDz030gg0",
  authDomain: "trainscheduler-f473a.firebaseapp.com",
  databaseURL: "https://trainscheduler-f473a.firebaseio.com",
  projectId: "trainscheduler-f473a",
  storageBucket: "",
  messagingSenderId: "846106311538"
};

firebase.initializeApp(config);

//Setting datbase variable for Firebase
var database = firebase.database();
//Setting currentTime variable with moment.js
var currentTime = moment();

//Displaying database input on HTML page
database.ref().on("child_added", function(childSnap) {
  var name = childSnap.val().name;
  var destination = childSnap.val().destination;
  var firstTrain = childSnap.val().firstTrain;
  var frequency = childSnap.val().frequency;
  var min = childSnap.val().min;
  var next = childSnap.val().next;

  $("#trainTable > tbody").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + next + "</td><td>" + min + "</td></tr>");
});

database.ref().on("value", function(snapshot) {

});

//Button for adding new trains
$("#addTrain").on("click", function(event) {
  event.preventDefault();

  //Grabs user input from form
  var trainName = $("#trainName").val().trim();
  var destination = $("#destination").val().trim();
  var firstTrain = $("#firstTrain").val().trim();
  var frequency = $("#frequency").val().trim();

  //Ensures each input of the form has a value
  if (trainName == "") {
    alert("Enter a train name!");
    return false;
  }
  if (destination == "") {
    alert("Enter a destination!");
    return false;
  }
  if (firstTrain == "") {
    alert("Enter a first train time!")
    return false;
  }
  if (frequency == "") {
    alert("Enter a frequency!");
    return false;
  }

  //Moment.js MATH
  //Subtracts the first train time back one year to ensure it's before current time.
  var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
  //The time difference between currentTime and firstTrain
  var diffTime = currentTime.diff(moment(firstTimeConverted), "minutes");
  var remainder = diffTime % frequency;
  var minUntilTrain = frequency - remainder;
  var nextTrain = moment().add(minUntilTrain, "minutes").format("hh:mm a");

  //Creating an object to log to Firebase
  var newTrain = {
    name:trainName,
    destination:destination,
    firstTrain:firstTrain,
    frequency:frequency,
    min:minUntilTrain,
    next:nextTrain
  }

  console.log(newTrain);
  database.ref().push(newTrain);

  $("#trainName").val("");
  $("#destination").val("");
  $("#firstTrain").val("");
  $("#frequency").val("");

  return false;

});
