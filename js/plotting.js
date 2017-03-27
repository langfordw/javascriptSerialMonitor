google.charts.load('current', {'packages':['corechart']});
// google.charts.setOnLoadCallback(drawChart);

function drawChart(data) {
  var data = google.visualization.arrayToDataTable(data);

  var options = {
    title: 'Load/Displacement'
  };

  var chart = new google.visualization.LineChart(document.getElementById('chart'));

  chart.draw(data, options);
}

