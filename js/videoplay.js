// When user clicks a video
/*$('body').on('click', 'a.video', function(){
	var myVideo = $(this).attr('href');
	var videotitle = $(this).attr('title');

	$('#info a, #paginationdiv').hide();
	$('#frame').attr("src", "http://www.youtube.com/embed/"+ myVideo +"?rel=0&autoplay=1&vq=hd360").show();
	$('#videoinfo').text(videotitle);

	return false;
});*/


$('body').on('click', 'a.video', function(){
	var myVideo = $(this).attr('href');
	var videotitle = $(this).attr('title');

	/*$('#info a, #paginationdiv').hide();
	$('#frame').attr("src", "http://www.youtube.com/embed/"+ myVideo +"?rel=0&autoplay=1&vq=hd360").show();*/
	$('body').css('overflow','hidden');
	$('.theme-popover-mask').fadeIn(100);
	$('.theme-popover').slideDown(200);

	var starting_times = VIDEO_TIME[myVideo].start.split(',');
	var ending_times = VIDEO_TIME[myVideo].end.split(',');
	var title = VIDEO_TIME[myVideo].title;
        var video_duration = VIDEO_TIME[myVideo].duration;
	//Current playing video
	$('#frame2').attr("src", "https://www.youtube.com/embed/" + myVideo + "?autoplay=1&color=red&rel=0&start=" + parseInt(starting_times[0]* video_duration) +"&end=" + parseInt(ending_times[0]*video_duration)).show();	
	//Video playing list
	for (var idx=0; idx<starting_times.length; idx++) {
		var this_start = starting_times[idx];
		var this_end = ending_times[idx];
		var index = idx+1;
		imgUrl = "https://www.youtube.com/embed/" + myVideo + "?autoplay=1&color=red&rel=0&start=" + parseInt(this_start * video_duration) + "&end=" + parseInt(this_end * video_duration);
		$('ol.list-group').append('<li class= "list-group-item" title="Click to play"><a href="' + imgUrl + '"><div class="tag-status status1"></div><h5>' + title + ' (Instance ' + index + ') ' + '</h5></a></li>');

	}

	//Play video after click the different parts in the list
	$('.list-group-item>a').click(function(e){
		e.preventDefault();
		$('#frame2').attr('src', $(this).attr("href"));
	});

	//Close the player and mask
	$('.theme-poptit .close').click(function(){
		$('.theme-popover-mask').fadeOut(100);
		$('.theme-popover').slideUp(200);
		$('body').css('overflow','visible');
		$('li.list-group-item').remove();
		$('ol.list-group').removeAttr("list-group-item");
	});

	return false;
});




/*$('body').on('click','list-group-item.tag-status',function(){
	$('this').addClass('status2').

});

$('body').on('click', '#showall',function(e){
  $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
  $('.tree li.parent_li').find(' > ul > li').show('fast')
  $('.tree li.parent_li i').addClass("glyphicon-minus-sign").removeClass("glyphicon-plus-sign");
  $('.tree li.movie i').addClass("glyphicon-film").removeClass("glyphicon-minus-sign");
});*/


/*$('a.video').click(function(){
	var myVideo = $(this).attr('href');
	alert("video href= " + myVideo);
	$('.theme-popover-mask').fadeIn(100);
	$('.theme-popover').slideDown(200);
	$('#frame2').attr("src", "http://www.youtube.com/embed/"+ myVideo +"?rel=0&autoplay=1&vq=hd360").show();
});*/
