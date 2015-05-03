'use strict'

class GalleryCtrl {
	constructor($scope, $rootScope, $q, $modal, InksyImage) {

		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$q = $q;
		this.$modal = $modal;
		this.InksyImage = InksyImage;

		this.images = [];

		// Defined up here because I'm not sure
		// if it's actually possible to bind a 
		// class method to a particular lexical scope
		this.fileHandler = (event, files) => {
			var uploadPromise;

			uploadPromise = this.uploadFiles(files)

			uploadPromise.then(function() {
				
			});
		}

		$scope.$on('file:new', (event, files) => {
			var uploadPromise;

			uploadPromise = this.uploadFiles(files);

			uploadPromise.then((images) => {
				for (let image of images) {
					var img = new Image();
					img.src = image.src;
					$rootScope.$broadcast('image:new', img);
				}
			}, () => {
				console.error("Exception in file upload.");
			});
		});

		return this;
	}

	// Uploads a list of files,
	// returns a promise that completes
	// when all files have been uploaded
	uploadFiles(files) {
		var fileUploadPromises;

		fileUploadPromises = [];

		for (let i = 0; i < files.length; i++) {
			let reader, file, uploadPromise;

			file = files[i];
			uploadPromise = this.$q.defer();

			reader = new FileReader();
			reader.onload = (event) => {
				var src, result, img;

				src = event.target.result;
				img = new Image();

				result = new this.InksyImage(src, img);

				img.onload = () => {
					uploadPromise.resolve(result);
				}
				img.src = src;

				this.images.push(result);
			}
			reader.readAsDataURL(file);

			fileUploadPromises.push(uploadPromise.promise);
		}

		return this.$q.all(fileUploadPromises);
	}
}

GalleryCtrl.$inject = ['$scope', '$rootScope', '$q', '$modal', 'InksyImage'];

export default GalleryCtrl;