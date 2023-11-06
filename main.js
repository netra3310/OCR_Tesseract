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

// const tableAreas = [
// 	[302, 128], // y, h
// 	[430, 190],
// 	[628, 128],
// 	[756, 96],
// 	[860, 156],
// 	[1086, 94],
// 	[1182, 64],
// 	[1250, 128],
// 	[1380, 96],
// ];

const tableAreas = [
	[302, 120], // y, h
	[429, 188],
	[627, 127],
	[760, 89],
	[858, 154],
	[1087, 88],
	[1180, 62],
	[1249, 122],
	[1378, 106],
];

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

const displayExtractedText = (index, subIndex, type, text) => {
	if (type === 0) {
		const markEle = document.getElementById("mark-" + tableRows[index][subIndex]);
		if (markEle)
			markEle.value = text;
	} else if (type === 1) {
		const sizeEle = document.getElementById("size-" + tableRows[index][subIndex]);
		if (sizeEle)
			sizeEle.value = text;
	}
}

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

const getArea = (left, top, width, height, rows, index) => {
	const subheight = height / rows;
	return [left, top + subheight * index, width, subheight];
};

const processImage = (area, imagePath) => {
	const image = new Image();
	image.src = imagePath;

	image.onload = function() {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		canvas.width = image.width;
		canvas.height = image.height;

		ctx.drawImage(image, 0, 0);
		const x = area[0]; // X-coordinate of the top-left corner of the crop area
		const y = area[1]; // Y-coordinate of the top-left corner of the crop area
		const width = area[2]; // Width of the crop area
		const height = area[3]; // Height of the crop area

		const croppedCanvas = document.createElement('canvas');
		const croppedCtx = croppedCanvas.getContext('2d');

		croppedCanvas.width = width;
		croppedCanvas.height = height;

		croppedCtx.drawImage(canvas, x, y, width, height, 0, 0, width, height);

		croppedCanvas.toBlob((blob) => {

			// Use the appropriate method to initiate the download based on the browser
			if (window.navigator.msSaveBlob) {
				// For Internet Explorer
				window.navigator.msSaveBlob(blob, 'cropped-image.png');
			} else {
				// For other browsers
				const url = URL.createObjectURL(blob);
				const link = document.getElementById('hiddenLink');
				link.href = url;
				link.download = 'cropped-image.png';
				link.click();
			}
		}, 'image/png');
	};
}

const getTextUsingApi = async (file, result) => {
	const url = 'https://pen-to-print-handwriting-ocr.p.rapidapi.com/recognize/';
	const data = new FormData();
	data.append('srcImg', file);
	data.append('Session', 'string');

	const options = {
		method: 'POST',
		headers: {
			'X-RapidAPI-Key': '16521b9d28msh594999a7536c54fp15bd79jsn8d968e2c557f',
			'X-RapidAPI-Host': 'pen-to-print-handwriting-ocr.p.rapidapi.com'
		},
		body: data
	};

	try {
		const response = await fetch(url, options);
		const result = await response.text();
		return result;
	} catch (error) {
		return error;		
	}
}

const extractTextFromImg = async (tesseractWorker, targetArea, file) => {
	const area = {
		left: targetArea[0],
		top: targetArea[1],
		width: targetArea[2],
		height: targetArea[3]
	};

	const tesseractResut = await tesseractWorker.recognize(file, 
		{
			rectangle: area
		}
	);
	const tesseractText = tesseractResut.data.text?.replace("\n", "").replace(" ", "");
	console.log("tesseractText === ", tesseractText);
	if (tesseractText === undefined || tesseractText === "") {
		console.log("blank area");
		return false;
	}

	// crop image
	const imagePath = URL.createObjectURL(file);
	const image = new Image();
	image.src = imagePath;

	return new Promise((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = image.width;
      canvas.height = image.height;

      ctx.drawImage(image, 0, 0);
      const { left, top, width, height} = area;

      const croppedCanvas = document.createElement('canvas');
      const croppedCtx = croppedCanvas.getContext('2d');

      croppedCanvas.width = width;
      croppedCanvas.height = height;

      croppedCtx.drawImage(canvas, left, top, width, height, 0, 0, width, height);

      croppedCanvas.toBlob(async (blob) => {
        const croppedImageFile = new File([blob], "test", { type: blob.type });
				const result = await getTextUsingApi(croppedImageFile);
        resolve(result);
      }, 'image/png');
    };

    image.onerror = (error) => {
      reject(error);
    };
  });
}

window.addEventListener("load", async () => {
	const worker = await Tesseract.createWorker('eng+jpn', 1,
		{
			corePath: './node_modules/tesseract.js-core',
			workerPath: "./node_modules/tesseract.js/dist/worker.min.js",
		}
	);

	const imageFileEle = document.getElementById("image_file");
	imageFileEle.onchange = async () => {
		const seletedImagePath = URL.createObjectURL(imageFileEle.files[0]);

		// // preview selected image
		// const previewImage = document.getElementById('previewImage');
		// previewImage.src = seletedImagePath;

		let result = null;
		result = await extractTextFromImg(worker, [573, 135, 295, 52], imageFileEle.files[0]);
		const checkDateEle = document.getElementById("check-date");
		const resultObj = JSON.parse(result);
		checkDateEle.value = resultObj.value;

		const nameValue = await worker.recognize(imageFileEle.files[0], {
			rectangle: {
				top: 225,
				left: 260,
				width: 215,
				height: 42
			}
		});
		const nameEle = document.getElementById("patient-info-name");
		nameEle.value = nameValue.data.text;

		const ageValue = await worker.recognize(imageFileEle.files[0], {
			rectangle: {
				top: 223,
				left: 664,
				width: 96,
				height: 40
			}
		});
		const ageEle = document.getElementById("patient-info-age");
		ageEle.value = ageValue.data.text;
		
		for (var i = 0; i < tableRows.length; i ++) {
			for (var j = 0; j < tableRows[i].length; j ++) {
				var height = (tableAreas[i][1]) / tableRows[i].length;
				var area1 = [x1 + 10, tableAreas[i][0] + height * j, w1, height];
				var area2 = [x2 + 10, tableAreas[i][0] + height * j, w2, height];

				console.log(tableRows[i][j]);
				console.log(area1);
				console.log(area2);

				var result1 = await extractTextFromImg(worker, area1, imageFileEle.files[0]);
				if (result1) {
					var resultObj1 = JSON.parse(result1);
					displayExtractedText(i, j, 0, resultObj1?.value); // mark
				}

				var result2 = await extractTextFromImg(worker, area2, imageFileEle.files[0]);
				if (result2) {
					var resultObj2 = JSON.parse(result2);
					displayExtractedText(i, j, 1, resultObj2?.value); // size
				}

				// var value1 = await worker.recognize(imageFileEle.files[0],{
				// 	rectangle: { left: area1[0], top: area1[1], width: area1[2], height: area1[3] },
				// });
				// var value2 = await worker.recognize(imageFileEle.files[0],{
				// 	rectangle: { left: area2[0], top: area2[1], width: area2[2], height: area2[3] },
				// });
				// tableValues[tableRows[i][j]] = [value1.data.text, value2.data.text];
			}
		}
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
