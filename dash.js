
var createMarker= function(text, content, position, map, markerArray){

    var contentString = '<div class="popup-content">'+
        '<div class="popup-img "><img  src="'+content+'" alt="Sensor Platform" width="100%" ></div>'+
        '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    var marker = new google.maps.Marker({
        position: position,
        map: map,
        label: {
            text: text,
            color: "white"
        },
        title: text,
        icon: {
            labelOrigin: new google.maps.Point(18, 42),
            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            size: new google.maps.Size(25, 40),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(11, 40),
        }
    });

    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });

    markerArray.push(marker);

};

var createNavMarker= function(text, content, position, map, markerArray){

    var contentString1 = '<div class="popup-content">'+
        '<div class="popup-img "><img  src="'+content+'" alt="Sensor Platform" width="100%" ></div>'+
        '</div>';

    var infowindow1 = new google.maps.InfoWindow({
        content: contentString1
    });


    var marker1 = new google.maps.Marker({
        position: position,
        map: map,
        title: text
    });

    var marker11 = new google.maps.Marker({
        position: position,
        map: map,
        label: {
            text: text,
            color: "white"
        },
        title: text,
        icon: {
            labelOrigin: new google.maps.Point(11, 50),
            url: ' ',
            size: new google.maps.Size(25, 40),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(11, 40),
        }
    });

    marker11.addListener('click', function() {
        infowindow1.open(map, marker11);
    });

    markerArray.push(marker11);
};

var initMap=function() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat:-18.612105, lng: 146.49343},
        mapTypeId: 'hybrid',
        zoom: 16,
        scrollwheel:  false
    });

    map.data.setStyle({
        strokeColor: '#66bb6a',
        fillColor: '#66bb6a',
        fillOpacity: 0.1,
        strokeWeight: 2
    });

    var markers=[];

    var navMarkers=[];

    createNavMarker("West Sensor Platform", "images/platform1.jpg", {lat: -18.61180718753694, lng: 146.4860380712551}, map, navMarkers);
    createNavMarker("East Sensor Platform", "images/platform2.jpg", {lat: -18.6123192163581, lng: 146.5002565912303}, map, navMarkers);

    createMarker("Mangroves", "images/mangroves.jpg",  {lat: -18.61213598839285, lng: 146.4889281705785}, map, markers);
    createMarker("Accomodation", "images/accomodation.jpg",  {lat: -18.61413911560015, lng: 146.4896363148613}, map, markers);
    createMarker("Labs", "images/laboratories.jpg", {lat: -18.61342522001228, lng: 146.4902400333704}, map, markers);

    map.addListener( 'zoom_changed', function() {
        var zoom = map.getZoom();

        // iterate over markers and call setVisible
        for (var i = 0; i < markers.length; i++) {
            markers[i].setVisible(zoom >= 15);
        }

        for (var i = 0; i < navMarkers.length; i++) {
            navMarkers[i].setVisible(zoom >= 14);
        }


    });


};



var makePlots =function(){
  var temperature=[{
    x: [],
    y: [],
    name: 'Temperature',
    line: {
      color: "red"
    }
  }];

  var layout = {
    yaxis:{
        title: 'Temperature (C)',
        color: "white",
      autorange: true
    },
    plot_bgcolor :'transparent',
    paper_bgcolor: '#424242'
  };


  makeplot= function() {
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
        title: 'Temperature',
        yaxis:{
            title: 'Temperature (C)',
            autorange: true
        },
        legend: {
          x: 1.05,
          y: 1
        },
        margin: {
                    l: 100,
                    r: 50,
                    b: 50,
                    pad: 0
                }
      };
      var layout2 = {
        title: 'Transmission',
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
        margin: {
                    l: 100,
                    r: 50,
                    b: 50,
                    pad: 0
                }
      };
      var layout3 = {
        title: 'Direction',
        yaxis:{
            title: 'Direction (Rad CCW from East)',
            autorange: true//,

        },
        legend: {
          x: 1.05,
          y: 1
        },
        margin: {
                    l: 100,
                    r: 50,
                    b: 50,
                    pad: 0
                }
      };
      Plotly.newPlot("temperature", traces1,layout1, {displayModeBar: false});
      Plotly.newPlot("transmission", traces2,layout2, {displayModeBar: false});
      Plotly.newPlot("direction", traces3,layout3, {displayModeBar: false});


    }
  };

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
  };

  makeplot();

};

makePlots();
