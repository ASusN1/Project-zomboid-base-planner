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

const hideObjectBtn = document.getElementById("hideObjectBtn");
const unhideObjectBtn = document.getElementById("unhideObjectBtn");
const hideGridNumberbtn = document.getElementById("hide_grid_number_btn");
// short cut stuff 
document.addEventListener('keydown', (event) => {
    if (event.target.closest('input, textarea')) {
        console.log('Key press ignored in input or textarea');
        return; // Ignore key presses when typing in input or textarea
    }
        

    const key = event.key.toLowerCase();
    if ((event.ctrlKey) && key === 'z') {
        console.log("UNdo button pressed : ctrl + z");
        event.preventDefault(); 
        undoButton.focus();
        undoButton.click();
    } 

    else if ((event.ctrlKey) && key === 'y') {
        console.log("Redo button pressed : ctrl + y");
        event.preventDefault();
        redoButton.focus();
        redoButton.click();
    }

    else if (key === 'd') {
        console.log("Delete tool shortcut key pressed : d");
        deleteButton.focus();
        deleteButton.click(); 
    }

    else if (key === 'p') {
        console.log("Place tool shortcut key pressed : p");
        placeButton.focus();
        placeButton.click(); 
    }
    else if (key=== "h" && event.altKey){
        console.log("Show object all object selected ");
        unhideObjectBtn.focus();
        unhideObjectBtn.click(); 
    }
    else if (key === "h"){
        console.log("Hide object selected ");
        hideObjectBtn.focus();
        hideObjectBtn.click();
    }
    else if (key === "r") {
        console.log("Rotate object tool shortcut key pressed : r");
        rotateObjectButton.focus();
        rotateObjectButton.click();
    }
    else if (key === "g") {
        console.log("Hide grid number tool shortcut key pressed : g");
        hideGridNumberbtn.focus();
        hideGridNumberbtn.click();
    }
    else if (key === "w") {
        console.log("Place direction tool shortcut key pressed : w");
        placeDirectionButton.focus();
        placeDirectionButton.click();
    }
});