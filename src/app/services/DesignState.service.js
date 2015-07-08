'use strict';

var DesignState = function(Design, $rootScope, InksyEvents, $q) {

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

	var loadDesign = function(json, productData) {
		design = Design.fromJson(json, productData);
		return design;
	};

	var commit = function(sourceContext) {
		// console.log(design);
		$rootScope.$broadcast(InksyEvents.DESIGN_CHANGED, design, sourceContext);
	};

	var designToJson = function() {
		return JSON.stringify(design);
	}

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
		console.log('variant: ' + JSON.stringify(variant));
		console.log('variant sides' + JSON.stringify(variantSides));
		angular.extend(options || {}, {
			ppi: 100
		});

		for (let sideId in variantSides) {

			side = variantSides[sideId];
			printArea = side.getPrintArea();
			area = side.area;

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
				cloneObject.clipTo = null;
				cloneObject.popMask();
				cloneObject.removeFirstMask();

				referenceCanvas = layer.getCanvasObject().canvas;

				var topLeftOfClipArea = side.getOffsetFromCenter();

				var xOffset = ((referenceCanvas.width / 2) + topLeftOfClipArea.x);
				var yOffset = ((referenceCanvas.height / 2) + topLeftOfClipArea.y);

				leftRelativeToClipArea = (cloneObject.left - xOffset) * printScaleX;
				topRelativeToClipArea = (cloneObject.top - yOffset) * printScaleY;

				cloneObject.set({
					scaleX: cloneObject.scaleX * printScaleX,
					scaleY: cloneObject.scaleY * printScaleY,
					left: leftRelativeToClipArea,
					top: topRelativeToClipArea
				});

				cloneObject.getMasks().forEach(function(mask) {
					mask.setWidth( mask.getWidth() * mask.scaleX * printScaleX );
					mask.setHeight( mask.getHeight() * mask.scaleY * printScaleY );
				})

				printCanvas.add(cloneObject);

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
		loadDesign: loadDesign,
		commit: commit,
		exportForPrint: exportForPrint,
		designToJson: designToJson
	};
};

DesignState.$inject = ['Design', '$rootScope', 'InksyEvents', '$q'];

export default DesignState;
