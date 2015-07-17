var map = null
var directionsDisplay = null
var placesMarkers={}
var accomodationMarker = null
var infowindow2 = null
function loadMap() {
    var accomodationData = getAccomodationData()
    var placesData = JSON.parse(getPlacesData())

    var myOptions = {
      center: new google.maps.LatLng(lat(), lon()),
      zoom: zoom(),
      mapTypeId: google.maps.MapTypeId.SATELLITE
    };
    
    map = new google.maps.Map(document.getElementById("map"),
        myOptions);
    
    var infowindow = new google.maps.InfoWindow({
        content: accomodationData.accomodationTitle
    });
    
        accomodationMarker = new google.maps.Marker({
        position: new google.maps.LatLng(accomodationData.accomodationLat,accomodationData.accomodationLon),
        map: map,
        title: accomodationData.accomodationTitle
    });
    
    google.maps.event.addListener(accomodationMarker, 'click', function() {
        infowindow.open(map,accomodationMarker);
    });
    
    var circle = 'https://maps.gstatic.com/intl/en_ALL/mapfiles/markers2/measle.png';
    
    infowindow2 = new google.maps.InfoWindow({});
    
    placesMarkers['all'] = {}
    placesData.forEach(function (result, i, results) {
        
        var placeMarker = new google.maps.Marker({
            position: new google.maps.LatLng(result.lat,result.lon),
            map: map,
            title: result.title,
            icon: circle
        });

        google.maps.event.addListener(placeMarker, 'click', function() {
            infowindow2.close()
            displayRoute(accomodationMarker.position,placeMarker.position,function(distance, duration){
                infowindow2.setContent("<a href='/places/place/" + result.slug + "'>" + result.title + "</a><p>" + distance + "</p><p>" + duration + "</p>")
            })
            infowindow2.open(map,placeMarker);
        });
        
        placesMarkers['all'][result.slug] = placeMarker;
        
    });
    
};

window.onload= loadMap;
    
function displayRoute(start,end,done) {

    if (! directionsDisplay) {
        directionsDisplay = new google.maps.DirectionsRenderer();// also, constructor can get "DirectionsRendererOptions" object
        directionsDisplay.setOptions({preserveViewport: true})
        directionsDisplay.setMap(map); // map should be already initialized.
    }
    
    var request = {
        origin : start,
        destination : end,
        travelMode : google.maps.TravelMode.DRIVING
    };
    var directionsService = new google.maps.DirectionsService(); 
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            var route = response.routes[0]
            done(getRouteDistance(route),getRouteTime(route))
        }
    });
}

function getRouteDistance(route) {
    return route.legs[0].distance.text
}

function getRouteTime(route) {
    return route.legs[0].duration.text
}

function toggleMarkers(cat,color){
    for (var i in placesMarkers['all']) {
        placesMarkers['all'][i].setMap(null)
    }
    if (!placesMarkers[cat]){
        placesMarkers[cat]={}
        var icon ={
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: color,
            fillOpacity: 1,
            scale: 3,
            strokeColor: LightenDarkenColor(color,-30),
            strokeWeight: 1
        };
        jQuery.getJSON( '/api/places/' + cat, function(data, textStatus, jqXHR){
            data.forEach(function (result, i, results) {
                var lat = placesMarkers['all'][result.slug].position.lat()
                var lon = placesMarkers['all'][result.slug].position.lng()
                var placeMarker = new google.maps.Marker({
                    position: new google.maps.LatLng(lat,lon),
                    map: map,
                    title: result.title,
                    icon: icon
                });
                
                google.maps.event.addListener(placeMarker, 'click', function() {
                    infowindow2.close()
                    displayRoute(accomodationMarker.position,placeMarker.position,function(distance, duration){
                        infowindow2.setContent("<a href='/places/place/" + result.slug + "'>" + result.title + "</a><p>" + distance + "</p><p>" + duration + "</p>")
                    })
                    infowindow2.open(map,placeMarker);
                });
                placesMarkers[cat][result.slug] = placeMarker;
            });
        });
    } else {
        for (var i in placesMarkers[cat]) {
            console.log($('#'+ cat +'Markers').hasClass("active"))
            if ($('#'+ cat +'Markers').hasClass("active")) {placesMarkers[cat][i].setMap(map)} else {placesMarkers[cat][i].setMap(null)}
            //if (placesMarkers[cat][i].getMap() != null) {placesMarkers[cat][i].setMap(null)} else {placesMarkers[cat][i].setMap(map)}
        }
    } 
}

function resetMarkers() {
    for (var i in placesMarkers) {
        for (var j in placesMarkers[i]) {
            placesMarkers[i][j].setMap(null)
        }
    }
    for (var i in placesMarkers['all']) {
        placesMarkers['all'][i].setMap(map)
    }
}

function LightenDarkenColor(col,amt) {
    var usePound = false;
    if ( col[0] == "#" ) {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col,16);

    var r = (num >> 16) + amt;

    if ( r > 255 ) r = 255;
    else if  (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if ( b > 255 ) b = 255;
    else if  (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if ( g > 255 ) g = 255;
    else if  ( g < 0 ) g = 0;

    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
}