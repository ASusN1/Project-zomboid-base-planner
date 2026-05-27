const searchBar = document.getElementById('searchBar');

searchBar.addEventListener('input', () => {
    const underscore_items_input = searchBar.value.trim().toLowerCase();
    console.log(underscore_items_input);

    document.querySelectorAll('.item-card').forEach(card => {
        const name = card.querySelector('span').innerText.toLowerCase();
        card.style.display = name.includes(underscore_items_input) ? '' : 'none';
    });
});

searchBar.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const underscore_items_input = searchBar.value.trim().toLowerCase();
        console.log(underscore_items_input);
    }
});