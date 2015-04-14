var args = arguments[0] || {};

function closeWindow() {
	$.getView().close();
}

/**
 * Called by Alloy for each model before rendering to transform it
 * into something that is better for display
 */
function transformData(_model) {

	var attr = _model.attributes;
	return {
		type : attr["type"],
		tags : attr["tags"].toString(),
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

	// now display the data
	var data = currentItem.properties.model;
	alert("clicked on\nid: " + data.id + "\nEvent: " + data.name + "\nWhen: " + data.location);

	// - NOTE -
	// can also get the item from the collection directly
	//

}

/**
 * adds item of clothing to current closet
 */
function doAddItemToCloset() {
	alert("Add Item To Closet was CLicked");


	// open new controller/window
	var controller = Alloy.createController("AddClothes", {
		closetAttributes : args.closet, // need information on closet
	});

	if (OS_IOS) {
		Alloy.Globals.navWindow.openWindow(controller.addClothesWindow);
	} else {
		controller.addClothesWindow.open();
	}
}

/**
 * Event Listener called when the window is closed
 */
$.getView().addEventListener("close", function() {
	$.destroy();
});

// -- FETCH ALL OF THE DATA FOR THE INITIAL DISPLAY --
clothesCollection.reset(args.clothesArray);

