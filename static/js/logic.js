// Store our API endpoint as queryUrl.
const URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
const RADIUS_COEFFICIENT = 3;
const RADIUS_MIN = 5;
const COLOR_DEPTHS = [10, 30, 50, 70, 90];
const COLOR_COLORS = ["#f2c438", "#f2a533", "#007b63", "#11464a", "#191c2d"];

// Perform a GET request to the query URL/
d3.json(URL).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  console.log(data.features);

  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><hr><p>Magnitude: ${feature.properties.mag}</p><hr><p>Depth: ${feature.geometry.coordinates[2]}`);
  }    
  
    function pointToLayer(feature, latlng){
      return L.circleMarker(latlng);
    }

    function styleFeature(feature){
      function getRadius(feature){
        let magnitude = feature.properties.mag;
        let radius = Math.max(
          magnitude * RADIUS_COEFFICIENT, 
          RADIUS_MIN);
        // console.log(radius);
        return radius;
      }

      function getColor(feature){
        let depth = feature.geometry.coordinates[2];
        console.log(depth);
        if (depth < COLOR_DEPTHS[0]) {
          var color = COLOR_COLORS[0];
        } else if (depth < COLOR_DEPTHS[1]){
          var color = COLOR_COLORS[1];
        } else if (depth < COLOR_DEPTHS[2]){
          var color = COLOR_COLORS[2];
        } else if (depth < COLOR_DEPTHS[3]){
          var color = COLOR_COLORS[3]; 
        } else if (depth < COLOR_DEPTHS[4]){
          var color = COLOR_COLORS[4];       
        } else {
          var color = COLOR_COLORS[5];
        }
        return color;
      }

      let style = {
        opacity: 1,    // border
        color: "#000000",    // border
        fillOpacity: 0.5,    
        fillColor: getColor(feature),
        radius: getRadius(feature)
      };
      return style;
    }

    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: pointToLayer,
        style: styleFeature
    });
    
    createMap(earthquakes);
}

// createMap() takes the earthquake data and incorporates it into the visualization:

function createMap(earthquakes) {
    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  

  
    // Create a baseMaps object.
    let baseMaps = {
      "Street Map": street,
    };
  
    // Create an overlays object.
    let overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create a new map.
    // Edit the code to add the earthquake data to the layers.
    let myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [street, earthquakes]
    });
}
    // Create a layer control that contains our baseMaps.
    // Be sure to add an overlay Layer that contains the earthquake GeoJSON.
    // L.control.layers(baseMaps, overlayMaps, {
    //   collapsed: false
    // }).addTo(myMap);

  
 // Set up the legend.
 let legend = L.control({ position: "bottomright" });
 legend.onAdd = function() {
   let div = L.DomUtil.create("div", "info legend");
   
  //  let depth = feature.geometry.coordinates[2];

   // Add the minimum and maximum.
   let legendInfo = "<h1>Earthquake</h1>" +
     "<div class=\"labels\">" +
       "<div class=\"min\">" + limits[0] + "</div>" +
       "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
     "</div>";

   div.innerHTML = legendInfo;

   limits.forEach(function(limit, index) {
     labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
   });
   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
   return div;
 };

 // Adding the legend to the map
 legend.addTo(myMap);


