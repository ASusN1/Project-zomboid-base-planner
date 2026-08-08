const deleteCardBtn = document.getElementById('deleteCardBtn');
const deleteConfirmation = document.getElementById('deleteConfirmation');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');


window.isDeleteSelectMode = false;
const selectedDesignIds = new Set(); //gets the ids of design set to be delete 

//add a check box to every saved design card 
function addCheckboxesToCards() {
    const allCloudCards = document.querySelectorAll('.card-design.cloud-card');

    allCloudCards.forEach(card => {
        card.classList.add("selected");

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = "card-select-checkbox";

        checkbox.addEventListener('click', (e) => {
            e.stopPropagation(); // prevnets the lcicsk from triggering the base builder 

            const designId = card.dataset.designId;

            if (checkbox.checked) {
                selectedDesignIds.add(designId);
                card.classList.add("card-design-marked-for-deletion");
            } else {
                selectedDesignIds.delete(designId);
                card.classList.remove("card-design-marked-for-deletion");
            }
        });

        card.appendChild(checkbox);
    });
}

function resetSelectMode() {

    document.querySelectorAll(".card-select-checkbox").forEach(checkbox => checkbox.remove());
    document.querySelectorAll(".card-design.selected").forEach(card => {
        card.classList.remove("selected");
        card.classList.remove("card-design-marked-for-deletion");
    });
    selectedDesignIds.clear();
    window.isDeleteSelectMode = false;
    deleteCardBtn.textContent = "Delete Cards";
}

deleteCardBtn.addEventListener('click', () => {
    if (!window.isDeleteSelectMode) {
        window.isDeleteSelectMode = true;
        deleteCardBtn.textContent = "Confirm Delete";
        addCheckboxesToCards();
        return;
    }


    if (selectedDesignIds.size === 0) {
        resetSelectMode();
        return;
    }

    deleteConfirmation.style.display = 'flex';
});

cancelDeleteBtn.addEventListener('click', () => {
    deleteConfirmation.style.display = 'none';
});

confirmDeleteBtn.addEventListener("click", async () => {
    deleteConfirmation.style.display = "none";

    const idsToDelete = Array.from(selectedDesignIds); // the ids the user checked off

    const deleteResponse = await fetch(window.BACKEND_URL + "/designs/delete", {
        method: "POST",
        headers: Object.assign({ "Content-Type": "application/json" }, getAuthHeader()), // json body plus the bearer token
        body: JSON.stringify({ designsIds: idsToDelete }),
    });

    const deleteResult = await deleteResponse.json(); // read the backend's response

    if (!deleteResponse.ok) {
        console.error("Error deleting designs: " + deleteResult.error);
        return;
    }

    idsToDelete.forEach(id => {
        const cardToRemove = document.querySelector('.card-design[data-design-id="' + id + '"]');
        if (cardToRemove) {
            cardToRemove.remove();
        }
    });

    resetSelectMode();
    console.log("Delete flow complete");
});