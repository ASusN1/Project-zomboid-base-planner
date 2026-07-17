const yourDesignsBtn = document.getElementById('yourDesignsBtn');
const communityDesignsBtn = document.getElementById('communityDesignsBtn');
const aboutBtn = document.getElementById('aboutBtn');

yourDesignsBtn.addEventListener("click", () => {
    yourDesignsBtn.classList.add("active");
    communityDesignsBtn.classList.remove("active");
    aboutBtn.classList.remove("active");
    cardRow.style.display = "";
    communityCardRowContainer.style.display = "none";
});

communityDesignsBtn.addEventListener("click", () => {
    communityDesignsBtn.classList.add("active");
    yourDesignsBtn.classList.remove("active");
    aboutBtn.classList.remove("active");
    communityCardRowContainer.style.display = "";
    cardRow.style.display = "none";
    loadCOmmunityDesignsFromSupabase(); // load community designs when button clicked
});

aboutBtn.addEventListener("click", () => {
    communityDesignsBtn.classList.remove("active");
    yourDesignsBtn.classList.remove("active");
    aboutBtn.classList.add("active");
});

const toggleViewBtn = document.getElementById('toggleViewBtn');
const cardRow = document.getElementById('cardRow');

toggleViewBtn.addEventListener("click", () => {
    cardRow.classList.toggle("list-view");
});
