#!/usr/bin/env node

const app = require('../app');
const http = require('http');
const connectDB = require('../helpers/database');

const port = process.env.PORT || 3000;
app.set('port', port);

const server = http.createServer(app);

// Gọi hàm kết nối trước khi cho Server lắng nghe (Listen)
connectDB().then(() => {
    server.listen(port);
    server.on('error', (error) => { console.error(`Error occurred while starting server: ${error.message}`); });
    server.on('listening', () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});