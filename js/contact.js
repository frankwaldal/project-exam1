// Function to check fields in form and send the message with a POST to php-file
function formSubmit(e) {
    e.preventDefault();
    var nameMsgCheck = /[A-Za-z\- .]+/;
    var emailCheck = /^[a-z0-9\.\-_+!#$%&'*/=?\^`{}~|]+@([a-z0-9\-]+\.)+[a-z]{2,4}$/i;

    var name = document.querySelector('#formName');
    var email = document.querySelector('#formEmail');
    var message = document.querySelector('#formMessage');
    var respond = document.querySelector('#formError');

    if (nameMsgCheck.test(name.value)) {
        name.style.border = '2px solid #eee';
        document.querySelector('#nameError').style.display = 'none';
    } else {
        name.style.border = '2px solid #c9504d';
        document.querySelector('#nameError').style.display = 'block';
    }

    if (emailCheck.test(email.value)) {
        email.style.border = '2px solid #eee';
        document.querySelector('#emailError').style.display = 'none';
    } else {
        email.style.border = '2px solid #c9504d';
        document.querySelector('#emailError').style.display = 'block';
    }

    if (nameMsgCheck.test(message.value)) {
        message.style.border = '2px solid #eee';
        document.querySelector('#msgError').style.display = 'none';
    } else {
        message.style.border = '2px solid #c9504d';
        document.querySelector('#msgError').style.display = 'block';
    }

    if (!nameMsgCheck.test(name.value) || !emailCheck.test(email.value) || !nameMsgCheck.test(message.value)) {
        respond.innerHTML = 'Please fill in all fields.';
        respond.style.color = '#c9504d';
    } else {
        var body = `name=${name.value}&email=${email.value}&message=${message.value}`;

        fetch('https://fwaldal.no/fed/emailFiles/email.php', {
            method: 'post',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: body
        })
            .then(resolve => {
                respond.innerHTML = 'Your message was sent.';
                respond.style.color = '#83d086';
                name.value = '';
                email.value = '';
                message.value = '';
            })
            .catch(err => {
                respond.innerHTML = `We couldn't send your message right now.<br>Error: ${err}`;
                respond.style.color = '#c9504d';
            })
    }
}

// Function to check target input field against regex
function liveCheck(e) {
    var nameMsgCheck = /[A-Za-z\- .]+/;
    var emailCheck = /^[a-z0-9\.\-_+!#$%&'*/=?\^`{}~|]+@([a-z0-9\-]+\.)+[a-z]{2,4}$/i;

    if (e.target.type === 'email') {
        if (emailCheck.test(e.target.value)) {
            e.target.style.border = '2px solid #eee';
            document.querySelector('#emailError').style.display = 'none';
        } else {
            e.target.style.border = '2px solid #c9504d';
            document.querySelector('#emailError').style.display = 'block';
        }
    } else {
        if (nameMsgCheck.test(e.target.value)) {
            e.target.style.border = '2px solid #eee';
            if (e.target.type === 'text') {
                document.querySelector('#nameError').style.display = 'none';
            } else {
                document.querySelector('#msgError').style.display = 'none';
            }
        } else {
            e.target.style.border = '2px solid #c9504d';
            if (e.target.type === 'text') {
                document.querySelector('#nameError').style.display = 'block';
            } else {
                document.querySelector('#msgError').style.display = 'block';
            }
        }
    }
}

// Reseting added styles and messages added during form check when hitting reset button
function formReset() {
    document.querySelector('#formError').innerHTML = '';
    document.querySelector('#nameError').style.display = 'none';
    document.querySelector('#emailError').style.display = 'none';
    document.querySelector('#msgError').style.display = 'none';
    document.querySelector('#formName').style.border = '2px solid #eee';
    document.querySelector('#formEmail').style.border = '2px solid #eee';
    document.querySelector('#formMessage').style.border = '2px solid #eee';
}

document.querySelectorAll('label input').forEach(item => {
    item.addEventListener('blur', liveCheck);
});

document.querySelector('textarea').addEventListener('blur', liveCheck);

document.querySelector('.form').addEventListener('submit', formSubmit);

document.querySelector('.form').addEventListener('reset', formReset);
