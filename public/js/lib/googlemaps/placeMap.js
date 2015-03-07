var loadMap = function() 
            {
                var myOptions = {
                  center: new google.maps.LatLng(lat(), lon()),
                  zoom: zoom(),
                  mapTypeId: google.maps.MapTypeId.SATELLITE
                };
                var map = new google.maps.Map(document.getElementById("map"),
                    myOptions);
            };
            window.onload= loadMap;