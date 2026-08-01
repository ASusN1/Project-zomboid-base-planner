async function exportBaseDesignAsPicture() { 
    
    document.querySelector(".sidebar").style.display = "none"; // hide sidebar
    document.querySelector(".tools-bar").style.display = "none"; // hide tools bar
    document.querySelector(".base-design-name").style.display = "none"; // hide base design name

    const was_grid_number_hidden_before_capture = window.grid_number_hidden;
    grid.classList.add("hide-grid-number");

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

    document.querySelector(".sidebar").style.display = ""; // show sidebar
    document.querySelector(".tools-bar").style.display = ""; // show tools bar
    document.querySelector(".base-design-name").style.display = ""; // show base design name

    if (!was_grid_number_hidden_before_capture) {
        grid.classList.remove("hide-grid-number");
    }

    canvas.toBlob(blob => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "base_design.png";
        link.click();
    });
}

window.exportBaseDesignAsPicture = exportBaseDesignAsPicture;