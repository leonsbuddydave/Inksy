'use strict';

var InksyPhoto = function() {
	class InksyPhoto {
		constructor() {
			this.images = {};
		}

		setExternalId(id) {
			this.externalId = id;
		}

		getExternalId() {
			return this.externalId;
		}

		setHD(url) {
			this.images.hd = url;
		}

		getHD() {
			return this.images.hd;
		}
	}

	return InksyPhoto;
}

InksyPhoto.$inject = [];

export default InksyPhoto;