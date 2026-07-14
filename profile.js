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

// أعلى الصفحة
const studentNameTop =
    document.getElementById("studentName");

const studentGradeTop =
    document.getElementById("studentGrade");


// بيانات الطالب
const nameElement =
    document.getElementById("name");

const emailElement =
    document.getElementById("email");

const phoneElement =
    document.getElementById("phone");

const studentCodeElement =
    document.getElementById("studentCode");

const gradeElement =
    document.getElementById("grade");

const joinDateElement =
    document.getElementById("joinDate");

const studentWalletElement =
    document.getElementById("studentWallet");


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
        // LOAD STUDENT DATA
        // ==================================

        try {


            // مستند الطالب
            // students / USER UID

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
            // STUDENT EXISTS
            // ==================================

            if (studentSnapshot.exists()) {


                const student =
                    studentSnapshot.data();


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

                    "غير مضاف";


                // ==================================
                // WALLET
                // ==================================

                const studentWallet =

                    Number(
                        student.wallet ?? 0
                    );


                // ==================================
                // JOIN DATE
                // ==================================

                const joinDate =

                    formatDate(

                        student.createdAt ||

                        student.joinDate ||

                        student.registrationDate ||

                        user.metadata.creationTime

                    );


                // ==================================
                // DISPLAY TOP PROFILE
                // ==================================

                setText(
                    studentNameTop,
                    studentName
                );


                setText(
                    studentGradeTop,
                    studentGrade
                );


                // ==================================
                // DISPLAY STUDENT DATA
                // ==================================

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


                // ==================================
                // DISPLAY WALLET
                // ==================================

                setText(

                    studentWalletElement,

                    `${studentWallet.toLocaleString("ar-EG")} جنيه`

                );


            }


            // ==================================
            // STUDENT NOT FOUND
            // ==================================

            else {


                console.warn(
                    "لم يتم العثور على مستند الطالب في Firestore"
                );


                const fallbackName =

                    user.displayName ||

                    "طالب المنصة";


                const fallbackEmail =

                    user.email ||

                    "غير مضاف";


                // أعلى الصفحة

                setText(
                    studentNameTop,
                    fallbackName
                );


                setText(
                    studentGradeTop,
                    "غير مضاف"
                );


                // البيانات

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
                    "غير مضاف"
                );


                setText(

                    joinDateElement,

                    formatDate(
                        user.metadata.creationTime
                    )

                );


                setText(
                    studentWalletElement,
                    "0 جنيه"
                );


            }


        }


        // ==================================
        // ERROR
        // ==================================

        catch (error) {


            console.error(

                "حدث خطأ أثناء تحميل بيانات الطالب:",

                error

            );


            alert(
                "حدث خطأ أثناء تحميل بيانات الحساب"
            );


        }


    }

);


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

            value &&

            typeof value.toDate === "function"

        ) {


            date =
                value.toDate();


        }


        // Normal Date / String

        else {


            date =
                new Date(value);


        }


        // Invalid date

        if (

            isNaN(
                date.getTime()
            )

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


        console.error(
            "خطأ في تحويل التاريخ:",
            error
        );


        return "غير معروف";


    }


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

        value !== undefined &&

        value !== null &&

        value !== ""

            ? value

            : "غير مضاف";


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
