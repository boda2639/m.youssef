// ==========================================
// FIREBASE
// ==========================================

import { db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==========================================
// GET COURSE ID FROM URL
// ==========================================

const params = new URLSearchParams(window.location.search);
const courseId = params.get("id");


// ==========================================
// HTML ELEMENTS
// ==========================================

const loadingBox = document.getElementById("loadingBox");
const courseContent = document.getElementById("courseContent");
const errorBox = document.getElementById("errorBox");
const errorText = document.getElementById("errorText");

const courseTitle = document.getElementById("courseTitle");

const videosContainer = document.getElementById("videosContainer");
const filesContainer = document.getElementById("filesContainer");

const videosCount = document.getElementById("videosCount");
const filesCount = document.getElementById("filesCount");

const noVideos = document.getElementById("noVideos");
const noFiles = document.getElementById("noFiles");


// ==========================================
// START PAGE
// ==========================================

if (!courseId) {

    showError("لم يتم تحديد الكورس المطلوب.");

} else {

    loadCourse();

}


// ==========================================
// LOAD COURSE FROM FIREBASE
// ==========================================

async function loadCourse() {

    try {

        const courseRef = doc(
            db,
            "courses",
            courseId
        );

        const courseSnapshot = await getDoc(courseRef);


        // لو الكورس غير موجود
        if (!courseSnapshot.exists()) {

            showError(
                "الكورس غير موجود في قاعدة البيانات."
            );

            return;
        }


        // بيانات الكورس
        const course = courseSnapshot.data();

        console.log(
            "بيانات الكورس:",
            course
        );


        // ==================================
        // MAIN COURSE TITLE
        // ==================================

        courseTitle.textContent =
            course.courseName ||
            course.title ||
            course.name ||
            "اسم الكورس";


        // ==================================
        // VIDEOS
        // ==================================

        let videos = [];


        // النظام الجديد
        // videos = Array
        if (Array.isArray(course.videos)) {

            videos = course.videos;

        }

        // دعم النظام القديم
        // videoTitle + videoUrl
        else if (
            course.videoTitle ||
            course.videoUrl
        ) {

            videos = [

                {
                    videoTitle:
                        course.videoTitle ||
                        "مشاهدة الفيديو",

                    videoUrl:
                        course.videoUrl ||
                        ""
                }

            ];

        }


        // ==================================
        // PDF FILES
        // ==================================

        let pdfs = [];


        // النظام الجديد
        // pdfs = Array
        if (Array.isArray(course.pdfs)) {

            pdfs = course.pdfs;

        }

        // دعم النظام القديم
        // pdfTitle + pdfUrl
        else if (
            course.pdfTitle ||
            course.pdfUrl
        ) {

            pdfs = [

                {
                    pdfTitle:
                        course.pdfTitle ||
                        "ملف الشرح",

                    pdfUrl:
                        course.pdfUrl ||
                        ""
                }

            ];

        }


        // ==================================
        // RENDER CONTENT
        // ==================================

        renderVideos(videos);

        renderFiles(pdfs);


        // إخفاء شاشة التحميل
        loadingBox.classList.add(
            "hidden"
        );


        // إظهار محتوى الكورس
        courseContent.classList.remove(
            "hidden"
        );


    } catch (error) {

        console.error(
            "خطأ أثناء تحميل الكورس:",
            error
        );


        showError(
            "حدث خطأ أثناء تحميل بيانات الكورس."
        );

    }

}


// ==========================================
// RENDER VIDEOS
// ==========================================

function renderVideos(videos) {

    // تنظيف الحاوية
    videosContainer.innerHTML = "";


    // فلترة الفيديوهات الفارغة
    const validVideos = videos.filter(

        (video) => {

            return (

                video &&

                (
                    video.videoTitle ||
                    video.videoUrl ||
                    video.title ||
                    video.url ||
                    video.name
                )

            );

        }

    );


    // عدد الفيديوهات
    videosCount.textContent =
        `${validVideos.length} فيديو متاح`;


    // لو مفيش فيديوهات
    if (validVideos.length === 0) {

        noVideos.classList.remove(
            "hidden"
        );

        return;

    }


    noVideos.classList.add(
        "hidden"
    );


    // إنشاء كارت لكل فيديو
    validVideos.forEach(

        (video, index) => {


            // اسم الفيديو
            const videoTitle =

                video.videoTitle ||

                video.title ||

                video.name ||

                `الفيديو ${index + 1}`;


            // رابط الفيديو
            const videoUrl =

                video.videoUrl ||

                video.url ||

                "";


            // إنشاء الكارت
            const card =

                document.createElement(
                    "article"
                );


            card.className =
                "item-card";


            // محتوى الكارت
            card.innerHTML = `

                <div class="item-number">

                    <i class="fa-solid fa-play"></i>

                    فيديو #${index + 1}

                </div>


                <h3 class="item-title">

                    ${escapeHTML(videoTitle)}

                </h3>


                <button
                    type="button"
                    class="item-btn video-btn"
                >

                    <i class="fa-solid fa-circle-play"></i>

                    <span>
                        تشغيل الفيديو
                    </span>

                </button>

            `;


            // زر تشغيل الفيديو
            const button =

                card.querySelector(
                    ".video-btn"
                );


            button.addEventListener(

                "click",

                () => {


                    // التأكد من وجود الرابط
                    if (!videoUrl) {

                        alert(
                            "رابط هذا الفيديو غير موجود."
                        );

                        return;

                    }


                    // حفظ رابط الفيديو
                    sessionStorage.setItem(

                        "currentVideoUrl",

                        videoUrl

                    );


                    // حفظ اسم الفيديو
                    sessionStorage.setItem(

                        "currentVideoTitle",

                        videoTitle

                    );


                    // حفظ اسم الكورس
                    sessionStorage.setItem(

                        "currentCourseTitle",

                        courseTitle.textContent

                    );


                    // الانتقال إلى صفحة الفيديو
                    window.location.href =

                        `course-details.html?courseId=${encodeURIComponent(courseId)}&videoIndex=${index}`;

                }

            );


            // إضافة الكارت
            videosContainer.appendChild(
                card
            );


        }

    );

}


// ==========================================
// RENDER PDF FILES
// ==========================================

function renderFiles(pdfs) {

    // تنظيف الحاوية
    filesContainer.innerHTML = "";


    // فلترة الملفات الفارغة
    const validPdfs = pdfs.filter(

        (file) => {

            return (

                file &&

                (
                    file.pdfTitle ||
                    file.pdfUrl ||
                    file.title ||
                    file.url ||
                    file.name
                )

            );

        }

    );


    // عدد الملفات
    filesCount.textContent =
        `${validPdfs.length} ملف متاح`;


    // لو مفيش ملفات
    if (validPdfs.length === 0) {

        noFiles.classList.remove(
            "hidden"
        );

        return;

    }


    noFiles.classList.add(
        "hidden"
    );


    // إنشاء كارت لكل ملف
    validPdfs.forEach(

        (file, index) => {


            // اسم الملف
            const pdfTitle =

                file.pdfTitle ||

                file.title ||

                file.name ||

                `ملف الشرح ${index + 1}`;


            // رابط الملف
            const pdfUrl =

                file.pdfUrl ||

                file.url ||

                "";


            // إنشاء الكارت
            const card =

                document.createElement(
                    "article"
                );


            card.className =
                "item-card";


            // محتوى الكارت
            card.innerHTML = `

                <div class="item-number">

                    <i class="fa-solid fa-file-pdf"></i>

                    ملف #${index + 1}

                </div>


                <h3 class="item-title">

                    ${escapeHTML(pdfTitle)}

                </h3>


                <button
                    type="button"
                    class="item-btn file-btn"
                >

                    <i class="fa-solid fa-file-arrow-down"></i>

                    <span>
                        فتح ملف الشرح
                    </span>

                </button>

            `;


            // زر فتح الملف
            const button =

                card.querySelector(
                    ".file-btn"
                );


            button.addEventListener(

                "click",

                () => {


                    // التأكد من وجود الرابط
                    if (!pdfUrl) {

                        alert(
                            "رابط ملف الـ PDF غير موجود."
                        );

                        return;

                    }


                    // فتح ملف PDF
                    window.open(

                        pdfUrl,

                        "_blank",

                        "noopener,noreferrer"

                    );

                }

            );


            // إضافة الكارت
            filesContainer.appendChild(
                card
            );


        }

    );

}


// ==========================================
// SHOW ERROR
// ==========================================

function showError(message) {

    loadingBox.classList.add(
        "hidden"
    );


    courseContent.classList.add(
        "hidden"
    );


    errorBox.classList.remove(
        "hidden"
    );


    errorText.textContent =
        message;

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}