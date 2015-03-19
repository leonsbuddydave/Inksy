'use strict';

import MainCtrl from './main/main.controller';
import CartCtrl from './cart/cart.controller';
import LayerPaletteCtrl from './layerpalette/layerpalette.controller';

import editor from '../components/editor/editor.directive';

angular.module('inksy', ['ngAnimate', 'ui.bootstrap'])
.controller('MainCtrl', MainCtrl)
.controller('CartCtrl', CartCtrl)
.controller('LayerPaletteCtrl', LayerPaletteCtrl)
.directive('editor', editor)
;