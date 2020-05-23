const startButton = document.getElementById("start");
const resumeButton = document.getElementById("resume");
const pauseButton = document.getElementById("pause");
const resetButton = document.getElementById("reset");
const minuteDisplay = document.getElementById("minutes");
const secondDisplay = document.getElementById("seconds");
const stateDisplay = document.getElementById("current state");

const LONGBREAK_MINS = 15;
const SHORTBREAK_MINS = 5;
const POMO_MINS = 25;

const STATES = ["pomodoro","short-break","pomodoro","short-break","pomodoro","short-break","pomodoro","long-break"];
let state_index = 0;

let timerMinutes = POMO_MINS;
let timerSeconds = 0;

let pomocounter = 1;

class Clock{
    constructor(){
        this.remainingMinutes = timerMinutes;
        this.remainingSeconds = timerSeconds;
        this.status = "not started";
        this.remainingMilliseconds = 0;
    }

    countDown(milliseconds){
        this.status = "running";
        let end = new Date();
        end.setMilliseconds(end.getMilliseconds() + milliseconds);
        // Had to use an arrow function, otherwise a function inside the countDown() method won't be able to access
        // the other class methods. We love javascript!
        this.clockHandle = setInterval(() =>{
            //Get current date
            let now = new Date();
            //Calculate remaining milliseconds
            this.remainingMilliseconds = end - now;
            //Check to see if the timer has elapsed, or the reset button has been pressed
            //Stop the clock if either happen
            if(this.remainingMilliseconds <= 0){
                this.status = "completed";
                clearInterval(this.clockHandle);
                this.remainingMinutes = 0;
                this.remainingSeconds = 0;            
                this.updateClock();
                

                if(state_index + 1 >= STATES.length)
                    state_index = 0;
                else
                    state_index++;
                
                if(STATES[state_index] == "pomodoro"){
                    pomocounter++;
                    this.countDown(POMO_MINS*60000);
                }
                else if(STATES[state_index] == "short-break"){
                    this.countDown(SHORTBREAK_MINS*60000);
                }
                else{
                    this.countDown(LONGBREAK_MINS*60000)
                }
            }
            else{
                //Convert milliseconds to Minutes + Seconds, then update HTML
                this.timeConversion(this.remainingMilliseconds);
                //Update hmtl
                this.updateClock();
            }
        }, 90);
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

        let displayMins = this.remainingMinutes.toString().padStart(2, "0");
        let displaySecs = this.remainingSeconds.toString().padStart(2, "0");

        minuteDisplay.innerHTML = displayMins;
        secondDisplay.innerHTML = displaySecs;
        stateDisplay.innerHTML = STATES[state_index]+"#"+pomocounter;
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
        minuteDisplay.innerHTML = timerMinutes.toString().padStart(2,"0");
        secondDisplay.innerHTML = timerSeconds.toString().padStart(2,"0");

        pauseButton.style.display = "none";
        resumeButton.style.display = "none";
        startButton.style.display = "inline";

        this.status = "not started";
        pomocounter = 1;
    }
    /* 
    startClock() : Starts the timer if and only if the clock has not been started.
    @param : none
    @return : none
    */
    startClock(){
        if(this.status === "not started"){
            //
            let timerMilliseconds = (timerMinutes * 60000) + (timerSeconds * 1000) + 1000;
            this.countDown(timerMilliseconds);
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
        if(this.status === "running" && this.remainingMinutes != 0 || this.remainingSeconds != 0){
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
            this.countDown(this.remainingMilliseconds);
            pauseButton.style.display = "inline";
            resumeButton.style.display = "none";
            this.status = "running";
        }
    }
}

let clock = new Clock();
clock.updateClock();

//resetClock();
startButton.addEventListener("click",() => {clock.startClock() });
resetButton.addEventListener("click",() => {clock.resetClock() });
pauseButton.addEventListener("click",() => {clock.pauseClock() });
resumeButton.addEventListener("click",() => {clock.resumeClock() });