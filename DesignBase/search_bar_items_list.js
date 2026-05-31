const searchBar = document.getElementById('searchBar');

searchBar.addEventListener('input', () => {
    const underscore_items_input = searchBar.value.trim().toLowerCase();
    console.log(underscore_items_input);

    let itemFound = false;

    document.querySelectorAll('.item-card').forEach(card => {
        const name = card.querySelector('span').innerText.toLowerCase();
        if (name.includes(underscore_items_input)) {
            itemFound = true;
            card.style.display = '';
        }
        else {
            card.style.display = 'none';
        }
    });
     
    if (underscore_items_input !== '') {
        if (!itemFound) {
            console.log( searchBar.value.trim() + "No items found");
        }else {
            console.log( searchBar.value.trim() + "Items found");
        }
    }
});

searchBar.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const underscore_items_input = searchBar.value.trim().toLowerCase();
        console.log(underscore_items_input);
    }
});