// ==========================================
// FIREBASE
// ==========================================

import {
    auth,
    db
} from "./firebase.js";


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

const loadingBox =
    document.getElementById("loadingBox");

const profileContent =
    document.getElementById("profileContent");

const errorBox =
    document.getElementById("errorBox");

const errorText =
    document.getElementById("errorText");


// بيانات الطالب

const studentName =
    document.getElementById("studentName");

const studentEmail =
    document.getElementById("studentEmail");

const studentPhone =
    document.getElementById("studentPhone");

const studentGrade =
    document.getElementById("studentGrade");

const studentCode =
    document.getElementById("studentCode");

const studentUID =
    document.getElementById("studentUID");


// زر تسجيل الخروج

const logoutBtn =
    document.getElementById("logoutBtn");


// ==========================================
// CHECK AUTHENTICATION
// ==========================================

onAuthStateChanged(

    auth,

    async (user) => {

        // ==================================
        // USER NOT LOGGED IN
        // ==================================

        if (!user) {

            window.location.replace(
                "login.html"
            );

            return;
        }


        // ==================================
        // LOAD STUDENT PROFILE
        // ==================================

        try {

            const studentRef =
                doc(
                    db,
                    "students",
                    user.uid
                );


            const studentSnapshot =
                await getDoc(
                    studentRef
                );


            // ==================================
            // STUDENT EXISTS IN FIRESTORE
            // ==================================

            if (
                studentSnapshot.exists()
            ) {

                const student =
                    studentSnapshot.data();


                console.log(
                    "بيانات الطالب:",
                    student
                );


                // ==================================
                // DISPLAY STUDENT DATA
                // ==================================

                setText(

                    studentName,

                    student.name ||
                    student.fullName ||
                    "طالب المنصة"

                );


                setText(

                    studentEmail,

                    student.email ||
                    user.email ||
                    "غير متوفر"

                );


                setText(

                    studentPhone,

                    student.phone ||
                    student.phoneNumber ||
                    "غير مضاف"

                );


                setText(

                    studentGrade,

                    student.grade ||
                    student.class ||
                    student.studentGrade ||
                    "غير مضاف"

                );


                setText(

                    studentCode,

                    student.studentCode ||
                    student.code ||
                    "غير مضاف"

                );


                setText(

                    studentUID,

                    user.uid

                );


                // ==================================
                // SHOW PROFILE
                // ==================================

                loadingBox?.classList.add(
                    "hidden"
                );


                errorBox?.classList.add(
                    "hidden"
                );


                profileContent?.classList.remove(
                    "hidden"
                );

            }


            // ==================================
            // STUDENT DOCUMENT NOT FOUND
            // ==================================

            else {

                console.warn(
                    "لا يوجد مستند للطالب داخل Firestore"
                );


                // نعرض البيانات الأساسية من Auth

                setText(

                    studentName,

                    user.displayName ||
                    "طالب المنصة"

                );


                setText(

                    studentEmail,

                    user.email ||
                    "غير متوفر"

                );


                setText(

                    studentPhone,

                    "غير مضاف"

                );


                setText(

                    studentGrade,

                    "غير مضاف"

                );


                setText(

                    studentCode,

                    "غير مضاف"

                );


                setText(

                    studentUID,

                    user.uid

                );


                loadingBox?.classList.add(
                    "hidden"
                );


                profileContent?.classList.remove(
                    "hidden"
                );

            }

        }

        catch (error) {

            console.error(
                "خطأ أثناء تحميل بيانات الطالب:",
                error
            );


            showError(
                "حدث خطأ أثناء تحميل بيانات حسابك."
            );

        }

    }

);


// ==========================================
// LOGOUT
// ==========================================

if (logoutBtn) {

    logoutBtn.addEventListener(

        "click",

        async () => {

            try {

                // تسجيل الخروج من Firebase

                await signOut(auth);


                // حذف البيانات المحلية

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


                // الانتقال لصفحة تسجيل الدخول

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
                    "حدث خطأ أثناء تسجيل الخروج."
                );

            }

        }

    );

}


// ==========================================
// SET TEXT SAFELY
// ==========================================

function setText(
    element,
    value
) {

    if (!element) {

        return;

    }


    element.textContent =
        value ?? "غير متوفر";

}


// ==========================================
// SHOW ERROR
// ==========================================

function showError(
    message
) {

    loadingBox?.classList.add(
        "hidden"
    );


    profileContent?.classList.add(
        "hidden"
    );


    errorBox?.classList.remove(
        "hidden"
    );


    if (errorText) {

        errorText.textContent =
            message;

    }

}