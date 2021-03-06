//
// Service for working with the closet collection and clothes
// model object. This separates the functionality into a 
// reusable service
//
//
/**
 * @param {Object} _params - fields for the closet object
 * @returns a {Promise}
 */
function _createCloset(_params) {
	var closet = Alloy.createModel('Closet');
	return closet.save(_params);
}

/**
 *
 * @param {Object} _closetId
 * @param {Object} _clothesInformation - fields for the clothing object
 */
function _addClothes(_closetId, _clothesInformation) {
	var clothing = Alloy.createModel('Clothing');
	var closet = Alloy.createModel('Closet');

	// 1) get the closet
	return closet.fetch({
		id : _closetId,
		data : {
			response_json_depth : 2,
			sel : JSON.stringify({
				"all" : ["[CUSTOM_clothing]clothing_ids", "id"]
			})
		}
	}).then(function(_closetObject) {
		// 2) create the clothing item
		return clothing.save(_clothesInformation);
	}).then(function(_newClothing) {
		// 3) add clothing item to closet

		// 3a) get the array of clothes
		var clothesArray = closet.get('[CUSTOM_clothing]clothing_ids') || [];

		// 3b) get JUST the array of clothes ids
		if (clothesArray.length) {
			clothesArray = clothesArray.map(function(_item) {
				return _item.id;
			});
		}

		// 3c) Add the id of the new piece of clothing
		clothesArray.push(_newClothing.id);

		// 3d) just set the fields we need to update,the clothesArray
		closet.clear().set({
			'[CUSTOM_clothing]clothing_ids' : clothesArray,
			id : _closetId
		});
		// 3e) save the closet with the updated clothes Array
		return closet.save();
	}, function(_error) {
		console.log(_error);
	});

}

/**
 * gets a specific clothing object based on the 
 * object id of the clothing
 * 
 * @param {Object} _id
 */
function _getClothing(_id) {
	var clothing = Alloy.createCollection('Clothing');

	return clothing.fetch({
		id : _id,
		data : {
			response_json_depth : 2
		}
	});
}

/**
 * 
 */
function _getAllClosets() {
	var closetCollection = Alloy.createCollection('Closet');
	return closetCollection.fetch({
		data : {
			response_json_depth : 4
		}
	});
}

/**
 * gets all of the clothing in all closets
 */
function _getAllClothing() {
	var clothing = Alloy.createCollection('Clothing');
	return clothing.fetch({
		data : {
			response_json_depth : 2
		}
	});
}

/**
 * gets all of the clothing from a specific closet
 * 
 * @param {Object} _closetId
 */
function _getAllClothingByClosetId(_closetId) {

	var clothing = Alloy.createCollection('clothing');

	var queryObject = {
		'[CUSTOM_closet]closet_id' : _closetId
	};

	return clothing.fetch({
		data : {
			where : JSON.stringify(queryObject)
		}
	});
}

function _queryCloset() {

}

module.exports = {
	createCloset : _createCloset,
	getAllClosets : _getAllClosets,
	getEverythingInCloset : _getAllClothingByClosetId,
	getClothingById : _getClothing,
	addClothesToCloset : _addClothes,
	findInCloset : _queryCloset
};
