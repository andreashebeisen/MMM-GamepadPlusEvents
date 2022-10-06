//
// Module : MMM-GamepadPlusEvents
// based on: https://github.com/MozillaReality/gamepad-plus/blob/master/demo.js
//

Module.register("MMM-GamepadPlusEvents", {
    defaults: {
        showNotification: true,
        axisThreshold: 0.15,
        axisActions: [],
        buttonActions: [],
        keyActions: []
    },

    getScripts: function() {
        return [
            "gamepads.js"
        ];
    },

    notificationReceived: function (notification, payload, sender) {
        switch (notification) {
            case "ALL_MODULES_STARTED":
                this.initListeners();
                break;
        }
    },

    initListeners: function () {
        let self = this;
        
        Log.info(`Gamepads detected: ${Gamepads.hasGamepads()}`);

        const gamepadsConfig = {
            axisThreshold: self.config.axisThreshold,
            gamepadIndicesEnabled: false
        }
        let gamepads = new Gamepads(gamepadsConfig);
        gamepads.polling = false;

        if (gamepads.gamepadsSupported) {
            gamepads.updateStatus = function () {
                gamepads.polling = true;
                gamepads.update();
                window.requestAnimationFrame(gamepads.updateStatus);
            };

            gamepads.cancelLoop = function () {
                gamepads.polling = false;

                if (gamepads.pollingInterval) {
                    window.clearInterval(gamepads.pollingInterval);
                }

                window.cancelAnimationFrame(gamepads.updateStatus);
            };

            window.addEventListener("gamepadconnected", function (e) {
                Log.info(`Gamepad connected at index ${e.gamepad.index}: ${e.gamepad.id}. ${e.gamepad.buttons.length} buttons, ${e.gamepad.axes.length} axes.`);

                gamepads.updateStatus();
            });

            window.addEventListener("gamepaddisconnected", function (e) {
                Log.info(`Gamepad removed at index ${e.gamepad.index}: ${e.gamepad.id}.`);
            });

            if (gamepads.nonstandardEventsEnabled) {
                window.addEventListener("gamepadaxismove", function (e) {
                    self.handleAxisEvent(e);
                    // let message = `Gamepad axis move at index ${e.gamepad.index}: ${e.gamepad.id}. Axis: ${e.axis}. Value: ${e.value}.`;
                    // self.showNotification(message);
                });

                window.addEventListener("gamepadbuttondown", function (e) {
                    self.handleButtonEvent.call(self, "gamepadbuttondown", e);
                });

                window.addEventListener("gamepadbuttonup", function (e) {
                    self.handleButtonEvent.call(self, "gamepadbuttonup", e);
                });
            }

            if (gamepads.keyEventsEnabled) {
                window.addEventListener("keydown", function (e) {
                    if (!e.gamepad) {
                        return;
                    }
                    let message = `Keydown event from gamepad button down at index ${e.gamepad.index}: ${e.gamepad.id}. Button: ${e.button}. Key: ${e.key || "?"}. Key code: ${e.code}.`;
                    self.showNotification(message);
                });

                window.addEventListener("keypress", function (e) {
                    if (!e.gamepad) {
                        return;
                    }
                    let message = `Keypress event from gamepad button down at index ${e.gamepad.index}: ${e.gamepad.id}. Button: ${e.button}. Key: ${e.key || "?"}. Key code: ${e.code}.`;
                    self.showNotification(message);
                });

                window.addEventListener("keyup", function (e) {
                    if (!e.gamepad) {
                        return;
                    }
                    let message = `Keyup event from gamepad button down at index ${e.gamepad.index}: ${e.gamepad.id}. Button: ${e.button}. Key: ${e.key || "?"}. Key code: ${e.code}.`;
                    self.showNotification(message);
                });
            }
        }
    },

    handleAxisEvent: function (e) {
        let message = `Gamepad axis move at index ${e.gamepad.index}: ${e.gamepad.id}. Axis: ${e.axis}. Value: ${e.value}.`;
        Log.info(message);

        if (this.config.showNotification) {
            this.showNotification(message);
        }

        // TODO: filter gamepad
        let direction = e.value >= 0 ? "positive" : "negative";
        let actions = this.config.axisActions.filter(a => a.axis === e.axis && a.direction === direction && Math.abs(e.value) >= a.threshold);
        Array.from(actions).forEach(action => {
            this.sendNotification(action.notification, action.payload);
        });
    },

    handleButtonEvent: function (type, e) {
        let direction = type === "gamepadbuttondown" ? "down" : "up";
        let message = `Gamepad button ${direction} at index ${e.gamepad.index}: ${e.gamepad.id}. Button: ${e.button}.`;
        Log.info(message);

        if (this.config.showNotification) {
            this.showNotification(message);
        }

        // TODO: filter gamepad
        // TODO: default for type?
        let actions = this.config.buttonActions.filter(a => a.button === e.button && a.type === type);
        Array.from(actions).forEach(action => {
            this.sendNotification(action.notification, action.payload);
        });
    },

    showNotification: function (message) {
        this.sendNotification("SHOW_ALERT",
            {
                type: "notification",
                title: this.name,
                message: message
            }
        );
    }
});