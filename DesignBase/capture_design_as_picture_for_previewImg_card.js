async function captureBaseDesingScreenShootForPreviewImgCard() { 
    
    document.querySelector(".sidebar").style.display = "none"; // hide sidebar
    document.querySelector(".tools-bar").style.display = "none"; // hide tools bar
    document.querySelector(".base-design-name").style.display = "none"; // hide base design name

    const previousZoom = zoom;
    const previousOffsetX = offsetX;
    const previousOffsetY = offsetY;

    zoom = 1;
    offsetX = 0;
    offsetY = 0;
    grid.style.left = "50%";
    updateTransform();
    
    await new Promise(r => requestAnimationFrame(r)); // wait for the next frame to ensure the UI is updated

    const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "browser" },
        preferCurrentTab: true
    });

    const video = document.createElement("video");
    video.srcObject = stream;
    await video.play();

    await new Promise(r => requestAnimationFrame(r)); // wait for the next frame to ensure the video is playing

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    stream.getTracks().forEach(track => track.stop()); // stop the stream

    zoom = previousZoom;
    offsetX = previousOffsetX;
    offsetY = previousOffsetY;
    grid.style.left = "";
    updateTransform();

    document.querySelector(".sidebar").style.display = ""; // show sidebar
    document.querySelector(".tools-bar").style.display = ""; // show tools bar
    document.querySelector(".base-design-name").style.display = ""; // show base design name

    return new Promise((resolve) => {
        canvas.toBlob(blob => { resolve(blob); }, "image/png");
    });
}

window.captureBaseDesingScreenShootForPreviewImgCard = captureBaseDesingScreenShootForPreviewImgCard;