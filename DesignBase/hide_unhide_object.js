window.hiddenCubeKeys = [];

const hideObjectButton = document.getElementById('hideObjectBtn');
const unhideObjectButton = document.getElementById('unhideObjectBtn');

hideObjectButton.addEventListener('click', () => {
    console.log('Hide tool selected'); 

    currentToolusing = 'hide'; 

    selectedItem = null; 

    document.querySelectorAll('.item-card').forEach(card => {
        card.classList.remove('active');
    });
});

unhideObjectButton.addEventListener('click', () => {
    console.log('Unhide button clicked');

    // loop through every key we stored while hiding cubes
    for (let i = 0; i < window.hiddenCubeKeys.length; i++) {
        const key = window.hiddenCubeKeys[i];  

        if (window.cubeRegistry.has(key)) { 
            const cube = window.cubeRegistry.get(key);  

            for (let j = 0; j < cube.elements.length; j++) { 
                const el = cube.elements[j].el;  
                el.style.display = '';  
            }
        }
    }
    window.hiddenCubeKeys = []; 

    for(let i = 0; i < window.hiddenWallElements.length; i++) {
        const wallEl = window.hiddenWallElements[i];
        wallEl.style.display = '';
    }
    window.hiddenWallElements = [];
});