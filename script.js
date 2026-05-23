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
    document.getElementById(itemName).style.display = "block"; // tester later if this block can be repalce with just text 
    evt.currentTarget.className += " active";
}
// will put in docker or smt since this not suppose to be in the js code since it going to be long
const itemDatabase = {
    Wall :[
        { name: 'Brick Wall', color: '#B22222' },
        { name: 'Stone Wall', color: '#808080' },
        { name: 'Wooden Wall', color: '#8B4513' }
    ],
    Floor: [
        { name: 'Wooden Floor', color: '#DEB887' },
        { name: 'Marble Floor', color: '#F5F5F5' },
        { name: 'Tile Floor', color: '#D3D3D3' }
    ],
    Furniture: [
        { name: 'Chair', color: '#8B4513' },
        { name: 'Table', color: '#DEB887' }
    ]
}
//----------------------------------------------------
