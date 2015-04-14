var args = arguments[0] || {};

// If IOS then add the window to the NavigationWindow
if (OS_IOS) {
	$.navWindow.open();

	// used with IOS for TitleBar and Navigation UI
	Alloy.Globals.navWindow = $.navWindow;
}

function closeWindow() {
	$.getView().close();
}

/**
 * Called by Alloy for each model before rendering to transform it
 * into something that is better for display
 */
function transformData(_model) {

	var attr = _model.attributes;
	var nbrOfItems = attr["[CUSTOM_clothing]clothing_ids"] ? attr["[CUSTOM_clothing]clothing_ids"].length : 0;
	return {
		name : attr["name"],
		location : attr["location"],
		mood : attr["mood"],
		items : "# Items: " + nbrOfItems,
		_data : attr // < -- SAVE ALL OF THE MODEL DATA
	};
}

/**
 * called when user clicks on listView. The _event will provide
 * the index of the item clicked in the listView
 *
 * @param {Object} _event
 */
function listItemClicked(_event) {

	// get data using index provided, the items are in the section
	// so we use the index against the section, not the listView
	var currentItem = $.listSection.getItemAt(_event.itemIndex);
	Ti.API.info("currentItem " + JSON.stringify(currentItem, null, 2));

	// - NOTE -
	// can also get the item from the collection directly
	//
	var _collection = closetCollection;
	var model = _collection.models[_event.itemIndex];

	var controller = Alloy.createController("ListClothes", {
		clothesArray : model.get("[CUSTOM_clothing]clothing_ids"),
		closet : model.attributes, // we need the closet
		navWindow : Alloy.Globals.navWindow
	});

	if (OS_IOS) {
		Alloy.Globals.navWindow.openWindow(controller.clothesListWindow);
	} else {
		controller.clothesListWindow.open();
	}
}

/**
 * Event Listener called when the window is closed
 */
$.getView().addEventListener("close", function() {
	$.destroy();
});

// -- FETCH ALL OF THE DATA FOR THE INITIAL DISPLAY --
closetCollection.fetch();

