const startButton = document.getElementById("start");
const resumeButton = document.getElementById("resume");
const pauseButton = document.getElementById("pause");
const resetButton = document.getElementById("reset");
const minuteDisplay = document.getElementById("minutes");
const secondDisplay = document.getElementById("seconds");

var timerMinutes = 0;
var timerSeconds = 5;

var remainingMinutes = 0;
var remainingSeconds = 0;

/*
Status codes:
0 - not started
-1 - completed
1 - running
2 - paused
*/
var status = 0;

var clockHandle;

function countDown(minutes,seconds){
    status = 1;
    var end = new Date();
    end.setMinutes(end.getMinutes() + minutes);
    end.setSeconds(end.getSeconds() + seconds);
    function tick(){
        //Get current date
        var now = new Date();
        //Calculate remaining milliseconds
        var remainingMilli = end - now;
        //Check to see if the timer has elapsed, or the reset button has been pressed
        //Stop the clock if either happen
        if(remainingMilli <= 0){
            clearInterval(clockHandle);
            remainingMinutes = 0;
            remainingSeconds = 0;            
            updateClock();
            status = -1;
            //Exit the function
            return;
        }
        //Convert milliseconds to Minutes + Seconds, then update variables
        timeConversion(remainingMilli);
        //Update hmtl
        updateClock();
    }
    clockHandle = setInterval(tick, 90);
}

function timeConversion(milliseconds){
    remainingMinutes = Math.floor(milliseconds / 60000);
    remainingSeconds = ((milliseconds % 60000) / 1000).toFixed(0);
}

/* 
updateClock() : Updates the display to latest remaining time
@param : none
@return : none
*/
function updateClock(){
    minuteDisplay.innerHTML = remainingMinutes;
    secondDisplay.innerHTML = remainingSeconds;
}

/* 
resetClock() : Resets the countdown timer. If running first stops the clock, before resetting.
@param : none
@return : none
*/
function resetClock(){
    /*
    A running clock must first be stopped before it can be reset.
    Status code 1 tells us that the clock is running.
    */
    if(status == 1){
        clearInterval(clockHandle); //Disable clock
        remainingMinutes = 0;
        remainingSeconds = 0;
    }
    minuteDisplay.innerHTML = timerMinutes;
    secondDisplay.innerHTML = timerSeconds;

    pauseButton.style.display = "none";
    resumeButton.style.display = "none";
    startButton.style.display = "inline";

    status = 0;
}
/* 
startClock() : Starts the timer if and only if the clock has not been started (status code 0).
@param : none
@return : none
*/
function startClock(){
    if(status == 0){
        countDown(timerMinutes,timerSeconds);
        startButton.style.display = "none";
        pauseButton.style.display = "inline";
    }
}

function pauseClock(){
    if(status == 1){
        clearInterval(clockHandle);
        pauseButton.style.display = "none";
        resumeButton.style.display = "inline";
        status = 2;
    }
}

function resumeClock(){
    if(status == 2){
        console.log(remainingMinutes);
        console.log(remainingSeconds);
        countDown(remainingMinutes,remainingSeconds);
        pauseButton.style.display = "inline";
        resumeButton.style.display = "none";
    }
}

resetClock();
startButton.addEventListener("click",startClock);
resetButton.addEventListener("click",resetClock);
pauseButton.addEventListener("click",pauseClock);
resumeButton.addEventListener("click",resumeClock);