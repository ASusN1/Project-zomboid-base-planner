const deleteCardBtn = document.getElementById('deleteCardBtn');
const deleteConfirmation = document.getElementById('deleteConfirmation');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

console.log("deleteCardBtn element:", deleteCardBtn); 
console.log("confirmDeleteBtn element:", confirmDeleteBtn); 

window.isDeleteSelectMode = false;
const selectedDesignIds = new Set(); //gets the ids of design set to be delete 

//add a check box to every saved design card 
function addCheckboxesToCards() {
    console.log("addCheckboxesToCards ran"); 
    const allCloudCards = document.querySelectorAll('.card-design.cloud-card');
    console.log("Found cloud cards:", allCloudCards.length); 

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
            console.log("Checkbox clicked, selectedDesignIds now:", Array.from(selectedDesignIds)); 
        });

        card.appendChild(checkbox);
    });
}

function resetSelectMode() {
    console.log("resetSelectMode ran"); 

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
    console.log("deleteCardBtn clicked, isDeleteSelectMode:", window.isDeleteSelectMode);
    if (!window.isDeleteSelectMode) {
        window.isDeleteSelectMode = true;
        deleteCardBtn.textContent = "Confirm Delete";
        addCheckboxesToCards();
        return;
    }

    console.log("selectedDesignIds size:", selectedDesignIds.size); 

    if (selectedDesignIds.size === 0) {
        console.log("No cards selected, resetting instead of opening confirm popup"); 
        resetSelectMode();
        return;
    }

    console.log("Opening delete confirmation popup"); 
    deleteConfirmation.style.display = 'flex';
});

cancelDeleteBtn.addEventListener('click', () => {
    console.log("cancelDeleteBtn clicked"); // 
    deleteConfirmation.style.display = 'none';
});

confirmDeleteBtn.addEventListener('click', async () => {
    console.log("confirmDeleteBtn clicked — starting delete process");

    deleteConfirmation.style.display = 'none';

    const idsToDelete = Array.from(selectedDesignIds);
    console.log("idsToDelete:", idsToDelete);

    const userResult = await window.sb.auth.getUser(); //get cureernt user 
    const user = userResult.data.user;
    console.log("Current user:", user); 

    const previewPathsToDelete = idsToDelete.map(id => user.id + "/" + id + ".jpg");
    console.log("Attempted to delete paths:", previewPathsToDelete);

    const storageDeleteResult = await window.sb.storage
        .from('design-preview-card-picture')
        .remove(previewPathsToDelete);
    
    console.log("Storage delete result:", storageDeleteResult);

    if (storageDeleteResult.error) {
        console.error('Error deleting preview images:', storageDeleteResult.error.message);
    }

    const deleteResult = await window.sb
        .from('designs')
        .delete()
        .in('id', idsToDelete);

    console.log("Design row delete result:", deleteResult);
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