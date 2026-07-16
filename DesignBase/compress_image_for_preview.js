async function compressImageForPreview(imageBlob, targetWidth = 400, quality = 0.7 ) {
    const imageBitmap = await createImageBitmap(imageBlob); //decode the blob in

    const scaleFactor = targetWidth/imageBitmap.width;
    const targetHeight = imageBitmap.height * scaleFactor;

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const context = canvas.getContext('2d');
    context.drawImage(imageBitmap,0,0, canvas.width, canvas.height);

    imageBitmap.close(); //release the memory used by the image bitmap
    return new Promise((resolve) => {
        canvas.toBlob(blob => resolve(blob), 'image/jpeg', quality);
    });
}

window.compressImageForPreview = compressImageForPreview;