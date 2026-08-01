const hide_grid_number_btn = document.getElementById("hide_grid_number_btn");
window.gridNumberHidden = false;

hide_grid_number_btn.addEventListener("click", () => {
    if (window.gridNumberHidden === false) {
        grid.classList.add("hide-grid-number");
        window.gridNumberHidden = true;
        hide_grid_number_btn.textContent = "Show Grid Number";
    }else{
        grid.classList.remove("hide-grid-number");
        window.gridNumberHidden = false;
        hide_grid_number_btn.textContent = "Hide Grid Number";
    }
});

