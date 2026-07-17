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

confirmDeleteBtn.addEventListener('click', async () => {

    deleteConfirmation.style.display = 'none';

    const idsToDelete = Array.from(selectedDesignIds);

    const userResult = await window.sb.auth.getUser(); //get cureernt user 
    const user = userResult.data.user;

    const previewPathsToDelete = idsToDelete.map(id => user.id + "/" + id + ".jpg");

    const storageDeleteResult = await window.sb.storage
        .from('design-preview-card-picture')
        .remove(previewPathsToDelete);
    

    if (storageDeleteResult.error) {
        console.error('Error deleting preview images:', storageDeleteResult.error.message);
    }

    const deleteResult = await window.sb
        .from('designs')
        .delete()
        .in('id', idsToDelete);

    const error = deleteResult.error;

    if (error) {
        console.error('Error deleting designs:', error.message);
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