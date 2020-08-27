const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const path = require('path');
const os = require('os');
const url = require('url');

//set environment
process.env.NODE_ENV = 'development';

let mainWin;

function createWin(){
    mainWin = new BrowserWindow({
        frame: false,
        width: 1200,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });
    
    //load html file
    mainWin.webContents.loadURL(url.format({
        pathname: path.join(__dirname, 'src/index.html'),
        protocol: 'file',
        slashes: true,
        
    }));
    
    //open dev tools
    mainWin.webContents.openDevTools();
    
    //quit app when closed
    mainWin.on('closed', function(){
        mainWin = null;
    });
};

//listen when app is ready & create window
app.on('ready', createWin);

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit();
    };
});

app.on('activate', () => {
    if(win === null) {
        createWindow();
    }
});

//get user data
ipcMain.on('get-user', (ev, args) =>{
    console.log(args);
    const COMPANY = 'Mr.Kun';
    const user = os.homedir();
    switch(os.platform()){
        case 'win32':
            return ev.reply("here-is-user", path.join(process.env.APPDATA, `${COMPANY}`));
        case 'darwin':
            return ev.reply("her-is-user", path.join(user, `Library/Application Support/${COMPANY}`));
        case 'linux':
            return ev.reply("here-is-user", path.join(user, `.local/share/data/${COMPANY}`));
    };
    ev.reply("here-is-user", path.join(user,`${user.toLowerCase()}`));

});

//close button quit app
ipcMain.on('close-window', (ev, args) => {
    console.log(args);
    mainWin = null;
    return app.quit();
});

//open dialog to select files
ipcMain.on('select-file', (ev, args)=>{
    let fp;
    if(args !== 'true') return null;
    dialog.showOpenDialog({
        properties: ['openFiles', 'openDir', 'multiSelections']
    }).then(result =>{
        if(result.canceled) return null;
        if(!Array.isArray(result.filePaths)) return null;
        fp = result.filePaths.slice();
        ev.returnValue = fp;
        return;
    }).catch(err => {
        console.log(err);
        return null;
    });
});