<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Barcode Scanner</title>
    <style>
        #video-container {
            position: relative;
            width: 100%;
            max-width: 600px;
            margin: auto;
        }
        #video {
            width: 100%;
        }
        #scan-result {
            margin-top: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div id="video-container">
        <video id="video" playsinline></video>
    </div>
    <div id="scan-result"></div>
    <button id="startButton">Start Scanning</button>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jsqr/2.0.0/jsQR.min.js"></script>
    <script>
        const video = document.getElementById('video');
        const scanResult = document.getElementById('scan-result');
        const startButton = document.getElementById('startButton');
        let scanning = false;

        startButton.addEventListener('click', toggleScanning);

        async function toggleScanning() {
            if (!scanning) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                    video.srcObject = stream;
                    video.play();
                    startButton.textContent = 'Stop Scanning';
                    scanning = true;
                    scanQRCode();
                } catch (error) {
                    console.error('Error accessing the camera: ', error);
                }
            } else {
                video.srcObject.getTracks().forEach(track => track.stop());
                startButton.textContent = 'Start Scanning';
                scanning = false;
            }
        }

        function scanQRCode() {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const scanInterval = setInterval(() => {
                if (!scanning) {
                    clearInterval(scanInterval);
                    return;
                }
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: 'dontInvert',
                });

                if (code) {
                    scanResult.innerHTML += 'Scanned Barcode: ' + code.data + '<br>';
                }
            }, 100);
        }
    </script>
</body>
</html>
