import {
    db,
    auth
} from "./firebase.js";


import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// ==========================================
// ELEMENTS
// ==========================================

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

const courseSearch =
    document.getElementById("courseSearch");


// ==========================================
// AUTH
// ==========================================

onAuthStateChanged(
    auth,
    (user) => {

        if (!user) {

            window.location.replace(
                "/login"
            );

            return;
        }


        loadCourses();

    }
);


// ==========================================
// LOAD COURSES
// ==========================================

async function loadCourses() {

    try {

        const querySnapshot =
            await getDocs(
                collection(
                    db,
                    "courses"
                )
            );


        loadingBox.style.display =
            "none";


        if (querySnapshot.empty) {

            emptyState.style.display =
                "block";

            coursesCount.textContent =
                "لا توجد كورسات";

            return;
        }


        coursesContainer.innerHTML =
            "";


        querySnapshot.forEach(
            (courseDocument) => {

                const course =
                    courseDocument.data();


                const card =
                    createCourseCard(
                        courseDocument.id,
                        course
                    );


                coursesContainer.appendChild(
                    card
                );

            }
        );


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


// ==========================================
// CREATE COURSE CARD
// ==========================================

function createCourseCard(
    courseId,
    course
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "course-card";


    // ======================================
    // COURSE DATA
    // ======================================

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


    const price =

        Number(
            course.price ?? 0
        );


    // ======================================
    // PRICE TEXT
    // ======================================

    const priceText =

        price > 0

            ? `${price.toLocaleString("ar-EG")} جنيه`

            : "مجاني";


    // ======================================
    // CARD HTML
    // ======================================

    card.innerHTML = `

        <div class="course-image">


            <img

                src="${escapeHTML(image)}"

                alt="${escapeHTML(title)}"

                loading="lazy"

            >


            <!-- SUBJECT -->

            <div class="subject-badge">

                ${escapeHTML(subject)}

            </div>


            <!-- LOCK -->

            <div class="course-lock">

                <i class="fa-solid fa-lock"></i>

            </div>


        </div>


        <div class="course-content">


            <div class="course-top-row">


                <div class="course-grade">

                    <i class="fa-solid fa-graduation-cap"></i>

                    <span>

                        ${escapeHTML(grade)}

                    </span>

                </div>


                <div class="course-price">

                    ${escapeHTML(priceText)}

                </div>


            </div>


            <h3 class="course-title">

                ${escapeHTML(title)}

            </h3>


            <p class="course-description">

                ${escapeHTML(description)}

            </p>


            <div class="locked-message">

                <i class="fa-solid fa-lock"></i>

                <span>

                    الكورس مغلق حتى إتمام الشراء

                </span>

            </div>


            <button
                class="course-button"
                data-course-id="${escapeHTML(courseId)}"
            >

                عرض تفاصيل الكورس

                <i class="fa-solid fa-arrow-left"></i>

            </button>


        </div>

    `;


    // ======================================
    // OPEN COURSE DETAILS
    // ======================================

    const button =
        card.querySelector(
            ".course-button"
        );


    button.addEventListener(
        "click",
        () => {

            window.location.href =
                `/course?id=${encodeURIComponent(courseId)}`;

        }
    );


    return card;

}


// ==========================================
// SEARCH
// ==========================================

if (courseSearch) {

    courseSearch.addEventListener(
        "input",
        function () {

            const searchValue =

                this.value

                    .trim()

                    .toLowerCase();


            const courseCards =

                document.querySelectorAll(
                    ".course-card"
                );


            courseCards.forEach(
                (card) => {

                    const cardText =

                        card.textContent

                            .toLowerCase();


                    card.style.display =

                        cardText.includes(
                            searchValue
                        )

                            ? ""

                            : "none";

                }
            );

        }
    );

}


// ==========================================
// LOGOUT
// ==========================================

if (logoutBtn) {

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
                    "/login"
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
