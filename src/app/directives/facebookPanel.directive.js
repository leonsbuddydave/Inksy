'use strict';

var facebookPanel = function(Facebook, InksyAlbum, $rootScope, InksyEvents) {
	return {
		templateUrl: 'app/partials/facebook-panel.html',
		restrict: 'AE',
		scope: {
			active: '=active'
		},
		link: function(scope, element, attributes) {
			const PHOTOS_PER_REQUEST = 20;
			var nextApiUrl = '/me/albums?fields=photos,name,description,cover_photo';
			var apiRequestInProgress = false;

			scope.auth = null;
			scope.albums = null;
			scope.selectedAlbum = null;

			scope.$on(InksyEvents.TAB_STATUS_CHANGED, function(event, id) {
				if (id === 'facebook' && !scope.isConnected()) {
					scope.connectToFacebook();
				}
			});

			/**
			 * [connectToFacebook Connects to the user's Facebook account
			 * and retrieves user photos]
			 */
			scope.connectToFacebook = function() {
				if (Facebook.isReady()) {
					apiRequestInProgress = true;
					Facebook.login((response) => {
						scope.auth = response.authResponse;
						apiRequestInProgress = false;

						scope.loadMoreAlbums();
					}, {
						scope: 'user_photos'
					});
				} else {
					console.log('Facebook SDK not loaded.');
				}
			}

			scope.canLoadMoreAlbums = function() {
				var can = scope.isConnected();
				can &= (!apiRequestInProgress);
				can &= (nextApiUrl !== null);

				return can;
			}

			scope.getAlbums = function() {
				return scope.albums || [];
			}

			scope.selectAlbum = function(album) {
				scope.selectedAlbum = album;
			}

			scope.getSelectedAlbum = function() {
				return scope.selectedAlbum || null;
			}

			scope.clearSelectedAlbum = function() {
				scope.selectedAlbum = null;
			}

			scope.loadMoreAlbums = function() {
				apiRequestInProgress = true;
				Facebook.api(nextApiUrl, (response) => {
					nextApiUrl = response.paging.next || null;
					scope.albums = InksyAlbum.fromFacebookData(response.data, scope.albums);

					apiRequestInProgress = false;
				});
			}

			// TODO: Implement loading of more photos for a given Album
			scope.loadMorePhotos = function() {
				if (scope.getSelectedAlbum() === null) return;

				console.log(scope.getSelectedAlbum());
			}

			scope.onPhotoClick = function(photo) {
				var image = new Image();
				image.onload = () => {
					scope.$apply(function() {
						$rootScope.$broadcast('image:new', image);
					});
				}
				image.crossOrigin = "anonymous";
				image.src = photo.getHD();
				scope.active = false
			}

			scope.getAlbumPreviewUrl = function(album) {
				var accessToken, id;

				if (angular.isUndefined(album)) return null;

				accessToken = scope.auth.accessToken;
				id = album.getExternalId();

				return [
					"https://graph.facebook.com/",
					id,
					"/picture?type=album&access_token=",
					accessToken
				].join('');
			}

			/**
			 * [isConnected Is the user connected to Facebook]
			 */
			scope.isConnected = function() {
				return scope.auth !== null;
			}

		}
	}
};

facebookPanel.$inject = ['Facebook', 'InksyAlbum', '$rootScope', 'InksyEvents'];

export default facebookPanel;