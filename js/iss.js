var map = L.map('map').setView([0,0], 4);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    accessToken: 'pk.eyJ1IjoiZnJhbmt3YWxkYWwiLCJhIjoiY2szb3NuaHRwMDBhZTNjb2FhbnB3cnJpZiJ9.rt9uvKHuyBFSFUoDqmGbXA'
}).addTo(map);

var mapIcon = L.icon({
    iconUrl: 'img/issIcon.svg',
    iconSize: [80, 34],
    iconAnchor: [40, 3],
    shadowUrl: 'img/issIconShadow.png',
    shadowSize: [80, 34],
    shadowAnchor: [35, -2]
});

var marker = L.marker([0, 0], {icon: mapIcon}).addTo(map);

function issPosition() {
    fetch('https://cors-anywhere.herokuapp.com/http://api.open-notify.org/iss-now.json')
        .then(resolve => {
            resolve.json().then(respond => {
                map.setView([respond.iss_position.latitude, respond.iss_position.longitude], 3);
                marker.setLatLng([respond.iss_position.latitude, respond.iss_position.longitude]);
                marker.bindPopup(`The current possition of the ISS.<br> Lat: ${respond.iss_position.latitude}, Lon: ${respond.iss_position.longitude}`).openPopup();
            })
        })
        .catch(err => {console.log(err)})
}

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
            .catch(err => {console.log(err)})
    });
}

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
        .catch(err => {console.log(err)})
}

issPosition();

issPassing();

issCrew();

document.querySelector('#refresh').addEventListener('click', issPosition);


// Fetch urls

// https://cors-anywhere.herokuapp.com/http://api.open-notify.org/
// https://frankwaldal-eval-test.apigee.net/open-notify/
