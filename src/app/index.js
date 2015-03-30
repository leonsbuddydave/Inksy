'use strict';

import MainCtrl from './main/main.controller';
import CartCtrl from './cart/cart.controller';
import LayerPaletteCtrl from './layerpalette/layerpalette.controller';
import GalleryCtrl from './gallery/gallery.controller';
import FacebookPhotoImportCtrl from './gallery/FacebookPhotoImport.controller';

import editor from '../components/editor/editor.directive';
import fileUploadButton from './directives/fileUploadButton.directive';
import draggable from './directives/draggable.directive';
import droppable from './directives/droppable.directive';
import backgroundImage from './directives/backgroundImage.directive';

import LayerService from './services/layer.service';
import { Instagram, InstagramProvider } from './services/Instagram.service';

import { ImageLayer } from './models/layer.model';
import ProductImage from './models/product-image.model';
import ProductAngle from './models/product-angle.constant';

angular.module('templates', []);

angular.module('inksy', ['ngAnimate', 'ui.bootstrap', 'templates', 'dndLists', 'facebook'])
	.config(function(FacebookProvider, InstagramProvider) {
		FacebookProvider.init('1561447194144363');
		InstagramProvider.init('755dd07bfe2e49408dd93d59cc810b2c', 'http://localhost:3000/assets/instagram_redirect.html');
	})
	.controller('MainCtrl', MainCtrl)
	.controller('CartCtrl', CartCtrl)
	.controller('LayerPaletteCtrl', LayerPaletteCtrl)
	.controller('GalleryCtrl', GalleryCtrl)
	.controller('FacebookPhotoImportCtrl', FacebookPhotoImportCtrl)

	.directive('editor', editor)
	.directive('fileUploadButton', fileUploadButton)
	.directive('draggable', draggable)
	.directive('droppable', droppable)
	.directive('backgroundImage', backgroundImage)

	.factory('LayerService', LayerService)
	.factory('Instagram', Instagram)

	.provider('Instagram', InstagramProvider)

	.constant('ProductAngle', ProductAngle)
;