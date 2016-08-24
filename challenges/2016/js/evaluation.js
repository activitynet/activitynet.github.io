SERVERURL = 'http://ec2-52-11-11-89.us-west-2.compute.amazonaws.com/challenge16/'
var login_data;
var leadership_data;
var EMAIL;
var PASSWORD;
var fullname;
var FIRSTNAME;
var LASTNAME;
var serverurl = "http://ec2-52-11-11-89.us-west-2.compute.amazonaws.com/evaluation_server";
var files = "http://ec2-52-11-11-89.us-west-2.compute.amazonaws.com/files";
var TASKID = 1;
var USERID;
var fullname;
var PUBLIC = 'true';
$(function() {

  print_classification_result();
  $('#login-button').on('click', function() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    $.ajax({
      	url:SERVERURL+"server.py",
      	type:"POST",
        data:{action:"user_login", email: email, password: password},
        success: function(data) {
          if (data){
          var login_data = data
          EMAIL = login_data[2];
       		PASSWORD = login_data[3];
        	FIRSTNAME = login_data[0];
        	LASTNAME = login_data[1];
          USERID = login_data[4];
			    fullname = FIRSTNAME + " " + LASTNAME;
          localStorage.setItem("EMAIL_CACHED", EMAIL);
          localStorage.setItem("PASSWORD_CACHED", PASSWORD);
          localStorage.setItem("FIRSTNAME_CACHED", FIRSTNAME);
          localStorage.setItem("LASTNAME_CACHED", LASTNAME);
          localStorage.setItem("USERID_CACHED", USERID);
          $('#login-content').remove();
          PUBLIC = 'false'
          fill_logged_content();
          print_classification_result();
          }
          else {
            var message = 'Invalid Username or Password';
            $("#warning-message_log").hide();
            $("#warning-message_log").html('<span id="warning" class="help-inline text-danger style = "font-size=10pt;" "><i class="glyphicon glyphicon-warning-sign"></i>' + message + '</span>');
            $("#warning-message_log").fadeIn('slow');

          }

        }
    });


  });

  $('#close-signup').on('click',function () {
    document.getElementById("signup").reset();
    $("#warning-register").hide();
  });

  $('#upclose').on('click',function () {
    document.getElementById("signup").reset();
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
        url:SERVERURL+"server.py",
        type:"POST",
        data:{action:"register_user_form", email: email, password: password, firstname: firstname,lastname:lastname, organization:organization},
        success: function(data) {
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

if (localStorage.getItem("EMAIL_CACHED") && localStorage.getItem("PASSWORD_CACHED")) {
  $('#email').val(localStorage.getItem("EMAIL_CACHED"));
  $('#password').val(localStorage.getItem("PASSWORD_CACHED"));
  $('#login-button').click();
}

});


function print_msg(msg){
	$("#warning-register").hide();
	$("#warning-register").html('</br><span id="warning" class="help-inline text-danger style = "font-size=10pt;" "><i class="glyphicon glyphicon-warning-sign"></i>' + msg + '</span></br>');
	$("#warning-register").fadeIn('slow');
}


function fill_logged_content() {
  print_logged();
  print_classification_content();
  pdf_upload();
  check_time();


}

function print_logged(){
  $.ajax({
    url:SERVERURL + "/logged.html",
    type:"POST",
    success: function(html) {

      var firstname = localStorage.getItem("FIRSTNAME_CACHED")
      var lastname = localStorage.getItem("LASTNAME_CACHED")
      var html_print = sprintf(html, firstname, lastname);
      document.getElementById("logged-content").innerHTML = html_print


      $("#signout-btn").on("click", function() {
        localStorage.clear();
        location.href="evaluation.html";
      });


    }
  });
}
json_file_classification = "http://ec2-52-11-11-89.us-west-2.compute.amazonaws.com/files/example_classification.json";
json_file_detection = "http://ec2-52-11-11-89.us-west-2.compute.amazonaws.com/files/example_detection.json";

function load_example_formats() {

    $.ajax({
    url:SERVERURL + "/submission_formats/example_classification.html",
    type:"POST",
    success: function(html) {
      $("#example-classification").html(html);
    }
  });
    $.ajax({
    url:SERVERURL + "/submission_formats/example_detection.html",
    type:"POST",
    success: function(html) {
      $("#example-detection").html(html);
    }
  });

}

function print_results_format(html) {
  var classification_ = "<h4>Untrimmed video classification</h4><p>Please format your results as illustrated in the example below. You can also download this <a href='%s' target='_blank' download> example classification submission file</a>.</p><pre><code id=example-classification></code></pre>"
  classification_ = sprintf(classification_, files + '/example_submission_classification_16.json');
  var detection_ = "<h4>Activity detection</h4><p>Please format your results as illustrated in the example below. You can also download this <a href='%s' target='_blank' download> example detection submission file</a></p><pre><code id=example-detection></code></pre>"
  detection_ = sprintf(detection_, files + '/example_submission_detection_16.json');
  html = sprintf(html, classification_, detection_);
  return html;
}

function print_classification_content() {
 	TASKID = 1;
  	var html = '<div id="evaluate" >'+
				  '<div class="row"><div class="col-md-12"><div class="panel with-nav-tabs panel-default">'+
					  '<div class="panel-heading"><span class="nav-tab-title pull-right">Upload your results </span>'+
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

	$("#upload_file").html(html);
    load_example_formats();

    $("#file_to_upload").fileinput({
		showPreview:false,
        maxFileCount: 1,
        uploadAsync: false,
        uploadUrl:SERVERURL + "/upload.php",
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
		$('#kv-success-2').html('<div style="background:url(../../images/process_48.gif) no-repeat center center; width=100%; height:107px;"><div class="section-title text-center" style="padding-top:86px"><span >Uploading and evaluating JSON file … This might take a few minutes</span></div></div>').show();
		}
    });

	$("#file_to_upload").on('filebatchuploadsuccess', function(event, data) {
		var out = '';
		var result_url = data.response[0];
		var metric1 = data.response[1];
		var metric2 = data.response[2];
    var metric3 = data.response[3];
		$.each(data.files, function(key, file) {
		  var fname = file.name;
		  out = out + '<li>' + fname + ' successfully uploaded.' + '</li><li>mAP=' + metric1 + ';&nbsp;Top-1=' + metric3 + ';&nbsp;Top-3=' + metric2 + ' </li><li>Download your results <a href="' + result_url + '" download>click here!&nbsp <i class="fa fa-download"></i></a></li>';
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
    check_time();
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
    check_time();

	});
}


function print_classification_result() {
	var actionstatus= "detection_action";
	var html = '<div id="evaluate" >'+
			      '<div class="row"><div class="col-md-12"><div class="panel panel-default panel-fade">'+
			          '<div class="panel-heading"><span class="nav-tab-title pull-right"> </span>'+
					  '<ul class="nav nav-tabs"><li class="active"><a href="#detection2" data-toggle="tab"><i class="glyphicon glyphicon-eye-open"></i>&nbsp;&nbsp;Detection</a></li>'+
					  '<li><a href="#classification2" data-toggle="tab"><i class="glyphicon glyphicon-tags"></i>&nbsp;Classification</a></li></ul></div>'+
			   '<div id="table-content" class="container-fluid" style="margin-top:30px;"></div>'+
			   '</div></div></div></div>';
  	$("#leader_div").html(html);
    $("#leader_div").show();
	load_leaderboard(actionstatus);
	$('#evaluate li').on('click', function(){
		var currid = $(this).children(':first').attr('href');
		if(currid == "#classification2"){
			$('#myTable tbody>tr').empty();
			actionstatus = "classification_action";
			load_leaderboard(actionstatus);
		}else if(currid == "#detection2"){
			$('#myTable tbody>tr').empty();
			actionstatus = "detection_action";
			load_leaderboard(actionstatus);
		}
	});
}

function load_leaderboard(STATUS){
	var typecontent;
	if(STATUS == "classification_action"){
		typecontent = "Leaderboard - Untrimmed Video Classification ";
	}else if(STATUS == "detection_action"){
		typecontent = "Leaderboard - Activity Detection";
	}
  if (STATUS == "classification_action") {
	   var html = '<h3>' + typecontent + '</h3>'+
			   '<table id="myTable" class="table table-striped dataTable no-footer sort_table" role="grid" style=" background-color:#EBEBEB;width:100%"><thead><tr role="row">'+
  			      '<th class="sort sorting_desc_disabled" style="width:50px" rowspan="1" colspan="1">Ranking</th>'+
			   	  '<th class="sort" style="width:50px" rowspan="1" colspan="1">Username</th>'+
			      '<th class="sort" style="width:50px" rowspan="1" colspan="1">Organization</th>'+
			      '<th class="sort" sort_status="sortable" style="width:50px" rowspan="1" colspan="1">Upload time</th>'+
			      '<th class="sort" sort_status="sortable" style="width:50px" rowspan="1" colspan="1">mAP</th>'+
            '<th class="sort" sort_status="sortable" style="width:50px" rowspan="1" colspan="1">Top-1</th>' +
			      '<th class="sort" sort_status="sortable" style="width:50px" rowspan="1" colspan="1">Top-3</th>'+
			   '</tr></thead><tbody></tbody></table>';
  }
  else if (STATUS == "detection_action") {
    var html = '<h3>' + typecontent + '</h3>'+
        '<table id="myTable" class="table table-striped dataTable no-footer sort_table" role="grid" style=" background-color:#EBEBEB;width:100%"><thead><tr role="row">'+
             '<th class="sort sorting_desc_disabled" style="width:50px" rowspan="1" colspan="1">Ranking</th>'+
           '<th class="no-sort" style="width:50px" rowspan="1" colspan="1">Username</th>'+
           '<th class="no-sort" style="width:50px" rowspan="1" colspan="1">Organization</th>'+
           '<th class="no-sort" sort_status="sortable" style="width:50px" rowspan="1" colspan="1">Upload time</th>'+
           '<th class="sort" sort_status="sortable" style="width:50px" rowspan="1" colspan="1">mAP</th>'+
           '<th class="sort" sort_status="sortable" style="width:50px" rowspan="1" colspan="1">Average-mAP</th>' +
        '</tr></thead><tbody></tbody></table>';
  }
	$("#table-content").html(html);

  if (STATUS == "classification_action") {
    get_best_result(USERID, 1)
  }
  else if (STATUS == "detection_action") {
    get_best_result(USERID, 2)
  }
  /*
		$.ajax({
		url:SERVERURL + "leadership.php",
    //url:SERVERURL + "Server/backend/api_leaderboard.py"
		type:"POST",
   		data:{action: STATUS},
      	success: function(data) {
			//Take all records from JSON
			var leadership_data = jQuery.parseJSON(data);
			 $.each(leadership_data, function(i, ls){
				 var rank = i + 1;
         if (STATUS == "classification_action") {
				    $('#myTable').append('<tr><td>'+ ls['rank'] +'</td><td>'+ ls['username'] +'</td><td>'+ ls['organization'] +'</td><td>'+ ls['uploadtime'] +'</td><td>'+ ls['metric1'] +'</td><td>'+ ls['metric2'] +'</td></tr>');
         }
         else if (STATUS == "detection_action") {
           $('#myTable').append('<tr><td>'+ ls['rank'] +'</td><td>'+ ls['username'] +'</td><td>'+ ls['organization'] +'</td><td>'+ ls['uploadtime'] +'</td><td>'+ ls['metric1'] +'</td></tr>');
         }
		  	});
			$("table.sort_table").sort_table({ "action" : "init" });
    	}
	});*/
}

function get_best_result(userid, taskid) {
  /*
  This function prints the best result for the user in the
  leaderboard table (#myTable).
  */
  console.log(PUBLIC)
  $.ajax({
    url: SERVERURL + 'Server/backend/api_leaderboard.py',
    type: 'POST',
    data: {'userid': userid, 'taskid': taskid, 'public': PUBLIC},
    success: function(data_lst) {
      var avg_mAP = [0.146,  0.178,  0.176,  0.162,  0.155,  0.148];
      for (var i=0; i<data_lst.length; i++) {
      var data = data_lst[i];
      var result_rank = i+1;
      if (taskid == 1) {
        $('#myTable').append('<tr><td>'+ result_rank +'</td><td>'+ data['username'] +'</td><td>'+ data['organization'] +'</td><td>'+ data['uploadtime'] +'</td><td>'+ data['map'] +'</td><td>'+ data['top1'] +'</td><td>'+ data['top3'] +'</td></tr>');
      }
      else if (taskid == 2) {
        $('#myTable').append('<tr><td>'+ result_rank +'</td><td>'+ data['username'] +'</td><td>'+ data['organization'] +'</td><td>'+ data['uploadtime'] +'</td><td>'+ data['map'] +'</td><td>'+ avg_mAP[i] +'</td></tr>');
      }
      }
      $("table.sort_table").sort_table({ "action" : "init" });
    }
  });
}


function pdf_upload() {
    title_explain_pdf()
    var html =  '<div id="loadpdf" >'+'<div class="row"><div class="col-md-12"><div class="panel with-nav-tabs panel-default">'
    +'<div class="panel-heading"><span class="nav-tab-title pull-right"></span>'
    html += '<input id="pdf" name="pdf" type="file" multiple=false class="file-loading" >' +
      '<div id="kv-success-3" class="alert alert-success fade in" style="margin-top:20px;display:none"></div>'+
      '<div id="kv-error-3" class="alert alert-danger fade in" style="margin-top:20px;display:none"></div>'+
      '</div></div></div></div></div>';

	$("#pdf_div").html(html);
  $("#pdf").fileinput({
  showPreview:false,
      maxFileCount: 1,
      uploadAsync: false,
      uploadUrl:SERVERURL+"upload_pdf.php",
      mainClass: "input-group-lg",
      allowedFileExtensions: ['pdf'],
      uploadExtraData: function() {
          return {
              email: EMAIL,
              taskid: TASKID

          };
      }
    });


  }

  function title_explain_pdf(){

    var html = '<h4>Upload Your PDF</h4>'
    html+=' <p>For a correct submission and participate to  this challenge. You <b>MUST BE</b> attach a pdf file describing the metod or model in detail.</p>'
    	$("#title_pdf_explain").html(html);
  }

  function check_time(){
    var userid = localStorage.getItem("USERID_CACHED");

    $.ajax({
      type:"POST",
      url:SERVERURL+"check_time.php",
      data:{userid:userid, taskid:TASKID},
      success: function(data) {
        var tt = data

        if (Boolean(tt)){
          if(tt !='"None"'){
          document.getElementById("file_to_upload").disabled = true;
          $('#kv-success-2').hide();
          $('#kv-error-2').html('<div class="section-title text-center" style="padding-top:60px"><span >' + tt + '</span></div>').show();
          $('#kv-error-2').fadeIn('slow');
        }
        else{
          document.getElementById("file_to_upload").disabled = false;
        }

        }


          }

    });
  }
