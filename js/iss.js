// Initiating map, centered at coords 0,0 with zoomlevel 4
var map = L.map('map').setView([0,0], 4);

// Adds map-graphics using mapbox
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/navigation-preview-night-v4',
    accessToken: 'pk.eyJ1IjoiZnJhbmt3YWxkYWwiLCJhIjoiY2szb3NuaHRwMDBhZTNjb2FhbnB3cnJpZiJ9.rt9uvKHuyBFSFUoDqmGbXA'
}).addTo(map);

// Adds icon-marker to map
var mapIcon = L.icon({
    iconUrl: 'img/issIcon.svg',
    iconSize: [80, 34],
    iconAnchor: [40, 3],
    shadowUrl: 'img/issIconShadow.png',
    shadowSize: [80, 34],
    shadowAnchor: [35, -2]
});

var marker = L.marker([0, 0], {icon: mapIcon}).addTo(map);

// Function to add marker of ISS' location and center the map at current location
function issPosition() {
    fetch('https://cors-anywhere.herokuapp.com/http://api.open-notify.org/iss-now.json')
        .then(resolve => {
            resolve.json().then(respond => {
                map.setView([respond.iss_position.latitude, respond.iss_position.longitude], 4);
                marker.setLatLng([respond.iss_position.latitude, respond.iss_position.longitude]);
                marker.bindPopup(`The current possition of the ISS.<br> Lat: ${respond.iss_position.latitude}, Lon: ${respond.iss_position.longitude}`).openPopup();
            })
        })
        .catch(err => {
            document.querySelector('#mapError').innerHTML = `We couldn't retrieve the current location of the ISS.<br>Error: ${err}`;
        })
}

// Function to show next times ISS passes at coords retrieved from browsers geolocation-API
function issPassing() {
    navigator.geolocation.getCurrentPosition(location => {
        var url = `https://cors-anywhere.herokuapp.com/http://api.open-notify.org/iss-pass.json?lat=${location.coords.latitude}&lon=${location.coords.longitude}`;
        fetch(url)
            .then(resolve => {
                resolve.json().then(respond => {
                    var passings = '';
                    if (respond.response.length === 0) {
                        document.querySelector('#passingHeading').innerHTML = 'No passing in the near future at your location.';
                    } else {
                        for (i=0;i<respond.response.length;i++) {
                            var date = new Date(respond.response[i].risetime*1000);
                            passings += `<li>${date.toLocaleString('en-GB')}</li>`;
                        }
                        document.querySelector('#passing').innerHTML = passings;
                    }
                })
            })
            .catch(err => {
                document.querySelector('#passingHeading').innerHTML = `We couldn't retrieve the next passings at your location.<br>Error: ${err}`;
            })
    });
}

// Function to check which persons are in space and specifically at the ISS
function issCrew() {
    fetch('https://cors-anywhere.herokuapp.com/http://api.open-notify.org/astros.json')
        .then(resolve => {
            resolve.json().then(respond => {
                var crew = '';
                for (i=0;i<respond.people.length;i++) {
                    if (respond.people[i].craft === 'ISS') {
                        crew += `<li>${respond.people[i].name}</li>`
                    }
                }
                document.querySelector('#crew').innerHTML = crew;
            })
        })
        .catch(err => {
            document.querySelector('#crewHeading').innerHTML = `We couldn't retrieve current crew at ISS.<br>Error: ${err}`;
        })
}

issPosition();

issPassing();

issCrew();

document.querySelector('#refresh').addEventListener('click', issPosition);
