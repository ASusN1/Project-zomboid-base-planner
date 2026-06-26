function loadBaseDesignFromJsonAndRedirect() {
    const fileInput = document.createElement('input'); 
    fileInput.type = 'file';
    fileInput.accept = '.json'; // only allow json files

    fileInput.addEventListener('change', () => {
        const selectedFile = fileInput.files[0];
        if (!selectedFile) return;

        const fileReader = new FileReader();
        fileReader.onload = (e) => {
           localStorage.setItem('pendingBaseDesign', e.target.result);
           window.location.href = '../DesignBase/index.html'; // redirect to DesignBae page
        };

        fileReader.readAsText(selectedFile); 
    });

    fileInput.click(); 
}

window.loadBaseDesignFromJsonAndRedirect = loadBaseDesignFromJsonAndRedirect;