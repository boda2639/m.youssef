import { db, auth } from "./firebase.js";

import {
    collection,
    getDocs
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    onAuthStateChanged,
    signOut
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// ==============================
// عناصر الصفحة
// ==============================

const coursesContainer =
    document.getElementById("coursesContainer");

const loadingBox =
    document.getElementById("loadingBox");

const emptyState =
    document.getElementById("emptyState");

const coursesCount =
    document.getElementById("coursesCount");

const logoutBtn =
    document.getElementById("logoutBtn");


// ==============================
// التأكد من تسجيل الدخول
// ==============================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.replace("login.html");

        return;
    }

    loadCourses();
});


// ==============================
// تحميل الكورسات من Firestore
// ==============================

async function loadCourses() {

    try {

        const querySnapshot =
            await getDocs(
                collection(db, "courses")
            );


        loadingBox.style.display = "none";


        if (querySnapshot.empty) {

            emptyState.style.display = "block";

            coursesCount.textContent =
                "لا توجد كورسات";

            return;
        }


        coursesContainer.innerHTML = "";


        querySnapshot.forEach((doc) => {

            const course = doc.data();

            const card =
                createCourseCard(
                    doc.id,
                    course
                );


            coursesContainer.appendChild(card);

        });


        coursesCount.textContent =
            `${querySnapshot.size} كورس متاح`;

    }

    catch (error) {

        console.error(
            "خطأ في تحميل الكورسات:",
            error
        );


        loadingBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation"></i>

            <span>
                حدث خطأ أثناء تحميل الكورسات
            </span>
        `;

    }

}


// ==============================
// إنشاء كارت الكورس
// ==============================

function createCourseCard(
    courseId,
    course
) {

    const card =
        document.createElement("article");


    card.className =
        "course-card";


    // البيانات

    const image =
        course.courseImage ||
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb";

    const subject =
        course.subject ||
        "الفيزياء";

    const title =
        course.courseName ||
        course.title ||
        "كورس بدون عنوان";

    const description =
        course.description ||
        "لا يوجد وصف لهذا الكورس حالياً.";

    const grade =
        course.grade ||
        "المرحلة الثانوية";


    // حماية النصوص قبل وضعها في HTML

    card.innerHTML = `

        <div class="course-image">

            <img
                src="${escapeHTML(image)}"
                alt="${escapeHTML(title)}"
                loading="lazy"
            >

            <div class="subject-badge">

                ${escapeHTML(subject)}

            </div>

        </div>


        <div class="course-content">


            <div class="course-grade">

                <i class="fa-solid fa-graduation-cap"></i>

                <span>
                    ${escapeHTML(grade)}
                </span>

            </div>


            <h3 class="course-title">

                ${escapeHTML(title)}

            </h3>


            <p class="course-description">

                ${escapeHTML(description)}

            </p>


            <button
                class="course-button"
                data-course-id="${courseId}"
            >

                عرض تفاصيل الكورس

                <i class="fa-solid fa-arrow-left"></i>

            </button>


        </div>

    `;


    // زر فتح الكورس

    const button =
        card.querySelector(
            ".course-button"
        );


    button.addEventListener(
        "click",

        () => {

            window.location.href =
                `course.html?id=${courseId}`;

        }
    );


    return card;
}


// ==============================
// تسجيل الخروج
// ==============================

logoutBtn.addEventListener(
    "click",

    async () => {

        try {

            await signOut(auth);


            localStorage.removeItem(
                "userRole"
            );


            localStorage.removeItem(
                "userName"
            );


            localStorage.removeItem(
                "userUID"
            );


            localStorage.removeItem(
                "userEmail"
            );


            window.location.replace(
                "login.html"
            );

        }

        catch (error) {

            console.error(
                "خطأ في تسجيل الخروج:",
                error
            );

        }

    }
);


// ==============================
// حماية النصوص
// ==============================

function escapeHTML(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");
}
const courseSearch =
    document.getElementById("courseSearch");


courseSearch.addEventListener("input", function () {

    const searchValue =
        this.value
            .trim()
            .toLowerCase();


    const courseCards =
        document.querySelectorAll(".course-card");


    courseCards.forEach(card => {

        const cardText =
            card.textContent.toLowerCase();


        if (cardText.includes(searchValue)) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

});