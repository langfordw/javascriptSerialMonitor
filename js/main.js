/**
 * Created by ghassaei on 10/26/16.
 */


$(function() {

    var socket = io.connect('http://localhost:8080');
    var serialMonitor = $("#serialMonitor");
    var stringBuffer = new Array();
    var serialInput = $("#serialInput");
    $("#commentCharacter").val('#');
    $("#delimeterCharacter").val(',');

    serialInput.keydown(function(e) {
        if (e.keyCode == 13) {
            $("#sendButton").click();
        }
    })

    $("#baudSelect").change(function() {
        var baud = $("#baudSelect option:selected")[0].innerText;
        socket.emit("baudRate", parseInt(baud));

    });

    $("#refreshPorts").click(function(e) {
        e.preventDefault();
        socket.emit("refreshPorts");
    });

    $("#goButton").click(function() {
        console.log("sending go");
        socket.emit('dataOut','g');
    });

    $("#stopButton").click(function() {
        console.log("sending stop");
        socket.emit('dataOut','x');
    });

    $("#resumeButton").click(function() {
        console.log("sending resume");
        socket.emit('dataOut','r');
    });
    
    $("#saveButton").click(function() {
        console.log("saving data...");
        console.log(serialMonitor.html())
        var fileName = "jsm_data.json";
        saveData2(serialMonitor.html(),fileName);
    });

    $("#clearButton").click(function() {
        serialMonitor.html("");
    });

    $("#plotButton").click(function() {
        var data = serialMonitor.html().split('\n');
        data = ["1, 2, 3","3, 4, 5","5, 6, 7","7, 8, 9","9, 10, 11"];
        drawChart(parseData(data));
    });

    $("#sendButton").click(function() {
        var text = serialInput.val();
        if ($("#newLineCheck").is(":checked")) {
            text += "\n";
        }
        if ($("#carriageReturnCheck").is(":checked")) {
            text += "\r";
        } 
        console.log("sending: " + text);
        socket.emit('dataOut',text);
        serialInput.val("");
    });

    $("#availablePorts").change(function(){//change port
        var port = $("select option:selected")[0].innerText;
        socket.emit("portName", port);
    });

    //bind events
    socket.on('connected', function(data){

        console.log("connected");

        if (data.baudRate) $("#baudRate").html(data.baudRate);
        if (data.availablePorts && data.availablePorts.length>0){
            var html = "<select class='availablePorts'>";
            for (var i=0;i<data.availablePorts.length;i++){
                html += "<option value='"+data.availablePorts[i]+"'>" + data.availablePorts[i] + "</option>"
            }
            html+="</select>"
            $("#availablePorts").html(html);
        } 
        // set dropdown to selected port:
        $("#availablePorts option[value='"+data.portName+"']").attr("selected", "selected");
    });

    socket.on('portConnected', function(data){
        console.log("connected port " + data.portName + " at " + data.baudRate);
        $("#statusMsg").html("connected port " + data.portName + " at " + data.baudRate);
        $("#statusMsg").addClass("success");
        $("#statusMsg").removeClass("warn");
    });

    socket.on('portDisconnected', function(data){
        console.log("disconnected port " + data.portName + " at " + data.baudRate);
        $("#statusMsg").html("disconnected port " + data.portName + " at " + data.baudRate);
        $("#statusMsg").removeClass("success");
        $("#statusMsg").addClass("warn");
    });

    socket.on("errorMsg", function(data){
        console.warn(data);
    });

    socket.on("error", function(error){
        console.warn(error);
    });

    socket.on("connect_error", function(){
        console.log("connect error");
        $("#statusMsg").html("connect error");
        $("#statusMsg").removeClass("success");
        $("#statusMsg").addClass("warn");
    });

    socket.on("dataIn", function(data){//oncoming serial data
        serialMonitor.html(serialMonitor.html()+data + '\n');
        console.log(serialMonitor.html())
        if ($("#autoscroll").is(':checked')) {
            serialMonitor[0].scrollTop = serialMonitor[0].scrollHeight;
        }
        if ($("#streamToPlot").is(':checked')) {
            var data = serialMonitor.html().split('\n');
            drawChart(parseData(data));
        }
    });

    function parseData(data) {
        var clean_data = [];
        for (var i=0; i < data.length; i++) {
            if (data[i][0] != $("#commentCharacter").val()) {
                var xy = data[i].split($("#delimeterCharacter").val()).map(Number);
                xy[0] *= 0.0001984375;
                clean_data.push(xy);
            }
        }
        return clean_data;
    }

    var saveData = (function () {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        return function (data, fileName) {
            var blob = new Blob([data], { type: 'text/csv;charset=utf-8;' }),
            url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        };
    }());

});
