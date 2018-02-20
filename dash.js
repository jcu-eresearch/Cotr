angular.module('CotrApp',['ngMaterial', 'ngMessages' ])
.config(function($mdThemingProvider) {
   $mdThemingProvider.theme('altTheme')
   .primaryPalette('grey',{
     'default': '900'})
   .accentPalette('grey',{
     'default': '500'})
     // .backgroundPalette('grey',{'default': '900'})
   .dark()
   $mdThemingProvider.theme('default')
   .primaryPalette('grey')
   .backgroundPalette('grey',{
      'default': '200'})
    .accentPalette('green');

  $mdThemingProvider.setDefaultTheme('defuault');
  $mdThemingProvider.alwaysWatchTheme(true);
})
.controller('AppCtrl', function ($scope, $timeout, $mdSidenav, $log, $timeout,$mdDialog) {
  var map;

  $scope.showAlert = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    // Modal dialogs should fully cover application
    // to prevent interaction outside of dialog
    $mdDialog.show(
      $mdDialog.alert()

        .clickOutsideToClose(true)
        .title('You are viewing the Classroom on the Reef Dashboard')
        .textContent('Orpheus Island Research Station')
        .ariaLabel('James Cook University')
        .ok('OK!')

    );
  };
  $scope.initDashMap=function() {

      map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -18.617, lng: 146.500},
          mapTypeId: 'hybrid',
          zoom:12,
          scrollwheel:  false
      });

      map.data.setStyle({
          strokeColor: '#66bb6a',
          fillColor: '#66bb6a',
          fillOpacity: 0.1,
          strokeWeight: 2
      });


      var marker1 = new google.maps.Marker({
          position: {lat: -18.617, lng: 146.500},
          map: map
      });

      var markers=[marker1];



      function definePopup(id, source1, source2) {
          var popupText = '<video id="my-video" class="video-js" controls preload="auto" width="640" height="264"\n' +
              '           data-setup="{}">\n' +
              '<source src="'+source1+'" type=\'video/mp4\'>\n' +
              '\n' +
              '<p class="vjs-no-js">\n' +
              'To view this video please enable JavaScript, and consider upgrading to a web browser that\n' +
              '<a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>\n' +
              '</p>\n' +
              '</video>';
          return popupText;
      }

      var infowindow = new google.maps.InfoWindow({
          content: definePopup('http://marfu-cam-fishtank.jcu.edu.au/mjpg/1/video.mjpg?camera=1')
      });

      marker1.addListener('click', function() {
          infowindow.open(map, marker1);
      });



  };

  $timeout(function(){$scope.initDashMap();});

})
.controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
  $scope.close = function () {
    $mdSidenav('left').close()
      .then(function () {
        $log.debug("close LEFT is done");
      });
  };
})
.controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
  $scope.close = function () {
    $mdSidenav('right').close()
      .then(function () {
        $log.debug("close RIGHT is done");
      });
  };
})

.controller('PlotlyCtrl', function ($scope, $timeout, $mdSidenav, $log) {
  $scope.temperature=[{
    x: [],
    y: [],
    name: 'Temperature',
    line: {
      color: "red"
    }
  }];

  $scope.layout = {
    yaxis:{
        title: 'Temperature (C)',
        color: "white",
      autorange: true
    },
    plot_bgcolor :'transparent',
    paper_bgcolor: '#424242'
  };

  //plotly stuff

  $scope.makeplot= function() {
    Plotly.d3.csv("data/sample.csv", function(data){ processData(data) } );

    function processData(allRows) {
     
      var x = [], y1 = [], y2= [];
      var y3 = [], y4 = [], y5= [], y6=[];
      for (var i=0; i<allRows.length; i++) {
        row = allRows[i];
        x.push( row['Timestamp UTC'] );
        y1.push( row['Temperature (C)'] );
        y2.push( row['Transmission'] );
        y3.push(row['direction (radians CCW from East)']);
      }

      var traces1 = [{
        x: x,
        y: y1,
        name: 'Temperature',
        line: {
          color: "#df5753"
        }
      }];

      var traces2 = [{
        x: x,
        y: y2,
        name: 'Transmission',
        line: {
          color: "#5481B0"
        }
      }];

      var traces3 = [{
        x: x,
        y: y3,
        name: 'Direction',
        line: {
          color: "#79D1CF"
        }
      }];

      var layout1 = {
        yaxis:{
            title: 'Temperature (C)',
            autorange: true//,
            //color: "white"
        },
        xaxis: {
          //color: "white"
        },
        legend: {
          x: 1.05,
          y: 1
        },
        //plot_bgcolor :'#424242',
        //paper_bgcolor: '#424242',
        margin: {
                    l: 100,
                    r: 50,
                    b: 50,
                    t: 0,
                    pad: 0
                }
      };
      var layout2 = {
        yaxis:{
            title: 'Transmission',
            autorange: true//,
            //color: "white"
        },
        xaxis: {
          //color: "white"
        },
        legend: {
          x: 1.05,
          y: 1
        },
        //plot_bgcolor :'#424242',
        //paper_bgcolor: '#424242',
        margin: {
                    l: 100,
                    r: 50,
                    b: 50,
                    t: 0,
                    pad: 0
                }
      };
      var layout3 = {
        yaxis:{
            title: 'Direction (Rad CCW from East)',
            autorange: true//,
            //color: "white"
        },
        xaxis: {
          //color: "white"
        },
        legend: {
          x: 1.05,
          y: 1
        },
        //plot_bgcolor :'#424242',
        //paper_bgcolor: '#424242',
        margin: {
                    l: 100,
                    r: 50,
                    b: 50,
                    t: 0,
                    pad: 0
                }
      };
      Plotly.newPlot("temperature", traces1,layout1, {displayModeBar: false});
      Plotly.newPlot("transmission", traces2,layout2, {displayModeBar: false});
      Plotly.newPlot("direction", traces3,layout3, {displayModeBar: false});


    }
  }

  var d3 = Plotly.d3;
  var temp = d3.select("div[id='temperature']");
  var temp = temp.node();
  var trans = d3.select("div[id='transmission']");
  var trans = trans.node();

  var dir = d3.select("div[id='direction']");
  var dir = dir.node();

  Plotly.Plots.resize(temp);
  Plotly.Plots.resize(trans);
  Plotly.Plots.resize(dir);

  window.onresize = function() {
    Plotly.Plots.resize(temp);
    Plotly.Plots.resize(trans);
    Plotly.Plots.resize(dir);
  }

  $scope.makeplot();

})


.directive('picSlider', function () {
    return {
        templateUrl: 'templates/slider.html',
        controller: function ($timeout){

            $timeout( function () {
                $(document).ready(function () {
                    $('.carousel.carousel-slider').carousel({fullWidth: true});
                });
            });

        }
    };
});