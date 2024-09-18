
$('html').mousemove(function(e){

		var wx = $(window).width();
		var wy = $(window).height();

		var x = e.pageX - this.offsetLeft;

		var newx = x - wx/2;
		var newy = y - wy/2;


		$('.parallax').each(function(){
			var speed = $(this).attr('data-speed');
			if($(this).attr('data-revert')) speed *= -1;
			TweenMax.to($(this), 1, {x: (1 - newx*speed), y: (1 - newy*speed)});
			//TweenMax.to($(this), 1, {x: (0.5), y: (0.5)});
		});

	});