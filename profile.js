// ==========================================
// FIREBASE
// ==========================================

import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==========================================
// HTML ELEMENTS
// ==========================================

const studentNameTop = document.getElementById("studentName");
const studentGradeTop = document.getElementById("studentGrade");

const nameElement = document.getElementById("name");
const emailElement = document.getElementById("email");
const phoneElement = document.getElementById("phone");
const studentCodeElement = document.getElementById("studentCode");
const gradeElement = document.getElementById("grade");
const joinDateElement = document.getElementById("joinDate");

const logoutBtn = document.getElementById("logoutBtn");


// ==========================================
// CHECK LOGIN + LOAD DATA
// ==========================================

onAuthStateChanged(auth, async (user) => {

    // لو الطالب مش مسجل دخول
    if (!user) {

        window.location.replace("login.html");

        return;
    }


    try {

        // ==================================
        // GET STUDENT FROM FIRESTORE
        // students / USER UID
        // ==================================

        const studentRef = doc(
            db,
            "students",
            user.uid
        );

        const studentSnapshot = await getDoc(
            studentRef
        );


        // ==================================
        // STUDENT FOUND
        // ==================================

        if (studentSnapshot.exists()) {

            const student = studentSnapshot.data();

            console.log(
                "بيانات الطالب:",
                student
            );


            // ==================================
            // NAME
            // ==================================

            const studentName =
                student.name ||
                student.fullName ||
                student.studentName ||
                user.displayName ||
                "طالب المنصة";


            // ==================================
            // EMAIL
            // ==================================

            const studentEmail =
                student.email ||
                user.email ||
                "غير مضاف";


            // ==================================
            // PHONE
            // ==================================

            const studentPhone =
                student.phone ||
                student.phoneNumber ||
                student.mobile ||
                "غير مضاف";


            // ==================================
            // STUDENT CODE
            // ==================================

            const studentCode =
                student.studentCode ||
                student.code ||
                student.studentId ||
                "غير مضاف";


            // ==================================
            // GRADE
            // ==================================

            const studentGrade =
                student.grade ||
                student.studentGrade ||
                student.class ||
                "الصف الثالث الثانوي";


            // ==================================
            // JOIN DATE
            // ==================================

            const joinDate =
                formatDate(
                    student.createdAt ||
                    student.joinDate ||
                    student.registrationDate
                );


            // ==================================
            // DISPLAY DATA
            // ==================================

            setText(
                studentNameTop,
                studentName
            );

            setText(
                studentGradeTop,
                studentGrade
            );

            setText(
                nameElement,
                studentName
            );

            setText(
                emailElement,
                studentEmail
            );

            setText(
                phoneElement,
                studentPhone
            );

            setText(
                studentCodeElement,
                studentCode
            );

            setText(
                gradeElement,
                studentGrade
            );

            setText(
                joinDateElement,
                joinDate
            );

        }


        // ==================================
        // STUDENT DOCUMENT NOT FOUND
        // ==================================

        else {

            console.warn(
                "لم يتم العثور على الطالب في Firestore"
            );

            // نعرض بيانات Firebase Authentication
            // المتاحة على الأقل

            const fallbackName =
                user.displayName ||
                "طالب المنصة";

            const fallbackEmail =
                user.email ||
                "غير مضاف";


            setText(
                studentNameTop,
                fallbackName
            );

            setText(
                studentGradeTop,
                "الصف الثالث الثانوي"
            );

            setText(
                nameElement,
                fallbackName
            );

            setText(
                emailElement,
                fallbackEmail
            );

            setText(
                phoneElement,
                "غير مضاف"
            );

            setText(
                studentCodeElement,
                "غير مضاف"
            );

            setText(
                gradeElement,
                "الصف الثالث الثانوي"
            );

            setText(
                joinDateElement,
                formatDate(
                    user.metadata.creationTime
                )
            );

        }

    }

    catch (error) {

        console.error(
            "حدث خطأ أثناء تحميل بيانات الطالب:",
            error
        );

        alert(
            "حدث خطأ أثناء تحميل بيانات الحساب"
        );

    }

});


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(value) {

    if (!value) {
        return "غير معروف";
    }

    try {

        let date;


        // Firestore Timestamp
        if (
            typeof value.toDate === "function"
        ) {

            date = value.toDate();

        }

        // Normal Date / String
        else {

            date = new Date(value);

        }


        if (
            isNaN(date.getTime())
        ) {

            return "غير معروف";

        }


        return date.toLocaleDateString(
            "ar-EG",
            {
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );

    }

    catch (error) {

        return "غير معروف";

    }

}


// ==========================================
// SET TEXT SAFELY
// ==========================================

function setText(element, value) {

    if (!element) {
        return;
    }

    element.textContent =
        value || "غير مضاف";

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

                localStorage.clear();

                window.location.replace(
                    "login.html"
                );

            }

            catch (error) {

                console.error(
                    "خطأ أثناء تسجيل الخروج:",
                    error
                );

                alert(
                    "حدث خطأ أثناء تسجيل الخروج"
                );

            }

        }
    );

}
