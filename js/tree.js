var nodeId = 0;

$(document).ready(function(){
  $('iframe').hide()
  $.ajax({
    url: "http://ec2-52-11-203-1.us-west-2.compute.amazonaws.com/generate_treeview.php",
    type: "POST",
    success: function(data)
    {
      $('.tree').html(data);

      $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Expand this branch');
      $('.tree li.parent_li').find(' > ul > li').hide();
	
	  var categories = $('#categories >ul>li');
	  $(categories).each(function(){
		var account = $(this).find('i').length;
		var itemStr = $(this).find('>span').text();
		var itemName = itemStr + "(" + account + ")";
		$(this).find('>span').get(0).lastChild.nodeValue = itemName;
	  });  
	  
      $('#categories').find(' > ul > li').show();

    },
    error:function(data){
      //$('.tree').text(data);
      console.log(data);
    }
  });    

  getVideos(nodeId, 1);

});

// change node condition and icon

$('body').on('click', '.tree li.parent_li > span', function (e) {
  var children = $(this).parent('li.parent_li').find(' > ul > li');
  if (children.is(":visible")) {
    children.hide('fast');
    $(this).attr('title', 'Expand this branch').find(' > i').addClass("glyphicon-plus-sign").removeClass("glyphicon-minus-sign");
  } else {
    children.show('fast');
    $(this).attr('title', 'Collapse this branch').find(' > i').addClass("glyphicon-minus-sign").removeClass("glyphicon-plus-sign");
  }
  e.stopPropagation();
});

var ResultsperPage = 16;

// When user clicks on a node

$('body').on('click', '.tree li span', function(){

  $('iframe').hide();
  nodeId = $(this).attr('id');
  $('.tree li span').removeClass('selected');
  $(this).addClass('selected');
  var page = 1;
  getVideos(nodeId, page);
  return false;
});

$('body').on('click', '.nextpage',function(e){
  var thispage = $(this).attr('href');

  $.ajax({
    url:"http://ec2-52-11-203-1.us-west-2.compute.amazonaws.com/getvideos.php",
    type:"POST",
    data:{nodeId : nodeId, page : thispage},
    success:function(data) {
      $('#info a').empty();
    var videos = jQuery.parseJSON(data);    // Take all videos from JSON.

    $.each(videos.videos.video, function(i, v){
      $('#info').append('<a class="video" href="'+ v.videoId + '"title="'+ v.title +'" data-witdh = "640" data-height = "360"  href="'+ v.location +
	  					'"><img src="http://img.youtube.com/vi/'+ v.videoId +'/1.jpg"></a>'); 
    });

    $('.tree li span').removeClass('selected');
    $(this).addClass('selected');

    var pages = Math.ceil(videos[0].size/ResultsperPage);
    CheckPage(thispage, pages);
    $('#videoinfo').empty();
  }
});
  return false;
}); 

$('body').on('click', '#showall',function(e){
  $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
  $('.tree li.parent_li').find(' > ul > li').show('fast')
  $('.tree li.parent_li i').addClass("glyphicon-minus-sign").removeClass("glyphicon-plus-sign");
  $('.tree li.movie i').addClass("glyphicon-film").removeClass("glyphicon-minus-sign");
});

$('body').on('click', '#hideall', function(e){
  $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Expand this branch');
  $('.tree li.parent_li').find(' > ul > li').hide('fast');
  $('#categories').find(' > ul > li').show('fast');
  $('.tree li.parent_li i').addClass("glyphicon-plus-sign").removeClass("glyphicon-minus-sign");  
  $('.tree li.movie i').addClass("glyphicon-film").removeClass("glyphicon-plus-sign");   
});


function CheckPage(thispage, numberofpages)
{
  var nextpage = parseInt(thispage) + 1;
  var prevpage = parseInt(thispage) - 1;

  if(thispage == 1)
  {
    $('#paginationdiv p').empty().append('Page ' + thispage + ' of ' + numberofpages);
    $('#Next_page, #First_page, #Last_page').removeClass('disabled');
    $('#Pre_page').addClass('disabled', 'disabled');
    $('#Pre_page a').attr('href', '#');
    $('#Next_page a').attr('href', nextpage); 
    $('#Last_page a').attr('href', numberofpages);
  }
  if(thispage > 1 && thispage < numberofpages)
  {
    $('#paginationdiv p').empty().append('Page ' + thispage + ' of ' + numberofpages);
    $('#Pre_page').removeClass('disabled');
    $('#Pre_page a').attr('href', prevpage);      
    $('#Next_page').removeClass('disabled'); 
    $('#Next_page a').attr('href', nextpage);
  }
  if(thispage == numberofpages)
  {
    $('#paginationdiv p').empty().append('Page ' + thispage + ' of ' + numberofpages);
    $('#Pre_page').removeClass('disabled');
    $('#Pre_page a').attr('href', prevpage);      
    $('#Next_page').addClass('disabled', 'disabled');
    $('#Next_page a').attr('href', '#');
  }

}

// Global var for saving the temporal annotations of the displayed videos.
var VIDEO_TIME = new Array();
function getVideos(nodeId, page)
{
  $.ajax({
    url:"http://ec2-52-11-203-1.us-west-2.compute.amazonaws.com/getvideos.php",
    type:"POST",
    data:{nodeId : nodeId},
    success:function(data) {
      $('#info a').empty();
      $('#frame').hide().attr('src', "");
      var videos = jQuery.parseJSON(data);    // Take all videos from JSON.
      $.each(videos.videos.video, function(i, v){
        $('#info').append('<a class="video" href="'+ v.videoId +'" title="'+ v.title +'" data-witdh = "640" data-height = "360"  href="'+ v.location + 
						  '"><img src="http://img.youtube.com/vi/'+ v.videoId +'/1.jpg"></a>');
		/*alert("v.videoID= " + v.videoID + "v.location= " + v.location); */
		<!--alert("v.videoStartTime= " + v.annotations);-->
		VIDEO_TIME[v.videoId] = new Object();
		VIDEO_TIME[v.videoId].annotation = v,
		VIDEO_TIME[v.videoId].title = v.title;
		VIDEO_TIME[v.videoId].start = v.startTime;
		VIDEO_TIME[v.videoId].end = v.endTime;
		VIDEO_TIME[v.videoId].duration = v.duration;
	  });
	  

      var pages = Math.ceil(videos[0].size/ResultsperPage);
      CheckPage(page, pages);
      $('#paginationdiv').show();
      $('#videoinfo').empty();
    },
    error:function(data){
    }
  });


}
