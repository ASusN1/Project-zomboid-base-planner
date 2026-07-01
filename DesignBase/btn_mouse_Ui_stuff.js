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

            // if item = wall + has spirte --> use spirte instead of color 
            if(item.type === 'wall' && typeof getWallSpritePath === 'function') {
                const previewSpritePath = getWallSpritePath(item.height, item.name, 'N') // use N as preview pic 

                if (previewSpritePath) {
                    colorBlock.style.backgroundImage = `url("${previewSpritePath}")`;
                    colorBlock.style.backgroundSize = 'cover';
                    colorBlock.style.backgroundColor = ''; 
                }
            }

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