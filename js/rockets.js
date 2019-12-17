// Function to create and add to DOM an overlay with an event on the left column
function leftExpandEvent() {
    var url = `https://api.spacexdata.com/v3/launches/${this.className.substring(6,9)}`;
    fetch(url)
        .then(resolve => {
            resolve.json().then(respond => {
                var launchTime = '';
                if (respond.last_ll_launch_date === null || respond.last_ll_launch_date === undefined) {
                    var launch = new Date(respond.launch_date_utc);
                    launchTime = `<p>Launchdate: ${launch.toString().substring(4,15)}</p>
                        <p>Launchtime: ${launch.toLocaleTimeString()}</p>`;
                } else {
                    if (respond.launch_date_utc<respond.last_ll_launch_date) {
                        var launch = new Date(respond.last_ll_launch_date);
                        launchTime = `<p>Launchdate: ${launch.toString().substring(4,15)}</p>
                            <p>Launchtime: ${launch.toLocaleTimeString()}</p>`;
                    } else {
                        var launch = new Date(respond.launch_date_utc);
                        launchTime = `<p>Launchdate: ${launch.toString().substring(4,15)}</p>
                            <p>Launchtime: ${launch.toLocaleTimeString()}</p>`;
                    }
                }
                var cores = '';
                for (j=0;j<respond.rocket.first_stage.cores.length;j++) {
                    cores += ` - ${respond.rocket.first_stage.cores[j].core_serial}`;
                }
                var customers = '';
                for (j=0;j<respond.rocket.second_stage.payloads[0].customers.length;j++) {
                    customers += ` - ${respond.rocket.second_stage.payloads[0].customers[j]}`;
                }
                var details = '';
                if (respond.details !== null) {
                    details = `<p>${respond.details}</p><br>`;
                }
                var orbit = '';
                if (respond.rocket.second_stage.payloads[0].orbit_params.regime === null || respond.rocket.second_stage.payloads[0].orbit_params.regime === undefined) {
                    if (respond.rocket.second_stage.payloads[0].orbit === 'ISS') {
                        orbit = `<a href="iss.htm">${respond.rocket.second_stage.payloads[0].orbit}</a>`;
                    } else {
                        orbit = `${respond.rocket.second_stage.payloads[0].orbit}`;
                    }
                } else {
                    if (respond.rocket.second_stage.payloads[0].orbit === 'ISS') {
                        orbit = `<a href="iss.htm">${respond.rocket.second_stage.payloads[0].orbit}</a> - ${respond.rocket.second_stage.payloads[0].orbit_params.regime}`
                    } else {
                        orbit = `${respond.rocket.second_stage.payloads[0].orbit} - ${respond.rocket.second_stage.payloads[0].orbit_params.regime}`
                    }

                }
                var success = '';
                if (respond.launch_success) {
                    success = '<p>Launch success: Yes</p>';
                } else {
                    success = `<p>Launch success: No</p>
                        <p>Failure reason: ${respond.launch_failure_details.reason}</p>`;
                }
                var links = '';
                if (respond.links.article_link !== null || respond.links.article_link !== undefined) {
                    links += `<p><a href="${respond.links.article_link}" target="_blank">Article</a></p>`
                }
                if (respond.links.wikipedia !== null || respond.links.wikipedia !== undefined) {
                    links += `<p><a href="${respond.links.wikipedia}" target="_blank">Wikipedia</a></p>`
                }
                if (respond.links.reddit_campaign !== null || respond.links.reddit_campaign !== undefined) {
                    links += `<p><a href="${respond.links.reddit_campaign}" target="_blank">Reddit Campaign thread</a></p>`
                }
                if (respond.links.reddit_launch !== null || respond.links.reddit_launch !== undefined) {
                    links += `<p><a href="${respond.links.reddit_launch}" target="_blank">Reddit Launch thread</a></p>`
                }
                var youtube = '';
                if (respond.links.youtube_id !== null || respond.links.youtube_id !== undefined) {
                    youtube = `<iframe width="100%" src="https://www.youtube.com/embed/${respond.links.youtube_id}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                }
                var content = `<img src="img/close.svg" id="close">
                    <h3>${respond.mission_name}</h3>
                    ${details}
                    ${launchTime}
                    <p>Launchsite: ${respond.launch_site.site_name_long}</p>
                    <br>
                    <p>Rocket: ${respond.rocket.rocket_name}</p>
                    <p>Core: ${cores.substring(3)}</p>
                    <p>Payload: ${respond.rocket.second_stage.payloads[0].payload_type}</p>
                    <p>Payload manufacturer: ${respond.rocket.second_stage.payloads[0].manufacturer}</p>
                    <p>Payload customer: ${customers.substring(3)}</p>
                    <p>Orbit: ${orbit}</p>
                    <br>
                    ${success}
                    <br>
                    ${links}
                    ${youtube}`;
                document.querySelector('#eventLeft').innerHTML = content;
                document.querySelector('#eventLeft').className = 'open scrollBox';
                document.querySelector('#close').addEventListener('click', e => {
                    e.preventDefault();
                    document.querySelector('#eventLeft').className = 'closed';
                    setTimeout(function(){
                        document.querySelector('#eventLeft').innerHTML = '';
                    },250);
                });
            })
        })
        .catch(err => {
            document.querySelector('#eventLeft').innerHTML = `<button id="close">X</button>
                <p>Couldn't retrieve information about launch.</p>
                <p>Error: ${err}</p>`
                document.querySelector('#eventLeft').className = 'open scrollBox';
                document.querySelector('#close').addEventListener('click', e => {
                    e.preventDefault();
                    document.querySelector('#eventLeft').className = 'closed';
                    setTimeout(function(){
                        document.querySelector('#eventLeft').innerHTML = '';
                    },250);
                });
        })
}

// Function to create and add to DOM an overlay with an event on the right column
function rightExpandEvent() {
    var url = `https://api.spacexdata.com/v3/launches/${this.className.substring(6,9)}`;
    fetch(url)
        .then(resolve => {
            resolve.json().then(respond => {
                var launchTime = '';
                if (respond.last_ll_launch_date === null || respond.last_ll_launch_date === undefined) {
                    var launch = new Date(respond.launch_date_utc);
                    launchTime = `<p>Launchdate: ${launch.toString().substring(4,15)}</p>
                        <p>Launchtime: ${launch.toLocaleTimeString()}</p>`;
                } else {
                    if (respond.launch_date_utc<respond.last_ll_launch_date) {
                        var launch = new Date(respond.last_ll_launch_date);
                        launchTime = `<p>Launchdate: ${launch.toString().substring(4,15)}</p>
                            <p>Launchtime: ${launch.toLocaleTimeString()}</p>`;
                    } else {
                        var launch = new Date(respond.launch_date_utc);
                        launchTime = `<p>Launchdate: ${launch.toString().substring(4,15)}</p>
                            <p>Launchtime: ${launch.toLocaleTimeString()}</p>`;
                    }
                }
                var cores = '';
                for (j=0;j<respond.rocket.first_stage.cores.length;j++) {
                    cores += ` - ${respond.rocket.first_stage.cores[j].core_serial}`;
                }
                var customers = '';
                for (j=0;j<respond.rocket.second_stage.payloads[0].customers.length;j++) {
                    customers += ` - ${respond.rocket.second_stage.payloads[0].customers[j]}`;
                }
                var details = '';
                if (respond.details !== null) {
                    details = `<p>${respond.details}</p><br>`;
                }
                var orbit = '';
                if (respond.rocket.second_stage.payloads[0].orbit_params.regime === null || respond.rocket.second_stage.payloads[0].orbit_params.regime === undefined) {
                    if (respond.rocket.second_stage.payloads[0].orbit === 'ISS') {
                        orbit = `<a href="iss.htm">${respond.rocket.second_stage.payloads[0].orbit}</a>`;
                    } else {
                        orbit = `${respond.rocket.second_stage.payloads[0].orbit}`;
                    }
                } else {
                    if (respond.rocket.second_stage.payloads[0].orbit === 'ISS') {
                        orbit = `<a href="iss.htm">${respond.rocket.second_stage.payloads[0].orbit}</a> - ${respond.rocket.second_stage.payloads[0].orbit_params.regime}`;
                    } else {
                        orbit = `${respond.rocket.second_stage.payloads[0].orbit} - ${respond.rocket.second_stage.payloads[0].orbit_params.regime}`;
                    }
                }
                var success = '';
                if (respond.launch_success) {
                    success = '<p>Launch success: Yes</p>';
                } else {
                    success = `<p>Launch success: No</p>
                        <p>Failure reason: ${respond.launch_failure_details.reason}</p>`;
                }
                var links = '';
                if (respond.links.article_link !== null || respond.links.article_link !== undefined) {
                    links += `<p><a href="${respond.links.article_link}" target="_blank">Article</a></p>`
                }
                if (respond.links.wikipedia !== null || respond.links.wikipedia !== undefined) {
                    links += `<p><a href="${respond.links.wikipedia}" target="_blank">Wikipedia</a></p>`
                }
                if (respond.links.reddit_campaign !== null || respond.links.reddit_campaign !== undefined) {
                    links += `<p><a href="${respond.links.reddit_campaign}" target="_blank">Reddit Campaign thread</a></p>`
                }
                if (respond.links.reddit_launch !== null || respond.links.reddit_launch !== undefined) {
                    links += `<p><a href="${respond.links.reddit_launch}" target="_blank">Reddit Launch thread</a></p>`
                }
                var youtube = '';
                if (respond.links.youtube_id !== null || respond.links.youtube_id !== undefined) {
                    youtube = `<iframe width="100%" src="https://www.youtube.com/embed/${respond.links.youtube_id}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                }
                var content = `<img src="img/close.svg" id="closeRight">
                    <h3>${respond.mission_name}</h3>
                    ${details}
                    ${launchTime}
                    <p>Launchsite: ${respond.launch_site.site_name_long}</p>
                    <br>
                    <p>Rocket: ${respond.rocket.rocket_name}</p>
                    <p>Core: ${cores.substring(3)}</p>
                    <p>Payload: ${respond.rocket.second_stage.payloads[0].payload_type}</p>
                    <p>Payload manufacturer: ${respond.rocket.second_stage.payloads[0].manufacturer}</p>
                    <p>Payload customer: ${customers.substring(3)}</p>
                    <p>Orbit: ${orbit}</p>
                    <br>
                    ${success}
                    <br>
                    ${links}
                    ${youtube}`;
                document.querySelector('#eventRight').innerHTML = content;
                document.querySelector('#eventRight').className = 'open scrollBox';
                document.querySelector('#closeRight').addEventListener('click', e => {
                    e.preventDefault();
                    document.querySelector('#eventRight').className = 'closed';
                    setTimeout(function(){
                        document.querySelector('#eventRight').innerHTML = '';
                    },250);
                });
            })
        })
        .catch(err => {
            document.querySelector('#eventRight').innerHTML = `<button id="closeRight">X</button>
                <p>Couldn't retrieve information about launch.</p>
                <p>Error: ${err}</p>`
                document.querySelector('#eventRight').className = 'open scrollBox';
                document.querySelector('#closeRight').addEventListener('click', e => {
                    e.preventDefault();
                    document.querySelector('#eventRight').className = 'closed';
                    setTimeout(function(){
                        document.querySelector('#eventRight').innerHTML = '';
                    },250);
                });
        })
}

// Function to fetch SpaceX capsules, populates containers in rokets.htm with these capsules
function capsulesPopulate() {
    // Removes eventlisteners to avoid adding doubles
    document.querySelectorAll('.openInfo').forEach(item => {
        item.removeEventListener('click', expandInfo);
    });
    fetch('https://api.spacexdata.com/v3/capsules?order=desc')
        .then(resolve => {
            resolve.json().then(respond => {
                var content = '';
                // Looping through returned array to create container for each capsule
                for (i=0;i<respond.length;i++) {
                    var launchTime = '';
                    if (respond[i].original_launch !== null) {
                        var launch = new Date(respond[i].original_launch);
                        launchTime = `<p>First launchdate: ${launch.toString().substring(4,15)}</p>
                            <p>First launchtime: ${launch.toLocaleTimeString()}</p>`;
                    }
                    var details = '';
                    if (respond[i].details !== null) {
                        details = `<p>${respond[i].details}</p><br>`;
                    }
                    var flights = '';
                    for (j=0;j<respond[i].missions.length;j++) {
                        var flightNumber = respond[i].missions[j].flight
                        flights += ` - <i class="flight${numeral(flightNumber).format('000')} flights">${respond[i].missions[j].name}</i>`;
                    }
                    content += `<div class="detailContainer">
                        <h3>${respond[i].type} - ${respond[i].capsule_serial}</h3>
                        <div class="openInfo">
                            <span class="vertSpan"></span>
                            <span class="horiSpan"></span>
                        </div>
                        <div class="hidden">
                            ${details}
                            ${launchTime}
                            <br>
                            <p>Flights: ${flights.substring(3)}</p>
                            <br>
                            <p>Landings: ${respond[i].landings}</p>
                            <p>Status: ${respond[i].status}</p>
                        </div>
                    </div>`;
                }
                // Adding the capsule containers to the DOM, and adding eventlisteners
                document.querySelector('#capsulesContainer').innerHTML = content;
                document.querySelectorAll('.flights').forEach(item => {
                    item.addEventListener('click', leftExpandEvent);
                });
                document.querySelectorAll('.openInfo').forEach(item => {
                    item.addEventListener('click', expandInfo);
                });
            })
        })
        // Error handling
        .catch(err => {
            document.querySelector('#capsulesContainer').innerHTML = `<p>Sorry, we couldn't retrieve capsules now.</p>
                <p>Error: ${err}</p>`;
        })
}

// Function to fetch SpaceX cores, populates containers in rokets.htm with these cores
function coresPopulate() {
    // Removes eventlisteners to avoid adding doubles
    document.querySelectorAll('.openInfo').forEach(item => {
        item.removeEventListener('click', expandInfo);
    });
    fetch('https://api.spacexdata.com/v3/cores?order=desc')
        .then(resolve => {
            resolve.json().then(respond => {
                var content = '';
                // Looping through returned array to create container for each core
                for (i=0;i<respond.length;i++) {
                    var launchTime = '';
                    if (respond[i].original_launch !== null) {
                        var launch = new Date(respond[i].original_launch);
                        launchTime = `<p>First launchdate: ${launch.toString().substring(4,15)}</p>
                            <p>First launchtime: ${launch.toLocaleTimeString()}</p>`;
                    }
                    var details = '';
                    if (respond[i].details !== null) {
                        details = `<p>${respond[i].details}</p><br>`;
                    }
                    var flights = '';
                    for (j=0;j<respond[i].missions.length;j++) {
                        var flightNumber = respond[i].missions[j].flight
                        flights += ` - <i class="flight${numeral(flightNumber).format('000')} flightsRight">${respond[i].missions[j].name}</i>`;
                    }
                    var reuseLanding = '';
                    if (respond[i].reuse_count === 0) {
                        reuseLanding += '<p>Reuse: No</p>';
                    } else {
                        reuseLanding += `<p>Reuse: ${respond[i].reuse_count}</p>`;
                    }
                    var landingAttempts = respond[i].rtls_attempts + respond[i].asds_attempts;
                    if (landingAttempts !== 0) {
                        reuseLanding += `<p>Landing attempts: ${landingAttempts}</p>`;
                    }
                    if (respond[i].rtls_landings === 0) {
                        if (respond[i].asds_landings !== 0) {
                            reuseLanding += `<p>Autonomous spaceport drone ship landings: ${respond[i].asds_landings}</p>`;
                        }
                    } else {
                        reuseLanding += `<p>Return to launch site landings: ${respond[i].rtls_landings}</p>`;
                        if (respond[i].asds_landings !== 0) {
                            reuseLanding += `<p>Autonomous spaceport drone ship landings: ${respond[i].asds_landings}</p>`;
                        }
                    }
                    content += `<div class="detailContainer">
                        <h3>${respond[i].core_serial}</h3>
                        <div class="openInfo">
                            <span class="vertSpan"></span>
                            <span class="horiSpan"></span>
                        </div>
                        <div class="hidden">
                            ${details}
                            ${launchTime}
                            <br>
                            <p>Flights: ${flights.substring(3)}</p>
                            <br>
                            ${reuseLanding}
                            <p>Status: ${respond[i].status}</p>
                        </div>
                    </div>`;
                }
                // Adding the core containers to the DOM, and adding eventlisteners
                document.querySelector('#coresContainer').innerHTML = content;
                document.querySelectorAll('.flightsRight').forEach(item => {
                    item.addEventListener('click', rightExpandEvent);
                });
                document.querySelectorAll('.openInfo').forEach(item => {
                    item.addEventListener('click', expandInfo);
                });
            })
        })
        // Error handling
        .catch(err => {
            document.querySelector('#coresContainer').innerHTML = `<p>Sorry, we couldn't retrieve capsules now.</p>
                <p>Error: ${err}</p>`;
            document.querySelectorAll('.openInfo').forEach(item => {
                item.addEventListener('click', expandInfo);
            });
        })
}
