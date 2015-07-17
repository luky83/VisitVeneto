var map = null
var directionsDisplay = null
var loadMap = function() 
            {
                var placesData = JSON.parse(getPlacesData())

                var myLocationMarker = null
                var myLocationAccuracyMarker = null
                var myLocation = null
                if(navigator.geolocation) {
                    
                    navigator.geolocation.watchPosition(function(position) {
                        if (!myLocationMarker) {
                            myLocationMarker = new google.maps.Marker({
                                position: new google.maps.LatLng(position.coords.latitude,position.coords.longitude),
                                icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',new google.maps.Size(22,22),new google.maps.Point(0,18),new google.maps.Point(11,11)),
                                map: map,
                                title: 'You are here!'
                            });
                            myLocationAccuracyMarker = new google.maps.Circle({
                                center: new google.maps.LatLng(position.coords.latitude,position.coords.longitude),
                                radius: position.coords.accuracy,
                                map: map,
                                fillColor: '#1589FF',
                                fillOpacity: 0.2,
                                strokeOpacity: 0.0
                            });
                        } else {
                            myLocationMarker.setPosition ( new google.maps.LatLng(position.coords.latitude,position.coords.longitude));
                            myLocationAccuracyMarker.setCenter ( new google.maps.LatLng(position.coords.latitude,position.coords.longitude));
                            myLocationAccuracyMarker.setRadius ( position.coords.accuracy );
                        }
                    });
                }
                var myOptions = {
                  center: new google.maps.LatLng(lat(), lon()),
                  zoom: zoom(),
                  mapTypeId: google.maps.MapTypeId.SATELLITE
                };
                map = new google.maps.Map(document.getElementById("map"),
                    myOptions);
                    
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
                        displayRoute(myLocationMarker.position,placeMarker.position,function(distance, duration){
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
