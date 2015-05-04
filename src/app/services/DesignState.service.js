'use strict';

class Design {
	constructor() {
		this.color = "#fff";
		this.sides = {};
		this.variant = null;
		this.material = null;
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

	getMaterial() {
		return this.material;
	}

	setMaterial(material) {
		this.material = material;
	}
}

var DesignState = function($rootScope, InksyEvents, $q) {
	
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
		// console.log(design);
		$rootScope.$broadcast(InksyEvents.DESIGN_CHANGED, design);
	};

	var exportForPrint = function(options, callback) {
		var side,
			area,
			printArea,
			printWidthInPixels,
			printHeightInPixels,
			originalDesignWidthInPixels,
			originalDesignHeightInPixels,
			printScaleX,
			printScaleY,
			printCanvas,
			printCanvasElement,
			variant,
			variantSides,
			layers;

		variant = design.getVariant();
		variantSides = variant.getAllSides();

		angular.extend(options || {}, {
			ppi: 300
		});

		for (let sideId in variantSides) {

			side = variantSides[sideId];
			printArea = side.getPrintArea();
			area = side.getArea();

			printWidthInPixels = options.ppi * printArea.width;
			printHeightInPixels = options.ppi * printArea.height;

			printScaleX = printWidthInPixels / area.width;
			printScaleY = printHeightInPixels / area.height;

			printCanvasElement = fabric.util.createCanvasElement();
			printCanvasElement.width = printWidthInPixels;
			printCanvasElement.height = printHeightInPixels;
			printCanvas = new fabric.Canvas(printCanvasElement);

			layers = design.getSides()[sideId].getLayers();

			var objectReadyPromises = [];

			layers.forEach(function(layer, layerIndex) {
				var cloneObject,
					leftRelativeToClipArea,
					topRelativeToClipArea,
					referenceCanvas,
					deferred;

				deferred = $q.defer();
				objectReadyPromises.push(deferred);

				cloneObject = fabric.util.object.clone(layer.getCanvasObject());
				// (cloneObject._regenerateInternalState || angular.noop).apply(cloneObject);
				// (cloneObject._generateCompositeImage || angular.noop).apply(cloneObject);
				cloneObject.clipTo = null;
					
				referenceCanvas = layer.getCanvasObject().canvas;

				leftRelativeToClipArea = (cloneObject.left - ((referenceCanvas.width / 2) + area.offsetX)) * printScaleX;
				topRelativeToClipArea = (cloneObject.top - ((referenceCanvas.height / 2) + area.offsetY)) * printScaleY;

				cloneObject.set({
					scaleX: cloneObject.scaleX * printScaleX,
					scaleY: cloneObject.scaleY * printScaleY,
					left: leftRelativeToClipArea,
					top: topRelativeToClipArea
				});

				cloneObject.maskOptions.scaleX = cloneObject.maskOptions.scaleX * printScaleX;
				cloneObject.maskOptions.scaleY = cloneObject.maskOptions.scaleY * printScaleY;
				// cloneObject.setCoords();

				printCanvas.add(cloneObject);

				if (cloneObject._generateCompositeImage) {
					cloneObject._generateCompositeImage();
				}

				deferred.resolve();
			});

			printCanvas.deactivateAll();
			printCanvas.renderAll();

			var url = printCanvas.toDataURL({
				format: 'png'
			});

			console.log('DesignState', url);
		}
	}

	/* Public Methods */
	return {
		getDesign: getDesign,
		commit: commit,
		exportForPrint: exportForPrint
	};
};

DesignState.$inject = ['$rootScope', 'InksyEvents', '$q'];

export default DesignState;