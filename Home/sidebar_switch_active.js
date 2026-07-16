const yourDesignsBtn = document.getElementById('yourDesignsBtn');
const communityDesignsBtn = document.getElementById('communityDesignsBtn');

yourDesignsBtn.addEventListener("click", () => {
    yourDesignsBtn.classList.add("active");
    communityDesignsBtn.classList.remove("active");
    cardRow.style.display = "";
    communityCardRowContainer.style.display = "none";
});

communityDesignsBtn.addEventListener("click", () => {
    communityDesignsBtn.classList.add("active");
    yourDesignsBtn.classList.remove("active");
    communityCardRowContainer.style.display = "";
    cardRow.style.display = "none";
    loadCOmmunityDesignsFromSupabase(); // load community designs when button clicked
});

const toggleViewBtn = document.getElementById('toggleViewBtn');
const cardRow = document.getElementById('cardRow');

toggleViewBtn.addEventListener("click", () => {
    cardRow.classList.toggle("list-view");
});
