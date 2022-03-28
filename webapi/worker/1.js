

self.addEventListener('message', function (e) {
    var data = e.data;
    console.log('worker:', data)
    switch (data.cmd) {
        case 'start':
            setTimeout(() => {
                self.postMessage({ cmd: 'wstart' });
            }, 2000);
            break;
        case 'stop':
            setTimeout(() => {
                self.postMessage({ cmd: 'wstop' });
                self.close(); // Terminates the worker.
            }, 2000);
            break;
        // default:
            // self.postMessage('Unknown command: ' + data);
    };
}, false);