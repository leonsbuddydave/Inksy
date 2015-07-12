'use strict';

class TextPropertyCtrl {
	constructor($scope, $rootScope, InksyEvents, $timeout) {
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$timeout = $timeout;

		this.textObject = null;
		this.loadingFonts = true;

		var FontFamilies = [
			'Open Sans',
			'Lora',
			'Press Start 2P',
			'Indie Flower',
			'Raleway'
		];

		WebFont.load({
			google: {
				families: FontFamilies
			},
			active: () => {
				this.loadingFonts = false;
			}
		})

		this.options = {
			fontFamilies: $.map(FontFamilies, (e) => {
				return { name: e };
			})
		};

		this.styles = {
			bold: false,
			italic: false,
			underline: false, 
			fontFamily: this.options.fontFamilies[0],
			align: 'center',
			color: '#000000'
		};

		this.text = "";

		$scope.$on('fabric:object:selected', this.onSelectionChanged.bind(this));
		$scope.$on('fabric:selection:cleared', this.onSelectionCleared.bind(this));
		$scope.$on(InksyEvents.LAYER_PALETTE_SELECTION_CLEARED, this.onSelectionCleared.bind(this));

		$scope.$watch(() => [this.styles, this.text], (newVal, oldVal) => {
			var to;

			to = this.textObject;

			if (to === null) return;

			to.setFontWeight(this.styles.bold ? "bold" : "normal" );
			to.setFontStyle( this.styles.italic ? "italic" : "" );
			to.setTextDecoration( this.styles.underline ? "underline" : "" );

			to.setText(this.text);
			to.setFontFamily(this.styles.fontFamily.name);
			to.setColor(this.styles.color);

			to.setTextAlign(this.styles.align);

			to.setCoords();
			$rootScope.$broadcast('global:render');

		}, true);
	}

	addNew() {
		this.$rootScope.$broadcast('text:new', this.text);
		// this.text = null;
	}

	enabled() {
		return this.textObject !== null;
	}

	onSelectionChanged(event, text) {
		var to;

		this.textObject = text;
		to = this.textObject;

		if (!(to instanceof fabric.Text)) {
			this.textObject = null;
			return;
		} else {
			this.styles.bold = ( to.getFontWeight() === 'bold' ? true : false );
			this.styles.italic = ( to.getFontStyle() === 'italic' ? true : false );
			this.styles.underline = ( to.getTextDecoration() === 'underline' ? true : false );

			this.text = to.getText();
			this.styles.fontFamily = _.find(this.options.fontFamilies, (family) => family.name === to.getFontFamily());

			this.styles.color = to.getFill();
			this.styles.align = to.getTextAlign();

			// this is so far from the correct way to do this
			// that it's giving me heart palpitations
			this.$timeout(function() {
				$('.text-properties-input').focus();
			}, 100);
		}
	}

	onSelectionCleared(event, text) {
		this.textObject = null;

		this.styles.bold = false;
		this.styles.italic = false;
		this.styles.underline = false;
		this.styles.fontFamily = this.options.fontFamilies[0];
		this.styles.color = "#000";
		this.text = "Sample Text";
	}

	bold() {
		this.styles.bold = !this.styles.bold;
	}

	underline() {
		this.styles.underline = !this.styles.underline;
	}

	italic() {
		this.styles.italic = !this.styles.italic;
	}

	isBold() {
		return this.styles.bold;
	}

	isUnderline() {
		return this.styles.underline;
	}

	isItalic() {
		return this.styles.italic;
	}
}

TextPropertyCtrl.$inject = ['$scope', '$rootScope', 'InksyEvents', '$timeout'];

export default TextPropertyCtrl;