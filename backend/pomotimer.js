const startButton = document.getElementById("start");
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

function countDown(){
    status = 1;
    var end = new Date();
    end.setMinutes(end.getMinutes() + timerMinutes);
    end.setSeconds(end.getSeconds() + timerSeconds);
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

updateClock
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
    status = 0;
}

function startClock(){
    if(status == 0){
        countDown();
    }
}

function pauseClock(){

}

resetClock();
startButton.addEventListener("click",startClock);
resetButton.addEventListener("click",resetClock);