'use strict';

import MainCtrl from './main/main.controller';
import CartCtrl from './cart/cart.controller';
import LayerPaletteCtrl from './layerpalette/layerpalette.controller';
import GalleryCtrl from './gallery/gallery.controller';

import editor from '../components/editor/editor.directive';
import fileUploadButton from './directives/fileUploadButton.directive';

import LayerService from './services/layer.service';

import { ImageLayer } from './models/layer.model.js';
import ProductImage from './models/product-image.model.js';

angular.module('templates', []);

angular.module('inksy', ['ngAnimate', 'ui.bootstrap', 'templates'])
	.controller('MainCtrl', MainCtrl)
	.controller('CartCtrl', CartCtrl)
	.controller('LayerPaletteCtrl', LayerPaletteCtrl)
	.controller('GalleryCtrl', GalleryCtrl)

	.directive('editor', editor)
	.directive('fileUploadButton', fileUploadButton)

	.factory('LayerService', LayerService)
;