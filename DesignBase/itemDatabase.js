// This just a testing data base before the actual tile / items 
const itemDatabase = {
    Walls :[
        { name: 'Brick Wall', color: '#B22222' , type: 'wall', height: 'small'},
        { name: 'Stone Wall', color: '#808080' , type: 'wall', height: 'medium'},
        { name: 'Wood_Wall_level_3', color: '#8B4513' , type: 'wall', height: 'large'},
        { name: 'Concrete Wall', color: '#696969' , type: 'wall'},
        { name: 'Metal Wall', color: '#A9A9A9' , type: 'wall'},
        { name: 'Glass Wall', color: '#87CEEB' , type: 'wall'},
        { name: 'Reinforced Wall', color: '#556B2F' , type: 'wall'},
        { name: "Metal Wall", color: "gray", type: "wall", height: "large" },
    ],
    Floors: [
        { name: 'Wooden Floor', color: '#DEB887' , type: 'floor'},
        { name: 'Marble Floor', color: '#F5F5F5' , type: 'floor'},
        { name: 'Tile Floor', color: '#D3D3D3' , type: 'floor'},
        { name: 'Concrete Floor', color: '#A9A9A9' , type: 'floor'},
        { name: 'Metal Floor', color: '#708090' , type: 'floor'},
        { name: 'Carpet Floor', color: '#8B0000' , type: 'floor'},
        { name: 'Gravel Floor', color: '#BC8F8F' , type: 'floor'},
        { name: 'Steel Plating', color: '#36454F' , type: 'floor'},
        { name: 'Dark Oak Floor', color: '#5C4033' , type: 'floor'},
        { name: 'Pine Wood Floor', color: '#CFA66B' , type: 'floor'},
        { name: "Hardwood_Floor", color: '#8B4513', type: "floor" },
    ],
    Furniture: [
        { name: 'Chair', color: '#8B4513' },
        { name: 'Table', color: '#DEB887' },
        { name: 'Bookshelf', color: '#654321' },
        { name: 'Bed', color: '#FFB6C1' },
        { name: 'Cabinet', color: '#8B4513' },
        { name: 'Desk', color: '#D2691E' },
        { name: 'Couch', color: '#CD5C5C' }
    ],
    Doors: [
        { name: 'Wooden Door', color: '#8B4513' },
        { name: 'Metal Door', color: '#708090' },
        { name: 'Glass Door', color: '#ADD8E6' },
        { name: 'Steel Door', color: '#36454F' },
        { name: 'Reinforced Door', color: '#556B2F' },
        { name: 'Barn Door', color: '#A0522D' },
        { name: 'Double Door', color: '#696969' },
        { name: 'Sliding Door', color: '#A9A9A9' }
    ],
    Windows: [
        { name: 'Wooden Window', color: '#DEB887' },
        { name: 'Glass Window', color: '#87CEEB' },
        { name: 'Barred Window', color: '#708090' },
        { name: 'Metal Window', color: '#A9A9A9' },
        { name: 'Reinforced Window', color: '#556B2F' },
        { name: 'Large Window', color: '#ADD8E6' },
        { name: 'Small Window', color: '#87CEEB' },
        { name: 'Boarded Window', color: '#8B4513' }
    ],
    Lighting: [
        { name: 'Light Bulb', color: '#FFFF00' },
        { name: 'Electric Light', color: '#FFD700' },
        { name: 'Lantern', color: '#FFA500' },
        { name: 'Candle', color: '#FFD700' },
        { name: 'Spotlight', color: '#FFFF00' },
        { name: 'Neon Light', color: '#FF1493' },
        { name: 'Ceiling Light', color: '#FFFF99' },
        { name: 'Wall Lamp', color: '#FFA500' }
    ],
    Storage: [
        { name: 'Storage Crate', color: 'url(../tile/Tables/Tables_pictures_stuff/Bordered_Square_Table.png)',  type: 'cube', x: 1, y: 1, z: 1 },
        { name: 'Metal Locker', color: '#708090', type: 'cube', x: 1, y: 1, z: 2 }, /* 1 by 1 cube but 2 tall*/
        { name: 'Shelf Unit', color: '#DEB887', type: 'cube', x: 1, y: 1, z: 3 }, /* 1 by 1 cube but 3 tall*/
        { name: 'Gun Safe', color: '#2F4F4F', type: 'cube', x: 2, y: 1, z: 1 }, /* 2 by 1 cube 1 tall */ /*later use for rotate*/ /*A1 */
        { name: 'Food Container', color: '#A0522D', type: 'cube', x: 1, y:2, z:1 }, /* 1 by 2 cube but 1 tall */ /*later use for rotate*/ /*A2 */
        { name: 'Ammo Box', color: '#556B2F', type: 'cube', x: 2, y: 2, z: 2 }, /* 2 by 2 cube but 2 tall */ /*later use for rotate*/ /*B */
        { name: 'Weapon Rack', color: '#696969', type: 'cube', x: 3, y: 1, z: 2 }, /* 3 by 1 cube but 2 tall */ /*later use for rotate*/ /*C1*/
        { name: 'Wooden_Crate', color: "#8b4513", type: 'cube',x: 1, y: 1, z: 1 }, /* 1 by 1 cube but 1 tall */ /*later use for rotate*/ /*D */
    ],
    Traps: [
        { name: 'Spike Trap', color: '#DC143C' },
        { name: 'Bear Trap', color: '#696969' },
        { name: 'Wire Trap', color: '#A9A9A9' },
        { name: 'Zombie Trap', color: '#8B0000' },
        { name: 'Alarm Trap', color: '#FFD700' },
        { name: 'Fire Trap', color: '#FF4500' },
        { name: 'Floor Spikes', color: '#8B0000' },
        { name: 'Barbed Wire', color: '#696969' }
    ]
};