function CollisionManager()
{
	this.testCollision = function(ball1, ball2, offset) // Test if two circles collide with eachother
	{
		var dx = ball1.x - ball2.x
		var dy = ball1.y - ball2.y

		var distance = Math.sqrt(dx*dx+dy*dy)

		if (distance < ball1.radius + ball2.radius + offset)
		{
			return true
		}
		else
		{
			return false
		}
	}

	this.handleCollision = function(ball1, ball2) // Collision between two balls
	{
		var dx = ball2.x-ball1.x
		var dy = ball1.x-ball2.y
		var distance = ball1.radius + ball2.radius

		var XaxisAngle = Math.atan2(dy, dx)
		var YaxisAngle = Math.atan2(dy, dx) - Math.PI/2

		var vx = ball2.vector[0]
		var vy = ball2.vector[1]

		var vBallAngle = Math.atan2(vy, vx)

		var vThisAngle = Math.atan2(ball1.vector[0], ball1.vector[1])

		var ballResult = YaxisAngle + vThisAngle
		var thisResult = YaxisAngle + vBallAngle

		if (turnedArray.indexOf(ball1) > -1)
		{
			turnedArray.splice(turnedArray.indexOf(ball1), 1)
		}

		if (turnedArray.indexOf(ball2) > -1)
		{
			turnedArray.splice(turnedArray.indexOf(ball2), 1)
		}

		wasteArray[wasteArray.length] = ball1
		ball1.red = '0'
		ball1.green = '0'
		ball1.blue = '0'
		ball2.red = '0'
		ball2.green = '0'
		ball2.blue = '0'
		
		ball1.flightCounter = 0
		ball1.crashTime = 5	
		ball1.startX = ball1.x
		ball1.startY = ball1.y
		ball1.vector[0] = Math.cos(thisResult)
		ball1.vector[1] = Math.sin(thisResult)
		ball1.expectedToCrash = false
		
		ball2.expectedToCrash = false
		ball2.flightCounter = 0
		ball2.startX = ball2.x
		ball2.startY = ball2.y
		ball2.vector[0] = Math.cos(ballResult)
		ball2.vector[1] = Math.sin(ballResult)
		if(ballArray.indexOf(ball2)!=-1)
		{
			ballArray.splice(ballArray.indexOf(ball2),1)
			wasteArray[wasteArray.length]=ball2
		}
	}

	this.handleCenterCollision = function(ball) // Collision between ball and center
	{
		var dx = center.x-ball.x
		var dy = center.y-ball.y
		
		var distanceAngle = Math.atan2(dy, dx)
		var normalAngle = distanceAngle - Math.PI/2
		var crashAngleC = Math.atan2(ball.vector[1],ball.vector[0])
		var resultAngleC = 2*normalAngle-crashAngleC
		
		ball.vector[0]=Math.cos(resultAngleC)
		ball.vector[1]=Math.sin(resultAngleC)

		ball.flightCounter = 0
		ball.startX = ball.x
		ball.startY = ball.y
	}
}