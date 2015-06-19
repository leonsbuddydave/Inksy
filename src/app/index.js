'use strict';

import MainCtrl from './controllers/main.controller';
import CartCtrl from './controllers/cart.controller';
import LayerPaletteCtrl from './controllers/layerpalette.controller';
import GalleryCtrl from './controllers/gallery.controller';
import ProductSelectorCtrl from './controllers/ProductSelector.controller';
import TextPropertyCtrl from './controllers/TextProperty.controller';
import ProductColorPickerCtrl from './controllers/ProductColorPicker.controller';
import PatternCtrl from './controllers/Pattern.controller';
import DesignElementsTabCtrl from './controllers/DesignElementsTab.controller';

import editor from './directives/editor.directive';
import fileUploadButton from './directives/fileUploadButton.directive';
import draggable from './directives/draggable.directive';
import droppable from './directives/droppable.directive';
import backgroundImage from './directives/backgroundImage.directive';
import backgroundColor from './directives/backgroundColor.directive';
import textColor from './directives/textColor.directive';
import categorySelector from './directives/categorySelector.directive';
import variantSelector from './directives/variantSelector.directive';
import instagramPanel from './directives/instagramPanel.directive';
import facebookPanel from './directives/facebookPanel.directive';
import galleryPanel from './directives/galleryPanel.directive';
import patternPanel from './directives/patternPanel.directive';

import LayerService from './services/layer.service';
import MathUtils from './services/MathUtils.service';
import GarbageFactory from './services/GarbageFactory.service';
import InksyAPI from './services/InksyAPI.service';
import DesignState from './services/DesignState.service';
import { ProductService, ProductServiceProvider } from './services/Product.service';
import { Instagram, InstagramProvider } from './services/Instagram.service';

import LayerSet from './models/LayerSet.model';
import Layer from './models/Layer.model';
import ImageLayer from './models/ImageLayer.model';
import TextLayer from './models/TextLayer.model';
import InksyImage from './models/InksyImage.model';
import InksyAlbum from './models/InksyAlbum.model';
import InksyPhoto from './models/InksyPhoto.model';
import Design from './models/Design.model';

import ProductImage from './models/product-image.model';
import ProductAngle from './models/product-angle.constant';
import InksyEvents from './constants/InksyEvents.constant';
import InksyConfig from './constants/InksyEvents.constant';

import invertColor from './filters/invertColor.filter';

import MaskedImage from './lib/MaskedImage'

angular.module('templates', []);

angular.module('inksy', ['ngAnimate', 'ui.bootstrap', 'templates', 'dndLists', 'facebook', 'ui.select', 'colorpicker.module'])
	.config(function(FacebookProvider, InstagramProvider) {
		FacebookProvider.init('890048857724673');
		InstagramProvider.init('4728f3e1dc9a4a90814f062d5ce0f13e', 'http://beta.inksy.co/inksy.co/admin/stores/tool');
	})
	.controller('MainCtrl', MainCtrl)
	.controller('CartCtrl', CartCtrl)
	.controller('LayerPaletteCtrl', LayerPaletteCtrl)
	.controller('GalleryCtrl', GalleryCtrl)
	.controller('ProductSelectorCtrl', ProductSelectorCtrl)
	.controller('TextPropertyCtrl', TextPropertyCtrl)
	.controller('ProductColorPickerCtrl', ProductColorPickerCtrl)
	.controller('PatternCtrl', PatternCtrl)
	.controller('DesignElementsTabCtrl', DesignElementsTabCtrl)

	.directive('editor', editor)
	.directive('fileUploadButton', fileUploadButton)
	.directive('draggable', draggable)
	.directive('droppable', droppable)
	.directive('backgroundImage', backgroundImage)
	.directive('backgroundColor', backgroundColor)
	.directive('textColor', textColor)
	.directive('categorySelector', categorySelector)
	.directive('variantSelector', variantSelector)
	.directive('instagramPanel', instagramPanel)
	.directive('facebookPanel', facebookPanel)
	.directive('galleryPanel', galleryPanel)
	.directive('patternPanel', patternPanel)

	.factory('LayerService', LayerService)
	.factory('ProductService', ProductService)
	.factory('Instagram', Instagram)

	.service('MathUtils', MathUtils)
	.service('GarbageFactory', GarbageFactory)
	.service('InksyAPI', InksyAPI)
	.service('DesignState', DesignState)

	.service('LayerSet', LayerSet)
	.service('Layer', Layer)
	.service('ImageLayer', ImageLayer)
	.service('TextLayer', TextLayer)
	.service('InksyImage', InksyImage)
	.service('InksyAlbum', InksyAlbum)
	.service('InksyPhoto', InksyPhoto)
	.service('Design', Design)

	.provider('Instagram', InstagramProvider)
	.provider('ProductService', ProductServiceProvider)

	.constant('ProductAngle', ProductAngle)
	.constant('InksyEvents', InksyEvents)
	.constant('InksyConfig', InksyConfig)

	.filter('invertColor', invertColor)
;
