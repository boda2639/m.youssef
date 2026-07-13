// ================================
// بيانات محافظات ومدن ومراكز مصر
// ================================

const egyptLocations = {
    "القاهرة": [
        "القاهرة", "مدينة نصر", "مصر الجديدة", "النزهة", "الشروق",
        "بدر", "القاهرة الجديدة", "التجمع الخامس", "المعادي",
        "حلوان", "15 مايو", "المقطم", "الزيتون", "عين شمس",
        "المطرية", "المرج", "السلام", "شبرا", "السيدة زينب",
        "مصر القديمة", "الخليفة", "البساتين", "دار السلام"
    ],

    "الجيزة": [
        "الجيزة", "الدقي", "العجوزة", "الهرم", "فيصل",
        "6 أكتوبر", "الشيخ زايد", "الحوامدية", "البدرشين",
        "العياط", "الصف", "أطفيح", "أوسيم", "كرداسة",
        "منشأة القناطر", "أبو النمرس"
    ],

    "الإسكندرية": [
        "الإسكندرية", "المنتزه", "الرمل", "سيدي جابر",
        "باب شرقي", "محرم بك", "كرموز", "اللبان",
        "الجمرك", "العجمي", "العامرية", "برج العرب"
    ],

    "الدقهلية": [
        "المنصورة", "طلخا", "ميت غمر", "دكرنس", "أجا",
        "منية النصر", "السنبلاوين", "بلقاس", "شربين",
        "المنزلة", "الجمالية", "المطرية", "نبروه",
        "بني عبيد", "تمي الأمديد", "ميت سلسيل"
    ],

    "البحر الأحمر": [
        "الغردقة", "رأس غارب", "سفاجا",
        "القصير", "مرسى علم", "الشلاتين", "حلايب"
    ],

    "البحيرة": [
        "دمنهور", "كفر الدوار", "رشيد", "إدكو",
        "أبو المطامير", "أبو حمص", "الدلنجات",
        "المحمودية", "الرحمانية", "إيتاي البارود",
        "حوش عيسى", "شبراخيت", "كوم حمادة",
        "وادي النطرون", "بدر"
    ],

    "الفيوم": [
        "الفيوم", "سنورس", "طامية",
        "إطسا", "إبشواي", "يوسف الصديق"
    ],

    "الغربية": [
        "طنطا", "المحلة الكبرى", "كفر الزيات",
        "زفتى", "السنطة", "قطور", "بسيون", "سمنود"
    ],

    "الإسماعيلية": [
        "الإسماعيلية", "فايد", "القنطرة شرق",
        "القنطرة غرب", "التل الكبير",
        "أبو صوير", "القصاصين"
    ],

    "المنوفية": [
        "شبين الكوم", "منوف", "أشمون", "الباجور",
        "قويسنا", "بركة السبع", "تلا",
        "الشهداء", "السادات", "سرس الليان"
    ],

    "المنيا": [
        "المنيا", "ملوي", "سمالوط", "مغاغة",
        "بني مزار", "مطاي", "أبو قرقاص",
        "دير مواس", "العدوة"
    ],

    "القليوبية": [
        "بنها", "شبرا الخيمة", "قليوب", "القناطر الخيرية",
        "الخانكة", "كفر شكر", "طوخ",
        "شبين القناطر", "العبور", "الخصوص"
    ],

    "الوادي الجديد": [
        "الخارجة", "الداخلة", "الفرافرة",
        "باريس", "بلاط"
    ],

    "السويس": [
        "السويس", "الأربعين", "عتاقة",
        "الجناين", "فيصل"
    ],

    "أسوان": [
        "أسوان", "دراو", "كوم أمبو",
        "نصر النوبة", "إدفو"
    ],

    "أسيوط": [
        "أسيوط", "ديروط", "القوصية", "منفلوط",
        "أبنوب", "الفتح", "أبو تيج",
        "الغنايم", "ساحل سليم", "البداري", "صدفا"
    ],

    "بني سويف": [
        "بني سويف", "الواسطى", "ناصر",
        "إهناسيا", "ببا", "سمسطا", "الفشن"
    ],

    "بورسعيد": [
        "بورسعيد", "بورفؤاد",
        "الشرق", "العرب", "المناخ",
        "الضواحي", "الزهور", "الجنوب"
    ],

    "دمياط": [
        "دمياط", "دمياط الجديدة", "رأس البر",
        "فارسكور", "كفر سعد", "الزرقا",
        "كفر البطيخ", "عزبة البرج"
    ],

    "الشرقية": [
        "الزقازيق", "بلبيس", "منيا القمح",
        "أبو حماد", "أبو كبير", "فاقوس",
        "الحسينية", "كفر صقر", "أولاد صقر",
        "ههيا", "الإبراهيمية", "ديرب نجم",
        "مشتول السوق", "العاشر من رمضان",
        "الصالحية الجديدة", "القرين"
    ],

    "جنوب سيناء": [
        "الطور", "شرم الشيخ", "دهب",
        "نويبع", "طابا", "رأس سدر",
        "أبو زنيمة", "أبو رديس", "سانت كاترين"
    ],

    "كفر الشيخ": [
        "كفر الشيخ", "دسوق", "فوه", "مطوبس",
        "بلطيم", "الحامول", "بيلا",
        "الرياض", "سيدي سالم", "قلين",
        "برج البرلس"
    ],

    "مطروح": [
        "مرسى مطروح", "الحمام", "العلمين",
        "الضبعة", "النجيلة", "سيدي براني",
        "السلوم", "سيوة"
    ],

    "الأقصر": [
        "الأقصر", "الزينية", "البياضية",
        "القرنة", "أرمنت", "الطود", "إسنا"
    ],

    "قنا": [
        "قنا", "أبو تشت", "فرشوط", "نجع حمادي",
        "دشنا", "الوقف", "قفط", "قوص", "نقادة"
    ],

    "شمال سيناء": [
        "العريش", "الشيخ زويد", "رفح",
        "بئر العبد", "الحسنة", "نخل"
    ],

    "سوهاج": [
        "سوهاج", "أخميم", "البلينا", "المراغة",
        "المنشأة", "دار السلام", "جرجا",
        "جهينة", "ساقلته", "طما", "طهطا"
    ]
};


// ================================
// عناصر الصفحة
// ================================

const registerForm = document.getElementById("registerForm");
const governorateSelect = document.getElementById("governorate");
const citySelect = document.getElementById("city");
const errorMessage = document.getElementById("errorMessage");


// ================================
// إضافة المحافظات
// ================================

Object.keys(egyptLocations).forEach(governorate => {
    const option = document.createElement("option");

    option.value = governorate;
    option.textContent = governorate;

    governorateSelect.appendChild(option);
});


// ================================
// تغيير المدن حسب المحافظة
// ================================

governorateSelect.addEventListener("change", function () {

    const selectedGovernorate = this.value;

    citySelect.innerHTML = "";

    if (!selectedGovernorate) {

        citySelect.disabled = true;

        citySelect.innerHTML = `
            <option value="">
                اختر المحافظة أولاً
            </option>
        `;

        return;
    }

    citySelect.disabled = false;

    const defaultOption = document.createElement("option");

    defaultOption.value = "";
    defaultOption.textContent = "اختر المركز / المدينة";

    citySelect.appendChild(defaultOption);

    egyptLocations[selectedGovernorate].forEach(city => {

        const option = document.createElement("option");

        option.value = city;
        option.textContent = city;

        citySelect.appendChild(option);
    });
});


// ================================
// إظهار وإخفاء كلمة المرور
// ================================

document.querySelectorAll(".toggle-password").forEach(icon => {

    icon.addEventListener("click", function () {

        const targetId = this.dataset.target;
        const input = document.getElementById(targetId);

        if (input.type === "password") {

            input.type = "text";

            this.classList.remove("fa-eye");
            this.classList.add("fa-eye-slash");

        } else {

            input.type = "password";

            this.classList.remove("fa-eye-slash");
            this.classList.add("fa-eye");
        }
    });
});


// ================================
// التحقق من رقم الهاتف المصري
// ================================

function isValidEgyptianPhone(phone) {

    const phoneRegex = /^01[0125][0-9]{8}$/;

    return phoneRegex.test(phone);
}


// ================================
// إرسال البيانات إلى واتساب
// ================================

registerForm.addEventListener("submit", function (event) {

    event.preventDefault();

    errorMessage.textContent = "";

    // الحصول على البيانات

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const grade = document.getElementById("grade").value;

    const password = document.getElementById("password").value;
    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const studentPhone =
        document.getElementById("studentPhone").value.trim();

    const parentPhone =
        document.getElementById("parentPhone").value.trim();

    const parentJob =
        document.getElementById("parentJob").value.trim();

    const governorate = governorateSelect.value;
    const city = citySelect.value;


    // ================================
    // التحقق من البيانات
    // ================================

    if (
        !fullName ||
        !email ||
        !grade ||
        !password ||
        !confirmPassword ||
        !studentPhone ||
        !parentPhone ||
        !parentJob ||
        !governorate ||
        !city
    ) {

        showError("من فضلك أكمل جميع البيانات المطلوبة.");
        return;
    }


    // التحقق من الاسم الرباعي

    const nameParts = fullName
        .split(/\s+/)
        .filter(part => part.length > 0);

    if (nameParts.length < 4) {

        showError("من فضلك اكتب الاسم الرباعي كاملًا.");
        return;
    }


    // التحقق من كلمة المرور

    if (password.length < 6) {

        showError("كلمة المرور يجب أن تكون 6 أحرف على الأقل.");
        return;
    }


    // تطابق كلمات المرور

    if (password !== confirmPassword) {

        showError("كلمة المرور وتأكيد كلمة المرور غير متطابقين.");
        return;
    }


    // التحقق من هاتف الطالب

    if (!isValidEgyptianPhone(studentPhone)) {

        showError("رقم هاتف الطالب غير صحيح. يجب أن يكون رقمًا مصريًا مكونًا من 11 رقمًا.");
        return;
    }


    // التحقق من هاتف ولي الأمر

    if (!isValidEgyptianPhone(parentPhone)) {

        showError("رقم هاتف ولي الأمر غير صحيح. يجب أن يكون رقمًا مصريًا مكونًا من 11 رقمًا.");
        return;
    }


    // ================================
    // تجهيز رسالة واتساب
    // ================================

    const message = `
🆕 طلب إنشاء حساب طالب جديد

━━━━━━━━━━━━━━━━━━

👤 الاسم الرباعي:
${fullName}

📧 البريد الإلكتروني:
${email}

🎓 الصف الدراسي:
${grade}

📱 رقم واتساب الطالب:
${studentPhone}

☎️ رقم هاتف ولي الأمر:
${parentPhone}

💼 وظيفة ولي الأمر:
${parentJob}

📍 المحافظة:
${governorate}

🏙️ المركز / المدينة:
${city}

━━━━━━━━━━━━━━━━━━

📚 منصة مستر محمد يوسف التعليمية
    `.trim();


    // ================================
    // رقم واتساب المستلم
    // ================================

    // الرقم بصيغة دولية بدون +
    const whatsappNumber = "201002185290";


    // تشفير الرسالة
    const encodedMessage = encodeURIComponent(message);


    // رابط واتساب
    const whatsappURL =
        `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;


    // فتح واتساب
    window.location.href = whatsappURL;
});


// ================================
// عرض رسالة الخطأ
// ================================

function showError(message) {

    errorMessage.textContent = message;

    errorMessage.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}