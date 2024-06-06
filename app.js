document.addEventListener('DOMContentLoaded', function() {
    if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
        navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' } // 'environment' لتحديد استخدام الكاميرا الخلفية
        }).then(function(stream) {
            var video = document.getElementById('video');
            video.srcObject = stream;
            video.play();

            // Initialize QuaggaJS to scan the barcode
            Quagga.init({
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: video
                },
                decoder: {
                    readers: ["code_128_reader", "ean_reader", "ean_8_reader", "code_39_reader", "code_39_vin_reader", "codabar_reader", "upc_reader", "upc_e_reader", "i2of5_reader"]
                }
            }, function(err) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log("Initialization finished. Ready to start");
                Quagga.start();
            });

            Quagga.onDetected(function(result) {
                var code = result.codeResult.code;
                document.getElementById('result').innerText = "Barcode detected: " + code;
                Quagga.stop();
            });
        }).catch(function(err) {
            console.log("Error accessing the camera: ", err);
        });
    } else {
        console.log("getUserMedia not supported on your browser!");
    }
});
