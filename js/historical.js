function historicalPopulate() {
    fetch('https://api.spacexdata.com/v3/history')
        .then(resolve => {
            resolve.json().then(respond => {
                console.log(respond);
                var content = '';
                for (i=0;i<respond.length;i++) {
                    var eventDate = new Date(respond[i].event_date_utc);
                    var flight = '';
                    if (respond[i].flight_number !== null) {
                        flight = `<p>Flight: <i class="flight${numeral(respond[i].flight_number).format('000')} flightsRight">${respond[i].flight_number}</i></p>`;
                    }
                    var links = '';
                    if (respond[i].id === 6) {
                        links += `<p><a href="iss.htm" target="_blank">More information about the International Space Station</a></p>`;
                    }
                    if (respond[i].links.reddit !== null) {
                        links += `<p><a href="${respond[i].links.reddit}" target="_blank">Reddit thread</a></p>`;
                    }
                    if (respond[i].links.article !== null) {
                        links += `<p><a href="${respond[i].links.article}" target="_blank">Article</a></p>`;
                    }
                    if (respond[i].links.wikipedia !== null) {
                        links += `<p><a href="${respond[i].links.wikipedia}" target="_blank">Wikipedia</a></p>`;
                    }
                    content += `<div class="detailContainer">
                        <h3>${respond[i].title}</h3>
                        <div class="openInfo">
                            <span class="vertSpan"></span>
                            <span class="horiSpan"></span>
                        </div>
                        <div class="hidden">
                            <p class="historicalDate">${eventDate.toString().substring(4,15)}</p>
                            <p>${respond[i].details}</p>
                            <br>
                            ${flight}
                            ${links}
                        </div>
                    </div>`;
                }
                document.querySelector('#historicalContainer').innerHTML = content;
                document.querySelectorAll('.openInfo').forEach(item => {
                    item.addEventListener('click', expandInfo);
                });
                document.querySelectorAll('.flightsRight').forEach(item => {
                    item.addEventListener('click', rightExpandEvent);
                });
            })
        })
        .catch(err => {
            document.querySelector('#historicalContainer').innerHTML = `<p>Sorry, we couldn't retrieve historical events now.</p>
                <p>Error: ${err}</p>`;
        })
}
