'use strict';

var instagramPanel = function(Instagram, InksyAlbum) {
	return {
		templateUrl: 'app/partials/instagram-panel.html',
		restrict: 'AE',
		link: function(scope, element, attributes) {
			const PHOTOS_PER_REQUEST = 20;
			var nextApiUrl = '/users/self/media/recent';
			var apiRequestInProgress = false;

			scope.auth = null;
			scope.album = null;

			/**
			 * [connectToInstagram Connects to the user's Instagram account
			 * and retrieves user photos]
			 */
			scope.connectToInstagram = function() {
				apiRequestInProgress = true;
				Instagram.login(function(response) {
					scope.auth = response.authResponse;
					apiRequestInProgress = false;
					scope.loadMorePhotos();
				});	
			}

			/**
			 * [canLoadMore Returns true if we have what we need
			 * to load more photos]
			 * @return {[type]} [description]
			 */
			scope.canLoadMore = function() {
				var can = scope.isConnected();
				can &= (!apiRequestInProgress);
				can &= (nextApiUrl !== null);

				return can;
			}

			/**
			 * [loadMorePhotos Attempts to load more Instagram photos]
			 */
			scope.loadMorePhotos = function() {
				if (!scope.canLoadMore()) {
					console.info("Can't load photos at this time.");
					return;
				}

				apiRequestInProgress = true;

				Instagram.api(nextApiUrl, {count: PHOTOS_PER_REQUEST}).then(function(response) {
					var photos, meta, pagination;

					photos = response.data;
					meta = response.meta;
					pagination = response.pagination;

					nextApiUrl = pagination.next_url || null;

					scope.album = InksyAlbum.fromInstagramData(photos, scope.album);

					apiRequestInProgress = false;
				});
			}

			/**
			 * [isConnected Is the user connected to Instagram?]
			 */
			scope.isConnected = function() {
				return scope.auth !== null;
			}

			scope.getAlbum = function() {
				return scope.album;
			}

			scope.onPhotoClick = function(photo) {
				console.log('Photo clicked!');
			}
			
		}
	}
};

instagramPanel.$inject = ['Instagram', 'InksyAlbum'];

export default instagramPanel;