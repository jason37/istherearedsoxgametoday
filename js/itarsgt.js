function isDateLaterThan(a, b) {
  return a > b;  
}

/* from https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date */
function ISODateString(d){
    function pad(n){return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
        + pad(d.getUTCMonth()+1)+'-'
        + pad(d.getUTCDate());
}

$(document).ready(function(){
    var url='/data/redsox2016schedule.json';

    var today = new Date();
    var nextGame = null;
    var todaysGame = null;

    // Format date as MM/DD/YY
    var curr_date = today.getDate();
    var curr_month = today.getMonth();
    curr_month++;
    var curr_year = today.getFullYear();
    var dateString = curr_month + "/" + curr_date + "/" + curr_year;

    $("#datecheck").html("Asked on " + dateString);

    // Check for game today
    $.getJSON(url,function(json){
        var nextGameDate;

        $.each(json.games,function(i,game){
            nextGameDate = new Date(game.date);

          // Uncomment for debugging
          //console.log("Today: " + today + " - Looking at next game: " + nextGameDate);          
          
          if (nextGame === null && isDateLaterThan(nextGameDate, today)) {
            nextGame = game;            
          }
          if(today.getYear() == nextGameDate.getYear()
              && today.getMonth() == nextGameDate.getMonth()
              && today.getDate() == nextGameDate.getDate()) {
            todaysGame = game;
          }
        });

        if (todaysGame) {
            $(".fill-in").text("YES");
            $("#game .summary").text(todaysGame.opponent);
            $("#game .location").text(todaysGame.location);
            $("#game .tstart").text(todaysGame.time);

            $("#game abbr").attr('title', ISODateString(nextGameDate));
            if (todaysGame.location == "Fenway Park") {
                $("body").addClass("home");
                $("#yesno .homeaway").text("At home");
             }
             else {
                $("body").addClass("away");
                $("#yesno .homeaway").text("Away");
                $("#yesno").css("border-color", "#000");
             }
            $("#game").show();
        } else if (nextGame !== null) {
          var nextGameDate = new Date(nextGame.date);
          $(".fill-in").text("NO");
          $("#game .date").text(nextGame.date);
          $("#game .summary").html("Next game " + (nextGameDate.getMonth()+1) + "/" + nextGameDate.getDate() +"/" + nextGameDate.getFullYear() + "<br>" + nextGame.opponent);
          $("#game .location").text(nextGame.location);

          // Formate next game date as day of the week
          var weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
          var nextGameDay = weekday[nextGameDate.getDay()];
          $("#game .day").text("on " + nextGameDay);
          $("#game .tstart").text(nextGame.time);
          $("#game").show();
        }


    }).fail( function(d, textStatus, error) {
        console.error("getJSON failed, status: " + textStatus + ", error: "+error);
    });

});
