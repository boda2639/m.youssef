
// ==========================================
// STUDENT WATERMARK
// ==========================================

const studentWatermark =
    document.getElementById(
        "studentWatermark"
    );

let watermarkInterval = null;

let studentCode = "";

// ==========================================
// GET URL PARAMETERS
// ==========================================

const params = new URLSearchParams(window.location.search);

const courseId = params.get("courseId");
const videoIndex = params.get("videoIndex");


// ==========================================
// GET SAVED VIDEO DATA
// ==========================================

const videoUrl =
    sessionStorage.getItem("currentVideoUrl") || "";

const videoTitleText =
    sessionStorage.getItem("currentVideoTitle") ||
    "مشاهدة الفيديو";

const courseTitleText =
    sessionStorage.getItem("currentCourseTitle") ||
    "محتوى الكورس";


// ==========================================
// HTML ELEMENTS
// ==========================================

const backBtn =
    document.getElementById("backBtn");

const courseTitle =
    document.getElementById("courseTitle");

const videoTitle =
    document.getElementById("videoTitle");

const videoWrapper =
    document.getElementById("videoWrapper");

const videoPlayer =
    document.getElementById("videoPlayer");

const youtubePlayerElement =
    document.getElementById("youtubePlayer");

const videoLoader =
    document.getElementById("videoLoader");

const bigPlayBtn =
    document.getElementById("bigPlayBtn");

const playPauseBtn =
    document.getElementById("playPauseBtn");

const backwardBtn =
    document.getElementById("backwardBtn");

const forwardBtn =
    document.getElementById("forwardBtn");

const progressBar =
    document.getElementById("progressBar");

const muteBtn =
    document.getElementById("muteBtn");

const volumeBar =
    document.getElementById("volumeBar");

const currentTimeElement =
    document.getElementById("currentTime");

const durationElement =
    document.getElementById("duration");

const settingsBtn =
    document.getElementById("settingsBtn");

const settingsMenu =
    document.getElementById("settingsMenu");

const speedOptions =
    document.querySelectorAll(".speed-option");

const fullscreenBtn =
    document.getElementById("fullscreenBtn");

const errorBox =
    document.getElementById("errorBox");

const errorText =
    document.getElementById("errorText");


// ==========================================
// PLAYER VARIABLES
// ==========================================

let currentPlayerType = null;

let youtubePlayerInstance = null;

let youtubeReady = false;

let youtubeTimer = null;

let currentVolume = 1;

let currentPlaybackRate = 1;


// ==========================================
// SET PAGE TITLES
// ==========================================

courseTitle.textContent = courseTitleText;

videoTitle.textContent = videoTitleText;

document.title =
    `${videoTitleText} | منصة مستر محمد يوسف`;


// ==========================================
// BACK TO COURSE
// ==========================================

backBtn.addEventListener("click", () => {

    if (courseId) {

        window.location.href =
            `course.html?id=${encodeURIComponent(courseId)}`;

    } else {

        window.history.back();

    }

});


// ==========================================
// START PLAYER
// ==========================================

if (!videoUrl) {

    showError(
        "رابط الفيديو غير موجود. ارجع إلى محتوى الكورس وحاول مرة أخرى."
    );

} else {

    startPlayer(videoUrl);

}


// ==========================================
// DETECT VIDEO TYPE
// ==========================================

function startPlayer(url) {

    showLoader();

    const youtubeId =
        getYouTubeVideoId(url);


    if (youtubeId) {

        currentPlayerType = "youtube";

        loadYouTubePlayer(youtubeId);

    } else {

        currentPlayerType = "direct";

        loadDirectVideo(url);

    }

}


// ==========================================
// DIRECT VIDEO
// ==========================================

function loadDirectVideo(url) {

    youtubePlayerElement.classList.add("hidden");

    videoPlayer.classList.remove("hidden");

    videoPlayer.src = url;

    videoPlayer.volume = currentVolume;

    videoPlayer.playbackRate =
        currentPlaybackRate;

    videoPlayer.load();

}


// ==========================================
// DIRECT VIDEO EVENTS
// ==========================================

videoPlayer.addEventListener(
    "loadedmetadata",
    () => {

        hideLoader();

        durationElement.textContent =
            formatTime(videoPlayer.duration);

        updateProgress();

    }
);


videoPlayer.addEventListener(
    "canplay",
    () => {

        hideLoader();

    }
);


videoPlayer.addEventListener(
    "waiting",
    () => {

        if (!videoPlayer.paused) {

            showLoader();

        }

    }
);


videoPlayer.addEventListener(
    "playing",
    () => {

        hideLoader();

        updatePlayUI(true);

    }
);


videoPlayer.addEventListener(
    "pause",
    () => {

        updatePlayUI(false);

    }
);


videoPlayer.addEventListener(
    "ended",
    () => {

        updatePlayUI(false);

        bigPlayBtn.classList.remove("hidden");

    }
);


videoPlayer.addEventListener(
    "timeupdate",
    () => {

        updateProgress();

    }
);


videoPlayer.addEventListener(
    "volumechange",
    () => {

        updateVolumeIcon(
            videoPlayer.muted
                ? 0
                : videoPlayer.volume
        );

    }
);


videoPlayer.addEventListener(
    "error",
    () => {

        hideLoader();

        showError(
            "تعذر تشغيل رابط الفيديو. تأكد أن الرابط مباشر ومتاح للتشغيل."
        );

    }
);


// ==========================================
// UPDATE DIRECT VIDEO PROGRESS
// ==========================================

function updateProgress() {

    if (
        currentPlayerType !== "direct" ||
        !Number.isFinite(videoPlayer.duration)
    ) {

        return;

    }


    const progress =
        (
            videoPlayer.currentTime /
            videoPlayer.duration
        ) * 100;


    progressBar.value =
        Number.isFinite(progress)
            ? progress
            : 0;


    currentTimeElement.textContent =
        formatTime(videoPlayer.currentTime);


    durationElement.textContent =
        formatTime(videoPlayer.duration);


    updateProgressColor();

}


// ==========================================
// YOUTUBE API
// ==========================================

window.onYouTubeIframeAPIReady = function () {

    if (
        currentPlayerType === "youtube" &&
        videoUrl
    ) {

        const youtubeId =
            getYouTubeVideoId(videoUrl);


        if (youtubeId) {

            createYouTubePlayer(youtubeId);

        }

    }

};


// ==========================================
// LOAD YOUTUBE PLAYER
// ==========================================

function loadYouTubePlayer(videoId) {

    videoPlayer.pause();

    videoPlayer.removeAttribute("src");

    videoPlayer.load();

    videoPlayer.classList.add("hidden");

    youtubePlayerElement.classList.remove("hidden");


    if (
        window.YT &&
        window.YT.Player
    ) {

        createYouTubePlayer(videoId);

    }

}


// ==========================================
// CREATE YOUTUBE PLAYER
// ==========================================

function createYouTubePlayer(videoId) {

    if (youtubePlayerInstance) {

        return;

    }


    youtubePlayerInstance =
        new YT.Player(
            "youtubePlayer",
            {

                videoId: videoId,

                width: "100%",

                height: "100%",

                playerVars: {

                    autoplay: 0,

                    controls: 0,

                    disablekb: 1,

                    fs: 0,

                    rel: 0,

                    modestbranding: 1,

                    playsinline: 1,

                    enablejsapi: 1,

                    origin:
                        window.location.origin

                },

                events: {

                    onReady:
                        onYouTubeReady,

                    onStateChange:
                        onYouTubeStateChange,

                    onError:
                        onYouTubeError

                }

            }
        );

}


// ==========================================
// YOUTUBE READY
// ==========================================

function onYouTubeReady(event) {

    youtubeReady = true;

    hideLoader();


    event.target.setVolume(
        currentVolume * 100
    );


    try {

        event.target.setPlaybackRate(
            currentPlaybackRate
        );

    } catch (error) {

        console.warn(
            "سرعة التشغيل غير متاحة:",
            error
        );

    }


    const duration =
        event.target.getDuration();


    durationElement.textContent =
        formatTime(duration);


    startYouTubeProgressTimer();

}


// ==========================================
// YOUTUBE STATE CHANGE
// ==========================================

function onYouTubeStateChange(event) {

    if (
        event.data ===
        YT.PlayerState.PLAYING
    ) {

        hideLoader();

        updatePlayUI(true);

    }


    if (
        event.data ===
        YT.PlayerState.PAUSED
    ) {

        updatePlayUI(false);

    }


    if (
        event.data ===
        YT.PlayerState.ENDED
    ) {

        updatePlayUI(false);

        bigPlayBtn.classList.remove(
            "hidden"
        );

    }


    if (
        event.data ===
        YT.PlayerState.BUFFERING
    ) {

        showLoader();

    }

}


// ==========================================
// YOUTUBE ERROR
// ==========================================

function onYouTubeError(error) {

    console.error(
        "YouTube Player Error:",
        error
    );


    hideLoader();


    showError(
        "تعذر تشغيل فيديو YouTube. قد يكون الفيديو خاصًا أو غير مسموح بتضمينه."
    );

}


// ==========================================
// YOUTUBE PROGRESS TIMER
// ==========================================

function startYouTubeProgressTimer() {

    clearInterval(youtubeTimer);


    youtubeTimer =
        setInterval(
            () => {

                if (
                    !youtubeReady ||
                    !youtubePlayerInstance
                ) {

                    return;

                }


                try {

                    const current =
                        youtubePlayerInstance
                            .getCurrentTime();

                    const duration =
                        youtubePlayerInstance
                            .getDuration();


                    if (
                        !duration ||
                        !Number.isFinite(duration)
                    ) {

                        return;

                    }


                    const progress =
                        (current / duration) * 100;


                    progressBar.value =
                        progress;


                    currentTimeElement.textContent =
                        formatTime(current);


                    durationElement.textContent =
                        formatTime(duration);


                    updateProgressColor();

                } catch (error) {

                    console.warn(
                        "تعذر تحديث وقت YouTube:",
                        error
                    );

                }

            },

            500
        );

}


// ==========================================
// PLAY / PAUSE
// ==========================================

function togglePlay() {

    if (currentPlayerType === "direct") {

        if (videoPlayer.paused) {

            videoPlayer
                .play()
                .catch(() => {

                    showError(
                        "تعذر تشغيل الفيديو."
                    );

                });

        } else {

            videoPlayer.pause();

        }

    }


    if (
        currentPlayerType === "youtube" &&
        youtubeReady &&
        youtubePlayerInstance
    ) {

        const state =
            youtubePlayerInstance
                .getPlayerState();


        if (
            state ===
            YT.PlayerState.PLAYING
        ) {

            youtubePlayerInstance
                .pauseVideo();

        } else {

            youtubePlayerInstance
                .playVideo();

        }

    }

}


playPauseBtn.addEventListener(
    "click",
    togglePlay
);


bigPlayBtn.addEventListener(
    "click",
    togglePlay
);


// ==========================================
// UPDATE PLAY UI
// ==========================================

function updatePlayUI(isPlaying) {

    const icon =
        playPauseBtn.querySelector("i");


    if (isPlaying) {

        icon.className =
            "fa-solid fa-pause";

        bigPlayBtn.classList.add(
            "hidden"
        );

    } else {

        icon.className =
            "fa-solid fa-play";

        bigPlayBtn.classList.remove(
            "hidden"
        );

    }

}


// ==========================================
// SEEK FORWARD / BACKWARD
// ==========================================

function seekBy(seconds) {

    if (currentPlayerType === "direct") {

        if (
            !Number.isFinite(
                videoPlayer.duration
            )
        ) {

            return;

        }


        videoPlayer.currentTime =
            Math.max(
                0,
                Math.min(
                    videoPlayer.duration,
                    videoPlayer.currentTime +
                    seconds
                )
            );

    }


    if (
        currentPlayerType === "youtube" &&
        youtubeReady &&
        youtubePlayerInstance
    ) {

        const current =
            youtubePlayerInstance
                .getCurrentTime();

        const duration =
            youtubePlayerInstance
                .getDuration();


        const newTime =
            Math.max(
                0,
                Math.min(
                    duration,
                    current + seconds
                )
            );


        youtubePlayerInstance
            .seekTo(
                newTime,
                true
            );

    }

}


backwardBtn.addEventListener(
    "click",
    () => {

        seekBy(-10);

    }
);


forwardBtn.addEventListener(
    "click",
    () => {

        seekBy(10);

    }
);


// ==========================================
// PROGRESS BAR SEEK
// ==========================================

progressBar.addEventListener(
    "input",
    () => {

        const percentage =
            Number(progressBar.value);


        updateProgressColor();


        if (
            currentPlayerType === "direct" &&
            Number.isFinite(
                videoPlayer.duration
            )
        ) {

            videoPlayer.currentTime =
                (
                    percentage / 100
                ) *
                videoPlayer.duration;

        }


        if (
            currentPlayerType === "youtube" &&
            youtubeReady &&
            youtubePlayerInstance
        ) {

            const duration =
                youtubePlayerInstance
                    .getDuration();


            const newTime =
                (
                    percentage / 100
                ) *
                duration;


            youtubePlayerInstance
                .seekTo(
                    newTime,
                    true
                );

        }

    }
);


// ==========================================
// PROGRESS BAR COLOR
// ==========================================

function updateProgressColor() {

    const value =
        Number(progressBar.value);


    progressBar.style.background = `

        linear-gradient(
            to right,

            #ff7900 0%,

            #ff7900 ${value}%,

            rgba(255, 255, 255, 0.24)
            ${value}%,

            rgba(255, 255, 255, 0.24)
            100%
        )

    `;

}


// ==========================================
// VOLUME
// ==========================================

volumeBar.addEventListener(
    "input",
    () => {

        currentVolume =
            Number(volumeBar.value);


        if (
            currentPlayerType === "direct"
        ) {

            videoPlayer.muted = false;

            videoPlayer.volume =
                currentVolume;

        }


        if (
            currentPlayerType === "youtube" &&
            youtubeReady &&
            youtubePlayerInstance
        ) {

            youtubePlayerInstance
                .unMute();


            youtubePlayerInstance
                .setVolume(
                    currentVolume * 100
                );

        }


        updateVolumeIcon(
            currentVolume
        );

        updateVolumeBarColor();

    }
);


// ==========================================
// MUTE BUTTON
// ==========================================

muteBtn.addEventListener(
    "click",
    () => {

        if (
            currentPlayerType === "direct"
        ) {

            videoPlayer.muted =
                !videoPlayer.muted;


            updateVolumeIcon(

                videoPlayer.muted
                    ? 0
                    : videoPlayer.volume

            );

        }


        if (
            currentPlayerType === "youtube" &&
            youtubeReady &&
            youtubePlayerInstance
        ) {

            if (
                youtubePlayerInstance
                    .isMuted()
            ) {

                youtubePlayerInstance
                    .unMute();


                updateVolumeIcon(
                    currentVolume
                );

            } else {

                youtubePlayerInstance
                    .mute();


                updateVolumeIcon(0);

            }

        }

    }
);


// ==========================================
// UPDATE VOLUME ICON
// ==========================================

function updateVolumeIcon(volume) {

    const icon =
        muteBtn.querySelector("i");


    if (volume === 0) {

        icon.className =
            "fa-solid fa-volume-xmark";

    } else if (volume < 0.5) {

        icon.className =
            "fa-solid fa-volume-low";

    } else {

        icon.className =
            "fa-solid fa-volume-high";

    }

}


// ==========================================
// VOLUME BAR COLOR
// ==========================================

function updateVolumeBarColor() {

    const value =
        Number(volumeBar.value) * 100;


    volumeBar.style.background = `

        linear-gradient(
            to right,

            #ff7900 0%,

            #ff7900 ${value}%,

            rgba(255, 255, 255, 0.22)
            ${value}%,

            rgba(255, 255, 255, 0.22)
            100%
        )

    `;

}


// ==========================================
// SETTINGS MENU
// ==========================================

settingsBtn.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();


        settingsMenu.classList.toggle(
            "hidden"
        );

    }
);


settingsMenu.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

    }
);


document.addEventListener(
    "click",
    () => {

        settingsMenu.classList.add(
            "hidden"
        );

    }
);


// ==========================================
// PLAYBACK SPEED
// ==========================================

speedOptions.forEach(
    (option) => {

        option.addEventListener(
            "click",
            () => {

                const speed =
                    Number(
                        option.dataset.speed
                    );


                currentPlaybackRate =
                    speed;


                // DIRECT VIDEO
                if (
                    currentPlayerType ===
                    "direct"
                ) {

                    videoPlayer.playbackRate =
                        speed;

                }


                // YOUTUBE
                if (
                    currentPlayerType ===
                    "youtube" &&
                    youtubeReady &&
                    youtubePlayerInstance
                ) {

                    try {

                        youtubePlayerInstance
                            .setPlaybackRate(
                                speed
                            );

                    } catch (error) {

                        console.warn(
                            "سرعة YouTube غير مدعومة:",
                            error
                        );

                    }

                }


                // REMOVE ACTIVE
                speedOptions.forEach(
                    (item) => {

                        item.classList.remove(
                            "active"
                        );


                        const check =
                            item.querySelector(
                                ".fa-check"
                            );


                        if (check) {

                            check.remove();

                        }

                    }
                );


                // ADD ACTIVE
                option.classList.add(
                    "active"
                );


                // ADD CHECK ICON
                const checkIcon =
                    document.createElement(
                        "i"
                    );


                checkIcon.className =
                    "fa-solid fa-check";


                option.appendChild(
                    checkIcon
                );


                // CLOSE MENU
                settingsMenu.classList.add(
                    "hidden"
                );

            }
        );

    }
);


// ==========================================
// FULLSCREEN
// ==========================================

fullscreenBtn.addEventListener(
    "click",
    toggleFullscreen
);


function toggleFullscreen() {

    if (!document.fullscreenElement) {

        if (
            videoWrapper.requestFullscreen
        ) {

            videoWrapper
                .requestFullscreen();

        } else if (
            videoWrapper
                .webkitRequestFullscreen
        ) {

            videoWrapper
                .webkitRequestFullscreen();

        }

    } else {

        if (
            document.exitFullscreen
        ) {

            document
                .exitFullscreen();

        } else if (
            document
                .webkitExitFullscreen
        ) {

            document
                .webkitExitFullscreen();

        }

    }

}


// ==========================================
// FULLSCREEN ICON
// ==========================================

document.addEventListener(
    "fullscreenchange",
    updateFullscreenIcon
);


document.addEventListener(
    "webkitfullscreenchange",
    updateFullscreenIcon
);


function updateFullscreenIcon() {

    const icon =
        fullscreenBtn.querySelector("i");


    if (
        document.fullscreenElement ||
        document.webkitFullscreenElement
    ) {

        icon.className =
            "fa-solid fa-compress";

    } else {

        icon.className =
            "fa-solid fa-expand";

    }

}


// ==========================================
// KEYBOARD SHORTCUTS
// ==========================================

document.addEventListener(
    "keydown",
    (event) => {

        const target =
            event.target.tagName
                .toLowerCase();


        if (
            target === "input" ||
            target === "textarea" ||
            target === "select"
        ) {

            return;

        }


        // SPACE
        if (
            event.code === "Space"
        ) {

            event.preventDefault();

            togglePlay();

        }


        // RIGHT ARROW
        if (
            event.code === "ArrowRight"
        ) {

            event.preventDefault();

            seekBy(10);

        }


        // LEFT ARROW
        if (
            event.code === "ArrowLeft"
        ) {

            event.preventDefault();

            seekBy(-10);

        }


        // F
        if (
            event.key.toLowerCase() === "f"
        ) {

            event.preventDefault();

            toggleFullscreen();

        }

    }
);


// ==========================================
// FORMAT TIME
// ==========================================

function formatTime(seconds) {

    if (
        !Number.isFinite(seconds) ||
        seconds < 0
    ) {

        return "00:00";

    }


    const totalSeconds =
        Math.floor(seconds);


    const hours =
        Math.floor(
            totalSeconds / 3600
        );


    const minutes =
        Math.floor(
            (
                totalSeconds % 3600
            ) / 60
        );


    const secs =
        totalSeconds % 60;


    if (hours > 0) {

        return (
            String(hours)
                .padStart(2, "0")
            +
            ":"
            +
            String(minutes)
                .padStart(2, "0")
            +
            ":"
            +
            String(secs)
                .padStart(2, "0")
        );

    }


    return (
        String(minutes)
            .padStart(2, "0")
        +
        ":"
        +
        String(secs)
            .padStart(2, "0")
    );

}


// ==========================================
// GET YOUTUBE VIDEO ID
// ==========================================

function getYouTubeVideoId(url) {

    try {

        const parsedUrl =
            new URL(url);


        const hostname =
            parsedUrl.hostname
                .replace("www.", "");


        // youtu.be/VIDEO_ID
        if (
            hostname === "youtu.be"
        ) {

            return (
                parsedUrl.pathname
                    .split("/")
                    .filter(Boolean)[0]
                ||
                null
            );

        }


        // youtube.com/watch?v=VIDEO_ID
        if (
            hostname.includes(
                "youtube.com"
            )
        ) {

            // NORMAL VIDEO
            const videoId =
                parsedUrl.searchParams
                    .get("v");


            if (videoId) {

                return videoId;

            }


            // SHORTS
            if (
                parsedUrl.pathname
                    .startsWith(
                        "/shorts/"
                    )
            ) {

                return (
                    parsedUrl.pathname
                        .split("/")[2]
                    ||
                    null
                );

            }


            // EMBED
            if (
                parsedUrl.pathname
                    .startsWith(
                        "/embed/"
                    )
            ) {

                return (
                    parsedUrl.pathname
                        .split("/")[2]
                    ||
                    null
                );

            }

        }


        return null;

    } catch (error) {

        return null;

    }

}


// ==========================================
// LOADER
// ==========================================

function showLoader() {

    videoLoader.classList.remove(
        "hidden"
    );

}


function hideLoader() {

    videoLoader.classList.add(
        "hidden"
    );

}


// ==========================================
// ERROR
// ==========================================

function showError(message) {

    errorText.textContent =
        message;


    errorBox.classList.remove(
        "hidden"
    );


    bigPlayBtn.classList.add(
        "hidden"
    );


    hideLoader();

}

// ==========================================
// LOAD STUDENT CODE
// ==========================================

async function loadStudentWatermark() {

    try {

        const user = auth.currentUser;

        if (!user) return;

        const snap =
            await getDoc(
                doc(
                    db,
                    "students",
                    user.uid
                )
            );

        if (!snap.exists()) return;

        studentCode =
            snap.data().studentCode || "";

        studentWatermark.innerHTML =
            `M.YOUSSEF • ${studentCode}`;

        startWatermark();

    }

    catch (error) {

        console.error(
            error
        );

    }

}


// ==========================================
// START WATERMARK
// ==========================================

function startWatermark() {

    if (!studentWatermark) return;

    moveWatermark();

    clearInterval(
        watermarkInterval
    );

    watermarkInterval =
        setInterval(

            moveWatermark,

            2000

        );

}


// ==========================================
// MOVE WATERMARK
// ==========================================

function moveWatermark() {

    const maxX =
        videoWrapper.clientWidth -
        220;

    const maxY =
        videoWrapper.clientHeight -
        60;

    studentWatermark.style.left =
        Math.random() * maxX + "px";

    studentWatermark.style.top =
        Math.random() * maxY + "px";

    studentWatermark.style.opacity =
        0.18 + Math.random() * 0.25;

    studentWatermark.style.transform =
        `rotate(${Math.floor(Math.random()*30)-15}deg)`;

}


// ==========================================
// START AFTER LOGIN
// ==========================================

onAuthStateChanged(

    auth,

    async(user)=>{

        if(!user) return;

        await loadStudentWatermark();

    }

);


// ==========================================
// CLEANUP
// ==========================================

window.addEventListener(

    "beforeunload",

    ()=>{

        clearInterval(

            watermarkInterval

        );

    }

);

// ==========================================
// INITIAL UI
// ==========================================

updateProgressColor();

updateVolumeBarColor();

updateVolumeIcon(1);


// ==========================================
// CLEANUP
// ==========================================

window.addEventListener(
    "beforeunload",
    () => {

        clearInterval(
            youtubeTimer
        );

    }
);
