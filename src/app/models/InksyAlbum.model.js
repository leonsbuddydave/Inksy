'use strict';

var InksyAlbum = function(InksyPhoto) {
	class InksyAlbum {
		constructor(name) {
			this.name = name;
			this.photos = [];
		}

		setExternalId(externalId) {
			this.externalId = externalId;
		}

		getExternalId() {
			return this.externalId;
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

		setCoverPhotoId(coverPhotoId) {
			this.coverPhotoId = coverPhotoId;
		}

		getCoverPhotoId() {
			return this.coverPhotoId;
		}

		setPaging(paging) {
			this.paging = paging;
		}

		getPaging() {
			return this.paging;
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

	InksyAlbum.fromFacebookData = function(facebookData, albums) {
		var stubAlbums = albums || [];

		if (angular.isArray(facebookData)) {
			facebookData.forEach(function(item, index) {
				var album = new InksyAlbum(item.name);
				album.setCoverPhotoId(item.cover_photo);
				album.setExternalId(item.id);

				if (item.photos) {
					album.setPaging(item.photos.paging);

					item.photos.data.forEach(function(item, index) {
						var photo;
						photo = new InksyPhoto();
						photo.setExternalId(item.id);
						photo.setHD(item.source);
						album.addPhoto(photo);
					})
				}

				stubAlbums.push(album);
			});
		}

		return stubAlbums;
	}

	return InksyAlbum;
}

InksyAlbum.$inject = ['InksyPhoto'];

export default InksyAlbum;