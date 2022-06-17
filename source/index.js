const hostname = '127.0.0.1';
const port = 3001;

// load app with current config
const app = (await import('./app.js')).app;
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});