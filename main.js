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
const w1 = 70;
const x2 = 880;
const w2 = 500;

const tableAreas = [
	[302, 128], // y, h
	[430, 190],
	[628, 128],
	[756, 96],
	[860, 156],
	[1086, 94],
	[1182, 64],
	[1250, 128],
	[1380, 96],
];

// const tableAreas = [
// 	[302, 120], // y, h
// 	[429, 188],
// 	[627, 127],
// 	[760, 89],
// 	[858, 154],
// 	[1087, 88],
// 	[1180, 62],
// 	[1249, 122],
// 	[1378, 106],
// ];

const buildTableData = (tableValues) => {
	for (var i = 0; i < tableRows.length; i ++) {
		for (var j = 0; j < tableRows[i].length; j ++) {
			const markEle = document.getElementById("mark-" + tableRows[i][j]);
			if (markEle)
				markEle.value = tableValues[tableRows[i][j]][0];
			const sizeEle = document.getElementById("size-" + tableRows[i][j]);
			if (sizeEle)
				sizeEle.value = tableValues[tableRows[i][j]][1];
		}
	}
}

const buildFileList = (files) => {
	const fileSelectboxEle = document.getElementById("current-file");
	fileSelectboxEle.id = "current-file";

	for (var i = 0; i < files.length; i++) {
		const fileSelectOptionEle = document.createElement("option");
		fileSelectOptionEle.name = files[i].name;
		fileSelectOptionEle.text = files[i].name;
		fileSelectOptionEle.value = files[i].name.replace('.', '_');
		fileSelectOptionEle.classList.add("filename");
		fileSelectboxEle.add(fileSelectOptionEle);
	}
}

window.addEventListener("load", async () => {
	const worker = await Tesseract.createWorker('eng', 1,
	{
		// langPath: './trained_data_best',
		corePath: './node_modules/tesseract.js-core',
		workerPath: "./node_modules/tesseract.js/dist/worker.min.js",
		// gzip: 0,
		// logger: function(m){console.log(m);}
	}
	);

	
	// const worker = await Tesseract.createWorker('jpn+eng', {
	// 	tessedit_ocr_engine_mode: '2',
	// 	// language_model_ngram_on: '0',
	// 	// segsearch_max_char_wh_ratio: '2',
	// 	// language_model_ngram_space_delimited_language: '1',
	// 	// language_model_ngram_scale_factor: '0.03',
	// 	// language_model_use_sigmoidal_certainty: '1',
	// 	// language_model_ngram_nonmatch_score: '-40',
	// 	// classify_integer_matcher_multiplier: '10',
	// 	// assume_fixed_pitch_char_segment: '0',
	// 	// chop_enable: '1',
	// 	// allow_blob_division: '0',
	// });
	// await worker.setParameters({
		
	// });

	const imageFileEle = document.getElementById("image_file");
	let tableValues = {};
	imageFileEle.onchange = async () => {
		// buildFileList(imageFileEle.files);
		// const fileSelectboxEle = document.getElementById("current-file");
		// if (fileSelectboxEle) {
		// 	fileSelectboxEle.onchange = (e) => {
		// 		const filename = e.target.value;
		// 		console.log(filename);
		// 	}
		// }

		// const imagePath = URL.createObjectURL(file);
		// console.log(imagePath);

		const testValue = await worker.recognize(imageFileEle.files[0], 
			// {
			// rectangle: {
			// 	// top: 522,
			// 	// left: 895,
			// 	// width: 366,
			// 	// height: 56
			// 	top: 521,
			// 	left: 894,
			// 	width: 363,
			// 	height: 54
			// },
			// tessedit_pageseg_mode: '6',
			// tessedit_zero_rejection: '0',
			// tessedit_ocr_engine_mode: '3',
			// }
		);
		console.log(testValue.data.text);
		console.log(testValue);

		// const checkDateValue = await worker.recognize(imageFileEle.files[0], {
		// 	rectangle: {
		// 		top: 135,
		// 		left: 573,
		// 		width: 295,
		// 		height: 52
		// 	}
		// });
		// const checkDateEle = document.getElementById("check-date");
		// checkDateEle.value = checkDateValue.data.text;

		// const nameValue = await worker.recognize(imageFileEle.files[0], {
		// 	rectangle: {
		// 		top: 225,
		// 		left: 260,
		// 		width: 215,
		// 		height: 42
		// 	}
		// });
		// const nameEle = document.getElementById("patient-info-name");
		// nameEle.value = nameValue.data.text;

		// const ageValue = await worker.recognize(imageFileEle.files[0], {
		// 	rectangle: {
		// 		top: 223,
		// 		left: 664,
		// 		width: 96,
		// 		height: 40
		// 	}
		// });
		// const ageEle = document.getElementById("patient-info-age");
		// ageEle.value = ageValue.data.text;
		
		// for (var i = 0; i < tableRows.length; i ++) {
		// 	for (var j = 0; j < tableRows[i].length; j ++) {
		// 		var height = (tableAreas[i][1]) / tableRows[i].length;
		// 		var area1 = [x1 + 10, tableAreas[i][0] + height * j, w1, height];
		// 		var area2 = [x2 + 10, tableAreas[i][0] + height * j, w2, height];
		// 		console.log(tableRows[i][j]);
		// 		console.log(area1);
		// 		console.log(area2);
		// 		var value1 = await worker.recognize(imageFileEle.files[0],{
		// 			rectangle: { left: area1[0], top: area1[1], width: area1[2], height: area1[3] },
		// 		});
		// 		var value2 = await worker.recognize(imageFileEle.files[0],{
		// 			rectangle: { left: area2[0], top: area2[1], width: area2[2], height: area2[3] },
		// 		});
		// 		tableValues[tableRows[i][j]] = [value1.data.text, value2.data.text];
		// 	}
		// }
		// buildTableData(tableValues);
	};

	const saveButton = document.getElementById("save-data");
	saveButton.onclick = () => {
		let data = new FormData();
		data.append("text", "hello, this, is, test, string");
		fetch("http://localhost:8001/save.php", { method:"post", mode: "no-cors", body:data })
		.then(res => res.text())
		.then(txt => console.log(txt))
		.catch(err => console.error(err));
	}
});
