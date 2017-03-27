/**
 * Created by ghassaei on 10/26/16.
 */



$(function() {

    var socket = io.connect('http://localhost:8080');
    var serialMonitor = $("#serialMonitor");
    var stringBuffer1 = new Array(100);
    var serialInput = $("#serialInput");

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
        console.log(data);
        stringBuffer1.push(data);
        stringBuffer1.push("</br>");
        serialMonitor.html(stringBuffer1);
        if ($("#autoscroll").is(':checked')) {
            serialMonitor[0].scrollTop = serialMonitor[0].scrollHeight;
        }
    });

});
