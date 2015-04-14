//
// GLOBAL COLLECTION INSTANCE
//
infoCollection = Alloy.Collections.instance('event');
closetCollection = Alloy.Collections.instance('closet');
clothesCollection = Alloy.Collections.instance('clothing');

// check if there is a user session saved already
var aUser = Alloy.createModel('User');
if (aUser.authenticated()) {
	// rehydrate the user
	aUser.showMe().then(function(_user) {
		userLoggedIn(_user);
	}, function(_error) {
		alert("Application Error\n " + _response.error.message);
		Ti.API.error(JSON.stringify(_response.error, null, 2));
		// go ahead and do the login
		userNotLoggedIn();
	});
} else {
	userNotLoggedIn();
}

/**
 *
 */
function userLoggedIn(_user) {

	if (!$.alreadyOpenedIndex) {
		// start the application, if using IOS then open the 
		// navWindow to start the app instead of the mainWindow
		var mainWindow = $.navWindow || $._index.mainWindow;
		mainWindow.open();

		$.alreadyOpenedIndex = true;
	}

	Alloy.Globals.CURRENT_USER = _user;

	// set button title with name to show we are logged in
	$._index.logoutBtn.title = "Logout: " + _user.get("username");

	// added support for getting location from the user
	// object since it seems like a helpful feature
	//
	// set to true to get location
	false && _user.getCurrentLocation().then(function(_results) {
		Ti.API.debug('_results ' + JSON.stringify(_results, null, 2));
	}, function(_error) {
		Ti.API.error('_error ' + JSON.stringify(_error));
	});

}

/**
 *
 */
function userNotLoggedIn() {
	// display login information
	var ctrl = Alloy.createController('User', {
		callback : function(_user) {

			userLoggedIn(_user);

			// close the old window
			ctrl.getView().close();
			ctrl = nil;
		}
	});

	ctrl.getView().open();
}

/**
 *
 */
function doLogout() {
	if (Alloy.Globals.CURRENT_USER) {
		Alloy.Globals.CURRENT_USER.logout().then(function(_model) {
			Alloy.Globals.CURRENT_USER = null;
			console.log("logged out!");

			// display login window
			userNotLoggedIn();

		}, function(_error) {
			alert(_error.message);
		});
	}
}

$._index.mainWindow.addEventListener('open', function() {

	// Set the parent object on the required _index view,
	// pass in the logout function, wait until the window
	// is displayed
	$._index.init({
		parent : $,
		doLogout : doLogout
	});

});

$._index.mainWindow.addEventListener('androidback', function(e) {
	$._index.mainWindow.close();

	// get activity and cleanup
	$._index.mainWindow.activity.finish();
});

