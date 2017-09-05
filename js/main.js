$( ".hamburger" ).click(function() {
  $(".mobile-menu").slideToggle( "slow", function() {
    // Animation complete.
  });
});

$('a.scrollTo').click(function(){
	let scrollTo = $(this).attr('data-scrollTo');
	$('body, html').animate({
		"scrollTop": $('.' + scrollTo).offset().top
	}, 1000)
})