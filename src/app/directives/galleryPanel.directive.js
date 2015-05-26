'use strict';

var galleryPanel = function(InksyPhoto, $q, $rootScope, InksyEvents) {
	return {
		templateUrl: 'app/partials/gallery-panel.html',
		restrict: 'AE',
		scope: {},
		link: function(scope, element, attributes) {
			scope.photos = [];

			scope.$on(InksyEvents.NEW_FILE_INCOMING, function(event, files) {
				var uploadPromise = scope.uploadImages(event, files);

				uploadPromise.then(function(results) {
					results.forEach(function(photo, index) {
						var image = new Image();
						image.onload = () => {
							scope.$apply(function() {
								$rootScope.$broadcast('image:new', image);
							});
						}
						image.src = photo.getHD();
					});
				});
			});

			scope.uploadImages = function(event, files) {
				var allUploadPromises = [];

				for (let i = 0; i < files.length; i++) {
					let reader, file, uploadPromise;

					file = files[i];
					uploadPromise = $q.defer();
					allUploadPromises.push(uploadPromise.promise);

					reader = new FileReader();
					reader.onload = (event) => {
						var src, result;

						src = event.target.result;

						result = new InksyPhoto();
						result.setHD(src);

						uploadPromise.resolve(result);
					}
					reader.readAsDataURL(file);

					uploadPromise.promise.then(function(result) {
						scope.addPhoto(result);
						return result;
					});
				}

				return $q.all(allUploadPromises);
			}

			scope.addPhoto = function(photo) {
				scope.photos.push(photo);
			}

			scope.getPhotos = function() {
				return scope.photos;
			}

			scope.onPhotoClick = function(photo) {
				var image = new Image();
				image.onload = () => {
					scope.$apply(function() {
						$rootScope.$broadcast('image:new', image);
					});
				}
				image.src = photo.getHD();
			}
		}
	}
}

galleryPanel.$inject = ['InksyPhoto', '$q', '$rootScope', 'InksyEvents'];

export default galleryPanel;