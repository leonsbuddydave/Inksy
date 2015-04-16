'use strict'

class InksyImage {
	constructor(src, image) {
		this.src = src;
		this.image = image;
		this.dpi = {
			x: 0,
			y: 0
		}
	}
}

class GalleryCtrl {
	constructor($scope, $rootScope, $q, $modal) {

		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$q = $q;
		this.$modal = $modal;

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

		this.handleImageDrop = (data) => {
			switch (data.type) {
				case 'image': {
					var img = new Image();
					img.onload = () => {
						$scope.$apply(function() {
							$rootScope.$broadcast('image:new', img);
						});
					}
					img.src = data.data;
				}
				break;

				case 'file': {
					$rootScope.$broadcast('file:new', data.files);
				}
				break;
			}
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

				result = new InksyImage(src, img);

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

	getFacebookPhotos($event) {
		var facebookModal, $modal;

		$modal = this.$modal;

		facebookModal = $modal.open({
			controller: 'FacebookPhotoImportCtrl',
			controllerAs: 'import',
			templateUrl: 'FacebookPhotoImportModal.html',
			resolve: {
				network: () => 'facebook'
			},
			size: 'lg'
		});

		facebookModal.result.then( (results) => {
			results.forEach((url, index) => {
				var img, result;

				img = new Image();
				img.src = url;
				
				result = new InksyImage(src, img);

				this.images.push(result);
			});
		});
	}

	getInstagramPhotos($event) {
		var instagramModal, $modal;

		$modal = this.$modal;

		instagramModal = $modal.open({
			controller: 'FacebookPhotoImportCtrl',
			controllerAs: 'import',
			templateUrl: 'FacebookPhotoImportModal.html',
			resolve: {
				network: () => 'instagram'
			},
			size: 'lg'
		})

		// TODO: Make this do literally anything
		instagramModal.result.then( (results) => {
			console.log(results);
		});
	}

	/*
		Following methods might belong
		in their own DPI-based service
	*/
	getPrintResolution(image, dpi) {
		var naturalWidth, naturalHeight, printWidth, printHeight;

		if (typeof dpi === 'undefined') dpi = 300;

		naturalWidth = image.naturalWidth;
		naturalHeight = image.naturalHeight;

		printWidth = naturalWidth / dpi;
		printHeight = naturalHeight / dpi;

		return {
			width: printWidth,
			height: printHeight
		}
	}

	/*
		DOOT
	*/
	isDpiCool(image) {
		var printResolution;

		printResolution = getPrintResolution(image, 300);
	}
}

GalleryCtrl.$inject = ['$scope', '$rootScope', '$q', '$modal'];

export default GalleryCtrl;