// مثال لكيفية صياغة كود الكارت داخل دالة الـ render في dashboard.js:
const cardHTML = `
    <div class="course-card" data-category="${doc.category}">
        <div class="card-image-area">
            <span class="card-badge ${doc.colorClass}">${doc.badge}</span>
            <img src="${doc.courseImage}" alt="${doc.title}">
        </div>
        <div class="card-body">
            <div class="card-grade"><i class="fa-solid fa-graduation-cap"></i> ${doc.grade}</div>
            <h3 class="card-title">${doc.title}</h3>
            <p class="card-desc">${doc.description}</p>
            
            <div class="card-stats">
                <div class="stat-item"><i class="fa-solid fa-photo-film"></i> ${doc.lecturesCount} محاضرة</div>
                <div class="stat-item"><i class="fa-solid fa-circle-check" style="color:#34c759;"></i> متاح بالكامل</div>
            </div>
            
            <a href="watch.html?video=${encodeURIComponent(doc.videoUrl)}&title=${encodeURIComponent(doc.title)}&pdf=${encodeURIComponent(doc.pdfUrl)}&desc=${encodeURIComponent(doc.description)}&grade=${encodeURIComponent(doc.grade)}&badge=${encodeURIComponent(doc.badge)}" class="card-btn">
                <i class="fa-solid fa-play" style="margin-left: 5px;"></i> مشاهدة المحاضرة
            </a>
        </div>
    </div>
`;

function selectCourse(cardElement) {
    document.querySelectorAll('.course-card-v2').forEach(card => {
        card.classList.remove('active-selected');
    });
    cardElement.classList.add('active-selected');
}
