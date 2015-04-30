'use strict';

var InksyImage = function() {
	return class InksyImage {
		constructor(src, image) {
			this.src = src;
			this.image = image;
			this.dpi = {
				x: 0,
				y: 0
			}
		}
	}
};

InksyImage.$inject = [];

export default InksyImage;