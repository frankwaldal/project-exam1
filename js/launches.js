var today = new Date();

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

function calendar(month, year, date) {
    if (date) {
        console.log(`Today is ${date}. of ${months[month]}, ${year}.`);
    } else {
        console.log(`You want to see ${months[month]} in ${year}.`);
    }
}

calendar(today.getMonth(), today.getFullYear(), today.getDate());

function expandEvent(e) {
    console.log(this.className.substring(67,70));
}

function calendarTest() {
    var futureLaunchCalendar = document.querySelector('#calendar');

    var arrayTest = [{
        classNames: 'flight_number088',
        title: 'Test one',
        start: '2019-12-12'
    },{
        classNames: 'flight_number089',
        title: 'Test two',
        start: '2019-12-24'
    }];

    var calendar = new FullCalendar.Calendar(futureLaunchCalendar, {
        plugins: ['dayGrid'],
        events: arrayTest
    });

    calendar.render();

    document.querySelectorAll('.fc-event').forEach(item => {
        item.addEventListener('click', expandEvent);
    });
}

calendarTest();






/*
var calendarEl = document.getElementById('calendar');

var calendar = new FullCalendar.Calendar(calendarEl, {
    plugins: [ 'dayGrid' ],
    events: [{
        title: 'Test Event',
        start: '2019-12-12'
    },{
        title: 'Test Event 2',
        start: '2019-12-13'
    },{
        title: 'Test Event 3',
        start: '2020-01-10'
    },{
        title: 'Test Event 3',
        start: '2020-02-10'
    }]
});

calendar.render();
*/
