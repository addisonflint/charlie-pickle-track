$(document).ready(function() {
    console.log("App is loaded");

    // When the sign-in form is submitted
    $("#signInForm").submit(function(e) {
        e.preventDefault(); // Stop page reload
        
        var user = $("#usernameInput").val();
        console.log("Sign in form submitted by: " + user);
        
        $("#signInForm").html("Sign in successful!");
    });

    // When the match log form is submitted
    $("#matchLogForm").submit(function(e) {
        e.preventDefault(); // Stop page reload
        
        var opponent = $("#opponentName").val();
        var myScore = $("#yourScore").val();
        var oppScore = $("#opponentScore").val();
        
        // Basic math calculation
        var difference = myScore - oppScore;
        
        console.log("Opponent: " + opponent);
        console.log("Score difference: " + difference);
        
        $("#matchLogForm").html("Match data saved!");
    });
});
