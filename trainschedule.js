"use script";


$(document).ready(function () {

    var config = {
        apiKey: "AIzaSyCX57lggx2Xn_aBktC_-rAXXbMyR7YPIY0",
        authDomain: "train-scheduler-66fe4.firebaseapp.com",
        databaseURL: "https://train-scheduler-66fe4.firebaseio.com",
        projectId: "train-scheduler-66fe4",
        storageBucket: "",
        messagingSenderId: "832703898885"
    };

    firebase.initializeApp(config);

    var database = firebase.database();

    $("#trainInfoBtn").on("click", function (event) {
        event.preventDefault();


        var trainName = $("#name").val().trim();
        var destination = $("#dest").val().trim();
        var firstTime = moment($("#firstTime").val().trim(), "hh:mm").subtract(1, "years").format("X");
        var frequency = $("#freq").val().trim();
        var currentTime = moment();

        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        var newTrain = {
            train: trainName,
            trainGoing: destination,
            trainComing: firstTime,
            everyXMin: frequency
        };

        database.ref().push(newTrain);

        $("#name").val("");
        $("#dest").val("");
        $("#firstTime").val("");
        $("#freq").val("");

    });
    database.ref().on("child_added", function (childSnapshot, prevChildKey) {

        console.log(childSnapshot.val());

        var trainName = childSnapshot.val().train;
        var destination = childSnapshot.val().trainGoing;
        var firstTime = childSnapshot.val().trainComing;
        var frequency = childSnapshot.val().everyXMin;
        var trainTime = moment.unix(firstTime).format("hh:mm");
        var difference = moment().diff(moment(trainTime), "minutes");
        var trainRemain = difference % frequency;
        var minUntil = frequency - trainRemain;
        var nextArrival = moment().add(minUntil, "minutes").format('hh:mm');

        $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minUntil + "</td></tr>");

    });
});
