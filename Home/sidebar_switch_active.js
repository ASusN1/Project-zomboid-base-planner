const yourDesignsBtn = document.getElementById('yourDesignsBtn');
const communityDesignsBtn = document.getElementById('communityDesignsBtn');
const aboutBtn = document.getElementById('aboutBtn');

const toggleViewBtn = document.getElementById('toggleViewBtn');
const cardRow = document.getElementById('cardRow');

const about_section = document.getElementById("about-section");

const devlog_btn = document.getElementById("devlog-btn");
const docs_btn = document.getElementById("docs-btn");
const about_btn = document.getElementById("about-btn");

const about_content = document.getElementById("about-content");
const devlog_content = document.getElementById("devlog-content");
const docs_content = document.getElementById("docs-content");

yourDesignsBtn.addEventListener("click", () => {
    yourDesignsBtn.classList.add("active");
    communityDesignsBtn.classList.remove("active");
    aboutBtn.classList.remove("active");
    cardRow.style.display = "";
    communityCardRowContainer.style.display = "none";
    toggleViewBtn.style.display = "";
    deleteCardBtn.style.display = "";
    about_section.classList.remove("about-section-visible");
});

communityDesignsBtn.addEventListener("click", () => {
    communityDesignsBtn.classList.add("active");
    yourDesignsBtn.classList.remove("active");
    aboutBtn.classList.remove("active");
    communityCardRowContainer.style.display = "";
    cardRow.style.display = "none";
    toggleViewBtn.style.display = "none";
    deleteCardBtn.style.display = "none";
    about_section.classList.remove("about-section-visible");
    loadCOmmunityDesignsFromSupabase(); // load community designs when button clicked
});

aboutBtn.addEventListener("click", () => {
    communityDesignsBtn.classList.remove("active");
    yourDesignsBtn.classList.remove("active");
    aboutBtn.classList.add("active");

    cardRow.style.display = "none";
    toggleViewBtn.style.display = "none";
    deleteCardBtn.style.display = "none";
    communityCardRowContainer.style.display = "none";
    about_section.classList.add("about-section-visible");

    showAboutTab("about");
});

function showAboutTab(tabName){
    about_btn.classList.remove("active");
    devlog_btn.classList.remove("active");
    docs_btn.classList.remove("active");

    about_content.classList.add("about-tab-hidden");
    devlog_content.classList.add("about-tab-hidden");
    docs_content.classList.add("about-tab-hidden");

    if (tabName === "about") {
        about_btn.classList.add("active");
        about_content.classList.remove("about-tab-hidden");
    } else if (tabName === "devlog") {
        devlog_btn.classList.add("active");
        devlog_content.classList.remove("about-tab-hidden");
    } else if (tabName === "docs") {
        docs_btn.classList.add("active");
        docs_content.classList.remove("about-tab-hidden");
    }
}

about_btn.addEventListener("click", () => showAboutTab("about"));
devlog_btn.addEventListener("click", () => showAboutTab("devlog"));
docs_btn.addEventListener("click", () => showAboutTab("docs"));

toggleViewBtn.addEventListener("click", () => {
    cardRow.classList.toggle("list-view");
});