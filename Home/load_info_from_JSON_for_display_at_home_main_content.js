function openDesignCard(jsonFilePath) { 
    fetch(jsonFilePath) 
    .then(res => res.json())
    .then(saveData => { 
        localStorage.setItem('pendingBaseDesign', JSON.stringify(saveData));
        window.location.href = "../DesignBase/index.html";
    });
}