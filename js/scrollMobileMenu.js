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

document.querySelector('#mobileMenuButton').addEventListener('click', () => {
    if (document.querySelector('header ul').id === 'mobileClosed') {
        document.querySelector('header ul').id = 'mobileOpen';
        document.querySelector('#mobileMenuButton span:first-child').style.transform = 'rotate(45deg)';
        document.querySelector('#mobileMenuButton span:nth-child(2)').style.width = '0px';
        document.querySelector('#mobileMenuButton span:last-child').style.transform = 'rotate(-45deg)';
    } else {
        document.querySelector('header ul').id = 'mobileClosed';
        document.querySelector('#mobileMenuButton span:first-child').style.transform = 'rotate(0deg)';
        document.querySelector('#mobileMenuButton span:nth-child(2)').style.width = '46px';
        document.querySelector('#mobileMenuButton span:last-child').style.transform = 'rotate(0deg)';
    }
});
