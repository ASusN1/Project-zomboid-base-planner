//delete tool ( later add shortcut key for this tool)
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

const placeButton = document.getElementById('placeButton');
// place item tool
placeButton.addEventListener('click', () => {
    console.log('Place tool selected');
    currentToolusing = 'place';
});

//redo tool ( redo last action) ( Ctrl Y) 
const redoButton = document.getElementById('redoButton');
redoButton.addEventListener('click', () => {
    console.log('Redo tool selected');
});

// undo tool ( undo last action) ( Ctrl Z)
const undoButton = document.getElementById('undoButton');
undoButton.addEventListener('click', () => {
    console.log('Undo tool selected');
    if (undoListItem.length === 0) return; // No actions to undo
    const action = undoListItem.pop(); // Get the last action from the undo list 
    action.tile.style.backgroundColor = action.previousColor;
    redoListItem.push(action); // update 
});
