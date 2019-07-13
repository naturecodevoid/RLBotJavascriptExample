const rlbot = require('rlbot-test')

class ATBA extends rlbot.BaseAgent {
    constructor(name, team, index, fieldInfo) {
        super(name, team, index, fieldInfo) //pushes these all to this.
    }
    getOutput(gameTickPacket, ballPrediction) {
        var controller = new rlbot.SimpleController()
        /* ATBA example */
        if (!gameTickPacket.gameInfo.isRoundActive) {

            return controller;
        }
        var ballLocation = gameTickPacket.ball.physics.location;
        var carLocation = gameTickPacket.players[this.index].physics.location;
        var carRotation = gameTickPacket.players[this.index].physics.rotation;

        // Calculate to get the angle from the front of the bot's car to the ball.
        var botToTargetAngle = Math.atan2(ballLocation.y - carLocation.y, ballLocation.x - carLocation.x);
        var botFrontToTargetAngle = botToTargetAngle - carRotation.yaw;

        // Correct the angle
        if (botFrontToTargetAngle < -Math.PI) { botFrontToTargetAngle += 2 * Math.PI };
        if (botFrontToTargetAngle > Math.PI) { botFrontToTargetAngle -= 2 * Math.PI };

        // Decide which way to steer in order to get to the ball.
        if (botFrontToTargetAngle > 0) {
            controller.steer = 1;
        } else {
            controller.steer = -1;
        }
        
        //almost scored
        if(ballPrediction.slices[60].physics.location.y > 5120 || ballPrediction.slices[60].physics.location.y < -5120) {
            this.sendQuickChat(rlbot.quickChats.compliments.NiceShot, false)
        }

        controller.throttle = 1;
        return controller;

    }
}

const manager = new rlbot.Manager(ATBA);
manager.start();