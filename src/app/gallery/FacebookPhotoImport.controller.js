'use strict';

class FacebookPhotoImportCtrl {
	constructor($scope, Facebook) {

		$scope.selectedAlbum = null;
		$scope.selectedPhotos = {};
		$scope.importing = false;

		$scope.$watch( () => Facebook.isReady(), (isReady) => {
			if (isReady) {
				Facebook.login((response) => {
					$scope.auth = response.authResponse;
					Facebook.api('/me/albums?fields=photos,name,description,cover_photo', (response) => {
						console.log(response.data);
						$scope.albums = response.data;
					});
				}, {
					scope: 'user_photos'
				});
			}
		});

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
			return "https://graph.facebook.com/" + id + "/picture?access_token=" + $scope.auth.accessToken
		}
	}
}

FacebookPhotoImportCtrl.$inject = ['$scope', 'Facebook'];

export default FacebookPhotoImportCtrl;