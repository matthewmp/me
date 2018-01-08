
$(document).ready(function(){
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
