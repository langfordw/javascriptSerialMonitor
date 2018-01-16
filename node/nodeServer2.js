var SerialPort = require('SerialPort-v4');

var app = require('http').createServer();
var io = require('socket.io')(app);
app.listen(8080);

//defaults
var portName = null;
var currentPort = null;
var baudRate = 115200;

io.on('connection', function(socket){
	// console.log("hello")
	var allPorts = [];
    refreshAvailablePorts(function(_allPorts, _portName, _baudRate){
        // currentPort = changePort(_portName, _baudRate);
    });

    socket.on('baudRate', function(value){
        console.log(value)
        refreshAvailablePorts(function(){
            if (!checkThatPortExists(portName)) return;
            currentPort = changePort(portName, value);
            baudRate = value;
        });
    });

    socket.on('portName', function(value){
        refreshAvailablePorts(function(){
            if (!checkThatPortExists(value)) return;
            currentPort = changePort(value, baudRate);
            portName = value;
        });
    });

    socket.on('dataOut', function(data){
        outputData(data);
    });

    function outputData(data){
        io.emit('dataSent', data);
        data += '\n';
        console.log("Sending data: " + data);
        currentPort.write(new Buffer(data), function(err, res) {
            if (err) onPortError(err);
        });
//        currentPort.write(new Buffer([parseInt(data)]));//write byte
    }

    function refreshAvailablePorts(callback){
        var _allPorts = [];
        SerialPort.list(function(err, ports){
            ports.forEach(function(port) {
                _allPorts.push(port.comName);
                console.log(port.comName)
            });

            allPorts = _allPorts;

            if (!portName && _allPorts.length>0) portName = _allPorts[0];
            if (callback) callback(allPorts, portName, baudRate);

            io.emit('connected', {
                baudRate: baudRate,
                portName: portName,
                availablePorts: _allPorts
            });
        });
    }

    function initPort(_portName, _baudRate){

        console.log("initing port " + _portName + " at " + _baudRate);
        var port = new SerialPort(_portName, {
            baudRate: _baudRate,
            parser: new SerialPort.parsers.Readline("\n"),
            autoOpen: false
        //       parser: SerialPort.parsers.raw
        });

        port.open(function(error){
            if (error) {
                onPortError(error);
                onPortClose();
                currentPort = null;
                return;
            }
            onPortOpen(_portName, _baudRate);
            port.on('data', onPortData);
            port.on('close', onPortClose);
            port.on('error', onPortError);
        });
        return port;
    }

    function changePort(_portName, _baudRate){
        console.log("change");
        if (!_portName) {
            onPortError("no port name specified");
            return null;
        }
        if (currentPort) {
            var oldBaud = baudRate;
            var oldName = portName;
            console.log("disconnecting port " + oldName + " at " + oldBaud);
            if (currentPort.isOpen) currentPort.close(function(error){
                if (error) {
                    onPortError(error);
                    return null;
                }
                io.emit("portDisconnected", {baudRate:oldBaud, portName:oldName});
            });
        }
        return initPort(_portName, _baudRate);
    }

    function onPortOpen(name, baud){
        console.log("connected to port " + portName + " at " + baudRate);
        io.emit("portConnected", {baudRate:baud, portName:name});
    }

    function onPortClose(){
       console.log("port closed");
    }

    function onPortError(error){
        console.log("Serial port error " + error);
        io.emit("errorMsg", {error:String(error)});
    }
});

// // Use a Readline parser
// var SerialPort = require('serialport');
// var parsers = SerialPort.parsers;

// // Use a `\n` as a line terminator
// var parser = new parsers.Readline({
//   delimiter: '\n'
// });

// var port = new SerialPort('/dev/tty.usbmodem1421', {
//   baudRate: baudRate
// });

// port.pipe(parser);

// port.on('open', () => console.log('Port open'));

// parser.on('data', function(data) {
// 	outputData(data);
// });

// port.write('ROBOT PLEASE RESPOND\n');

// // The parser will emit any string response

// function outputData(data){
//     io.emit('dataSent', data);
//     data += '\n';
//     console.log("Sending data: " + data);
//     currentPort.write(new Buffer(data), function(err, res) {
//         if (err) onPortError(err);
//     });
// //        currentPort.write(new Buffer([parseInt(data)]));//write byte
// }