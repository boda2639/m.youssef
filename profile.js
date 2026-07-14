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
    getDoc,
    collection,
    query,
    where,
    getDocs,
    limit,
    Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==========================================
// HTML ELEMENTS
// ==========================================

const loadingBox = document.getElementById("loadingBox");
const profileContent = document.getElementById("profileContent");
const errorBox = document.getElementById("errorBox");
const errorText = document.getElementById("errorText");

const studentName = document.getElementById("studentName");
const studentEmail = document.getElementById("studentEmail");
const studentPhone = document.getElementById("studentPhone");
const studentGrade = document.getElementById("studentGrade");
const studentCode = document.getElementById("studentCode");
const studentUID = document.getElementById("studentUID");

/* عناصر إضافية إن كانت موجودة في HTML */
const studentSubject = document.getElementById("studentSubject");
const registrationDate = document.getElementById("registrationDate");
const lastLogin = document.getElementById("lastLogin");

const logoutBtn = document.getElementById("logoutBtn");


// ==========================================
// AUTH STATE
// ==========================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.replace("login.html");
        return;
    }

    try {

        // ==================================
        // SEARCH FOR STUDENT DATA
        // ==================================

        const student = await findStudent(user);

        console.log("بيانات الطالب من Firebase:", student);


        // ==================================
        // NAME
        // ==================================

        setText(
            studentName,
            student?.name ||
            student?.fullName ||
            student?.studentName ||
            user.displayName ||
            "طالب المنصة"
        );


        // ==================================
        // EMAIL
        // ==================================

        setText(
            studentEmail,
            student?.email ||
            student?.studentEmail ||
            user.email ||
            "غير مضاف"
        );


        // ==================================
        // PHONE
        // ==================================

        setText(
            studentPhone,
            student?.phone ||
            student?.phoneNumber ||
            student?.studentPhone ||
            student?.mobile ||
            "غير مضاف"
        );


        // ==================================
        // GRADE
        // ==================================

        setText(
            studentGrade,
            student?.grade ||
            student?.studentGrade ||
            student?.class ||
            student?.gradeName ||
            "غير مضاف"
        );


        // ==================================
        // STUDENT CODE
        // ==================================

        setText(
            studentCode,
            student?.studentCode ||
            student?.code ||
            student?.studentId ||
            student?.studentID ||
            "غير مضاف"
        );


        // ==================================
        // SUBJECT
        // ==================================

        setText(
            studentSubject,
            student?.subject ||
            student?.courseSubject ||
            "فيزياء"
        );


        // ==================================
        // UID
        // ==================================

        setText(
            studentUID,
            user.uid
        );


        // ==================================
        // REGISTRATION DATE
        // ==================================

        setText(
            registrationDate,
            formatFirebaseDate(
                student?.createdAt ||
                student?.registrationDate ||
                student?.createdDate ||
                user.metadata?.creationTime
            )
        );


        // ==================================
        // LAST LOGIN
        // ==================================

        setText(
            lastLogin,
            formatFirebaseDate(
                user.metadata?.lastSignInTime
            ) || "اليوم"
        );


        // ==================================
        // SHOW PROFILE
        // ==================================

        loadingBox?.classList.add("hidden");
        errorBox?.classList.add("hidden");
        profileContent?.classList.remove("hidden");

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

});


// ==========================================
// FIND STUDENT
// ==========================================

async function findStudent(user) {

    // --------------------------------------
    // 1. SEARCH BY DOCUMENT ID = USER UID
    // --------------------------------------

    const directRef = doc(
        db,
        "students",
        user.uid
    );

    const directSnapshot = await getDoc(directRef);

    if (directSnapshot.exists()) {

        return {
            id: directSnapshot.id,
            ...directSnapshot.data()
        };

    }


    // --------------------------------------
    // 2. SEARCH BY uid FIELD
    // --------------------------------------

    const uidQuery = query(
        collection(db, "students"),
        where("uid", "==", user.uid),
        limit(1)
    );

    const uidSnapshot = await getDocs(uidQuery);

    if (!uidSnapshot.empty) {

        const studentDoc = uidSnapshot.docs[0];

        return {
            id: studentDoc.id,
            ...studentDoc.data()
        };

    }


    // --------------------------------------
    // 3. SEARCH BY userId FIELD
    // --------------------------------------

    const userIdQuery = query(
        collection(db, "students"),
        where("userId", "==", user.uid),
        limit(1)
    );

    const userIdSnapshot = await getDocs(userIdQuery);

    if (!userIdSnapshot.empty) {

        const studentDoc = userIdSnapshot.docs[0];

        return {
            id: studentDoc.id,
            ...studentDoc.data()
        };

    }


    // --------------------------------------
    // 4. SEARCH BY EMAIL
    // --------------------------------------

    if (user.email) {

        const emailQuery = query(
            collection(db, "students"),
            where("email", "==", user.email),
            limit(1)
        );

        const emailSnapshot = await getDocs(emailQuery);

        if (!emailSnapshot.empty) {

            const studentDoc = emailSnapshot.docs[0];

            return {
                id: studentDoc.id,
                ...studentDoc.data()
            };

        }

    }


    // NO STUDENT DOCUMENT
    return null;
}


// ==========================================
// FORMAT FIREBASE DATE
// ==========================================

function formatFirebaseDate(value) {

    if (!value) {
        return "غير معروف";
    }

    try {

        let date;


        // Firestore Timestamp
        if (
            value instanceof Timestamp ||
            typeof value?.toDate === "function"
        ) {

            date = value.toDate();

        }

        // JavaScript Date
        else if (value instanceof Date) {

            date = value;

        }

        // String date
        else {

            date = new Date(value);

        }


        if (isNaN(date.getTime())) {
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
// SET TEXT
// ==========================================

function setText(element, value) {

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
// SHOW ERROR
// ==========================================

function showError(message) {

    loadingBox?.classList.add("hidden");

    profileContent?.classList.add("hidden");

    errorBox?.classList.remove("hidden");

    if (errorText) {
        errorText.textContent = message;
    }
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

                localStorage.removeItem("userRole");
                localStorage.removeItem("userName");
                localStorage.removeItem("userUID");
                localStorage.removeItem("userEmail");

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
