var divRoot = $("#affdex_elements")[0];
var width = $("#affdex_elements").width();
var height = $("#affdex_elements").height();
var faceMode = affdex.FaceDetectorMode.SMALL_FACES;
var detector = new affdex.CameraDetector(divRoot, width, height, faceMode);

detector.detectAllEmotions();
//   detector.detectAllExpressions();
detector.detectAllEmojis();
detector.detectAllAppearance();

detector.addEventListener("onInitializeSuccess", function () {
    $("#face_video_canvas").css("display", "block");
    $("#face_video").css("display", "none");
});

function log(node_name, msg) {
    // $(node_name).append("<span>" + msg + "</span><br />")
}

function onStart() {
    if (detector && !detector.isRunning) {
        detector.start();
    }
}

function onStop() {
    if (detector && detector.isRunning) {
        detector.removeEventListener();
        detector.stop();
    }
};

function onReset() {
    if (detector && detector.isRunning) {
        detector.reset();
    }
};

detector.addEventListener("onWebcamConnectFailure", function () {

});

detector.addEventListener("onStopSuccess", function () {

    $("#results").html("");
});

detector.addEventListener("onImageResultsSuccess", function (faces, image, timestamp) {
    $('#results').html("");
    log('#results', "Timestamp: " + timestamp.toFixed(2));
    log('#results', "Number of faces found: " + faces.length);
    if (faces.length > 0) {
        log('#results', "Appearance: " + JSON.stringify(faces[0].appearance));
        log('#results', "Emotions: " + JSON.stringify(faces[0].emotions, function (key, val) {
            return val.toFixed ? Number(val.toFixed(0)) : val;
        }));
        log('#results', "Expressions: " + JSON.stringify(faces[0].expressions, function (key, val) {
            return val.toFixed ? Number(val.toFixed(0)) : val;
        }));
        log('#results', "Emoji: " + faces[0].emojis.dominantEmoji);
        for (var indice = 0; indice < faces.length; indice++) {
            drawFeaturePoints(image, faces[indice].featurePoints);
            drawAppearence(image, faces[indice]);
        }

    }
});

function drawAppearence(img, face) {
    var desenharEmoji = $("#mostrarEmoji").is(":checked");;
    var desenharIdade = $("#mostrarIdade").is(":checked");;
    var corTexto = $("#corTexto").val();

    var contxt = $('#face_video_canvas')[0].getContext('2d');

    var hRatio = contxt.canvas.width / img.width;
    var vRatio = contxt.canvas.height / img.height;
    var ratio = Math.min(hRatio, vRatio);
    var x = face.featurePoints[0].x - 20;
    var y = face.featurePoints[5].y + face.featurePoints[6].y + face.featurePoints[9].y + face.featurePoints[10].y
    y = y / 4 - 50;
    var largura = face.featurePoints[4].x + 40 - face.featurePoints[0].x;
    var altura = face.featurePoints[2].y - y;

    if (desenharEmoji) {
        contxt.font = "60px Arial";
        contxt.fillStyle = corTexto;
        contxt.fillText(face.emojis.dominantEmoji, x, y - 50);
    }

    if (desenharIdade) {
        contxt.font = "40px Arial";
        if (face.appearance.age != "Unknown")
            contxt.fillText(face.appearance.age, x + 90, y - 50);
    }

}

function drawFeaturePoints(img, featurePoints) {
    var desenharPontos = $("#mostrarPontos").is(":checked");
    var corPontos = $("#corPontos").val();
    var desenharRetangulo =  $("#mostrarRetangulo").is(":checked");
    var corRetangulo = $("#corRetangulo").val();

    var contxt = $('#face_video_canvas')[0].getContext('2d');

    var hRatio = contxt.canvas.width / img.width;
    var vRatio = contxt.canvas.height / img.height;
    var ratio = Math.min(hRatio, vRatio);

    contxt.strokeStyle = corPontos;

    if (desenharPontos) {
        for (var indice = 0; indice < 33; indice++) {
            contxt.beginPath();
            contxt.arc(featurePoints[indice].x,
                featurePoints[indice].y, 2, 0, 2 * Math.PI);
            contxt.stroke();
        }
        contxt.closePath();
    }
    contxt.beginPath();
    // contxt.stroke();
    //x,y,largura,altura
    var x = featurePoints[0].x - 20;
    var y = featurePoints[5].y + featurePoints[6].y + featurePoints[9].y + featurePoints[10].y
    y = y / 4 - 50;
    var largura = featurePoints[4].x + 40 - featurePoints[0].x;
    var altura = featurePoints[2].y - y;

    if (desenharRetangulo) {
        contxt.strokeStyle = corRetangulo;
        contxt.rect(x, y, largura, altura);
        contxt.stroke();
    }

}
