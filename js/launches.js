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
                    orbit = `${respond.rocket.second_stage.payloads[0].orbit}`
                } else {
                    orbit = `${respond.rocket.second_stage.payloads[0].orbit} - ${respond.rocket.second_stage.payloads[0].orbit_params.regime}`
                }
                var content = `<button id="close">X</button>
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
                document.querySelector('#event').className = 'open';
                document.querySelector('#close').addEventListener('click', e => {
                    e.preventDefault();
                    document.querySelector('#event').className = 'closed';
                });
            })
        })
        .catch(err => {
            document.querySelector('#event').innerHTML = `<button id="close">X</button>
                <p>Couldn't retrieve information about launch.</p>
                <p>Error: ${err}</p>`
        })
}

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
                var calendar = new FullCalendar.Calendar(calendarContainer, {
                    plugins: ['dayGrid'],
                    events: eventArray,
                });

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
        .catch(err => {
            calendarContainer.innerHTML = `<p>Sorry, we couldn't retrieve future launches now.</p>
                <p>Error: ${err}</p>`;
        })
}

function pastLaunchPopulate() {
    fetch('https://api.spacexdata.com/v3/launches/past?sort=launch_date_utc&order=desc')
        .then(resolve => {
            resolve.json().then(respond => {
                console.log(respond);
                var content = '';
                for (i=0;i<respond.length;i++) {
                    console.log(i);
                    console.log(respond[i]);
                    var launchTime = '';
                    if (respond[i].last_ll_launch_date === null || respond[i].last_ll_launch_date === undefined) {
                        var launch = new Date(respond[i].launch_date_utc);
                        launchTime = `<p>Launchdate: ${launch.toString().substring(4,15)}</p>
                            <p>Launchtime: ${launch.toLocaleTimeString()}</p>`;
                    } else {
                        if (respond[i].launch_date_utc<respond[i].last_ll_launch_date) {
                            var launch = new Date(respond[i].last_ll_launch_date);
                            launchTime = `<p>Launchdate: ${launch.toString().substring(4,15)}</p>
                                <p>Launchtime: ${launch.toLocaleTimeString()}</p>`;
                        } else {
                            var launch = new Date(respond[i].launch_date_utc);
                            launchTime = `<p>Launchdate: ${launch.toString().substring(4,15)}</p>
                                <p>Launchtime: ${launch.toLocaleTimeString()}</p>`;
                        }
                    }
                    var cores = '';
                    for (j=0;j<respond[i].rocket.first_stage.cores.length;j++) {
                        cores += ` - ${respond[i].rocket.first_stage.cores[j].core_serial}`;
                    }
                    var customers = '';
                    for (j=0;j<respond[i].rocket.second_stage.payloads[0].customers.length;j++) {
                        customers += ` - ${respond[i].rocket.second_stage.payloads[0].customers[j]}`;
                    }
                    var details = '';
                    if (respond[i].details !== null) {
                        details = `<p>${respond[i].details}</p><br>`;
                    }
                    var orbit = '';
                    if (respond[i].rocket.second_stage.payloads[0].orbit_params.regime === null || respond[i].rocket.second_stage.payloads[0].orbit_params.regime === undefined) {
                        orbit = `${respond[i].rocket.second_stage.payloads[0].orbit}`
                    } else {
                        orbit = `${respond[i].rocket.second_stage.payloads[0].orbit} - ${respond[i].rocket.second_stage.payloads[0].orbit_params.regime}`
                    }
                    var success = '';
                    if (respond[i].launch_success) {
                        success = '<p>Launch success: Yes</p>';
                    } else {
                        success = `<p>Launch success: No</p>
                            <p>Failure reason: ${respond[i].launch_failure_details.reason}</p>`;
                    }
                    var links = '';
                    if (respond[i].links.article_link !== null || respond[i].links.article_link !== undefined) {
                        links += `<p><a href="${respond[i].links.article_link}" target="_blank">Article</a></p>`
                    }
                    if (respond[i].links.wikipedia !== null || respond[i].links.wikipedia !== undefined) {
                        links += `<p><a href="${respond[i].links.wikipedia}" target="_blank">Wikipedia</a></p>`
                    }
                    if (respond[i].links.reddit_campaign !== null || respond[i].links.reddit_campaign !== undefined) {
                        links += `<p><a href="${respond[i].links.reddit_campaign}" target="_blank">Reddit Campaign thread</a></p>`
                    }
                    if (respond[i].links.reddit_launch !== null || respond[i].links.reddit_launch !== undefined) {
                        links += `<p><a href="${respond[i].links.reddit_launch}" target="_blank">Reddit Launch thread</a></p>`
                    }
                    var youtube = '';
                    if (respond[i].links.youtube_id !== null || respond[i].links.youtube_id !== undefined) {
                        youtube = `<iframe width="100%" height="500px" src="https://www.youtube.com/embed/${respond[i].links.youtube_id}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                    }
                    content += `<div class="pastLaunch">
                        <h3>${respond[i].mission_name}</h3>
                        <div class="openInfo">
                            <span class="vertSpan"></span>
                            <span class="horiSpan"></span>
                        </div>
                        <div class="hidden">
                            ${details}
                            ${launchTime}
                            <p>Launchsite: ${respond[i].launch_site.site_name_long}</p>
                            <br>
                            <p>Rocket: ${respond[i].rocket.rocket_name}</p>
                            <p>Core: ${cores.substring(3)}</p>
                            <p>Payload: ${respond[i].rocket.second_stage.payloads[0].payload_type}</p>
                            <p>Payload manufacturer: ${respond[i].rocket.second_stage.payloads[0].manufacturer}</p>
                            <p>Payload customer: ${customers.substring(3)}</p>
                            <p>Orbit: ${orbit}</p>
                            <br>
                            ${success}
                            <br>
                            ${links}
                            ${youtube}
                        </div>
                    </div>`;
                }
                document.querySelector('#pastLaunchContainer').innerHTML = content;
                document.querySelectorAll('.openInfo').forEach(item => {
                    item.addEventListener('click', expandInfo);
                });
            })
        })
        .catch(err => {
            document.querySelector('#pastLaunchContainer').innerHTML = `<p>Sorry, we couldn't retrieve past launches now.</p>
                <p>Error: ${err}</p>`;
        })
}

function expandInfo() {
    if (this.nextSibling.nextSibling.style.display === 'flex') {
        this.nextSibling.nextSibling.style.display = 'none';
        this.childNodes[1].style.transform = 'rotateX(0deg)';
    } else {
        this.nextSibling.nextSibling.style.display = 'flex';
        this.childNodes[1].style.transform = 'rotateX(90deg)';
    }
}

calendarInit();

pastLaunchPopulate();



/*
<div class="pastLaunch">
    <h3>FalconSat</h3>
    <div class="openInfo">
        <span class="vertSpan"></span>
        <span class="horiSpan"></span>
    </div>
    <div class="hidden">
        <p>Engine failure at 33 seconds and loss of vehicle</p><br>
        <p>Launchdate: Mar 03 2006</p>
        <p>Launchtime: 22:30:00</p>
        <p>Launchsite: Kwajalein Atoll Omelek Island</p>
        <br>
        <p>Rocket: Falcon 1</p>
        <p>Core: Merlin1A</p>
        <p>Payload: Satellite</p>
        <p>Payload manufacturer: SSTL</p>
        <p>Payload customer: DARPA</p>
        <p>Orbit: LEO - low-earth</p>
        <br>
        <p>Launch success: No</p>
        <p>Failure reason: merlin engine failure</p>
        <br>
        <p><a href="https://www.space.com/2196-spacex-inaugural-falcon-1-rocket-lost-launch.html" target="_blank">Article</a></p>
        <p><a href="https://en.wikipedia.org/wiki/DemoSat" target="_blank">Wikipedia</a></p>
        <iframe width="100%" height="500px" src="https://www.youtube.com/embed/0a_00nJ_Y88" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
</div>
*/
