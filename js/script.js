var map;
var yoobee = {
    lat: -41.279178,
    lng: 174.780331
}
var newMarker;
var clickMarkerLocation;
var radioOptions = document.getElementsByName("mode");

function initMap() {

    for (var i = 0; i < radioOptions.length; i++) {
        radioOptions[i].addEventListener('change', function(){
            var transportMode = getTransportMode();
            if(clickMarkerLocation){
                showDirections(clickMarkerLocation, transportMode);
            }
        });
    }

    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();

    map = new google.maps.Map(document.getElementById('map'), {
        center: yoobee,
        zoom: 15
    });

    var marker = new google.maps.Marker({
        position: yoobee,
        map: map
    });

    map.addListener('click', function(event) {
        var transportMode = getTransportMode();
        clickMarkerLocation = event.latLng;

        showDirections(clickMarkerLocation, transportMode);
    });

    function showDirections(destinationLocation, transportMode){
        if(directionsDisplay){
            directionsDisplay.setMap(null);
        }

        var request = {
            origin: yoobee,
            destination: destinationLocation,
            travelMode: transportMode
        };
        directionsService.route(request, function(result, status) {
            if (status == 'OK') {
                directionsDisplay.setMap(map);
                directionsDisplay.setDirections(result);
                document.getElementById('time').innerText = 'Time to get to destination is '+ result.routes[0].legs[0].duration.text;
                document.getElementById('distance').innerText = 'Total distance to destination is '+result.routes[0].legs[0].distance.text;
                addMarker();
            } else if(status == 'NOT_FOUND'){
                document.getElementById('time').innerText = '';
                document.getElementById('distance').innerText = '';
                removeMarker();
                alert("At least one of the locations specified in the request's origin, destination could not be geocoded.")
            } else if(status == 'ZERO_RESULTS'){
                document.getElementById('time').innerText = '';
                document.getElementById('distance').innerText = '';
                removeMarker();
                alert("No route could be found between the origin and destination.");
            }
        });
    }
}

function getTransportMode(){
    if (radioOptions) {
        for (var i = 0; i < radioOptions.length; i++) {
            if (radioOptions[i].checked){
                 return radioOptions[i].value;
            }
        }
    }
}

function addMarker(){
    removeMarker();

    newMarker = new google.maps.Marker({
        position: clickMarkerLocation,
        map: map
    });
}

function removeMarker(){
    if(newMarker && newMarker.setMap){
        newMarker.setMap(null);
    }
}
