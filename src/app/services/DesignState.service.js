'use strict';

class Design {
	constructor() {
		this.color = "#fff";
		this.sides = {};
		this.variant = null;
	}

	getSides() {
		return this.sides;
	}

	setSides(sides) {
		this.sides = sides;
	}

	getColor() {
		return this.color;
	}

	setColor(color) {
		this.color = color;
	}

	setVariant(variant) {
		this.variant = variant;
	}

	getVariant() {
		return this.variant;
	}
}

var DesignState = function($rootScope, InksyEvents) {
	
	var design;

	/**
	 * [design Canonical holding object for the design state]
	 * @type {Object}
	 */
	design = new Design();

	/**
	 * [getDesign Returns a reference to the design state singleton]
	 * @return {[type]} [A reference to the design state singleton]
	 */
	var getDesign = function() {
		return design;
	};

	var commit = function() {
		console.log(design);
		$rootScope.$broadcast(InksyEvents.DESIGN_CHANGED, design);
	};

	/* Public Methods */
	return {
		getDesign: getDesign,
		commit: commit
	};
};

DesignState.$inject = ['$rootScope', 'InksyEvents'];

export default DesignState;