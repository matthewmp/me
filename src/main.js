
require('./index.html');
require('./spotify.html');
require('./css/normalize.css');
require('./css/contact.css');
require('./css/grid.css');
require('./css/main.css');
require('./css/portfolio.css');
require('./css/skills.css');
require('./css/spinner.css');
require('./css/spotify.css');

$(document).ready(function(){

	// Scroll Animation
	$(document).scroll(()=>{
		let docScroll = $(document).scrollTop();
		let swOffset = $('.skills-container').offset();
		//console.log(docScroll, swOffset.top)
		if(docScroll >= (swOffset.top / 1.35)){
			console.log('hit')
			$('.skill_level').addClass('skillAnimate');
		}
	});

	$( '.hamburger' ).click(function() {
		$('.hamburger').toggleClass('active', 5000);

	  	$('.mobile-menu').slideToggle( 'slow', function() {
	    	// Animation complete.
	  	});
	});

	$('a.scrollTo').click(function(){
		var scrollTo = $(this).attr('data-scrollTo');
		$('body, html').animate({
			'scrollTop': $('.' + scrollTo).offset().top
		}, 1000)
	});

	$('.menu-item').click(function(){
		$('.hamburger').toggleClass('active', 5000);
	  	$('.mobile-menu').slideToggle( 'slow', function() {
	    	// Animation complete.
	  	});
	});

	$('#spinner').fadeOut();

	$('#home').click(()=>{
		alert('test');
	})

	$('.spHomeBtn').click(()=>{
		let url = 'http://mattpalumbo.me';
		$(location).attr('href',url);
	});
});
