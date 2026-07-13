// ========================================
// FIREBASE
// ========================================

import { auth, db } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    setPersistence,
    browserLocalPersistence,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ========================================
// HTML ELEMENTS
// ========================================

const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("loginEmail");

const passwordInput =
    document.getElementById("loginPassword");

const togglePassword =
    document.getElementById("togglePassword");

const forgotPassword =
    document.getElementById("forgotPassword");

const messageBox =
    document.getElementById("messageBox");

const loginButton =
    document.getElementById("loginButton");

const buttonText =
    document.getElementById("buttonText");

const buttonIcon =
    document.getElementById("buttonIcon");

const buttonLoader =
    document.getElementById("buttonLoader");


// ========================================
// ADMIN EMAIL
// ========================================

const ADMIN_EMAIL = "teacher@physics.com";


// ========================================
// DEVICE ID
// ينشأ تلقائياً لأول مرة فقط
// ========================================

function getDeviceId() {

    let deviceId =
        localStorage.getItem(
            "myoussef_device_id"
        );

    if (!deviceId) {

        // إنشاء معرف عشوائي للجهاز / المتصفح
        if (
            window.crypto &&
            typeof window.crypto.randomUUID === "function"
        ) {

            deviceId =
                crypto.randomUUID();

        } else {

            // دعم المتصفحات القديمة
            deviceId =
                "device_" +
                Date.now() +
                "_" +
                Math.random()
                    .toString(36)
                    .substring(2, 15);

        }

        // حفظه في نفس المتصفح
        localStorage.setItem(
            "myoussef_device_id",
            deviceId
        );
    }

    return deviceId;
}


// ========================================
// SHOW / HIDE PASSWORD
// ========================================

if (togglePassword) {

    togglePassword.addEventListener(
        "click",
        () => {

            const isPassword =
                passwordInput.type ===
                "password";

            passwordInput.type =
                isPassword
                    ? "text"
                    : "password";


            togglePassword.classList.toggle(
                "fa-eye",
                !isPassword
            );

            togglePassword.classList.toggle(
                "fa-eye-slash",
                isPassword
            );

        }
    );

}


// ========================================
// LOGIN
// ========================================

loginForm.addEventListener(
    "submit",

    async (event) => {

        event.preventDefault();

        clearMessage();


        // ====================================
        // GET EMAIL + PASSWORD
        // ====================================

        const email =
            emailInput.value
                .trim()
                .toLowerCase();

        const password =
            passwordInput.value;


        // ====================================
        // VALIDATION
        // ====================================

        if (!email || !password) {

            showMessage(
                "من فضلك أدخل البريد الإلكتروني وكلمة المرور.",
                "error"
            );

            return;
        }


        setLoading(true);


        try {

            // ====================================
            // KEEP USER LOGGED IN
            // ====================================

            await setPersistence(
                auth,
                browserLocalPersistence
            );


            // ====================================
            // FIREBASE LOGIN
            // ====================================

            const userCredential =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const user =
                userCredential.user;


            // ====================================
            // ADMIN
            // الأدمن غير مقيد بجهاز واحد
            // ====================================

            if (
                user.email &&
                user.email.toLowerCase() ===
                ADMIN_EMAIL.toLowerCase()
            ) {

                saveUserData(
                    user,
                    "admin",
                    "مستر محمد يوسف"
                );


                showMessage(
                    "تم تسجيل دخول الأدمن بنجاح، جاري تحويلك...",
                    "success"
                );


                setTimeout(
                    () => {

                        window.location.replace(
                            "dashboard.html"
                        );

                    },
                    700
                );


                return;
            }


            // ====================================
            // STUDENT DEVICE CHECK
            // ====================================

            const currentDeviceId =
                getDeviceId();


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


            // ====================================
            // IF STUDENT DOCUMENT DOES NOT EXIST
            // إنشاء ملف تلقائي للطالب
            // ====================================

            if (!studentSnapshot.exists()) {

                await setDoc(
                    studentRef,
                    {
                        email:
                            user.email || email,

                        name:
                            "طالب بالمنصة",

                        activeDeviceId:
                            currentDeviceId
                    }
                );


                saveUserData(
                    user,
                    "student",
                    "طالب بالمنصة"
                );


                loginSuccess();

                return;
            }


            // ====================================
            // GET STUDENT DATA
            // ====================================

            const studentData =
                studentSnapshot.data();


            const savedDeviceId =
                studentData.activeDeviceId;


            // ====================================
            // FIRST LOGIN
            // لا يوجد جهاز محفوظ
            // ====================================

            if (!savedDeviceId) {

                await updateDoc(
                    studentRef,
                    {
                        activeDeviceId:
                            currentDeviceId
                    }
                );


                saveUserData(
                    user,
                    "student",
                    studentData.name ||
                    "طالب بالمنصة"
                );


                loginSuccess();

                return;
            }


            // ====================================
            // SAME DEVICE
            // ====================================

            if (
                savedDeviceId ===
                currentDeviceId
            ) {

                saveUserData(
                    user,
                    "student",
                    studentData.name ||
                    "طالب بالمنصة"
                );


                loginSuccess();

                return;
            }


            // ====================================
            // DIFFERENT DEVICE
            // ====================================

            await signOut(auth);


            clearUserData();


            showMessage(
                "هذا الحساب مرتبط بجهاز آخر. تواصل مع إدارة المنصة لتغيير الجهاز.",
                "error"
            );


            setLoading(false);

        }

        catch (error) {

            console.error(
                "Login Error:",
                error
            );


            // لو تم تسجيل الدخول قبل حدوث خطأ
            // لا نحذف الجلسة هنا تلقائياً إلا حسب الخطأ

            showMessage(
                getFirebaseErrorMessage(
                    error.code
                ),
                "error"
            );


            setLoading(false);
        }

    }
);


// ========================================
// LOGIN SUCCESS
// ========================================

function loginSuccess() {

    showMessage(
        "تم تسجيل الدخول بنجاح، جاري تحويلك...",
        "success"
    );


    setTimeout(
        () => {

            window.location.replace(
                "dashboard.html"
            );

        },
        700
    );

}


// ========================================
// SAVE USER DATA
// ========================================

function saveUserData(
    user,
    role,
    name
) {

    localStorage.setItem(
        "userRole",
        role
    );


    localStorage.setItem(
        "userName",
        name
    );


    localStorage.setItem(
        "userUID",
        user.uid
    );


    localStorage.setItem(
        "userEmail",
        user.email || ""
    );

}


// ========================================
// CLEAR USER DATA
// ========================================

function clearUserData() {

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

    // مهم جداً:
    // لا نحذف myoussef_device_id
    // لأنه معرف هذا الجهاز
}


// ========================================
// PASSWORD RESET
// ========================================

if (forgotPassword) {

    forgotPassword.addEventListener(
        "click",

        async (event) => {

            event.preventDefault();

            clearMessage();


            const email =
                emailInput.value
                    .trim()
                    .toLowerCase();


            if (!email) {

                showMessage(
                    "اكتب بريدك الإلكتروني أولاً ثم اضغط على نسيت كلمة المرور.",
                    "error"
                );

                emailInput.focus();

                return;
            }


            try {

                await sendPasswordResetEmail(
                    auth,
                    email
                );


                showMessage(
                    "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.",
                    "success"
                );

            }

            catch (error) {

                console.error(
                    "Password Reset Error:",
                    error
                );


                showMessage(
                    getFirebaseErrorMessage(
                        error.code
                    ),
                    "error"
                );

            }

        }
    );

}


// ========================================
// LOADING STATE
// ========================================

function setLoading(isLoading) {

    loginButton.disabled =
        isLoading;


    if (isLoading) {

        buttonText.textContent =
            "جاري تسجيل الدخول...";


        if (buttonIcon) {

            buttonIcon.style.display =
                "none";

        }


        if (buttonLoader) {

            buttonLoader.style.display =
                "inline-block";

        }

    }

    else {

        buttonText.textContent =
            "تسجيل الدخول";


        if (buttonIcon) {

            buttonIcon.style.display =
                "inline-block";

        }


        if (buttonLoader) {

            buttonLoader.style.display =
                "none";

        }

    }

}


// ========================================
// SHOW MESSAGE
// ========================================

function showMessage(
    message,
    type
) {

    messageBox.textContent =
        message;


    messageBox.className =
        `message-box ${type}`;

}


// ========================================
// CLEAR MESSAGE
// ========================================

function clearMessage() {

    messageBox.textContent =
        "";


    messageBox.className =
        "message-box";

}


// ========================================
// FIREBASE ERROR MESSAGES
// ========================================

function getFirebaseErrorMessage(
    errorCode
) {

    switch (errorCode) {


        case "auth/invalid-email":

            return "البريد الإلكتروني غير صحيح.";


        case "auth/invalid-credential":

            return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";


        case "auth/user-not-found":

            return "لا يوجد حساب مسجل بهذا البريد الإلكتروني.";


        case "auth/wrong-password":

            return "كلمة المرور غير صحيحة.";


        case "auth/user-disabled":

            return "تم تعطيل هذا الحساب. تواصل مع إدارة المنصة.";


        case "auth/too-many-requests":

            return "تم إجراء محاولات كثيرة. حاول مرة أخرى بعد قليل.";


        case "auth/network-request-failed":

            return "حدثت مشكلة في الاتصال بالإنترنت.";


        case "auth/missing-password":

            return "من فضلك أدخل كلمة المرور.";


        case "permission-denied":
        case "firestore/permission-denied":

            return "لا توجد صلاحية للوصول إلى بيانات الطالب  .";


        default:

            return "حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.";

    }

}