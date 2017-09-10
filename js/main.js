
$(document).ready(function(){
	$( '.hamburger' ).click(function() {
		$('.hamburger').toggleClass('active', 5000);

	  	$('.mobile-menu').slideToggle( 'slow', function() {
	    	// Animation complete.
	  	});


	});

	$('a.scrollTo').click(function(){
		let scrollTo = $(this).attr('data-scrollTo');
		$('body, html').animate({
			'scrollTop': $('.' + scrollTo).offset().top
		}, 1000)
	});
});
