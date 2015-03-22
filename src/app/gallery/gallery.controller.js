'use strict'

class GalleryCtrl {
	constructor($scope, $rootScope, $q) {

		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$q = $q;

		this.images = [];

		// Defined up here because I'm not sure
		// if it's actually possible to bind a 
		// class method to a particular lexical scope
		this.fileHandler = (event, files) => {
			var uploadPromise;

			uploadPromise = this.uploadFiles(files)

			uploadPromise.then(function() {
				console.log('DONE UPLOADING');
			});
		}

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
				var src, result;

				src = event.target.result;
				result = {
					src: src
				};

				this.images.push(result);
				uploadPromise.resolve(result);
			}
			reader.readAsDataURL(file);

			fileUploadPromises.push(uploadPromise.promise);
		}

		return this.$q.all(fileUploadPromises);
	}

}

GalleryCtrl.$inject = ['$scope', '$rootScope', '$q'];

export default GalleryCtrl;