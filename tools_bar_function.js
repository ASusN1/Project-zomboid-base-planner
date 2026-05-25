//delete tool 
const deleteButton = document.getElementById('deleteButton');

deleteButton.addEventListener('click', () => {
    console.log('Delete tool selected');
    currentToolusing = 'delete';

    selectedItem = null; // Clear selected item when delete tool is selected

    //Clear selected item 
    document.querySelectorAll('.item-card').forEach(card => {
        card.classList.remove('active');

    });
});

// place item tool
placeButton.addEventListener('click', () => {
    console.log('Place tool selected');
    currentToolusing = 'place';
});
