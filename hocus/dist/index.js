"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@hocuspocus/server");
const server = server_1.Server.configure({
    port: 1234,
    onChange: async (data) => {
        console.log('===================');
        console.log(data);
    },
});
server.listen(async (val) => {
    console.log('started listening');
});
