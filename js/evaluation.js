var serverurl = "http://ec2-52-10-5-222.us-west-2.compute.amazonaws.com/evaluation_server";
var login_data;
var leadership_data
var EMAIL;
var PASSWORD;
var TASKID;

$(function() {
	
  $('#signup-button').on('click', function() {
    var newemail = $("#newemail").val();
    var newpassword = $("#newpassword").val();
    var newfirstname = $("#newfirstname").val();
    var newlastname = $("#newlastname").val();
	var organization = $("#organization").val();
	var emailreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	var isFormValid = true;
	var errormsg = "";
	var inputcon = $('input.form-control');
	$('#register-input input.form-control').each(function() {
    if($.trim($(this).val()).length == 0 && $(this).attr('placeholder') != 'Organization')
		{
			isFormValid = false;
			errormsg += $(this).attr('placeholder') + ',';
		}
    });
	
	if(!isFormValid)
	{	
		var message = errormsg + 'can not be empty';
		print_msg(message);	
		
	}else{
		if(emailreg.test(newemail)){
			$.ajax({
				url:serverurl + "/logging.php",
				type:"POST",
				data:{action: "adduser", email: newemail, password: newpassword,
					  firstname: newfirstname, lastname: newlastname, organization:organization},
				success: function(data) {
				  var email = JSON.parse(data)[0];
				  var password = JSON.parse(data)[1];
				  
				  if (email) {
					$('#email').val(email);
					$('#password').val(password);
					$('#login-button').click();
				  }
				  else {
					var message = 'Email address already taken';
					print_msg(message);
				  }
				}
			  });
		}else{
			var message = 'Please type correct email';
			print_msg(message);
		}  
	}
	});


  $('#login-button').on('click', function() {
	  var email = $('#email').val();
      var password = $('#password').val();
	  $.ajax({
      	url:serverurl + "/logging.php",
      	type:"POST",
      	data:{action: "validate_login", email: email, password: password},
      	success: function(data) {
       		login_data = data;			
        	EMAIL = JSON.parse(login_data)[2];
       		PASSWORD = JSON.parse(login_data)[3];
        	var firstname = JSON.parse(login_data)[0];
        	var lastname = JSON.parse(login_data)[1];
        	if (firstname) {
          		localStorage.setItem("EMAIL_CACHED", EMAIL);
          		localStorage.setItem("PASSWORD_CACHED", PASSWORD);
          		view_as_logged();
			}
			else {
			  $("#warning-message").hide();
			  $("#warning-message").html('<span class="help-inline text-danger">Invalid username or password</span>');
			  $("#warning-message").fadeIn('slow');
			}
      	}
    });
  });
  

  if (localStorage.getItem("EMAIL_CACHED") && localStorage.getItem("PASSWORD_CACHED")) {
    $('#email').val(localStorage.getItem("EMAIL_CACHED"));
    $('#password').val(localStorage.getItem("PASSWORD_CACHED"));
    $('#login-button').click();
  } 
  
});

function print_msg(msg){
	$("#warning-register").hide();
	$("#warning-register").html('</br><span class="help-inline text-danger "><i class="glyphicon glyphicon-warning-sign"></i>' + msg + '</span>');
	$("#warning-register").fadeIn('slow');
}

function hover_subtab(){
	$(".navbar-nav >li").hover(function(){
		$(this).find(".nav-folder").css("display","block");
		},function(){
		$(this).find(".nav-folder").css("display","none");
	});
}

function view_as_logged() {
  $.ajax({
    url:serverurl + "/logged.html",
    type:"POST",
    success: function(html) {
      var firstname = JSON.parse(login_data)[0];
      var lastname = JSON.parse(login_data)[1];
      var homepage = sprintf(html, firstname, lastname);
      $('.homepage').html(homepage);
      $(function() {
        fill_logged_content();
		hover_subtab();
      });
    }
  });
}

function print_home_content() {
  $.ajax({
    url:serverurl + "/home.html",
    type:"POST",
    success: function(html) {
      $("#evaluation-page").html(html);
    }
  });
}

json_file_classification = "http://ec2-52-10-5-222.us-west-2.compute.amazonaws.com/files/example_classification.json";
json_file_detection = "http://ec2-52-10-5-222.us-west-2.compute.amazonaws.com/files/example_detection.json";
function load_example_formats() {
  /*
  $.getJSON(json_file_classification, function(json){
    $('#example-classification').html(library.json.prettyPrint(json));
      $.getJSON(json_file_detection, function(json){
        $('#example-detection').html(library.json.prettyPrint(json));
      });
  });
  */
    $.ajax({
    url:serverurl + "/submission_formats/example_classification.html",
    type:"POST",
    success: function(html) {
      $("#example-classification").html(html);
    }
  });
    $.ajax({
    url:serverurl + "/submission_formats/example_detection.html",
    type:"POST",
    success: function(html) {
      $("#example-detection").html(html);
    }
  });

}

function print_results_format(html) {
  var classification_ = "<h4>Untrimmed video classification</h4><p>Please format your results as illustrated in the example below:</p><pre><code id=example-classification></code></pre>"
  var detection_ = "<h4>Activity detection</h4><p>Please format your results as illustrated in the example below:</p><pre><code id=example-detection></code></pre>"
  html = sprintf(html, classification_, detection_);
  return html;
}

function print_classification_content() {	
 	var TASKID = 1;  
  	var html = '<div id="evaluate" style="margin-top:60px;padding-bottom:300px;">'+
				  '<div class="row"><div class="col-md-12"><div class="panel with-nav-tabs panel-default">'+
					  '<div class="panel-heading"><span class="nav-tab-title pull-right">Upload your results</span>'+
					  '<ul class="nav nav-tabs"><li class="active"><a href="#classification" data-toggle="tab"><i class="glyphicon glyphicon-tags"></i>&nbsp;&nbsp;Classification</a></li>'+
					  '<li><a href="#detection" data-toggle="tab"><i class="glyphicon glyphicon-eye-open"></i>&nbsp;Detection</a></li></ul></div>'+
					  '<div class="panel-body"><div class="tab-content">'+
						  '<div class="tab-pane active" id="classification">%s</div>'+
						  '<div class="tab-pane" id="detection">%s</div>'+
				  	  '</div></div>';
        html = print_results_format(html);
  	html += '<input id="file_to_upload" name="file_to_upload" type="file" multiple=false class="file-loading">' +
			'<div id="kv-success-2" class="alert alert-success fade in" style="margin-top:20px;display:none"></div>'+
			'</div></div></div></div>';
	$("#evaluation-page").html(html);
    load_example_formats();
	
    $("#file_to_upload").fileinput({
		process:false,
		showPreview:false,
        maxFileCount: 1,
        uploadAsync: false,
        uploadUrl:serverurl + "/upload.php",
        mainClass: "input-group-lg",
        allowedFileExtensions: ["json"],
        uploadExtraData: function() {
            return {
                email: EMAIL,
                taskid: TASKID
            };
        }
    }).on('filebatchpreupload', function(event, data, id, index) {
	  $('.kv-upload-progress').remove();	
      $('#kv-success-2').html('<div style="background:url(images/process_48.gif) no-repeat center center; width=100%; height:107px;"><div class="section-title text-center" style="padding-top:86px"><span >Uploading and evaluating JSON file … This might take a few minutes</span></div></div>').show();
    }).on('filebatchuploadsuccess', function(event, data) {
      var out = '';
      var result_url = data.response[0];
      var metric1 = data.response[1];
	  var metric2 = data.response[2];
      $.each(data.files, function(key, file) {
        var fname = file.name;
        out = out + '<li>' + 'Uploaded file: ' +  fname + ' successfully.' + '</li><li>mAP&nbsp=&nbsp[' + metric1 + '];&nbsp;top-k=[' + metric2 + '] </li><li>Download your results <a href="' + result_url + '" download>click here!&nbsp <i class="fa fa-download"></i></a></li>';
       });
      $('#kv-success-2').html('<h4>Upload Status</h4><ul></ul>');	   
      $('#kv-success-2 ul').append(out);
      $('#kv-success-2').fadeIn('slow');
    });

    $('#file_to_upload').on('filebrowse', function(event) {
	  $('#file_to_upload').fileinput('clear');
      $('#kv-success-2').hide();
    });

    $('#file_to_upload').on('fileclear', function(event) {
      $('#kv-success-2').hide();
    });
	
	$('#evaluate li').on('click', function(){
		var currid = $(this).children(":first").attr('href');		
		if(currid == '#classification'){
			//$(this).addClass("active").siblings().removeClass("active");
			TASKID = 1;
			$('#file_to_upload').fileinput('clear');
      		$('#kv-success-2').hide();
		}else if(currid == '#detection'){
			//$(this).addClass("active").siblings().removeClass("active");
			TASKID = 2;
			$('#file_to_upload').fileinput('clear');
     		$('#kv-success-2').hide();
		}
	});
}

function print_classification_result() {
	var actionstatus= "classification_action";
	var html = '<div id="evaluate" style="margin-top:60px;padding-bottom:300px">'+
			      '<div class="row"><div class="col-md-12"><div class="panel panel-default panel-fade">'+
			          '<div class="panel-heading"><span class="nav-tab-title pull-right"> See your results</span>'+
					  '<ul class="nav nav-tabs"><li class="active"><a href="#classification" data-toggle="tab"><i class="glyphicon glyphicon-tags"></i>&nbsp;&nbsp;Classification</a></li>'+
					  '<li><a href="#detection" data-toggle="tab"><i class="glyphicon glyphicon-eye-open"></i>&nbsp;Detection</a></li></ul></div>'+			   
			   '<div id="table-content" class="container-fluid" style="margin-top:30px;"></div>'+
			   '</div></div></div></div>';
  	$("#evaluation-page").html(html);
	load_leaderboard(actionstatus);
	$('#evaluate li').on('click', function(){
		var currid = $(this).children(':first').attr('href');
		if(currid == "#classification"){
			$('#myTable tbody>tr').empty();
			actionstatus = "classification_action";
			load_leaderboard(actionstatus);
		}else if(currid == "#detection"){
			$('#myTable tbody>tr').empty();
			actionstatus = "detection_action";
			load_leaderboard(actionstatus);
		}
	});
}

function load_leaderboard(STATUS){
	var typecontent;
	if(STATUS == "classification_action"){
		typecontent = "Classification Result";
	}else if(STATUS == "detection_action"){
		typecontent = "Detection Result";
	}
	var html = '<h3>' + typecontent + '</h3>'+
			   '<table id="myTable" class="table table-striped dataTable no-footer sort_table" role="grid" style=" background-color:#EBEBEB;width:100%"><thead><tr role="row">'+
  			      '<th class="sort sorting_desc_disabled" style="width:50px" rowspan="1" colspan="1">Ranking</th>'+
			   	  '<th class="no-sort" style="width:50px" rowspan="1" colspan="1">Username</th>'+
			      '<th class="no-sort" style="width:50px" rowspan="1" colspan="1">Organization</th>'+
			      '<th class="no-sort" sort_status="sortable" style="width:50px" rowspan="1" colspan="1">Upload time</th>'+
			      '<th class="sort" sort_status="sortable" style="width:50px" rowspan="1" colspan="1">mAP</th>'+
			      '<th class="sort" sort_status="sortable" style="width:50px" rowspan="1" colspan="1">Top-k</th>'+
			   '</tr></thead><tbody></tbody></table>';
	$("#table-content").html(html);
		$.ajax({
		url:serverurl + "/leadership.php",
		type:"POST",
   		data:{action: STATUS},
      	success: function(data) {
			//Take all records from JSON 
			var leadership_data = jQuery.parseJSON(data);
			 $.each(leadership_data, function(i, ls){
				 var rank = i + 1;
				$('#myTable').append('<tr><td>'+ ls['rank'] +'</td><td>'+ ls['username'] +'</td><td>'+ ls['organization'] +'</td><td>'+ ls['uploadtime'] +'</td><td>'+ ls['metric1'] +'</td><td>'+ ls['metric2'] +'</td></tr>');
		  	});
			$("table.sort_table").sort_table({ "action" : "init" });	
    	}
	});
}

function fill_logged_content() {
  print_home_content();
  $("#home-btn").on("click", function() {
    print_home_content();
  });
  $("#classification-btn").on("click", function() {
    print_classification_content();
  });
  $("#leadership-btn").on("click", function() {
    print_classification_result();
  });
  $("#signout-btn").on("click", function() {
    localStorage.clear();
    location.reload();
  });
}
