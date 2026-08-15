const API_KEY = "AIzaSyB1cDGAYlyHwtAJnNkZ7CmYxQR9Puu1TeY";
const CHANNEL_ID = "UCn30fZYqpBpLVJIu4EIv1QA";

const viewerCount = document.getElementById("viewerCount");
const status = document.getElementById("status");
const eye = document.querySelector(".eye");

let currentVideoId = null;

// Find the current live video
async function findLiveVideo() {
    try {

        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=id&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${API_KEY}`
        );

        const data = await response.json();

        console.log("SEARCH:", data);

        if (data.items && data.items.length > 0) {

            currentVideoId = data.items[0].id.videoId;

            console.log("LIVE VIDEO:", currentVideoId);

        } else {

            currentVideoId = null;

        }

    } catch (err) {

        console.log(err);
        currentVideoId = null;

    }
}

// Get live viewer count
async function getViewers() {

    if (!currentVideoId) {

        eye.style.display = "none";
        viewerCount.textContent = "";
        status.textContent = "Not Streaming";
        return;

    }

    try {

        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${currentVideoId}&key=${API_KEY}`
        );

        const data = await response.json();

        console.log("VIDEO:", data);

        if (
            !data.items ||
            data.items.length === 0 ||
            !data.items[0].liveStreamingDetails
        ) {

            currentVideoId = null;

            eye.style.display = "none";
            viewerCount.textContent = "";
            status.textContent = "Not Streaming";

            return;
        }

        const details = data.items[0].liveStreamingDetails;

        eye.style.display = "inline";

        viewerCount.textContent =
            details.concurrentViewers || "0";

        status.textContent = "";

    } catch (err) {

        console.log(err);

        eye.style.display = "none";
        viewerCount.textContent = "";
        status.textContent = "Connection Error";

    }

}

// Run immediately
findLiveVideo().then(getViewers);

// Refresh viewer count every 10 sec
setInterval(getViewers, 10000);

// Look for a new live stream every 5 minutes
setInterval(findLiveVideo, 300000);