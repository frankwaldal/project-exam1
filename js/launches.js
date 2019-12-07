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
}

function pastLaunchPopulate() {

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

document.querySelectorAll('.openInfo').forEach(item => {
    item.addEventListener('click', expandInfo);
});
