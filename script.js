const grid = document.getElementById('grid');
const viewContainer = document.querySelector('.view-container');
const size = 12;
let zoom = 1;
let offsetX = 0;
let offsetY = 0;
let isCameraDragging = false;
let startX = 0;
let startY = 0;

function updateTransform() {
    grid.style.transform = `translate(${offsetX}px, ${offsetY}px) rotateX(60deg) rotateZ(45deg) scale(${zoom})`;
}

function createGrid() {
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');

            tile.textContent = `${x},${y}`;

            grid.appendChild(tile);
        }
    }
    updateTransform();
}

createGrid();

//zoom to the cneter og grid
viewContainer.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
        zoom += 0.1;
    } else {
        zoom -= 0.1;
    }
    zoom = Math.max(0.1, zoom);
    updateTransform();
});

//drag camera 
viewContainer.addEventListener('mousedown', (e) => {
    isCameraDragging = true;
    startX= e.clientX;
    startY = e.clientY;
    document.body.style.cursor= 'grabbing';
});

document.addEventListener('mouseup', (e) => {
    if (isCameraDragging) {
        isCameraDragging = false;
        document.body.style.cursor = 'default';
    }
});

document.addEventListener('mousemove', (e) => {
    if (!isCameraDragging) return;
    const dx = e.clientX- startX;
    const dy = e.clientY- startY;

    offsetX += dx;
    offsetY += dy;

    startX = e.clientX;
    startY = e.clientY;

    updateTransform();
});

//stop drag when mouse leave grid area ( prob create a btn like blender that allow drag) 
viewContainer.addEventListener('mouseleave',() => { 
    if (isCameraDragging) {
        isCameraDragging = false;
        document.body.style.cursor = 'default';
    }
})

//For the tab system 
function switchCategory(evt, itemName) {
    //declare all variables 
    var i, tabconnect, tablinks;
    // get all elelment with class contnetn and hide them
    tabconnect = document.getElementsByClassName("tabcontent");
    for (i =0; i < tabconnect.length; i++) {
        tabconnect[i].style.display = "none"; //not sure what this mean but will check later 
    }
    // get all element with class tablinks and remove the class active
    tablinks = document.getElementsByClassName("tablinks");
    for (i =  0; i< tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace("active", "");
    }

    // show current tabs , add active class to the btn 
    document.getElementById(itemName).style.display = "grid"; // tester later if this block can be repalce with just text 
    evt.currentTarget.className += " active";
}

function loadCateoryItems (){ 
    for (const categoryType in itemDatabase) {
        const panelContainer = document.getElementById(categoryType);

        if (!panelContainer) continue;
        panelContainer.innerHTML = ''; // Clear existing items

        //Access spepcif clist of items for each category
        itemDatabase[categoryType].forEach(item => {
            const cardElement = document.createElement('div');
            cardElement.className ="item-card";

            const colorBlock = document.createElement("div");
            colorBlock.className = "item-color-preview";
            colorBlock.style.backgroundColor = item.color;

            cardElement.appendChild(colorBlock);

            const textLabel = document.createElement('span');
            textLabel.innerText = item.name; // Later mod this file or smt
            cardElement.appendChild(textLabel);

            panelContainer.appendChild(cardElement);

        });
    }
}loadCateoryItems();