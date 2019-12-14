// Eventlistener to show button to scroll up when you have scrolled down
document.querySelector('.scrollBox').addEventListener('scroll', e => {
    if (document.querySelector('#up').style.display !== 'block') {
        document.querySelector('#up').style.display = 'block';
    }
    if (document.querySelector('.scrollBox').scrollTop === 0) {
        document.querySelector('#up').style.display = 'none';
    }
});

// Eventlistener for button to scroll to top
document.querySelector('#up').addEventListener('click', e => {
    document.querySelector('.scrollBox').scrollTo(0,0);
    setTimeout(function(){
        document.querySelector('#up').style.display = 'none';
    },100);
});
