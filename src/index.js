const {app,BrowserWindow,Menu,ipcMain} = require('electron');
const url=require('url');
const path=require('path');

if(process.env.NODE_ENV !== 'production'){
  require('electron-reload')(__dirname,{
    electron: path.join(__dirname,'../node_modules','.bin','electron')
  })
}

let mainWindow
let ventanaCrearNuevoElemento

app.on('ready',() => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname,'views/index.html'),
    protocol: 'file',
    slashes: true
  }))

  const mainMenu = Menu.buildFromTemplate(templateMenu);
  Menu.setApplicationMenu(mainMenu);

  mainWindow.on('closed',() => {
    app.quit();
  });

});

function funcionCrearNuevoElemento(){
  ventanaCrearNuevoElemento = new BrowserWindow({
    width:400,
    height:300,
    title:'Crear nuevo elemento'
  });
  ventanaCrearNuevoElemento.setMenuBarVisibility(false)
  ventanaCrearNuevoElemento.loadURL(url.format({
    pathname: path.join(__dirname,'views/nuevo-elemento.html'),
    protocol: 'file',
    slashes: true
  }))
  ventanaCrearNuevoElemento.on('closed',() =>{
    ventanaCrearNuevoElemento=null;
  });
}

ipcMain.on('product:new', (e, newProduct) => {
  console.log(newProduct);
  mainWindow.webContents.send('product:new', newProduct);
  ventanaCrearNuevoElemento.close();
});

const templateMenu = [
  {
    label:'Archivo',
    submenu: [
      {
        label:'Nuevo elemento',
        accelerator:'Ctrl+N',
        click(){
          funcionCrearNuevoElemento();
        }
      },
      {
        label:'Quitar todo',
        accelerator:'Ctrl+M',
        click() {
          mainWindow.webContents.send('products:remove-all');
        }
      },
      {
        label:'Salir',
        accelerator:'Ctrl+Q',
        click(){
          app.quit();
        }
      }
    ]
  },
];

if (process.env.NODE_ENV !== 'production') {
  templateMenu.push({
    label: 'DevTools',
    submenu: [
      {
        label: 'Show/Hide Dev Tools',
        accelerator: process.platform == 'darwin' ? 'Comand+D' : 'Ctrl+D',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  })
}
