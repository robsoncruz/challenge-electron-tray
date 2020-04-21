const { resolve } = require('path');
const { app, Menu, Tray } = require('electron');

app.dock.hide();

app.on('ready', () => {
    const tray = new Tray(resolve(__dirname, 'assets', 'iconTemplate.png'));    
    
    const contextMenu = Menu.buildFromTemplate([
        {label: 'Add', type: 'radio', checked: true}
    ]);

    tray.setToolTip('Challenge Tray');
    tray.setContextMenu(contextMenu);
})
