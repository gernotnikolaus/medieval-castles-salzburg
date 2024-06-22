// Filename: main.js
// Author: Gernot Nikolaus, June 2024
// Description: This file contains the main JavaScript code for the Medieval Castles map project.
// Credits: Gernot Nikolaus

// Create Leaflet map instance
var map = L.map('map', {
	center: [48, 13.05],            // Initial center coordinates (latitude, longitude)
	zoom: 10,                       // Initial zoom level
    minZoom: 8,                     // Minimum allowed zoom level
    maxZoom: 10,                    // Maximum allowed zoom level
    maxBoundsViscosity: 1.0,        // Stick to map bounds when user pans
    zoomControl: false              // Disable default zoom control
});

///////////////////
/////Castle//////
/////////////////

// Define custom icons for the castles and castle ruins
var castleIcon = L.icon({
    iconUrl: 'css/images/castles.png',     // Path to castle icon
    iconSize: [64, 64],                     // Size of the icon
    iconAnchor: [32, 32],                   // Anchor point of the icon
    popupAnchor: [0, -38]                   // Popup offset relative to the icon anchor
});

var castleIconRuins = L.icon({
    iconUrl: 'css/images/castles_ruin.png',// Path to castle ruins icon
    iconSize: [64, 64],                     // Size of the icon
    iconAnchor: [32, 32],                   // Anchor point of the icon
    popupAnchor: [0, -38]                   // Popup offset relative to the icon anchor
});

var century = 13;   // Default century selection

// Function to update castle markers based on selected century range
function updateCastlesByCenturyRange(startCentury, endCentury) {
    var filteredCastles = {
        type: "FeatureCollection",
        features: castlesGeoJSON.features.filter(function (feature) {
            if(startCentury == 21) { //if century is 21 it shows all ruins
                return feature.properties.century >= 0 && feature.properties.century <= 20;
            } else {
                return feature.properties.century >= startCentury && feature.properties.century <= endCentury;
            }
        })
    };

    // Clear existing castle markers
    castlesLayer.clearLayers();

    // Add filtered castles to the map
    L.geoJSON(filteredCastles, {
        pointToLayer: function (feature, latlng) {
            //checks century if all casltes are shown, if ruins switch to ruin symbole
            if(feature.properties.ruins == "yes" && century == 21) {
                return L.marker(latlng, { icon: castleIconRuins });
            } else {
                return L.marker(latlng, { icon: castleIcon });
            }
        },
        onEachFeature: function (feature, layer) {
            // Create popup content for each castle marker
            // get backround image and set the text variables
            var popupContent = `    
                <div class="popup-container" style="background-image: url('css/images/popup.png');">
                    <div class="popup-content">
                        <h3>${feature.properties.name}</h3>
                        <p>Century: ${feature.properties.century}</p>
                        <p>Ruins: ${feature.properties.ruins}</p>
                    </div>
                </div>
            `;
            layer.bindPopup(popupContent, { className: 'custom-popup' });
        }
    }).addTo(castlesLayer);
}

var castlesLayer = L.layerGroup().addTo(map);   // Layer group for castle markers

// Event listeners for each century button
document.getElementById('btn9').addEventListener('click', function() {
    century = 9; //set value and run function
    updateCastlesByCenturyRange(century, century);
});
document.getElementById('btn11').addEventListener('click', function() {
    century = 11;
    updateCastlesByCenturyRange(century, century);
});
document.getElementById('btn12').addEventListener('click', function() {
    century = 12;
    updateCastlesByCenturyRange(century, century);
});
document.getElementById('btn13').addEventListener('click', function() {
    century = 13;
    updateCastlesByCenturyRange(century, century);
});
document.getElementById('btn14').addEventListener('click', function() {
    century = 14;
    updateCastlesByCenturyRange(century, century);
});
document.getElementById('btn15').addEventListener('click', function() {
    century = 15;
    updateCastlesByCenturyRange(century, century);
});
document.getElementById('btn16').addEventListener('click', function() {
    century = 16;
    updateCastlesByCenturyRange(century, century);
});
document.getElementById('btn21').addEventListener('click', function() {
    century = 21;
    updateCastlesByCenturyRange(century, century);
});

// Initial call to visualize castles based on default century (21st century)
updateCastlesByCenturyRange(century, century);

///////////////////
/////Cities//////
/////////////////
// Define style and markers for city locations
var cityIcon = L.icon({
    iconUrl: 'css/images/cities.png',       // Path to city icon
    iconSize: [128, 128],                   // Size of the icon
    iconAnchor: [64, 64],                   // Anchor point of the icon
    popupAnchor: [0, -25]                   // Popup offset relative to the icon anchor
});

function addImage(latlng, imageUrl) {
    var imageIcon = L.icon({
        iconUrl: imageUrl,                  // URL of custom image
        iconSize: [100, 100],               // Size of the image
        iconAnchor: [150, 70],              // Anchor point of the image
        popupAnchor: [0, -100]              // Popup offset relative to the image anchor
    });
    return L.marker(latlng, { icon: imageIcon });
}

// Add city markers with names and custom images
var cities = L.geoJSON(citiesGeoJSON, {
    pointToLayer: function (feature, latlng) {
        // Add city icon
        L.marker(latlng, { icon: cityIcon }).addTo(map);
        // Add city name as text label
        var cityLabel = addImage(latlng, 'css/images/city-' + feature.properties.name + '.png'); //get the label image for the city 
        return cityLabel;
    }
}).addTo(map);

//////////////////
/////Mountains//////
/////////////////
// Define icon for mountain markers
var mountainsIcon = L.icon({
    iconUrl: 'css/images/mountains.png',     // Path to mountain icon
    iconSize: [32, 32],                     // Size of the icon
    iconAnchor: [16, 16],                   // Anchor point of the icon
    popupAnchor: [0, -25]                   // Popup offset relative to the icon anchor
});

// Add mountain markers to the map
var mountains = L.geoJSON(mountainsGEOJSON, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: mountainsIcon });
    }
}).addTo(map);

//////////////////
/////Roman Roads//////
/////////////////

// Style for Roman roads
var romanRoadsStyle = {
    color: "#91522d",       // Line color
    weight: 2,              // Line weight
    opacity: 0.45,          // Line opacity
    dashArray: '5, 10'      // Line dash pattern
};

// Add Roman roads GeoJSON data with specified style
var roads = L.geoJSON(romanRoadsGeoJSON, {
    style: romanRoadsStyle,
}).addTo(map);

///////////////////
/////Water//////
/////////////////
// Style for water features
var waterStyle = {
    color: "#89A7A7",      // Outline color
    weight: 2,              // Outline weight
    opacity: 1,             // Outline opacity
    fill: true,             // Fill shape
    fillColor: "#89A7A7",   // Fill color
    fillOpacity: 1          // Fill opacity
};

//for optimizing, small areas are not shown
// Filter water GeoJSON data based on area using Turf.js
const minArea = 100000;    // Minimum area in square meters (e.g., 1 sq km)
const filteredWaterFeatures = waterGeoJSON.features.filter(feature => {
    if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
        const area = turf.area(feature);
        return area > minArea;
    }
    return true;    // Keep non-polygon features
});

// Create a new GeoJSON object with filtered water features
const filteredWaterGeoJSON = {
    type: "FeatureCollection",
    features: filteredWaterFeatures
};

// Add filtered water GeoJSON data to the map
var water = L.geoJSON(filteredWaterGeoJSON, {
    style: waterStyle
}).addTo(map);

//////////////////
/////Trees//////
/////////////////
// Define icon for tree markers
var treesIcon = L.icon({
    iconUrl: 'css/images/forests.png',      // Path to tree icon
    iconSize: [32, 32],                     // Size of the icon
    iconAnchor: [16, 16],                   // Anchor point of the icon
    popupAnchor: [0, -25]                   // Popup offset relative to the icon anchor
});

// Add tree markers to the map
var trees = L.geoJSON(treesGEOJSON, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: treesIcon });
    }
}).addTo(map);

///////////////////
/////Box////// (study area)
/////////////////
// Style for bounding box
var boxStyle = {
    color: "#e41a1c",       // Outline color
    weight: 2,              // Outline weight
    opacity: 0.7,           // Outline opacity
    fill: false,            // No fill
    dashArray: '5, 10'      // Dash pattern for outline
};

// Add bounding box GeoJSON data with specified style
var box = L.geoJSON(areaBoxGeoJSON, {
    style: boxStyle,
}).addTo(map);

// Adjust map bounds to fit within the bounding box
var boxBounds = box.getBounds();
map.setMaxBounds(boxBounds.pad(0.3));    // Add padding to bounding box
map.fitBounds(boxBounds);               // Fit map to bounding box