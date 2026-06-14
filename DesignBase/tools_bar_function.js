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


const redoButton = document.getElementById('redoButton');
redoButton.addEventListener('click', () => {
    console.log('Redo tool selected');
    if (redoListItem.length === 0) return; // No actions to redo
    const action = redoListItem.pop(); // Get the last action from the redo list
    action.redo();
    undoListItem.push(action); // update undo list with the redone action
});


const undoButton = document.getElementById('undoButton');
undoButton.addEventListener('click', () => {
    console.log('Undo tool selected');
    if (undoListItem.length === 0) return; // No actions to undo
    const action = undoListItem.pop(); // Get the last action from the undo list 
    action.undo();
    redoListItem.push(action); // update 
});

// Place wall diretion, swith betwen ns and ew 
const placeDirectionButton = document.getElementById('placeDirectionButton');

placeDirectionButton.addEventListener('click', () => {
    const currentOrientation = directionOrientationOrder.indexOf(currentWallDirection);
    currentWallDirection = directionOrientationOrder[(currentOrientation + 1) % directionOrientationOrder.length]; // cycle through the directions
    placeDirectionButton.textContent = 'Place Direction: ' + currentWallDirection; 
    console.log('Place direction switched to: ' + currentWallDirection);
});

//rotate object tool ( later add shortcut key for this tool)
const rotateObjectButton = document.getElementById('rotateButton');
rotateObjectButton.addEventListener('click', () => {
    console.log('Rotate object tool selected');
});


// short cut stuff 
document.addEventListener('keydown', (event) => {
    if (event.target.closest('input, textarea')) {
        console.log('Key press ignored in input or textarea');
        return; // Ignore key presses when typing in input or textarea
    }
        

    const key = event.key.toLowerCase();
    if ((event.ctrlKey || event.actionKey) && key === 'z') {
        console.log("UNdo button pressed : ctrl + z");
        event.preventDefault(); // Prevent default undo behavior
        undoButton.click(); // Trigger the undo button click event
    } 

    else if ((event.ctrlKey || event.actionKey) && key === 'y') {
        console.log("Redo button pressed : ctrl + y");
        event.preventDefault(); // Prevent default redo behavior
        redoButton.click(); // Trigger the redo button click event
    }

    else if (key === 'd') {
        console.log("Delete tool shortcut key pressed : d");
        deleteButton.click(); // Trigger the delete button click event
    }

    else if (key === 'p') {
        console.log("Place tool shortcut key pressed : p");
        placeButton.click(); // Trigger the place button click event
    }
});