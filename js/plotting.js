// google.charts.load('current', {'packages':['line']});
// // google.charts.load('current', {'packages':['corechart']});

// function drawChart(data) {
//   var data = google.visualization.arrayToDataTable(data);

//   var options = {
//     // title: 'Load/Displacement',
//     legend: {position: 'none'},
//     vAxis: { title: 'Load (mN)' },
//     hAxis: { title: 'Displacement (mm)' }
//   };

//   var chart = new google.charts.Line(document.getElementById('chart'));
//   // var chart = new google.visualization.LineChart(document.getElementById('chart'));

//   // chart.draw(data, options);
//   chart.draw(data, google.charts.Line.convertOptions(options));
// }

var chart_initialized = false;

function getCol(matrix, col){
   var column = [];
   for(var i=0; i<matrix.length; i++){
      column.push(matrix[i][col]);
   }
   return column;
}

function addDataToChart(data) {
  
  if (!chart_initialized) {
    drawChart(clean_data);
    chart_initialized = true;
  } else {
    console.log(data)
    var xdata = data[0]
    var ydata = [];
    var indices = [];
    for (var i=1; i < data.length; i++) {
      ydata.push(data[i]);
      indices.push(i-1);
    }
    Plotly.extendTraces('chart', {x: [[xdata]], y: [ydata]}, indices);
  }
  
}


function drawChart(data) {

  // data: [[x1,y1],[x2,y2],...]
  // console.log(data)
  var traces = [];

  for (var i = 1; i < data[0].length; i++) {
    var trace = {
      x: getCol(data,0), 
      y: getCol(data,i), 
      type: 'lines',
      showlegend: false
    };
    traces.push(trace);
  }

  console.log(traces)

  var xAxisTemplate = {
    showgrid: true,
    zeroline: true,
    nticks: 20,
    showline: false,
    title: 'Displacement (mm)',
    mirror: 'all'
  }

  var yAxisTemplate = {
    showgrid: true,
    zeroline: true,
    nticks: 20,
    showline: false,
    title: 'Load (mN)',
    mirror: 'all'
  }

  var layout = {xaxis: xAxisTemplate, yaxis: yAxisTemplate}
  // var traces = [trace];
  var fig = {data: traces, layout: layout};
  Plotly.newPlot('chart', fig);
}