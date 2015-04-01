'use strict';

class FacebookPhotoImportCtrl {
	constructor($scope, Facebook, network, Instagram) {
		var facebookReadyWatcher;

		this.network = network;
		this.$scope = $scope;

		$scope.selectedAlbum = null;
		$scope.selectedPhotos = {};
		$scope.importing = false;

		this.socialData = {
			'facebook': null,
			'instagram': null
		};

		facebookReadyWatcher = $scope.$watch( () => Facebook.isReady(), (isReady) => {
			if (isReady) {
				// Done watching
				facebookReadyWatcher();

				// But only do shit if it's Facebook
				if (this.isFacebook()) {
					Facebook.login((response) => {
						$scope.auth = response.authResponse;
						this.auth = response.authResponse;
						Facebook.api('/me/albums?fields=photos,name,description,cover_photo', (response) => {
							console.log(response.data);
							$scope.albums = response.data;
							this.socialData.facebook = {
								albums: response.data
							}
						});
					}, {
						scope: 'user_photos'
					});
				}
			}
		});

		if (this.isInstagram()) {
			Instagram.login((response) => {
				this.auth = response.authResponse;
				Instagram.api('/users/self/media/recent').then((photos) => {
					this.socialData.instagram = {
						photos: photos
					};
				});
			});
		}

		$scope.selectAlbum = (album) => {
			$scope.selectedAlbum = album;
		};

		$scope.togglePhotoSelection = (photo) => {
			var id, selectedPhotos;

			id = photo.id;
			selectedPhotos = $scope.selectedPhotos;

			selectedPhotos[id] = !selectedPhotos[id];
		};

		$scope.importSelected = () => {
			var results = [];

			$scope.importing = true;

			for (let id in $scope.selectedPhotos) {
				results.push( getUrlForPhotoId(id) );
			}

			$scope.$close(results);
		}

		var getUrlForPhotoId = function(id) {
			return "https://graph.facebook.com/" + id + "/picture?access_token=" + $scope.auth.accessToken;
		}
	}

	isFacebook() {
		return (this.network === 'facebook');
	}

	isInstagram() {
		return (this.network === 'instagram');
	}

	getAlbums() {
		if (this.isFacebook()) {
			return this.socialData.facebook.albums;
		} else if (this.isInstagram()) {
			return [];
		} else {
			return [];
		}
	}

	getPhotos() {
		var $scope;

		$scope = this.$scope;

		if (this.isFacebook()) {
			return $scope.selectedAlbum.photos.data;
		} else if (this.isInstagram()) {
			if (this.socialData.instagram !== null) {
				return this.socialData.instagram.photos;	
			} else {
				return [];
			}
		} else {
			return [];
		}
	}

	/*
		Returns an album preview url for a
		given album based on the current
		network. Some networks do not support this.
	*/
	getAlbumPreviewUrl(album) {
		var accessToken, id;

		if (angular.isUndefined(album)) return null;

		accessToken = this.auth.accessToken;
		id = album.id;

		if (this.isFacebook()) {
			return [
				"https://graph.facebook.com/",
				id,
				"/picture?type=album&access_token=",
				accessToken
			].join('');
		} else if (this.isInstagram()) {
			return null;
		} else {
			return null;
		}
	}

	/*
		Returns the url for a given photo
		based on the current network.
	*/
	getPhotoPreviewUrl(photo) {
		var accessToken, id;

		if (angular.isUndefined(photo)) return null;

		accessToken = this.auth.accessToken;
		id = photo.id;

		if (this.isFacebook()) {
			return [
				"https://graph.facebook.com/",
				id,
				"/picture?access_token=",
				accessToken
			].join('');
		} else if (this.isInstagram()) {
			return photo.images.low_resolution.url;
		} else {
			return null;
		}
	}
}

FacebookPhotoImportCtrl.$inject = ['$scope', 'Facebook', 'network', 'Instagram'];

export default FacebookPhotoImportCtrl;