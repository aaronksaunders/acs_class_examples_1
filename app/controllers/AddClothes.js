//
// 
// arguments passed into controller
//
// - closetAttributes: the properties for the closetCollection
//
var args = arguments[0] || {};


var ClosetService = require('closetService');

/**
 * click handler for adding item to the closet
 */
function doSaveClothes() {

	var closetId = args.closetAttributes.id;
	var params = {
		type : $.typeTF.value,
		tags : $.tagsTF.value
	};

	ClosetService.addClothesToCloset(closetId, params).then(function(_updatedCloset) {
		// got the updated closet so update the collection of clothes,
		// the close collection is global so lets just reset it
		clothesCollection.reset(_updatedCloset.attributes["[CUSTOM_clothing]clothing_ids"]);

		// close the window now  that you have added the item
		$.addClothesWindow.close();

	}, function(_error) {
		alert('Item Not Saved to Closet ' + _error.message);
	});
}

