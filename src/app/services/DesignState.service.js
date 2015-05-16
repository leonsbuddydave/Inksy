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
				(cloneObject._regenerateInternalState || angular.noop).apply(cloneObject);
				// (cloneObject._generateCompositeImage || angular.noop).apply(cloneObject);
				// cloneObject = layer.getCanvasObject().clone();
				cloneObject.clipTo = null;
					
				referenceCanvas = layer.getCanvasObject().canvas;

				var xOffset = ((referenceCanvas.width / 2) + area.offsetX);
				var yOffset = ((referenceCanvas.height / 2) + area.offsetY);

				leftRelativeToClipArea = (cloneObject.left - xOffset) * printScaleX;
				topRelativeToClipArea = (cloneObject.top - yOffset) * printScaleY;

				cloneObject.set({
					scaleX: cloneObject.scaleX * printScaleX,
					scaleY: cloneObject.scaleY * printScaleY,
					left: leftRelativeToClipArea,
					top: topRelativeToClipArea
				});

				if (cloneObject._maskImage) {
					cloneObject.maskScaleX = cloneObject.maskScaleX * printScaleX;
					cloneObject.maskScaleY = cloneObject.maskScaleY * printScaleY;
					cloneObject.maskLeft = (cloneObject.maskLeft - xOffset) * printScaleX;
					cloneObject.maskTop = (cloneObject.maskTop - yOffset) * printScaleY;
				}

				printCanvas.add(cloneObject);

				if (cloneObject._generateCompositeImage) {
					cloneObject._generateCompositeImage();
				}

				console.log(layer.getCanvasObject());

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