const gridSizeInput = document.getElementById('gridSizeInput');

let size = Math.max(12, parseInt(gridSizeInput.value) || 12); // default to 12 if invalid input
if (size <12) size = 12; // force min height/width = 12*12 

let selectedItem = null; 
let currentToolusing = 'place'; // default tool is place

let undoListItem = [];
let redoListItem = [];



function createGrid() {
    grid.innerHTML = ''; // Clear existing grid when user change the grid size
    
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');

            tile.textContent = `${x},${y}`;
            
            // change color of selected tile to the color of the items ( Later change to png of the itm from pz) 
            // Tool feature here (delete,redo,undo,place ( place = default )
            tile.addEventListener('click', () => {
                const previousColor = tile.style.backgroundColor; // Store the previous color for undo
                let newColor = previousColor; // Default to previous color if no change

                if (currentToolusing ==='delete'){
                    newColor = '';
                }else if (currentToolusing === 'place' && selectedItem) {
                    newColor = selectedItem.color;
                }else { 
                    return;
                }

                if (newColor !== previousColor) {
                    tile.style.backgroundColor = newColor;
                    undoListItem.push({ tile, previousColor,newColor });
                    redoListItem = [];
                }
            });

            grid.appendChild(tile);
            
        }
    }
    updateTransform();
}
gridSizeInput.addEventListener('change', () => {
    size = Math.max(12, parseInt(gridSizeInput.value) || 12); // default to 12 if invalid input
    gridSizeInput.value = size; 

    //Reset items list 
    undoListItem = [];
    redoListItem = [];

    createGrid();
});

createGrid();

//For the category system 
function switchCategory(evt, itemName) {
    //declare all variables 
    var i, tabconnect, tablinks;
    // get all elelment with class contnetn and hide them
    tabconnect = document.getElementsByClassName("tabcontent");
    for (i =0; i < tabconnect.length; i++) {
        tabconnect[i].classList.remove("active");
        tabconnect[i].style.transform = "translateY(0)";
    }
    // get all element with class tablinks and remove the class active
    tablinks = document.getElementsByClassName("tablinks");
    for (i =  0; i< tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace("active", "");
    }

    // show current tabs , add active class to the btn 
    document.getElementById(itemName).classList.add("active");
    evt.currentTarget.className += " active";
    scrollState.scrollOffset = 0;
}

// load the item from database to the panel
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

            // Set items card to active when pressed 
            cardElement.addEventListener('click', () => {
                selectedItem = item; 

                document.querySelectorAll('.item-card').forEach(card => {
                    card.classList.remove('active');
                });
                cardElement.classList.add('active');
                console.log(selectedItem); // for testing later remove this ( print selectd item)
            });
            panelContainer.appendChild(cardElement);

        });
    }
}
loadCateoryItems();

// Simple mouse wheel scroll
const scrollContainer = document.querySelector('.item-category-content');
let scrollState = { scrollOffset: 0 };
const SCROLL_STEP = 40;

scrollContainer.addEventListener('wheel', (e) => {
    e.preventDefault();
    const activeTab = document.querySelector('.tabcontent.active');
    if (!activeTab) return;
    
    const containerHeight = scrollContainer.clientHeight;
    const contentHeight = activeTab.scrollHeight;
    const maxScroll = Math.max(0, contentHeight - containerHeight);
    
    scrollState.scrollOffset += e.deltaY > 0 ? SCROLL_STEP : -SCROLL_STEP;
    scrollState.scrollOffset = Math.max(0, Math.min(scrollState.scrollOffset, maxScroll));
    
    activeTab.style.transform = `translateY(-${scrollState.scrollOffset}px)`;
});