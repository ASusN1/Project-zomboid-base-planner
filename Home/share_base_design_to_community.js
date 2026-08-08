async function shareDesignToCommunity(privateDesignId) {
    const shareResponse = await fetch(window.BACKEND_URL + "/designs/share", {
        method: "POST",
        headers: Object.assign({ "Content-Type": "application/json" }, getAuthHeader()),
        body: JSON.stringify({ designId: privateDesignId }),
    });

    const shareResult = await shareResponse.json(); // read the backend's response

    if (!shareResponse.ok) {
        console.error("Error sharing design: " + shareResult.error);
        return;
    }

    alert(shareResult.message); // "shared successfully" or "updated successfully"
}

async function unshareDesignFromCommunity(privateDesignId) {
    const unshareResponse = await fetch(window.BACKEND_URL + "/designs/unshare", {
        method: "POST",
        headers: Object.assign({ "Content-Type": "application/json" }, getAuthHeader()),
        body: JSON.stringify({ designId: privateDesignId }),
    });

    const unshareResult = await unshareResponse.json(); // read the backend's response

    if (!unshareResponse.ok) {
        console.error("Error unsharing design: " + unshareResult.error);
        return;
    }

    alert(unshareResult.message);
}

window.shareDesignToCommunity = shareDesignToCommunity;
window.unshareDesignFromCommunity = unshareDesignFromCommunity;