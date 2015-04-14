// Button Event
OS_IOS && $.settingsBtn.addEventListener('click', openSettings);

// All other cross-platform UI events
$.showEvents.addEventListener('click', doShowEvents);
$.showClosets.addEventListener('click', doShowClosets);
$.createEvent.addEventListener('click', doCreateEvent);

$.init = function(args) {
	$.logoutBtn.addEventListener('click', args.doLogout);

	// MenuItem Event, cannot be set until the menu is drawn
	OS_ANDROID && ($.mainWindow.activity.onPrepareOptionsMenu = function(e) {
		e.menu.findItem(0).addEventListener('click', openSettings);
	});

};

// Show app settings and user profile information
function openSettings() {
	alert("openSettings");
}

//doShowEvents
function doShowEvents() {
	var controller = Alloy.createController("ListInformation");
	if (controller.navWindow) {
		controller.navWindow.open();
	} else {
		controller.getView().open();
	}
}

//doShowClosets
function doShowClosets() {
	var controller = Alloy.createController("ListCloset");
	if (controller.navWindow) {
		controller.navWindow.open();
	} else {
		controller.getView().open();
	}
}

// ================================================================================
//     EVENT TEST FUNCTIONS
// ================================================================================
function doCreateEvent() {
	var anEvent = Alloy.createModel('Event');
	anEvent.set({
		name : 'Celebration',
		start_time : new Date(),
		duration : 3600,
		recurring : 'monthly',
		recurring_count : 5
	});

	anEvent.save().then(function(_model) {
		console.log("anEvent.save " + JSON.stringify(_model, null, 2));

		var moment = require('alloy/moment');
		console.log("start time-relative: " + _model.getFromNowStartTime());
		console.log("start time-formatted: " + _model.getFormattedStartTime());

		return doFetchEvents();

	}, function(_error) {
		alert(_error.message);
	});
}

