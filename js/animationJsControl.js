var animation = {}
animation.hoverIn = function(){
	console.log('hey')
	$(this).addClass('shake animated');
}
animation.hoverOut = function(){
	$(this).removeClass('shake animated')
}



// $(function(){
// 	$('.selectedIcons').hover(function(){
// 		console.log('hei')
// 	});

// })