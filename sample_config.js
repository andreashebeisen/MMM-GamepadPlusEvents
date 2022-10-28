
let config = 		{
			module: "MMM-GamepadPlusEvents",
			config: {
				showNotification: true,
				axisThreshold: 0.15,
				controlSets: [
					{
						name: "default",
						default: true,
						axisActions: [
							{
								axis: 1,
								direction: "negative",
								threshold: 1,
								notification: "PAGE_INCREMENT"
							},
							{
								axis: 1,
								direction: "positive",
								threshold: 1,
								notification: "PAGE_DECREMENT"
							},
							{
								axis: 0,
								direction: "positive",
								threshold: 1,
								notification: "SHOW_ALERT",
								payload: {
									type: "notification",
									title: "Axis 0 moved positive",
									message: "Axis 0+ | default"
								}
							},
							{
								axis: 0,
								direction: "negative",
								threshold: 1,
								notification: "SHOW_HIDDEN_PAGE",
								payload: "admin"
							},
							// {
							// 	axis: 0,
							// 	direction: "positive",
							// 	threshold: 1,
							// 	notification: "PAGE_INCREMENT"
							// },
							// {
							// 	axis: 0,
							// 	direction: "negative",
							// 	threshold: 1,
							// 	notification: "PAGE_DECREMENT"
							// },
							
							// Docs
		
							// specific page
							// {
							// 	axis: 1,
							// 	direction: "negative",
							// 	threshold: 1,
							// 	page: 1,
							// 	notification: "SHOW_ALERT",
							// 	payload: {
							// 		type: "notification",
							// 		title: "Axis 1 moved negative",
							// 		message: "only on page 1"
							// 	}
							// },
							
							// specific gamepad
							// {
							// 	axis: 1,
							// 	direction: "positive",
							// 	threshold: 1,
							// 	gamepadId: "Generic   USB  Joystick   (Vendor: 0079 Product: 0006)",
							// 	notification: "SHOW_ALERT",
							// 	payload: {
							// 		type: "notification",
							// 		title: "Axis 1 moved positive",
							// 		message: "only on specific gamepad"
							// 	}
							// },
						],
						buttonActions: [
							// {
							// 	button: 0,
							// 	notification: "PAGE_DECREMENT"
							// },
							{
								button: 1,
								notification: "SHOW_ALERT",
								payload: {
									type: "notification",
									title: "Button 1 pressed",
									message: "Action 1 | default"
								}
							},
							{
								button: 0,
								notification: "NEW_GAMEPAD_CONTROLSET",
								payload: "hue"
							}
							// {
							// 	button: 1,
							// 	type: "gamepadbuttonup",
							// 	notification: "PAGE_INCREMENT"
							// },
		
							// Docs
							// multiple actions
							// {
							// 	button: 1,
							// 	notification: "SHOW_ALERT",
							// 	payload: {
							// 		type: "notification",
							// 		title: "Button 1 pressed",
							// 		message: "Action 1"
							// 	}
							// },
							// {
							// 	button: 1,
							// 	notification: "SHOW_ALERT",
							// 	payload: {
							// 		type: "notification",
							// 		title: "Button 1 pressed",
							// 		message: "Action 2"
							// 	}
							// },
		
							// specific page
							// {
							// 	button: 1,
							// 	page: 1,
							// 	notification: "SHOW_ALERT",
							// 	payload: {
							// 		type: "notification",
							// 		title: "Button 1 pressed",
							// 		message: "only on page 1"
							// 	}
							// },
		
							// specific gamepad
							// {
							// 	button: 1,
							// 	gamepadId: "Generic   USB  Joystick   (Vendor: 0079 Product: 0006)",
							// 	notification: "SHOW_ALERT",
							// 	payload: {
							// 		type: "notification",
							// 		title: "Button 1 pressed",
							// 		message: "only on specific gamepad"
							// 	}
							// },
						]
					},					
					{
						name: "hue",
						axisActions: [
							{
								axis: 0,
								direction: "positive",
								threshold: 1,
								notification: "SHOW_ALERT",
								payload: {
									type: "notification",
									title: "Axis 0 moved positive",
									message: "Axis 0+ | hue"
								}
							},
							{
								axis: 0,
								direction: "negative",
								threshold: 1,
								notification: "SHOW_ALERT",
								payload: {
									type: "notification",
									title: "Axis 0 moved negative",
									message: "Axis 0- | hue"
								}
							},
						],
						buttonActions: [
							{
								button: 1,
								notification: "SHOW_ALERT",
								payload: {
									type: "notification",
									title: "Button 1 pressed",
									message: "Action 1 | hue"
								}
							},
							{
								button: 0,
								notification: "NEW_GAMEPAD_CONTROLSET",
								payload: "default"
							}
						]
					}
				]
			}
		}