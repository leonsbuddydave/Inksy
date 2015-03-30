'use strict';

var settings = {
	clientId: null,
	redirectUri: null,
	apiBasename: 'https://api.instagram.com/',
	apiVersion: 'v1',
	accessToken: null
};

var InstagramProvider = function() {
	this.init = (clientId, redirectUri) => {
		settings.clientId = clientId;
		settings.redirectUri = redirectUri;
	}

	this.$get = Instagram.$inject.concat(($http, $window, $document, $interval, $q) => {
		return new Instagram($http, $window, $document, $interval, $q);
	});
};

class Instagram {
	constructor($http, $window, $document, $interval, $q) {
		this.$http = $http;
		this.$window = $window;
		this.$document = $document;
		this.$interval = $interval;
		this.$q = $q;

		return this;
	}

	getApiUrl() {
		return [
			settings.apiBasename,
			settings.apiVersion
		].join('');
	}

	api(url, params) {
		var apiUrl, queryString, finalUrl, $http, $q, deferred;

		$http = this.$http;
		$q = this.$q;

		deferred = $q.defer();

		console.log('Api being called!');;

		apiUrl = this.getApiUrl() + url;
		queryString = [];
		params = params || {};

		params['access_token'] = settings.accessToken;
		params['callback'] = 'JSON_CALLBACK';

		for (let paramName in params) {
			var param;

			param = params[paramName];
			queryString.push( paramName + '=' + param );
		}

		finalUrl = [apiUrl, '?', queryString.join('&')].join('')

		$http.jsonp(finalUrl).then((response) => {
			var instagramMeta, instagramData;

			instagramMeta = response.data.meta;
			instagramData = response.data.data;

			deferred.resolve(instagramData);
		}, () => {
			// TODO: Graceful error handling for Instagram API failures
		});

		return deferred.promise;
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
						settings.accessToken = accessToken;
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

Instagram.$inject = ['$http', '$window', '$document', '$interval', '$q'];

export { Instagram, InstagramProvider };