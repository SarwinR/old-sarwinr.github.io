class Screen {
	activeLayer = 0;

	// layers is an array of array of objects
	constructor(layers) {
		this.layers = layers;
	}

	setup() {
		// disable all layers except the layer 0
		this.layers.forEach((element) => {
			if (this.layers.indexOf(element) != 0) {
				element.forEach((obj) => {
					obj.visible = false;
				});
			}
		});
	}

	addLayer(layer) {}

	enableLayer(layerIndex) {}
	disableLayer(layerIndex) {}
}

export { Screen };
