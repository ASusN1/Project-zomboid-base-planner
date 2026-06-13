    const TILE = 60; 

    const tiles = document.querySelectorAll('.tile.'); 
    if (!tiles.length) 
        return; 

    //see grid dimesions: 
    let maxX = 0, maxY = 0; 
    tiles.forEach(t => { 
        maxX = Math.max(maxX, parseInt(t.dataset.x));
        maxY = Math.max(maxY, parseInt(t.dataset.y));
    });
    const cols = maxX + 1;
    const rows = maxY + 1;

    //set up canvs : isoX ( x-y) * (tile/2) , isoY = (x+y) * (tile/4) 
    let minIsox = Infinity, minIsoy = Infinity, maxIsox = -Infinity, maxIsoy = -Infinity;

    for ( let x = 0; x < cols ; x++) {
        for ( let y = 0; y < rows ; y++) {
            const ix = (x - y) * (TILE / 2);
            const iy = (x + y) * (TILE / 4);
            minIsoX = Math.min(minIsoX, ix);
            minIsoY = Math.min(minIsoY, iy);
            maxIsoX = Math.max(maxIsoX, ix+ TILE);
            maxIsoY = Math.max(maxIsoY, iy + TILE/2);
        }
    }

    const padding = 20; 
    const canvasW = (maxIsoX - minIsoX) + padding * 2; 
    const canvasH = (maxIsoY - minIsoY) + padding * 2+ 80;

    const canvas = document.createElement('canvas');
    canvas.width = canvasW; 
    canvas.height = canvasH; 
    const ctx = canvas.getContext('2d');

    //backgorund 
    ctx.fillStyle = '#fff';
    ctx.fillRect(0,0, canvasW, canvasH);

    //draw the tiles 
    function drawISotiles( ctx, ix,iy, fillColor, strokeColor = '#000') {
        const hw = TILE/2; 
        const hh = TILE/4;

        ctx.beginPath();
        ctx.moveTo(ix, iy);
        ctx.lineTo(ix, iy+hh); 
        ctx.lineTo(ix, iy +hh * 2);
        ctx.lineTo(ix - hw, iy +hh);
        ctx.closePath();
        ctx.fill(); 
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1;
        ctx.stroke();
    }