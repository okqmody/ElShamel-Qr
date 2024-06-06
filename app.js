const codeReader = new ZXing.BrowserBarcodeReader();

codeReader
    .getVideoInputDevices()
    .then((videoInputDevices) => {
        const constraints = {
            video: {
                deviceId: videoInputDevices[0].deviceId,
            },
        };

        codeReader.decodeFromConstraints(constraints, "video", (result, err) => {
            if (result) {
                document.getElementById("barcode-result").textContent = result.text;
            }
            if (err && !(err instanceof ZXing.NotFoundException)) {
                console.error(err);
            }
        });
    })
    .catch((err) => {
        console.error(err);
    });
