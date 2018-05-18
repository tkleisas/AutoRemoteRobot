let prevaction = ""
let distance = 0
let turn = 0
let mode = -1
let message = "A, B OR A+B"
function remoteControlled() {
    if (action.length > 0 && action.compare(prevaction) == 0) {
        basic.pause(50)
        return
    }
    if (action.compare("stop") == 0) {
        greekled.showString("S")
        stop()
    }
    if (action.compare("forward") == 0) {
        greekled.showString("Λ")
        moveForward()
    }
    if (action.compare("reverse") == 0) {
        greekled.showString("V")
        moveBackwards()
    }
    if (action.compare("turnleft") == 0) {
        greekled.showString("L")
        steerLeft()
    }
    if (action.compare("rotateleft") == 0) {
        greekled.showString("<")
        rotateLeft()
    }
    if (action.compare("turnright") == 0) {
        greekled.showString("R")
        steerRight()
    }
    if (action.compare("rotateright") == 0) {
        greekled.showString(">")
        rotateRight()
    }
    prevaction = action
    basic.pause(50)
}
function rotateLeft() {
    kitronik.motorOn(kitronik.Motors.Motor1, kitronik.MotorDirection.Reverse, speed)
    kitronik.motorOn(kitronik.Motors.Motor2, kitronik.MotorDirection.Forward, speed)
}
function stop() {
    kitronik.motorOff(kitronik.Motors.Motor1)
    kitronik.motorOff(kitronik.Motors.Motor2)
}

function remoteControl() {
    speed = input.rotation(Rotation.Pitch);
    if (speed < 30 && speed > -30) {
        radio.sendString("stop")
        greekled.showString("S")
    } else {
        radio.sendValue("speed", speed)
    }
    turn = input.rotation(Rotation.Roll)
    if (turn > 70) {
        radio.sendString("rotateright")
        greekled.showString(">")

    }
    if (turn < -70) {
        radio.sendString("rotateleft")
        greekled.showString("<")
    }
    if (speed >= 30 || speed <= -30) {
        if (speed > 0) {
            radio.sendString("reverse")
            greekled.showString("V")
        }
        else {
            radio.sendString("forward")
            greekled.showString("Λ")
        }
    }
    if (speed >= 30 || speed <= -30) {

        if (turn >= 30 && turn < 70) {
            radio.sendString("turnright")
            greekled.showString("R")
        }

        if (turn < -30 && turn > -70) {
            radio.sendString("turnleft")
            greekled.showString("L")
        }

    }
    basic.pause(50)
}
function autonomous() {
    let e = readDistance(5)
    greekled.showNumber(e)
    if (e < 40) {
        rotateLeft()
    } else {
        moveForward()
    }

}
input.onButtonPressed(Button.B, () => {
    mode = 1
    speed = 60
    message = "RX"
    action = "stop"

})
input.onButtonPressed(Button.A, () => {
    mode = 0
    speed = 60
    message = "A"
    action = "stop"
})

function steerLeft() {
    kitronik.motorOn(kitronik.Motors.Motor1, kitronik.MotorDirection.Forward, speed / 3)
    kitronik.motorOn(kitronik.Motors.Motor2, kitronik.MotorDirection.Forward, speed)
}
function moveBackwards() {
    kitronik.motorOn(kitronik.Motors.Motor1, kitronik.MotorDirection.Reverse, Math.abs(speed))
    kitronik.motorOn(kitronik.Motors.Motor2, kitronik.MotorDirection.Reverse, Math.abs(speed))
}
radio.onDataPacketReceived(({ receivedString }) => {
    if (mode == 1) {
        action = receivedString
    }
})
function steerRight() {
    kitronik.motorOn(kitronik.Motors.Motor1, kitronik.MotorDirection.Forward, speed)
    kitronik.motorOn(kitronik.Motors.Motor2, kitronik.MotorDirection.Forward, speed / 3)
}
function rotateRight() {
    kitronik.motorOn(kitronik.Motors.Motor1, kitronik.MotorDirection.Forward, speed)
    kitronik.motorOn(kitronik.Motors.Motor2, kitronik.MotorDirection.Reverse, speed)
}
function moveForward() {
    kitronik.motorOn(kitronik.Motors.Motor1, kitronik.MotorDirection.Forward, speed)
    kitronik.motorOn(kitronik.Motors.Motor2, kitronik.MotorDirection.Forward, speed)
}
input.onButtonPressed(Button.AB, () => {
    mode = 2
    speed = 0
    message = "TX"
    action = "stop"
})
let action = ""
let speed = 0
distance = 0
speed = 60
function readDistance(numTimes: number) {
    let d = sonar.ping(DigitalPin.P1, DigitalPin.P2, PingUnit.Centimeters)
    for (let i = 0; i < numTimes - 2; i++) {
        d = (d + sonar.ping(DigitalPin.P1, DigitalPin.P2, PingUnit.Centimeters)) / 2

    }
    return d
}

radio.setGroup(1)
radio.setTransmitPower(7)
basic.forever(() => {
    if (message.length > 1) {
        greekled.showString(message)
        message = ""
    }
    if (mode == 0) {
        autonomous()
    } else if (mode == 1) {
        remoteControlled()
    } else if (mode == 2) {
        remoteControl()
    }
})
