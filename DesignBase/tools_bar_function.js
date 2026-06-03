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

//redo tool ( redo last action) ( Ctrl Y)  ( basicly reverse of undo tool)
const redoButton = document.getElementById('redoButton');
redoButton.addEventListener('click', () => {
    console.log('Redo tool selected');
    if (redoListItem.length === 0) return; // No actions to redo
    const action = redoListItem.pop(); // Get the last action from the redo list
    action.tile.style.backgroundColor = action.newColor;
    undoListItem.push(action); // update undo list with the redone action
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

// Place wall diretion, swith betwen ns and ew 
const placeDirectionButotn = document.getElementById('placeDirectionButton');

placeDirectionButton.addEventListener('click', () => {
    currentWallDirection = currentWallDirection === direction_of_wall_tile.NS 
    ? direction_of_wall_tile.EW 
    : direction_of_wall_tile.NS; // switch between NS and EW
    placeDirectionButton.textContent = 'Place Direction: ' + currentWallDirection; 
    console.log('Place direction switched to: ' + currentWallDirection);
});