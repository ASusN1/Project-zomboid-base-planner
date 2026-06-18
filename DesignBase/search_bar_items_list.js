const searchBar = document.getElementById('searchBar');
const itemCards = Array.from(document.querySelectorAll('.item-card'));

searchBar.addEventListener('input', () => {
    const underscore_items_input = searchBar.value.trim().toLowerCase();

    let itemFound = false;

    itemCards.forEach(card => {
        const name = card.dataset.searchName || '';
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
        console.log(searchBar.value.trim().toLowerCase());
    }
});