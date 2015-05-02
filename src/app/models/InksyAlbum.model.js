'use strict';

var InksyAlbum = function(InksyPhoto) {
	class InksyAlbum {
		constructor(name) {
			this.name = name;
			this.photos = [];
		}

		getName() {
			return this.name;
		}

		addPhoto(photo) {
			this.photos.push(photo);
		}

		getPhotos() {
			return this.photos;
		}

		setNextUrl(nextUrl) {
			this.nextUrl = nextUrl;
		}

		getNextUrl() {
			return this.nextUrl;
		}
	}

	InksyAlbum.fromInstagramData = function(instagramData, album) {
		var stubAlbum = album || new InksyAlbum('default');

		if (angular.isArray(instagramData)) {
			var photo;
			instagramData.forEach(function(item, index) {
				photo = new InksyPhoto();
				photo.setExternalId(item.id);
				photo.setHD(item.images.standard_resolution.url);
				stubAlbum.addPhoto(photo);
			});
		}
		
		return stubAlbum;
	}

	InksyAlbum.fromFacebookData = function(facebookData) {
		return new InksyAlbum('default');
	}

	return InksyAlbum;
}

InksyAlbum.$inject = ['InksyPhoto'];

export default InksyAlbum;