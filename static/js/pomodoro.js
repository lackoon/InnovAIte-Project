let workTime = parseInt(document.getElementById("workTime").value) * 60;
let breakTime = parseInt(document.getElementById("breakTime").value) * 60;
let time = workTime;
let isRunning = false;
let isBreak = false;
let timer;
let runningTime = 0;
let stopColour = "linear-gradient(45deg, rgb(97, 4, 4), rgb(135, 9, 9))";
let startColour = "linear-gradient(45deg, rgb(24, 48, 26), rgb(30, 59, 30))";

function updateDisplay() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    document.getElementById("timeDisplay").innerText = `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        document.body.style.backgroundImage = "linear-gradient(45deg, rgb(4, 97, 4), rgb(9, 135, 9))";
        timer = setInterval(() => {
            if (time > 0) 
            {
                time--;
                updateDisplay();
                if (!isBreak)
                {
                    runningTime++;
                }
            } 
            else 
            {
                clearInterval(timer);
                isRunning = false;
                if (isBreak) 
                {
                    time = workTime;
                    updateDisplay();
                    isBreak = false;
                    document.getElementById("mode").innerHTML = "Work";
                    document.getElementById("end").innerHTML = "End Task";
                    alert("Time to work!");
                } 
                else 
                {
                    time = breakTime;
                    updateDisplay();
                    isBreak = true;
                    alert("Break Time!");
                    document.getElementById("mode").innerHTML = "Break";
                    document.getElementById("end").innerHTML = "Skip Break";
                }
                startTimer();
            }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
    document.body.style.backgroundImage = "linear-gradient(45deg, rgb(97, 4, 4), rgb(135, 9, 9))";
}

function resetTimer() {
    pauseTimer();
    time = workTime;
    updateDisplay();
}

function completeTask() {
    if (isBreak)
    {
        time = 0;
        isBreak = true;
        return;
    }
    document.querySelectorAll(".timer").forEach(element => {
        element.style.backgroundColor = stopColour; 
    });
    const taskName = document.getElementById("taskName").value;
    if (taskName.trim() === "") {
        alert("Please enter a task name!");
        return;
    }

    const duration = runningTime/60;
    runningTime = 0;
    fetch("/save_task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: taskName, duration: duration.toFixed(2) })
    }).then(response => response.json())
      .then(data => {
          alert(data.message);
          location.reload();
      }).catch(error => console.error("Error:", error));
}

function saveSettings() {
    let newWorkTime = parseInt(document.getElementById("workTime").value);
    let newBreakTime = parseInt(document.getElementById("breakTime").value);

    fetch("/save_settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ work_time: newWorkTime, break_time: newBreakTime })
    }).then(response => response.json())
      .then(() => location.reload());
}

updateDisplay();
