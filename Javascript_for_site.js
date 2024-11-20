//javscript
//Calasable view 
// countdown timer
function timer(endTime = "2021-08-27T16:45:53.378") {
  const second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24;

  let end = new Date(endTime).getTime(),
    x = setInterval(function () {
      let now = new Date().getTime(),
        timeLeft = end - now;

      let days = Math.floor(timeLeft / (day)),
        hours = Math.floor((timeLeft % (day)) / (hour)),
        minutes = Math.floor((timeLeft % (hour)) / (minute)),
        seconds = Math.floor((timeLeft % (minute)) / second);

      console.log('Time left:' + days + "Days " + hours + "Hrs " + minutes + "Mins " + seconds + "secs")

      if (timeLeft < 0) {
        console.log('Times up');
        clearInterval(x);
      }
    }, 1000)                    // time refresh in ms
}

timer("2021-08-23T16:45:53.378")
