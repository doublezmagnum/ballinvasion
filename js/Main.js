// Create the canvas
//THis is my comment

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

canvas.width = w.innerWidth;
canvas.height = w.innerHeight-5;
document.body.appendChild(canvas);

// powerUps:
var powerUps = 
{
    "shotgun": 0,
    "slowMotion": 0,
    "biggerpaddle": 0
}

// LocalStorage --
if (localStorage.getItem("record") == null) {
    var localHighScore = []
} else {
    var localHighScore = localStorage.getItem("record").split(",");

    //console.trace("Local High Scores: ")
    for (var i = 0; i < localHighScore.length; i++) {
        //console.trace(String(i+1) + ". " + String(localHighScore[i]) + " seconds")
    }
}

function compareNumbers(a, b) {
    return a - b;
}

function loseGame() {
    survivedSeconds = String(Math.floor((Date.now() - startTime) / 1000))
    //meOverFunction(Math.floor((Date.now()-startTime)/1000));
    gameOver = true
    ballArray = []
    aoeArray = []
    itemBlastArray = []
    turnedArray = []
    itemBoxArray = []
    shotArray = []
    fighterArray = []
    explodingArray = []
    center.x = 4000
    center.y = 4000
    center.x = 4000
    center.y = 4000
    center.radius = 200
    pad.x = 4000
    pad.y = 4000

    localHighScore.push(survivedSeconds)
    localHighScore.sort(compareNumbers)
    localStorage.setItem("record", localHighScore);
    document.getElementById("overlay").style.display = "block";
    document.getElementById("score").value = survivedSeconds
}

// Game objects

center = new Center()

var ballArray = []
var itemBoxArray = []
var wasteArray = []
var turnedArray = []
var fighterArray = []
var shotArray = []
var explodingArray = []
var laserArray = []
var aoeArray = []
var itemBlastArray = []

var rect = canvas.getBoundingClientRect();
var mouseX = 0
var mouseY = 0
var angle = 0

var pad = new Pad()
pad.draw()
var itemQueue = new ItemQueue()


// wasteBall CODE DISABLES RIGHT CLICKING - SHOULD BE ACTIVATED IN THE RELEASED GAME - DEACTIVATED FOR DEBUGGING PURPOSES
document.oncontextmenu = function(e)
{
    var evt = new Object({keyCode:93}); 
    stopEvent(e); 
}

function stopEvent(event){
 if(event.preventDefault != undefined)
  event.preventDefault();
 if(event.stopPropagation != undefined)
  event.stopPropagation();
}

var submittedScore = false
document.getElementById("playagainbtn").addEventListener("click", function(e) {
    location.reload();
    document.getElementById("overlay").style.display = "none";
}, false);


navigator.sayswho = (function() {
    var ua = navigator.userAgent,
        tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/)
        if (tem != null) return 'Opera ' + tem[1];
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})();

var soundType = ""
if (navigator.sayswho.indexOf("Opera") == -1) {
    soundType = ".mp3"
} else {
    soundType = ".wav"
}

function doMouseDown(event) {
    if (event.which == 1)
    {
        center.firing = true
    }

    else if (event.which == 3)
    {
        if (!itemQueue.changingPosition)
        {
            itemQueue.queueMovement()
        }
    }

    // Testing if user is changing mute status

    var dx = mouseX - mutebuttonCoordinates[0]
    var dy = mutebuttonCoordinates[1] - mouseY

    if (Math.sqrt(dx*dx+dy*dy) < mutebuttonDimensions[1]*0.4)
    {
        if(muted == false)
        {
            muted = true
        }
        else if(muted == true)
        {
            muted = false
            music.play();
        }
    }

}

function doMouseUp(event) 
{  
    if (event.which == 1)
    {
        center.firing = false
    }
}


function getX(event, canvas) {
    if (event.offsetX) {
        return event.offsetX;
    }
    if (event.clientX) {
        return event.clientX - canvas.offsetLeft;
    }
    return null;
}

function getY(event, canvas) {
    if (event.offsetY) { //chrome and IE
        return event.offsetY;
    }
    if (event.clientY) { // FF
        return event.clientY - canvas.offsetTop;
    }
    return null;
}

addEventListener("mousemove", function(e) {

    mouseX = getX(e, canvas);
    mouseY = getY(e, canvas);
    var dx = mouseX - center.x
    var dy = center.y - mouseY

    pad.deltaRotation = Math.atan2(-dy, dx) - angle

    angle = Math.atan2(-dy, dx)

    if (pad.deltaRotation > Math.PI) {
        pad.deltaRotation = 2 * Math.PI - pad.deltaRotation
    }

    pad.rotation = angle

}, false);

var spawnLimit = 0.01
var test = false

var collisionManager = new CollisionManager();
var itemManager = new ItemManager();

var gameOver = false
var survivedSeconds = 0


var update = function(modifier) {
    if (gameOver == false) 
    {
        var rN = Math.random()
        if (rN < spawnLimit && gameOver == false) {
            var ball = new Ball();
            ball.spawn(ballSpeed + 10 * spawnLimit);
            spawnLimit += modifier * 0.01

        }

        if (rN < spawnLimit)
        {
            var nI = new ItemBox()
            nI.spawn()
        }


        if (center.firing && center.gunCounter < gunLimit) {
            if (center.redCounter < 255 - redLimit) {
                if (powerUps["shotgun"] == 0) {
                    if (muted == false) {
                        var snd = new Audio("sound/Menu1" + soundType);
                        snd.play()
                    }

                    var laser = new Laser();
                    //laser.spawn((Math.random()-0.5)*accuracy + (Math.random()-0.5)*center.gunCounter*recoil, 1);
                    laser.spawn(0, 1, false)
                } else {
                    var numLasers = 5
                    var angleError = -0.1
                    if (muted == false) {
                        var snd = new Audio("sound/Menu1.wav");
                        snd.play()
                    }

                    for (l = 0; l < numLasers; l++) {
                        var laser = new Laser();             
                        laser.spawn(angleError, 5, true);
                        angleError += 0.05
                    }
                }
            }
        }
        if (center.changing == true) 
        {
            center.radiusChanger(modifier)
        }
        updateBlast(modifier)

        updateItemBlast(modifier)

        updateItemBoxes(modifier)

        updateBall(modifier);

        updateLasers(modifier);

        updateShots(modifier);

        updateFighters(modifier);

        itemQueue.update()
    }
};

var render = function(deltaTime) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#36A8E0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(' + String(a) + ',' + String(b) + ',' + String(c) + ',' + String(0.4) + ')';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var grd=ctx.createLinearGradient(spawnDistance*Math.cos(0.01*d),spawnDistance*Math.sin(0.01*d),-spawnDistance*Math.cos(0.01*d),-spawnDistance*Math.sin(0.01*d));
    grd.addColorStop(0,'rgba(' + String(b) + ',' + String(a) + ',' + String(c) + ',' + String(0.8) + ')');
    grd.addColorStop(1,'rgba(' + String(c) + ',' + String(b) + ',' + String(a) + ',' + String(0.8) + ')');
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (gameOver == false) 
    {
        drawBlast();
        drawItemBlast();

        centerColor = "rgb(" + String(center.redCounter) + ", 0, 0)";
        center.redCounter = Math.max(center.redCounter - 1, 0)
        center.gunCounter = Math.max(center.gunCounter - 1, 0)
        drawBall();

        drawExploding();

        drawFighters();

        drawShots();

        drawLasers();

        drawItemBoxes();

        drawMuteButton();

        pad.draw()

        center.draw()

        itemQueue.draw()
        drawTurned(deltaTime);
        drawWaste(deltaTime);

        var Now = Date.now()
        survivedSeconds = Math.floor((Now - startTime) / 1000)
        ctx.fillStyle = "black"
        ctx.font = "60px Arial Black";
        ctx.fillText(String(Math.floor((Now - startTime) / 1000)), canvas.width / 2 - 20, 100)
    }

    //var wind = 0.05*Math.random()+0.6+0.05*Math.sin(0.01*d)-0.03
    //ctx.fillStyle = 'rgba('+String(a)+','+String(b)+','+String(c)+','+String(wind)+')';
    //ctx.fillRect(0, 0, canvas.width, canvas.height);

    screenColorChanger();
};

var startTime = Date.now();
var aCounter = 1
var increasing = "a"
var a = 0
var b = 255
var c = 255
var d = 1
var increasing2 = "e"
var increasing2Speed = 51
var e = 0
var f = 255
var g = 255

var main = function() {
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render(delta / 1000);

    then = now;
    requestAnimationFrame(main);
};

var songLength = 15 * 60
if (soundType == ".wav") {
    var music = new Audio("music/Mix3.ogg");
} else {
    var music = new Audio("music/Mix3" + soundType);
}


var then = Date.now();
main();

var mutebutton1Ready = false
var mutebutton2Ready = false
var mutebuttonDimensions = [64, 36]
var mutebuttonCoordinates = [50, 50]
var mutebutton1 = new Image()
mutebutton1.src = "images/mutebutton1.png"


mutebutton1.onload = function()
{ 
    mutebutton1Ready = true
};
var mutebutton2 = new Image()
mutebutton2.src = "images/mutebutton2.png"

mutebutton2.onload = function()
{ 
    mutebutton2Ready = true
};

var comboSounds = [new Audio("sound/Combo/2/1" + soundType), new Audio("sound/Combo/2/2" + soundType), new Audio("sound/Combo/2/3" + soundType)]
var comboThen = 0
var comboStage = 0
var comboHits = 0

addEventListener("mousedown", doMouseDown, false);
addEventListener("mouseup", doMouseUp, false);
addEventListener("keydown", keyboard, true);

var muted = true;
      
function keyboard(e) 
{
        if (e.keyCode === 87) //32 = space
        {
        // W
        if (center.redCounter < 50) 
        {
            var blast = new AoEBlast();
            blast.spawn(center.x, center.y, center.radius, 300, true);
        } 
        else if (muted == false) 
        {
            // REFUSE BUY
            var refuseSound = new Audio("sound/Reject1" + soundType);
            refuseSound.play()
        }
        }  
        else if (e.keyCode == 32) 
        {
        // SPACE
        /*var nF = new Fighter()
        nF.spawn()*/
        if (gameOver == true)
        {
            location.reload();
        }

        if (!itemQueue.changingPosition)
        {
            itemQueue.queueMovement()
        }
    }
    
    else if (e.keyCode == 77)
    {
        if(muted == false)
        {
            muted = true
        }
        else if(muted == true)
        {
            muted = false
            music.play();
        }
    }
}
    
function submitscore(name, score) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.open("POST", "http://waveos.pf-control.de/scores/submitscore.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("username=" + name + "&score=" + score);
}

function drawTurned(modifier) {
    turnedArray.forEach(function(turned) {
        turned.drawTurned(modifier);
    });
}

function updateBlast(modifier) 
{
    aoeArray.forEach(function(blast0) {
        blast0.updateBlast(modifier);
    });
}

function drawBlast() {
    aoeArray.forEach(function(blast) {
        blast.drawBlast();
    });
}

function updateItemBlast(modifier) {
    itemBlastArray.forEach(function(itemBlast) 
    {
        itemBlast.updateBlast(modifier);
    });
}

function drawItemBlast() {
    itemBlastArray.forEach(function(itemBlast)
    {   
        itemBlast.drawBlast();
    });
}

function updateItemBoxes() {
    itemBoxArray.forEach(function(itemBox) {
        itemBox.update();
    });
}

function drawItemBoxes() {
    itemBoxArray.forEach(function(itemBox) {
        itemBox.draw();
    });
}

function updateBall(modifier) {
    ballArray.forEach(function(ball) {
        ball.updateBall(modifier);

    });
}

function drawBall() {
    ballArray.forEach(function(ball) {
        ball.draw();
    });
}

function drawWaste(modifier) {
    wasteArray.forEach(function(wasteBall) {
        wasteBall.drawWaste(modifier);
    });
}

function drawExploding() {
    explodingArray.forEach(function(explodingBall) {
        explodingBall.die()
        explodingBall.draw()
    });
}

function updateLasers(modifier) {
    laserArray.forEach(function(laser) {
        laser.updateLaser(modifier);
    });
}

function drawLasers() {
    laserArray.forEach(function(laser) {
        laser.drawLaser();
    });
}

function updateShots(modifier) {
    shotArray.forEach(function(shot) {
        shot.updateShot(modifier);
    });
}

function drawShots() {
    shotArray.forEach(function(shot) {
        shot.drawShot();
    });
}

function updateFighters(modifier) {
    fighterArray.forEach(function(fighter) {
        fighter.updateFighter(modifier);
    });
}

function drawFighters() {
    fighterArray.forEach(function(fighter) {
        fighter.drawFighter()
    });
}

function drawMuteButton() 
{
    if (mutebutton2Ready && mutebutton1Ready)
    {
       if (muted == true)
        {
            ctx.drawImage(mutebutton1, mutebuttonCoordinates[0]-mutebuttonDimensions[0]*0.5, mutebuttonCoordinates[1]-mutebuttonDimensions[1]*0.5, mutebuttonDimensions[0], mutebuttonDimensions[1])
        }
        else
        {
            ctx.drawImage(mutebutton2, mutebuttonCoordinates[0]-mutebuttonDimensions[0]*0.5, mutebuttonCoordinates[1]-mutebuttonDimensions[1]*0.5, mutebuttonDimensions[0], mutebuttonDimensions[1])
        } 
    }
}

function screenColorChanger() {
    d += 1
    if (increasing == "a") {
        a += 1
        b -= 1
        if (a == 200) {
            increasing = "b"
        }
    } else if (increasing == "b") {
        b += 1
        c -= 1
        if (b == 200) {
            increasing = "c"
        }
    } else {
        c += 1
        a -= 1
        if (c == 200) {
         increasing = "a"
        }
    }

    if (increasing2 == "e") {
        e += increasing2Speed
        f -= increasing2Speed
        if (e == 255) {
            increasing2 = "f"
        }
    } else if (increasing2 == "f") {
        f += increasing2Speed
        g -= increasing2Speed
        if (f == 255) {
            increasing2 = "g"
        }
    } else {
        g += increasing2Speed
        e -= increasing2Speed
        if (g == 255) {
            increasing2 = "e"
        }
    }
}

/*window.setInterval(function(){
    for (var powerUp in powerUps)
    {
        if (powerUps[powerUp] > 0)
        {
            powerUps[powerUp] -= 1
        }
    }
}, 1000);*/