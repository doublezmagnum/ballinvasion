var centerColor = "rgb(82, 92 ,209)"; //(R,G,B)
var gunLimit = 7
var redLimit = 20

function Center() {
    this.reloading = false
    this.redCounter = 0
    this.firing = false
    this.gunCounter = 0
    this.changing = false
    this.radius = 50
    this.intendedRadius = this.radius
    this.radiusChange = 0
    this.changeSpeed = 0.3

    this.centerBars = {}


    this.x = canvas.width / 2
    this.y = canvas.height / 2

    this.draw = function() 
    {
        ctx.fillStyle = centerColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();

        for (var centerBar in this.centerBars)
        {
            this.centerBars[centerBar].draw()
        }
    }

    this.handleRadiusChange = function(radiusChange) {
        //console.trace("RadiusChange")
        this.intendedRadius += radiusChange
        this.radiusChange = radiusChange
        this.changing = true
    }

    this.radiusChanger = function() {
        //console.trace(this.intendedRadius, this.radius)
        var error = (this.intendedRadius - this.radius)
        var radiusChange = error / Math.abs(error) * this.changeSpeed
        this.radius += radiusChange

        if (Math.abs(this.radius - this.intendedRadius) < 0.05) {
            this.changing = false
            this.radius = this.intendedRadius
        }

        for (var uk = 0; uk < turnedArray.length; uk++) {
            turnedArray[uk].orbitRadius += radiusChange
        }
        for (var bk = 0; bk < ballArray.length; bk++) {
            var ballo = ballArray[bk]
            ballo.crashTime = ballo.crashTime - radiusChange / (ballo.speed * 100)
            //console.trace(ballo.crashTime)
        }

        if (this.radius <= 0) {
            loseGame()
        }

        for (var wk = 0; wk < wasteArray.length; wk++) {
            var waste = wasteArray[wk]
            var dx = waste.x - center.x
            var dy = center.y - waste.y
            var distance = dx * dx + dy * dy
            if (distance < (waste.radius + this.radius) * (waste.radius + this.radius)) {
                var a = Math.atan2(dy, dx)
                waste.vector[0] += 0.3 * Math.cos(a)
                waste.vector[1] -= 0.3 * Math.sin(a)
            }
        }
    }
}