async function capturePreviewCardImage(){
    const targetEl = document.querySelector(".design-community-preview-content-main");
    const rect = targetEl.getBoundingClientRect();

    const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "browser" },
        preferCurrentTab: true
    });

    const video = document.createElement("video");
    video.srcObject = stream;
    await video.play();

    await new Promise(r => requestAnimationFrame(r)); 

    const scaleX = video.videoWidth / window.innerWidth;
    const scaleY = video.videoHeight / window.innerHeight;

    const canvas = document.createElement("canvas");
    canvas.width = rect.width;
    canvas.height = rect.height;

    const context = canvas.getContext("2d");

    context.drawImage (
        video,
        rect.left * scaleX,
        rect.top * scaleY,
        rect.width * scaleX,
        rect.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
    );

    stream.getTracks().forEach(track => track.stop());

    canvas.toBlob(blob => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "preview_card_image.png";
        link.click();
    }, "image/png"); 
}
window.capturePreviewCardImage = capturePreviewCardImage;
