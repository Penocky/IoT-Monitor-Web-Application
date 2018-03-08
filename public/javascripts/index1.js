$(document).ready(function () {
  var timeData = [],

    airData = [];
  var data = {
    labels: timeData,
    datasets: [


      {
        fill: false,
        label: 'Airquality',
        yAxisID: 'Airquality',
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
        data: airData
      }
    ]
  }

  var basicOption = {
    title: {
      display: true,
      text: 'Times with Bad Air',
      fontSize: 36
    },
    scales: {
      yAxes: [

      {
          id: 'Airquality',
          type: 'linear',
          scaleLabel: {
            labelString: 'Air Quality',
            display: true
          },
          position: 'right'
       }
          ]
    }
  }

  //Get the context of the canvas element we want to select
  var ctx = document.getElementById("myChart1").getContext("2d");
  var optionsNoAnimation = { animation: false }
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: basicOption
  });

  var ws = new WebSocket('wss://' + location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }
  ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    try {
      var obj = JSON.parse(message.data);
      if(!obj.time || !obj.temperature) {
        return;
      }
      if (obj.airquality > 70) {
        airData.push(obj.airquality);
        timeData.push(obj.time);
      }

      // only keep no more than 50 points in the line chart
      const maxLen = 50;
      var len = timeData.length;
      if (len > maxLen) {
        timeData.shift();
        airData.shift();
      }

      if (airData.length > maxLen) {
        airData.shift();
      }

      myLineChart.update();
    } catch (err) {
      console.error(err);
    }
  }
});
