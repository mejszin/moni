const ipcRenderer = require('electron').ipcRenderer; 
 
ipcRenderer.on('clear-body', function(event, param) {
    document.getElementById('indicator-grid').innerHTML = "";                             
});

ipcRenderer.on('add-indicator', function(event, param) {

    var fs = require('fs'),
        path = require('path'),    
        filePath = path.join(__dirname, '/reports/' + param);

    console.log(filePath);

    fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
        if (!err) {
            var cells = data.split(',');
            // Create indicator
            var indicator = document.createElement('div');
            indicator.className = 'indicator';
            indicator.style.backgroundColor = cells[8];
            // Create title element
            var title = document.createElement('h1');
            title.innerHTML = cells[5];
            // Create terse element
            var terse = document.createElement('p');
            terse.innerHTML = cells[6];
            // Create status element
            var status = document.createElement('p');
            status.className = 'status ' + cells[4].toLowerCase();
            status.innerHTML = cells[2];
            // Add elements to grid
            indicator.appendChild(title);
            indicator.appendChild(terse);
            indicator.appendChild(status);
            document.getElementById('indicator-grid').appendChild(indicator);
        } else {
            console.log(err);
        }
    });

                                      
});

ipcRenderer.send('start-updater');