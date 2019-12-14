function aboutSpaceX() {
    fetch('https://api.spacexdata.com/v3/info')
        .then(resolve => {
            resolve.json().then(respond => {
                document.querySelector('#summary').innerHTML = `<p>${respond.summary}</p>`;
                document.querySelector('#roles').innerHTML = `<h3>Key roles:</h3>
                    <p>Founder: <b>${respond.founder}</b> - <a href="https://en.wikipedia.org/wiki/${respond.founder.replace(/ /g, '_')}" target="_blank">Wikipedia</a></p>
                    <p>CEO: <b>${respond.ceo}</b> - <a href="https://en.wikipedia.org/wiki/${respond.ceo.replace(/ /g, '_')}" target="_blank">Wikipedia</a></p>
                    <p>CTO: <b>${respond.cto}</b> - <a href="https://en.wikipedia.org/wiki/${respond.cto.replace(/ /g, '_')}" target="_blank">Wikipedia</a></p>
                    <p>COO: <b>${respond.coo}</b> - <a href="https://en.wikipedia.org/wiki/${respond.coo.replace(/ /g, '_')}" target="_blank">Wikipedia</a></p>
                    <p>CTO Propulsion: <b>${respond.cto_propulsion}</b> - <a href="https://en.wikipedia.org/wiki/${respond.cto_propulsion.replace(/ /g, '_')}" target="_blank">Wikipedia</a></p>`;
                document.querySelector('#figures').innerHTML = `<h3>Key figures:</h3>
                    <p>Employees: ${respond.employees}</p>
                    <p>Company value: ${numeral(respond.valuation).format('($ 0.00a)')}</p>
                    <p>Launch sites: ${respond.launch_sites}</p>
                    <p>Test sites: ${respond.test_sites}</p>`;
                document.querySelector('#location').innerHTML = `<h3>Location:</h3>
                    <p>${respond.headquarters.address}<br>${respond.headquarters.city}, ${respond.headquarters.state}</p>`;
                var links = '<h3>Links:</h3>';
                for (var a in respond.links) {
                    if (respond.links.hasOwnProperty(a)) {
                        var urlName = a.split('_');
                        for (i=0;i<urlName.length;i++) {
                            urlName[i] = urlName[i].charAt(0).toUpperCase() + urlName[i].slice(1);
                        }
                        var linkName = urlName.join(' ');
                        links += `<p><a href="${respond.links[a]}" target="_blank">${linkName}</a></p>`;
                    }
                }
                document.querySelector('#links').innerHTML = links;
            })
        })
}

function historicalPopulate() {
    fetch('https://api.spacexdata.com/v3/history')
        .then(resolve => {
            resolve.json().then(respond => {
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
