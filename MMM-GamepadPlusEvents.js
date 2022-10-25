//
// Module : MMM-GamepadPlusEvents
// inspired by: https://github.com/victor-paumier/MMM-GamepadEvents
// based on: https://github.com/MozillaReality/gamepad-plus/blob/master/demo.js
//

Module.register("MMM-GamepadPlusEvents", {
    initialized: false,
    currentControlSet: null,
    currentPageIndex: 0,

    defaults: {
        showNotification: false,
        axisThreshold: 0.15,
        controlSets: [
            {
                name: "default",
                default: true,
                axisActions: [],
                buttonActions: []
            }
        ]
    },

    getScripts: function() {
        return [
            "gamepads.js"
        ];
    },

    notificationReceived: function (notification, payload, sender) {
        switch (notification) {
            case "ALL_MODULES_STARTED":
                this.initControlSet();
                this.initListeners();
                break;
            case "NEW_PAGE": // from MMM-pages
                this.currentPageIndex = payload;
                break;
            case "NEW_GAMEPAD_CONTROLSET":
                this.setControlSet(payload);
                break;
        }
    },

    initControlSet: function() {
        let defaultControlSets = this.config.controlSets.filter(cs => cs.default);
        if (defaultControlSets.length) {
            this.currentControlSet = defaultControlSets[0];
        }
    },

    setControlSet: function(controlSetName) {        
        let controlSets = this.config.controlSets.filter(cs => cs.name === controlSetName);
        if (controlSets.length) {
            this.currentControlSet = controlSets[0];
        }
        else {
            Log.console.warn();(`Control set not found: ${controlSetName}`);
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

        // dismiss initial events while detecting gamepads
        setTimeout(() => {
            this.initialized = true;
        }, 2000);
    },

    handleAxisEvent: function (e) {
        if (!this.initialized) return;

        let message = `Gamepad axis move at index ${e.gamepad.index}: ${e.gamepad.id}. Axis: ${e.axis}. Value: ${e.value}. Page: ${this.currentPageIndex}.`;
        Log.info(message);

        if (this.config.showNotification) {
            this.showNotification(message);
        }

        let direction = e.value >= 0 ? "positive" : "negative";
        let actions = this.currentControlSet.axisActions.filter(a => a.axis === e.axis
                                                        && a.direction === direction
                                                        && Math.abs(e.value) >= a.threshold
                                                        && (!a.gamepadId || a.gamepadId === e.gamepad.id) // filter for specific gamepad (filtered by id). Default: any gamepad.
                                                        && (!a.page || a.page === this.currentPageIndex) // filter with current page (or no page specified)
                                                    );
        Array.from(actions).forEach(action => {
            this.sendNotification(action.notification, action.payload);
        });
    },

    handleButtonEvent: function (type, e) {
        if (!this.initialized) return;

        let direction = type === "gamepadbuttondown" ? "down" : "up";
        let message = `Gamepad button ${direction} at index ${e.gamepad.index}: ${e.gamepad.id}. Button: ${e.button}. Page: ${this.currentPageIndex}.`;
        Log.info(message);

        if (this.config.showNotification) {
            this.showNotification(message);
        }

        let actions = this.currentControlSet.buttonActions.filter(a => a.button === e.button
                                                        && (!a.gamepadId || a.gamepadId === e.gamepad.id) // filter for specific gamepad (filtered by id). Default: any gamepad.
                                                        && ((!a.type && type === "gamepadbuttondown") || a.type === type) // filter for gamepadbuttondown (default) or gamepadbuttonup
                                                        && (!a.page || a.page === this.currentPageIndex) // filter with current page. Default: any page.
                                                    );

        Array.from(actions).forEach(action => {
            this.sendNotification(action.notification, action.payload);

            // execute "own" events since the module itself does not receive the notification sent
            switch (action.notification) {
                case "NEW_GAMEPAD_CONTROLSET":
                    this.setControlSet(action.payload);
                    break;
            }
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
