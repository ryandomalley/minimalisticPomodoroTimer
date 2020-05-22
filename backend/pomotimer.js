const startButton = document.getElementById("start");
const resumeButton = document.getElementById("resume");
const pauseButton = document.getElementById("pause");
const resetButton = document.getElementById("reset");
const minuteDisplay = document.getElementById("minutes");
const secondDisplay = document.getElementById("seconds");

let timerMinutes = 0;
let timerSeconds = 5;

class Clock{
    constructor(){
        this.remainingMinutes = 0;
        this.remainingSeconds = 0;
        this.status = "not started";
    }

    countDown(minutes,seconds){
        this.status = "running";
        let end = new Date();
        end.setMinutes(end.getMinutes() + minutes);
        end.setSeconds(end.getSeconds() + seconds);
        // Had to use an arrow function, otherwise a function inside the countDown() method won't be able to access
        // the other class methods. We love javascript!
        this.clockHandle = setInterval(() =>{
            //Get current date
            let now = new Date();
            //Calculate remaining milliseconds
            let remainingMilli = end - now;
            //Check to see if the timer has elapsed, or the reset button has been pressed
            //Stop the clock if either happen
            if(remainingMilli <= 0){
                clearInterval(this.clockHandle);
                this.remainingMinutes = 0;
                this.remainingSeconds = 0;            
                this.updateClock();
                this.status = "completed";
                //Exit the function
                return;
            }
            else{
                //Convert milliseconds to Minutes + Seconds, then update HTML
                this.timeConversion(remainingMilli);
                //Update hmtl
                this.updateClock();
            }
        }, 45);
    }

    /* 
    timeConversion() : Converts milliseconds to remainingMinutes and remainingSeconds
    @param : number of milliseconds to convert
    @return : none
    */
    timeConversion(milliseconds){
        this.remainingMinutes = ~~(milliseconds / 60000);
        let remainingMilliseconds = milliseconds - (this.remainingMinutes*60000)
        this.remainingSeconds = ~~(remainingMilliseconds / 1000);
    }

    /* 
    updateClock() : Updates the display to latest remaining time
    @param : none
    @return : none
    */
    updateClock(){
        minuteDisplay.innerHTML = this.remainingMinutes;
        secondDisplay.innerHTML = this.remainingSeconds;
    }

    /* 
    resetClock() : Resets the countdown timer. If running first stops the clock, before resetting.
    @param : none
    @return : none
    */
    resetClock(){
        /*
        A running clock must first be stopped before it can be reset.
        Status code 1 tells us that the clock is running.
        */
        if(this.status === "running"){
            clearInterval(this.clockHandle); //Disable clock
            this.remainingMinutes = 0;
            this.remainingSeconds = 0;
        }
        minuteDisplay.innerHTML = timerMinutes;
        secondDisplay.innerHTML = timerSeconds;

        pauseButton.style.display = "none";
        resumeButton.style.display = "none";
        startButton.style.display = "inline";

        this.status = "not started";
    }
    /* 
    startClock() : Starts the timer if and only if the clock has not been started.
    @param : none
    @return : none
    */
    startClock(){
        if(this.status === "not started"){
            this.countDown(timerMinutes,timerSeconds);
            startButton.style.display = "none";
            pauseButton.style.display = "inline";
        }
    }
    /* 
    pauseClock() : Pause the timer only if the clock is running.
    @param : none
    @return : none
    */
    pauseClock(){
        if(this.status === "running"){
            clearInterval(this.clockHandle);
            pauseButton.style.display = "none";
            resumeButton.style.display = "inline";
            this.status = "paused";
        }
    }

    /* 
    resumeClock() : Resumes the timer if and only if the clock is paused.
    @param : none
    @return : none
    */
    resumeClock(){
        if(this.status === "paused"){
            this.countDown(this.remainingMinutes,this.remainingSeconds);
            pauseButton.style.display = "inline";
            resumeButton.style.display = "none";
            this.status = "running";
        }
    }
}


let clock = new Clock();
clock.resetClock();

//resetClock();
startButton.addEventListener("click",() => {clock.startClock() });
resetButton.addEventListener("click",() => {clock.resetClock() });
pauseButton.addEventListener("click",() => {clock.pauseClock() });
resumeButton.addEventListener("click",() => {clock.resumeClock() });