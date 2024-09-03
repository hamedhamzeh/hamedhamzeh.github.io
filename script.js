function changeVideo(videoSrc) {
    var videoElement = document.getElementById("mainVideo");
    var sourceElement = document.getElementById("videoSource");
    sourceElement.src = videoSrc;
    videoElement.load();
    videoElement.play();

    // Handle button selection state
    var buttons = document.querySelectorAll(".video-option");
    buttons.forEach((button) => button.classList.remove("selected"));

    // Find the button that was clicked and add the 'selected' class
    event.target.classList.add("selected");
}
