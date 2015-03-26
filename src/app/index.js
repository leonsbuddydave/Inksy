'use strict';

import MainCtrl from './main/main.controller';
import CartCtrl from './cart/cart.controller';
import LayerPaletteCtrl from './layerpalette/layerpalette.controller';
import GalleryCtrl from './gallery/gallery.controller';

import editor from '../components/editor/editor.directive';
import fileUploadButton from './directives/fileUploadButton.directive';
import draggable from './directives/draggable.directive';
import droppable from './directives/droppable.directive';

import LayerService from './services/layer.service';

import { ImageLayer } from './models/layer.model';
import ProductImage from './models/product-image.model';
import ProductAngle from './models/product-angle.constant';

angular.module('templates', []);

angular.module('inksy', ['ngAnimate', 'ui.bootstrap', 'templates', 'dndLists'])
	.controller('MainCtrl', MainCtrl)
	.controller('CartCtrl', CartCtrl)
	.controller('LayerPaletteCtrl', LayerPaletteCtrl)
	.controller('GalleryCtrl', GalleryCtrl)

	.directive('editor', editor)
	.directive('fileUploadButton', fileUploadButton)
	.directive('draggable', draggable)
	.directive('droppable', droppable)

	.factory('LayerService', LayerService)

	.constant('ProductAngle', ProductAngle)
;