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

function getCol(matrix, col){
   var column = [];
   for(var i=0; i<matrix.length; i++){
      column.push(matrix[i][col]);
   }
   return column;
}


function drawChart(data) {

  // data: [[x1,y1],[x2,y2],...]
  console.log(data)

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
    title: 'Displacement',
    mirror: 'all'
  }

  var yAxisTemplate = {
    showgrid: true,
    zeroline: true,
    nticks: 20,
    showline: false,
    title: 'Load',
    mirror: 'all'
  }

  var layout = {xaxis: xAxisTemplate, yaxis: yAxisTemplate}
  // var traces = [trace];
  var fig = {data: traces, layout: layout};
  Plotly.newPlot('chart', fig);
}