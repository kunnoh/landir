'use strict';
import db from './db.controller.js';


window.onload = function(){
    const doc = window.document;
    const ipc = window.ipcRenderer;

    const idb = new db;

    //create indexed db database
    console.log(idb.create());

    const exitBtn = doc.getElementById('exit-btn');
    const shareBtn = doc.getElementById('file-share');

    //get user profile
    ipc.send('get-user', 'please give me user data');
    ipc.on('here-is-user', (ev, data) =>{
        console.log(data);
    });

    exitBtn.addEventListener('click', function(ev){
        if(!ev.target.classList.contains('power-icon')) return false;
            ipc.send('close-window', 'close application');
    }, false);

    shareBtn.addEventListener('click', function(ev){
        let pathArr = ipc.sendSync('select-file', 'true');
        dbControl.createDbObj(pathArr);
    }, false);
};

let dbControl = (function(){
    function createPath(fp){
        const formtObj = obj => {
            let filePath = obj.substring(0, obj.lastIndexOf('/')+1);
            let fileName = obj.substring(obj.lastIndexOf('/')+1, obj.length);
            return {filePath, fileName};
        }
        const files = fp.map(formtObj);
        console.log(files);
    };
    function getPath(){};
    function deletePath(){

    };
    return {
        createDbObj: createPath,
        getPaths: getPath,
        deleteObj: deletePath
    };
})();