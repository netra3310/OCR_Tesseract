const getAreas = (left, top, width, height, rows) => {
	const subheight = height / rows;
	let params = [];
	for (i = 0; i < rows; i ++) {
		params.push([left, top + subheight * i, width, subheight]);
	}

	return params;
};

const tableRows = [
	["t003", "t001", "t009", "t999"],
	["k001", "k004", "k010", "k012", "k006", "k999"],
	["s001", "s009", "s003", "s999"],
	["h009", 'h007', "h999"],
	["j007", "j001", "j027", "j017", "j999"],
	["b003", "b001", "b999"],
	["z002", "z999"],
	["q005", "q004", "q003", "q999"],
	["r009", "r015", "r999"]
];

const x1 = 780;
const w1 = 85;
const x2 = 880;
const w2 = 520;

const tableAreas = [
	[302, 128], // y, h
	[430, 190],
	[628, 128],
	[760, 96],
	[860, 156],
	[1086, 94],
	[1182, 64],
	[1250, 128],
	[1380, 96],
];

const buildTableData = (tableValues) => {
	
	const tableDataEle = document.getElementById("data_table");

	let insertHtml = '';
	for (var i = 0; i < tableRows.length; i ++) {
		for (var j = 0; j < tableRows[i].length; j ++) {
			var eleString = tableRows[i][j] + ": "
			 + '<input type="text" name="' + 'i' + '-' + 'j-1' + '" value="' + (tableValues[tableRows[i][j]] !== undefined ? tableValues[tableRows[i][j]][0] : '') + '">'
			 + '<input type="text" name="' + 'i' + '-' + 'j-2' + '" value="' + (tableValues[tableRows[i][j]] !== undefined ? tableValues[tableRows[i][j]][1] : '') + '">';
			var divEle = '<div class="item">' + eleString + '</div>';
			insertHtml += divEle;
		}
	}

	tableDataEle.insertAdjacentHTML('afterbegin', insertHtml);
}

window.addEventListener("load", async () => {
	const worker = await Tesseract.createWorker('jpn');

	const imageFileEle = document.getElementById("image_file");
	let tableValues = {};
	imageFileEle.onchange = async () => {
		for (var i = 0; i < tableRows.length; i ++) {
			for (var j = 0; j < tableRows[i].length; j ++) {
				var height = tableAreas[i][1] / tableRows[i].length;
				var area1 = [x1, tableAreas[i][0] + height * j, w1, height];
				var area2 = [x2, tableAreas[i][0] + height * j, w2, height];
				console.log(tableRows[i][j]);
				console.log(area1);
				console.log(area2);
				var value1 = await worker.recognize(imageFileEle.files[0],{
					rectangle: { top: area1[0], left: area1[1], width: area1[2], height: area1[3] },
				});
				var value2 = await worker.recognize(imageFileEle.files[0],{
					rectangle: { top: area2[0], left: area2[1], width: area2[2], height: area2[3] },
				});
				tableValues[tableRows[i][j]] = [value1.data.text, value2.data.text];
			}
		}
		buildTableData(tableValues);
	}
});
