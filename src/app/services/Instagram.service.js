'use strict';

var settings = {
	clientId: null,
	redirectUri: null
};

var InstagramProvider = function() {
	this.init = (clientId, redirectUri) => {
		settings.clientId = clientId;
		settings.redirectUri = redirectUri;
	}

	this.$get = Instagram.$inject.concat(($http, $window, $document, $interval) => {
		return new Instagram($http, $window, $document, $interval);
	});
};

class Instagram {
	constructor($http, $window, $document, $interval) {
		this.$http = $http;
		this.$window = $window;
		this.$document = $document;
		this.$interval = $interval;

		return this;
	}

	testMethod() {
		console.log('Test method!');
	}

	getAuthUrl() {
		return [
			'https://instagram.com/oauth/authorize/',
			'?client_id=',
			settings.clientId,
			'&redirect_uri=',
			settings.redirectUri,
			'&response_type=token'
		].join('');
	}

	getWindowFeatures(width, height) {
		var
			$window,
			$document,
			screenX,
			screenY,
			outerWidth,
			outerHeight,
			left,
			top,
			features;

		$window = this.$window;
		$document = this.$document;
		features = [];

		screenX = $window.screenX || $window.screenLeft;
		screenY = $window.screenY || $window.screenTop;
		outerWidth = $window.outerWidth || $document.documentElement.clientWidth;
		outerHeight = $window.outerHeight || ($document.documentElement.clientHeight - 22);

		left = screenX + ((outerWidth - width) / 2);
		top = screenY + ((outerHeight - height) / 2.5);

		features.push('width=' + width);
		features.push('height=' + height);
		features.push('left=' + left);
		features.push('top=' + top);
		features.push('scrollbars=1,location=1,toolbar=0');

		return features.join(',');
	}

	login(callback) {
		var win, $window, windowOptions, $interval, accessToken;

		$window = this.$window; 
		$interval = this.$interval;

		win = $window.open(settings.redirectUri, '_blank', this.getWindowFeatures(600, 400));

		win.onload = () => {
			if (window.location.hash.length === 0) {
				win.open(this.getAuthUrl(), '_self', this.getWindowFeatures(600, 400));
			}

			var interval = $interval(() => {
				try {
					if (win.location.hash.length) {
						$interval.cancel(interval);
						accessToken = win.location.hash.replace('#access_token=', '');
						win.close();

						if (!angular.isUndefined(callback)) {
							callback({
								authResponse: {
									accessToken: accessToken	
								}
							});
						}
					}
				} catch (e) {
					// Permission Denied
				}
			}, 100);
		};
	}
}

Instagram.$inject = ['$http', '$window', '$document', '$interval'];

export { Instagram, InstagramProvider };