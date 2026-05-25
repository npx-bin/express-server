#!/usr/bin/env node

var os = require('os');
var ifaces = os.networkInterfaces();
const express = require('express');
const cors = require('cors');
const opn = require('opn');

const app = express();
let port = 3003;

if (process.argv && process.argv[2] && !isNaN(parseInt(process.argv[2], 10))) {
    port = parseInt(process.argv[2], 10);
}

console.clear();
console.log("\nLaunching Express Server . . .\n\n");

app.use(cors({
    origin: "*",
    allowedHeaders: "*",
    optionsSuccessStatus: 200
}));

app.get('/', (req, res) => res.sendFile('html/index.html', {
    root: __dirname
}));

app.listen(port, () => {
    let hosts = ["localhost", "127.0.0.1"];
    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;
        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
            }
            if (alias >= 1) {
                // this single interface has multiple ipv4 addresses
                hosts.push(iface.address);
            } else {
                // this interface has only one ipv4 adress
                hosts.push(iface.address);
            }
            ++alias;
        });
    });
    let urls = [];
    hosts.forEach(function (host) {
        urls.push(`\thttp://${host}:${port}`);
    });

    let output = [`>> Express Server launched, listening on port ${port} !!\n`, `You can view the page in your browser at the following urls:\n\n${urls.join("\n")}\n\n\n`, "To launch using a custom port, stop the server and restart using the following command:\n", "$ npx npx-bin/express-server 0000\n\n", "Note: Replace 0000 with the port number of your choice.\n\n", "For more information, refer the README.md @ https://github.com/npx-bin/express-server"];
    console.log(output.join(""));
    opn(`http://localhost:${port}`);
});
