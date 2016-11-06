var http = require("http"),
    fs = require("fs"),
    path = require("path"),
    mime = require("mime");

function send404(response) {
    response.writeHead(404, {"Content-type": "text/plain"});
    response.write("Error 404: resource not found");
    response.end();
}

function sendPage(response, filePath, fileContents) {
    response.writeHead(200, {"Content-Type": mime.lookup(path.basename(filePath))});
    response.end(fileContents);
}

function serverWorking(response, absPath) {
    fs.exists(absPath, function(exists) {
        if (exists) {
            fs.readFile(absPath, function(err, data) {
                if (err) {
                    send404(response)
                } else {
                    sendPage(response, absPath, data);
                }
            });
        } else {
            send404(response);
        }
    });
}

var server = http.createServer(function(request, response) {
    var filePath = false;

    if (request.url == '/') {
        filePath = "public/index.html";
    } else {
        filePath = "public" + request.url;
    }

    var absPath = "./" + filePath;
    serverWorking(response, absPath);
});

var port_number = server.listen(process.env.PORT || 3000, function() {
    console.log("Server up and running on http://localhost:3000/");
});

var io = require("socket.io").listen(server);

io.sockets.on("connection", function(socket) {
    socket.emit("chat", { name: "Server", text: "Connected"});

    socket.on("chat", function(data) {
        io.sockets.emit("chat", { name: data.name, text: data.text });
    });
});
