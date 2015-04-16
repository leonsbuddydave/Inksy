var scaleFactor = 5.976;

var imageSize = {
	width: 2974,
	height: 2758	
};

var clipArea = {
	size: {
		width: 1686,
		height: 1750
	},
	center: {
		x: 1023,
		y: 1453
	}
};

var clipAreaOffset = {
	x: clipArea.center.x - (imageSize.width / 2),
	y: clipArea.center.y - (imageSize.height / 2)
};

console.log(JSON.stringify({
	area: {
		width: Math.round(clipArea.size.width / scaleFactor),
		height: Math.round(clipArea.size.height / scaleFactor),
		offsetX: Math.round(clipAreaOffset.x / scaleFactor),
		offsetY: Math.round(clipAreaOffset.y / scaleFactor)
	}
}));