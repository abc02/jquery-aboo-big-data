var express = require('express');
var proxy = require('http-proxy-middleware');


// proxy middleware options 
var options = {
    target: 'http://datainterface.abpao.com', // target host 
    changeOrigin: true,               // needed for virtual hosted sites 
    // ws: true,                         // proxy websockets 
    pathRewrite: {
        '^/v1': '/v1',     // rewrite path 
        // '^/api/remove/path' : '/path'           // remove base path 
    },
    // router: {
    //     // when request.headers.host == 'dev.localhost:3000', 
    //     // override target 'http://www.example.org' to 'http://localhost:8000' 
    //     'dev.localhost:3000' : 'http://localhost:8000'
    // }
};

// create the proxy (without context) 
var exampleProxy = proxy(options);

// mount `exampleProxy` in web server 
var app = express();
app.use('/v1', exampleProxy);

app.use(express.static(__dirname));
app.get('/', function (req, res) {
    res.send('Hello World!');
  });
  
app.listen(3000, function () {
    console.log('app listening on port 3000!');
});



