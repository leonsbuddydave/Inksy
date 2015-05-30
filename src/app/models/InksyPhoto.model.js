'use strict';

var InksyPhoto = function() {
	class InksyPhoto {
		constructor() {
			this.images = {};
		}

		toJSON() {
			var json = {};

			json.images = this.images;
			json.externalId = this.externalId;

			return json;
		}

		static fromJson(json) {
			var instance = new InksyPhoto();

			instance.images = json.images;
			instance.externalId = json.externalId;

			return instance;
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