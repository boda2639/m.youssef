// ========================================
// FIREBASE
// ========================================

import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// ========================================
// HTML ELEMENTS
// ========================================

const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("loginEmail");

const passwordInput =
    document.getElementById("loginPassword");

const rememberMe =
    document.getElementById("rememberMe");

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
// SHOW / HIDE PASSWORD
// ========================================

if (togglePassword) {

    togglePassword.addEventListener("click", () => {

        const isPassword =
            passwordInput.type === "password";

        passwordInput.type =
            isPassword ? "text" : "password";


        togglePassword.classList.toggle(
            "fa-eye",
            !isPassword
        );

        togglePassword.classList.toggle(
            "fa-eye-slash",
            isPassword
        );

    });

}


// ========================================
// LOGIN
// ========================================

loginForm.addEventListener(

    "submit",

    async (event) => {

        event.preventDefault();

        clearMessage();


        // ========================================
        // GET LOGIN DATA
        // ========================================

        const email =
            emailInput.value
                .trim()
                .toLowerCase();

        const password =
            passwordInput.value;


        // ========================================
        // VALIDATION
        // ========================================

        if (!email || !password) {

            showMessage(
                "من فضلك أدخل البريد الإلكتروني وكلمة المرور.",
                "error"
            );

            return;
        }


        // ========================================
        // START LOADING
        // ========================================

        setLoading(true);


        try {

            // ========================================
            // LOGIN PERSISTENCE
            // ========================================

            const persistence =
                rememberMe?.checked

                    ? browserLocalPersistence

                    : browserSessionPersistence;


            await setPersistence(
                auth,
                persistence
            );


            // ========================================
            // FIREBASE LOGIN
            // ========================================

            const userCredential =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const user =
                userCredential.user;


            // ========================================
            // SAVE USER INFORMATION
            // ========================================

            localStorage.setItem(
                "userUID",
                user.uid
            );


            localStorage.setItem(
                "userEmail",
                user.email || email
            );


            // ========================================
            // CHECK ACCOUNT TYPE
            // ========================================

            if (
                user.email &&
                user.email.toLowerCase() ===
                ADMIN_EMAIL.toLowerCase()
            ) {

                localStorage.setItem(
                    "userRole",
                    "admin"
                );

                localStorage.setItem(
                    "userName",
                    "مستر محمد يوسف"
                );

            }

            else {

                localStorage.setItem(
                    "userRole",
                    "student"
                );

                localStorage.setItem(
                    "userName",
                    "طالب بالمنصة"
                );

            }


            // ========================================
            // SUCCESS MESSAGE
            // ========================================

            showMessage(
                "تم تسجيل الدخول بنجاح",
                "success"
            );


            // إيقاف التحميل
            setLoading(false);


            // ========================================
            // REDIRECT TO PROFILE
            // ========================================

            setTimeout(() => {

                window.location.replace(
                    "profile.html"
                );

            }, 700);

        }

        catch (error) {

            console.error(
                "Firebase Login Error:",
                error
            );


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
// FORGOT PASSWORD
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

    if (loginButton) {

        loginButton.disabled =
            isLoading;

    }


    if (isLoading) {

        if (buttonText) {

            buttonText.textContent =
                "جاري تسجيل الدخول...";

        }


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

        if (buttonText) {

            buttonText.textContent =
                "تسجيل الدخول";

        }


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

    if (!messageBox) {

        return;

    }


    messageBox.textContent =
        message;


    messageBox.className =
        `message-box ${type}`;

}


// ========================================
// CLEAR MESSAGE
// ========================================

function clearMessage() {

    if (!messageBox) {

        return;

    }


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


        default:

            return "حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.";

    }

}
