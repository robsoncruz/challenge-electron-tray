const { app, Menu, MenuItem, Tray, dialog } = require('electron');
const { resolve, basename } = require('path');
const { spawn } = require('child_process');
const Store = require('electron-store');
const fs = require('fs');

let mainTray = {};

const schema = {
    projects: {
        type: 'string',
    },
};

const store = new Store({ schema });

function render(tray = mainTray) {
    const storedProjects = store.get('projects');
    const projects = storedProjects ? JSON.parse(storedProjects) : [];
  
    const items = projects.map(({ name, path }) => ({
      label: name,
      submenu: [
        {
          label: 'Abrir no VSCode',
          click: () => {
            spawn('code', [path], { shell: true });
          },
        },
        {
          label: 'Remover',
          click: () => {
            store.set('projects', JSON.stringify(projects.filter(item => item.path !== path)));
            render();
          },
        },
      ],
    }));
  
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Adicionar novo projeto',
        click: () => {
          dialog.showOpenDialog({ properties: ['openDirectory'] })
          .then(result => {                
            const path = result.filePaths[0];
            const name = basename(result.filePaths[0]);
  
            store.set(
            'projects',
            JSON.stringify([ ...projects,
                {
                path,
                name,
                },
            ]),
            );

            render();
          })
        },
      },
      {
        type: 'separator',
      },
      ...items,
      {
        type: 'separator',
      },
      {
        type: 'normal',
        label: 'Fechar Aplicação',
        role: 'quit',
        enabled: true,
      },
    ]);
  
    tray.setContextMenu(contextMenu);
  
    tray.on('click', tray.popUpContextMenu);
  }
  
  app.on('ready', () => {
    mainTray = new Tray(resolve(__dirname, 'assets', 'iconTemplate.png'));  
    render(mainTray);
  });
