var serverurl = "http://ec2-52-25-205-214.us-west-2.compute.amazonaws.com/evaluation_server/";
var files = "http://ec2-52-25-205-214.us-west-2.compute.amazonaws.com/files";
var login_data;
var leadership_data
var EMAIL;
var PASSWORD;
var TASKID;
var fullname;

$(function() {

	$('#close-signup').on('click',function () {
    document.getElementById("signup_eva").reset();
    $("#warning-register").hide();
  });

  $('#upclose').on('click',function () {
    document.getElementById("signup_eva").reset();
    $("#warning-register").hide();
  });

  $('#signup-button').on('click', function() {
    var email = document.getElementById("newemail").value;
    var password = document.getElementById("newpassword").value;
    var lastname = document.getElementById("newlastname").value;
    var firstname = document.getElementById("newfirstname").value;
    var organization = document.getElementById("organization").value;
    var sw= "";
    if (email && password && firstname && lastname && organization){
      $.ajax({
        url:serverurl+"server.py",
        type:"POST",
        data:{action:"register_user_form", email: email, password: password, firstname: firstname,lastname:lastname, organization:organization},
        success: function(data) {
          console.log(data);
          var message = data;
          print_msg(message);
        }

      });
    }
    else{
      if (email==''){
        sw='Email*'+sw;
      }
      if (password==''){
        sw='Password*'+sw;
      }
      if (lastname==''){
        sw='Lastname*'+sw;
      }
      if (firstname==''){
        sw='Firstname*'+sw;
      }
      if (organization==''){
        sw='Organization*'+sw;
      }
      var res = sw.split("*");
      var message = res.slice(0,-1) +" MUST BE non Null";
      print_msg(message)
    }

});

	$('#login-button').on('click', function() {
		var email = document.getElementById("email").value;
		var password = document.getElementById("password").value;

		$.ajax({
				url:serverurl+"server.py",
				type:"POST",
				data:{action:"user_login", email: email, password: password},
				success: function(data) {
					if (data){
					var login_data = data
					EMAIL = login_data[2];
					PASSWORD = login_data[3];
					FIRSTNAME = login_data[0];
					LASTNAME = login_data[1];
					fullname = FIRSTNAME + " " + LASTNAME;
					localStorage.setItem("EMAIL_CACHED", EMAIL);
					localStorage.setItem("PASSWORD_CACHED", PASSWORD);
					localStorage.setItem("FIRSTNAME_CACHED", FIRSTNAME);
					localStorage.setItem("LASTNAME_CACHED", LASTNAME);
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
     	var firstname = localStorage.getItem("FIRSTNAME_CACHED")
	    var lastname = localStorage.getItem("LASTNAME_CACHED");
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

function print_myaccount_content(){
	$.ajax({
		url:serverurl + "/myaccount.html",
		type:"POST",
		success: function(html) {
		  	$("#evaluation-page").html(html);
		  	$('#user-name').html(fullname);
		  	$('#user-email').html(EMAIL);
		  	get_user_info(EMAIL);
		 	$('#myaccount li').on('click', function(){
				var currid = $(this).children(':first').attr('href');
				if(currid == "#classification"){
					$('#myTable tbody>tr').empty();
					var actionstatus = "classification_action";
					load_history(actionstatus, EMAIL);
				}else if(currid == "#detection"){
					$('#myTable tbody>tr').empty();
					var actionstatus = "detection_action";
					load_history(actionstatus, EMAIL);
				}else if(currid == "#myaccount"){
					$('#myTable tbody>tr').empty();
					print_myaccount_content();
				}
			});
		}
  	});
}

function load_history(STATUS, userEMAIL){
	var typecontent;
	if(STATUS == "classification_action"){
		typecontent = "Classification History";
	}else if(STATUS == "detection_action"){
		typecontent = "Detection History";
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
		url:serverurl + "/upload_history.php",
		type:"POST",
   		data:{action: STATUS, email: userEMAIL},
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

function get_user_info(useremail){
	$.ajax({
    url:serverurl + "/getuserinfo.php",
    type:"POST",
   	data:{email: useremail},
    success: function(data) {
		result = jQuery.parseJSON(data);
		$.each(result, function(i, ls){
			$('#user-organization').html(ls['org']);
			$('#user-evaluate').html(ls['eva']);
			$('#user-classification').html(ls['cla']);
		});
    }
  });
}

json_file_classification = "http://ec2-52-25-205-214.us-west-2.compute.amazonaws.com/files/example_classification.json";
json_file_detection = "http://ec2-52-25-205-214.us-west-2.compute.amazonaws.com/files/example_detection.json";
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
  var classification_ = "<h4>Untrimmed video classification</h4><p>Please format your results as illustrated in the example below. You can also download this <a href='%s' target='_blank' download> example classification submission file</a>.</p><pre><code id=example-classification></code></pre>"
  classification_ = sprintf(classification_, files + '/example_submission_classification.json');
  var detection_ = "<h4>Activity detection</h4><p>Please format your results as illustrated in the example below. You can also download this <a href='%s' target='_blank' download> example detection submission file</a></p><pre><code id=example-detection></code></pre>"
  detection_ = sprintf(detection_, files + '/example_submission_detection.json');
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
			'<div id="kv-error-2" class="alert alert-danger fade in" style="margin-top:20px;display:none"></div>'+
			'</div></div></div></div>';

	$("#evaluation-page").html(html);
    load_example_formats();

    $("#file_to_upload").fileinput({
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
    });

	$("#file_to_upload").on('filebatchpreupload', function(event, data, id, index) {
		$('.kv-upload-progress').remove();
		var file_extension = data.filenames[0].split('.').pop();
		if(file_extension=="json"){
		$('#kv-success-2').html('<div style="background:url(images/process_48.gif) no-repeat center center; width=100%; height:107px;"><div class="section-title text-center" style="padding-top:86px"><span >Uploading and evaluating JSON file … This might take a few minutes</span></div></div>').show();
		}
    });

	$("#file_to_upload").on('filebatchuploadsuccess', function(event, data) {
		var out = '';
		var result_url = data.response[0];
		var metric1 = data.response[1];
		var metric2 = data.response[2];
		$.each(data.files, function(key, file) {
		  var fname = file.name;
		  out = out + '<li>' + 'Uploaded file: ' +  fname + ' successfully.' + '</li><li>mAP&nbsp=&nbsp[' + metric1 + '];&nbsp;top-k=[' + metric2 + '] </li><li>Download your results <a href="' + result_url + '" download>click here!&nbsp <i class="fa fa-download"></i></a></li>';
		 });
		$('#kv-success-2').html('<h4>Upload Status</h4><ul></ul>');
		$('#kv-success-2').fadeIn('slow');
		$('#kv-success-2 ul').append(out);
    });

	$('#file_to_upload').on('filebatchuploaderror', function(event,data) {
		$('#kv-success-2').hide();
		$('#kv-error-2').html('<div class="section-title text-center" style="padding-top:60px"><span >' + data.jqXHR.responseText + '</span></div>').show();
		$('#kv-error-2').fadeIn('slow');
	});

    $('#file_to_upload').on('filebrowse', function(event) {
		$('#file_to_upload').fileinput('clear');
		$('#kv-success-2').hide();
		$('#kv-error-2').hide();
    });

    $('#file_to_upload').on('fileclear', function(event) {
		$('#kv-success-2').hide();
		$('#kv-error-2').hide();
    });

	$('#evaluate li').on('click', function(){
		var currid = $(this).children(":first").attr('href');
		if(currid == '#classification'){
			//$(this).addClass("active").siblings().removeClass("active");
			TASKID = 1;
			$('#file_to_upload').fileinput('clear');
      		$('#kv-success-2').hide();
			$('#kv-error-2').hide();
		}else if(currid == '#detection'){
			//$(this).addClass("active").siblings().removeClass("active");
			TASKID = 2;
			$('#file_to_upload').fileinput('clear');
     		$('#kv-success-2').hide();
			$('#kv-error-2').hide();
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
			      '<th class="sort" sort_status="sortable" style="width:50px" rowspan="1" colspan="1">Top-3</th>'+
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
/*  $("#myaccount-btn").on("click", function() {
    print_myaccount_content();
  });*/
  $("#classification-btn").on("click", function() {
    print_classification_content();
  });
  $("#leadership-btn").on("click", function() {
    print_classification_result();
  });
  $("#signout-btn").on("click", function() {
    localStorage.clear();
	location.href="http://activity-net.org/evaluation.html";
    //location.reload();
  });
}
