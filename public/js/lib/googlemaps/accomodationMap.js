var map = null
var directionsDisplay = null
var loadMap = function() 
            {
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
                
                var accomodationMarker = new google.maps.Marker({
                    position: new google.maps.LatLng(accomodationData.accomodationLat,accomodationData.accomodationLon),
                    map: map,
                    title: accomodationData.accomodationTitle
                });
                
                google.maps.event.addListener(accomodationMarker, 'click', function() {
                    infowindow.open(map,accomodationMarker);
                });
                
                var circle = 'https://maps.gstatic.com/intl/en_ALL/mapfiles/markers2/measle.png';
                
                var infowindow2 = new google.maps.InfoWindow({});
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
            
            function getRouteDistance(route){
                return route.legs[0].distance.text
            }
            
            function getRouteTime(route){
                return route.legs[0].duration.text
            }
