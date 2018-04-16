const bugImages = ["bug1.png", "bug2.png", "bug3.png", "bug4.png"];
let gameDiv = document.getElementById("gameDiv");
let countdownSpan = document.getElementById("countdownSpan");
let scoreSpan = document.getElementById("scoreSpan");
let countdown = 10, score = 0;
let startTime;

function gameOver() {
    // This is the function that gets called when the game is over.
    // Update this to post the new score to the server.

    let scoreObject = {
        name: playerName,
        score: score
    }

    // Post method
    let postRequestOptions = {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(scoreObject)
    }

    fetch('http://127.0.0.1:3000/scores', postRequestOptions)
    .then(response => response.json())      
    .then(scores => {                   
        let json = JSON.stringify(scores);
        console.log(json);
    })
    .catch(error => {
        console.log("A network error has occurred when attempting to perform the POST request:", error)
    })

    showScores();
        
    window.alert("You squashed " + score + " bugs!");
}

function showScores() {
    // Get method
    fetch('http://127.0.0.1:3000/scores')
        .then(response => response.json())    
        .then(scores => {                   
        let json = JSON.stringify(scores);  
        console.log('get json', json); 
          for (let i = 0; i < scores.length; i++) {
            console.log("i", scores[i].scoreq);
          }            
    })
    .catch(error => {
        console.log("A network error has occurred when attempting to perform the GET request:", error)
    })
}

function playGame() {
    playerName = document.getElementById("playerName").value;
    // console.log(playerName);
    if(playerName.length<3) {
        alert("You must enter your name before playing.");
        return;
    }    
    document.getElementById("startButton").style.display = "none";

    startTime = Date.now();
    score = 0;
    onTick();
}

function bugholeHTML(left, top, imgUrl) {
    return `
    <div class="bugOuter" style="left: ${left}px; top: ${top}px;">
        <div class="bugHole"></div>
        <div class="bug" style="background-image: url('${imgUrl}')"></div>
    </div>`;
}

for(let row = 0; row < 4; row++) {
    for(let column = 0; column < 4; column++) {
        let bugImg = bugImages[Math.floor(Math.random()*bugImages.length)];
        gameDiv.innerHTML += bugholeHTML(column*100, row*90, bugImg);
    }
}
const bugs = document.getElementsByClassName("bug");

for(let i = 0; i<bugs.length; i++) {
    bugs[i].onclick = splat;
}

function splat(event) {
    let obj = event.currentTarget;
    if(!obj.classList.contains("splat")) {
        obj.classList.add("splat");
        score ++;
        setTimeout(function() {
            obj.classList.remove("splat")
        }, 2000);
    }
}

function animate(obj) {
    obj.style.top = "0px";
    obj.classList.add("popup");
    setTimeout(function() {
        obj.classList.remove("popup");
        obj.style.top = "70px";
        obj.classList.add("hideagain");
        setTimeout(function() {
            obj.classList.remove("hideagain");
        }, 1500);
    }, 2000);
}

function onTick() {
    let elapsed = (Date.now() - startTime)/1000;
    //console.log(elapsed);
    countdown = 5 - Math.floor(elapsed);
    if(countdown >= 0) {
        countdownSpan.innerHTML = countdown;
        scoreSpan.innerHTML = score;

        // start animations
        for(let i = 0; i < bugs.length; i++) {
            if(elapsed < 19.0 && Math.floor(Math.random()*16 < 0.1)) {
                if(!bugs[i].classList.contains("popup") && !bugs[i].classList.contains("hideagain")) {
                    // console.log("animating " + i);
                    animate(bugs[i]);    
                }
            }
        }
        setTimeout(onTick, 50);
    } else {
        document.getElementById("startButton").style.display = "inline-block";
        gameOver();
    }
}

document.getElementById("startButton").onclick = playGame;