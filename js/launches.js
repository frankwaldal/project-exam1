// Function to create and add to DOM an overlay with an event from the calendar
function expandEvent() {
    var url = `https://api.spacexdata.com/v3/launches/${this.className.substring(67,70)}`;
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
                for (i=0;i<respond.rocket.first_stage.cores.length;i++) {
                    if (respond.rocket.first_stage.cores[i].core_serial === null || respond.rocket.first_stage.cores[i].core_serial === undefined) {
                        cores += '   No information yet.';
                    } else {
                        cores += ` - ${respond.rocket.first_stage.cores[i].core_serial}`;
                    }
                }
                var customers = '';
                for (i=0;i<respond.rocket.second_stage.payloads[0].customers.length;i++) {
                    customers += ` - ${respond.rocket.second_stage.payloads[0].customers[i]}`;
                }
                var details = '';
                if (respond.details !== null) {
                    details = `<p>${respond.details}</p><br><br>`;
                }
                var orbit = '';
                if (respond.rocket.second_stage.payloads[0].orbit_params.regime === null || respond.rocket.second_stage.payloads[0].orbit_params.regime === undefined) {
                    if (respond.rocket.second_stage.payloads[0].orbit === "ISS") {
                        orbit = `<a href="iss.htm">${respond.rocket.second_stage.payloads[0].orbit}</a>`;
                    } else {
                        orbit = `${respond.rocket.second_stage.payloads[0].orbit}`;
                    }
                } else {
                    if (respond.rocket.second_stage.payloads[0].orbit === "ISS") {
                        orbit = `<a href="iss.htm">${respond.rocket.second_stage.payloads[0].orbit}</a> - ${respond.rocket.second_stage.payloads[0].orbit_params.regime}`;
                    } else {
                        orbit = `${respond.rocket.second_stage.payloads[0].orbit} - ${respond.rocket.second_stage.payloads[0].orbit_params.regime}`;
                    }
                }
                var content = `<img src="img/close.svg" id="close">
                    <h3>${respond.mission_name}</h3>
                    ${details}
                    ${launchTime}
                    <p>Launchsite: ${respond.launch_site.site_name_long}</p>
                    <br>
                    <br>
                    <p>Rocket: ${respond.rocket.rocket_name}</p>
                    <p>Core: ${cores.substring(3)}</p>
                    <p>Payload: ${respond.rocket.second_stage.payloads[0].payload_type}</p>
                    <p>Payload manufacturer: ${respond.rocket.second_stage.payloads[0].manufacturer}</p>
                    <p>Payload customer: ${customers.substring(3)}</p>
                    <p>Orbit: ${orbit}</p>`;
                document.querySelector('#event').innerHTML = content;
                document.querySelector('#event').className = 'open scrollBox';
                document.querySelector('#close').addEventListener('click', e => {
                    e.preventDefault();
                    document.querySelector('#event').className = 'closed';
                    setTimeout(function(){
                        document.querySelector('#event').innerHTML = '';
                    },250);
                });
            })
        })
        // Error handling
        .catch(err => {
            document.querySelector('#event').innerHTML = `<button id="close">X</button>
                <p>Couldn't retrieve information about launch.</p>
                <p>Error: ${err}</p>`
                document.querySelector('#event').className = 'open scrollBox';
                document.querySelector('#close').addEventListener('click', e => {
                    e.preventDefault();
                    document.querySelector('#event').className = 'closed';
                    setTimeout(function(){
                        document.querySelector('#event').innerHTML = '';
                    },250);
                });
        })
}

// Function to initiate the calendar, fetching and populating it with future launches from SpaceX
function calendarInit() {
    var calendarContainer = document.querySelector('#calendar');

    var eventArray = [];

    fetch('https://api.spacexdata.com/v3/launches/upcoming')
        .then(resolve => {
            resolve.json().then(respond => {
                for (i=0;i<respond.length;i++) {
                    var start = '';
                    if (respond[i].last_ll_launch_date === null || respond[i].last_ll_launch_date === undefined) {
                        start = respond[i].launch_date_utc;
                    } else {
                        if (respond[i].launch_date_utc<respond[i].last_ll_launch_date) {
                            start = respond[i].last_ll_launch_date;
                        } else {
                            start = respond[i].launch_date_utc;
                        }
                    }
                    var flightNumber = respond[i].flight_number;
                    // Creating each calendar event object
                    var eventObject = {
                        classNames: `flight_number${numeral(flightNumber).format('000')}`,
                        title: `${respond[i].mission_name}`,
                        start: `${start.substring(0,10)}`,
                        backgroundColor: '#6897ba',
                        borderColor: '#628eef',
                        textColor: '#eee'
                    }
                    eventArray.push(eventObject);
                }
                // Initiating the calendar with FullCalendar.js
                var calendar = new FullCalendar.Calendar(calendarContainer, {
                    plugins: ['dayGrid'],
                    events: eventArray,
                });

                // Rendering the calendar to the DOM with FullCalendar.js
                calendar.render();

                document.querySelectorAll('.fc-event').forEach(item => {
                    item.addEventListener('click', expandEvent);
                });

                document.querySelectorAll('.fc-button').forEach(item => {
                    item.addEventListener('click', e => {
                        setTimeout(function() {
                            document.querySelectorAll('.fc-event').forEach(item => {
                                item.addEventListener('click', expandEvent);
                            })
                        },200)
                    })
                })
            })
        })
        // Error handling
        .catch(err => {
            calendarContainer.innerHTML = `<p>Sorry, we couldn't retrieve future launches now.</p>
                <p>Error: ${err}</p>`;
        })
}

// Function to fetch past launches for SpaceX, populates containers in launches.htm with these launches
function pastLaunchPopulate() {
    fetch('https://api.spacexdata.com/v3/launches/past?sort=launch_date_utc&order=desc')
        .then(resolve => {
            resolve.json().then(respond => {
                var content = '';
                // Looping through returned array to create container for each launch
                for (i=0;i<respond.length;i++) {
                    var launchTime = '';
                    if (respond[i].last_ll_launch_date === null || respond[i].last_ll_launch_date === undefined) {
                        var launch = new Date(respond[i].launch_date_utc);
                        launchTime = `<p class="historicalDate">${launch.toString().substring(4,15)}</p>`;
                    } else {
                        if (respond[i].launch_date_utc<respond[i].last_ll_launch_date) {
                            var launch = new Date(respond[i].last_ll_launch_date);
                            launchTime = `<p class="historicalDate">${launch.toString().substring(4,15)}</p>`;
                        } else {
                            var launch = new Date(respond[i].launch_date_utc);
                            launchTime = `<p class="historicalDate">${launch.toString().substring(4,15)}</p>`;
                        }
                    }
                    content += `<div class="detailContainer">
                        <h3>${respond[i].mission_name}</h3>
                        ${launchTime}
                        <div class="openInfo" id="flight${numeral(respond[i].flight_number).format('000')}">
                            <span class="vertSpan"></span>
                            <span class="horiSpan"></span>
                        </div>
                        <div class="hidden" id="hidden${numeral(respond[i].flight_number).format('000')}">
                        </div>
                    </div>`;
                }
                // Adding the launch containers to the DOM, and adding eventlisteners
                document.querySelector('#pastLaunchContainer').innerHTML = content;
                document.querySelectorAll('.openInfo').forEach(item => {
                    item.addEventListener('click', expandPastLaunch);
                });
            })
        })
        // Error handling
        .catch(err => {
            document.querySelector('#pastLaunchContainer').innerHTML = `<p>Sorry, we couldn't retrieve past launches now.</p>
                <p>Error: ${err}</p>`;
        })
}

// Function to expand info-boxes, used at all boxes styled in this fashion
function expandInfo() {
    if (this.nextSibling.nextSibling.style.display === 'flex') {
        this.nextSibling.nextSibling.style.display = 'none';
        this.childNodes[1].style.transform = 'rotateX(0deg)';
    } else {
        this.nextSibling.nextSibling.style.display = 'flex';
        this.childNodes[1].style.transform = 'rotateX(90deg)';
    }
}

// Function to populate launch information when expanding container
function expandPastLaunch() {
    var launchId = this.id.substring(6);
    if (this.nextSibling.nextSibling.style.display === 'flex') {
        this.nextSibling.nextSibling.style.display = 'none';
        this.childNodes[1].style.transform = 'rotateX(0deg)';
        document.querySelector(`#hidden${launchId}`).innerHTML = '';
    } else {
        this.nextSibling.nextSibling.style.display = 'flex';
        this.childNodes[1].style.transform = 'rotateX(90deg)';
        var url = `https://api.spacexdata.com/v3/launches/${launchId}`;
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
                        // Checks if ISS was launch target, and adds link to iss.htm if so
                        if (respond.rocket.second_stage.payloads[0].orbit === 'ISS') {
                            orbit = `<a href="iss.htm">${respond.rocket.second_stage.payloads[0].orbit}</a>`;
                        } else {
                            orbit = `${respond.rocket.second_stage.payloads[0].orbit}`;
                        }
                    } else {
                        // Checks if ISS was launch target, and adds link to iss.htm if so
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
                        youtube = `<iframe width="100%" height="500px" src="https://www.youtube.com/embed/${respond.links.youtube_id}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                    }

                    document.querySelector(`#hidden${launchId}`).innerHTML = `${details}
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

                })
            })
            .catch(err => {
                document.querySelector(`#hidden${launchId}`).innerHTML = `<p>Sorry, we couldn't retrieve this launches now.</p>
                    <p>Error: ${err}</p>`;
            })
    }
}
