'use strict';

import MainCtrl from './main/main.controller';
import CartCtrl from './cart/cart.controller';
import LayerPaletteCtrl from './layerpalette/layerpalette.controller';

import editor from '../components/editor/editor.directive';

import LayerService from './services/layer.service';

angular.module('templates', []);

angular.module('inksy', ['ngAnimate', 'ui.bootstrap', 'templates'])
	.controller('MainCtrl', MainCtrl)
	.controller('CartCtrl', CartCtrl)
	.controller('LayerPaletteCtrl', LayerPaletteCtrl)

	.directive('editor', editor)

	.factory('LayerService', LayerService)
;