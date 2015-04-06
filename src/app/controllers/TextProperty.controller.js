'use strict';

class TextPropertyCtrl {
	constructor($scope, $rootScope) {
		this.$scope = $scope;
		this.$rootScope = $rootScope;

		this.textObject = null;

		this.options = {
			fontFamilies: [
				{ name: 'Open Sans' },
				{ name: 'Lora' },
				{ name: 'Press Start 2P' },
				// { name: 'Comic Sans' },
				{ name: 'Indie Flower' },
			]
		};

		this.styles = {
			bold: false,
			italic: false,
			underline: false, 
			fontFamily: this.options.fontFamilies[0],
			align: 'center',
			color: '#000000'
		};

		this.text = "Sample Text";

		$scope.$on('fabric:object:selected', (event, text) => {
			console.log('Object selected');
			this.onSelectionChanged(event, text);
		});

		// $scope.$on('fabric:selection:cleared', (event) => {
		// 	console.log('Selection cleared');
		// 	this.onSelectionCleared(event);
		// });

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

	test() {
		this.$rootScope.$broadcast('text:new', 'Sin');
	}

	enabled() {
		return this.textObject !== null;
	}

	onSelectionChanged(event, text) {
		var to;

		this.textObject = text.selectedObject;
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
		}
	}

	onSelectionCleared(event, text) {
		this.textObject = null;
	}
}

TextPropertyCtrl.$inject = ['$scope', '$rootScope'];

export default TextPropertyCtrl;