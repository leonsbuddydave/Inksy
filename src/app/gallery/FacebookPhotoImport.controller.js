'use strict';

class FacebookPhotoImportCtrl {
	constructor($scope, Facebook) {

		$scope.selectedAlbum = null;

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
		}
	}
}

FacebookPhotoImportCtrl.$inject = ['$scope', 'Facebook'];

export default FacebookPhotoImportCtrl;