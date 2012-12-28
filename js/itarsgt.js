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
    var today = new Date();
    var nextGame = null;
    var todaysGame = null;

    // Format date as MM/DD/YY
    var curr_date = today.getDate();
    var curr_month = today.getMonth();
    curr_month++;
    var curr_year = today.getFullYear();
    var dateString = curr_month + "/" + curr_date + "/" + curr_year;

    // Create datepicker
    // $("#datecheck").html('Checking <input id="datepicker" type="text">');
    // $( "#datepicker" ).datepicker();

    // $(".datepicker").datepicker.("setDate", dateString);


	//var url = '/data/redsox' + curr_year + 'schedule.json';
	var url = '/data/redsox2013schedule.json';
	
    // Check for game today
    $.getJSON(url,function(json){
	
        var nextGameDate;

        $.each(json.games,function(i,game){
            nextGameDate = new Date(game.date);

            // Uncomment for debugging 
			console.log("Today: " + today + " - Looking at game: " + nextGameDate);

          if (!nextGame && isDateLaterThan(nextGameDate, today))
            nextGame = game;

            if(today.getYear() == nextGameDate.getYear() 
                && today.getMonth() == nextGameDate.getMonth() 
                && today.getDate() == nextGameDate.getDate()) {
              todaysGame = game;
            }
        });

        if (todaysGame) {
            $(".fill-in").text("YES");
            $("#game .summary").text("Red Sox play " + todaysGame.opponent);
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
        }
        else {
          $(".fill-in").text("NO");
          $("#game .date").text(nextGame.date);
          $("#game .summary").text("Red Sox will play the " + nextGame.opponent);
          $("#game .location").text(nextGame.location);
          var nextGameDate = new Date(nextGame.date);
          // Format next game date as day of the week
          var weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
          var nextGameDay = weekday[nextGameDate.getDay()];
          $("#game .day").text("on " + nextGameDay + ", " + nextGame.date + ", ");
          $("#game .tstart").text(nextGame.time);
          $("#game").show();
        }
	});



      var _gaq = _gaq || [];
      _gaq.push(['_setAccount', 'UA-4666310-15']);
      _gaq.push(['_trackPageview']);

      (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
      })();



});
