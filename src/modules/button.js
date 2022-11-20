class Button {
	constructor(object, link) {
		this.object = object;
		this.link = link;
	}

	openLink() {
		window.open(this.link, "_blank");
	}
}
