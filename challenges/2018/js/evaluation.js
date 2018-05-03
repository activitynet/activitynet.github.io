SERVERURL = 'http://ec2-52-11-11-89.us-west-2.compute.amazonaws.com/challenge18/'
var login_data;
var leadership_data;
var EMAIL;
var TOSAVE;
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

  //print_results()

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
          fill_logged_content();
          
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
  //pdf_upload();
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

      print_results();


    }
  });
}
json_file_classification = "http://ec2-52-11-11-89.us-west-2.compute.amazonaws.com/files/example_classification.json";
json_file_detection = "http://ec2-52-11-11-89.us-west-2.compute.amazonaws.com/files/example_detection.json";

function load_example_formats() {

  //   $.ajax({
  //   url:SERVERURL + "/submission_formats/example_untrimmed.html",
  //   type:"POST",
  //   success: function(html) {
  //     $("#example-untrimmed").html(html);
  //   }
  // });

    $.ajax({
    url:SERVERURL + "/submission_formats/example_proposals.html",
    type:"POST",
    success: function(html) {
      $("#example-proposals").html(html);
    }
  });

    $.ajax({
    url:SERVERURL + "/submission_formats/example_localization.html",
    type:"POST",
    success: function(html) {
      $("#example-localization").html(html);
    }
  });

    $.ajax({
    url:SERVERURL + "/submission_formats/example_captioning.html",
    type:"POST",
    success: function(html) {
      $("#example-captioning").html(html);
    }
  });

    $.ajax({
      url:SERVERURL + "/submission_formats/example_trimmed.html",
      type:"POST",
      success: function(html) {
        $("#example-trimmed").html(html);
      }
    });

    $.ajax({
      url:SERVERURL + "/submission_formats/example_spatiotemporal.html",
      type:"POST",
      success: function(html) {
        $("#example-spatiotemporal").html(html);
      }
    });

    $.ajax({
      url:SERVERURL + "/submission_formats/example_spatiotemporal.html",
      type:"POST",
      success: function(html) {
        $("#example-spatiotemporal_full").html(html);
      }
    });

}

function print_results_format(html) {
  // var untrimmed_ = "<h3>Submit Your Results</h3><h4>Untrimmed Video Classification</h4><p>Please format your results as illustrated in the example below. You can also download this <a href='%s' target='_blank' download> example submission file</a>. For anonymous submissions please contact us at fabian.caba@kaust.edu.sa</p><pre><code id=example-untrimmed></code></pre>"
  // untrimmed_ = sprintf(untrimmed_, SERVERURL + "/submission_formats/example_untrimmed.json");

  var proposals_ = "<h3>Submit Your Results</h3><h4>Temporal Action Proposals</h4><p>Please format your results as illustrated in the example below. You can also download this <a href='%s' target='_blank' download> example submission file</a>. For anonymous submissions please contact us at fabian.caba@kaust.edu.sa</p><pre><code id=example-proposals></code></pre>"
  proposals_ = sprintf(proposals_, SERVERURL + "/submission_formats/example_proposals.json");

  var localization_ = "<h3>Submit Your Results</h3><h4>Temporal Action Localization</h4><p>Please format your results as illustrated in the example below. You can also download this <a href='%s' target='_blank' download> example submission file</a>. For anonymous submissions please contact us at fabian.caba@kaust.edu.sa</p><pre><code id=example-localization></code></pre>"
  localization_ = sprintf(localization_, SERVERURL + "/submission_formats/example_localization.json");

  var captioning_ = "<h3>Submit Your Results</h3><h4>Dense-Captioning Events in Videos</h4><p>Please format your results as illustrated in the example below. You can also download this <a href='%s' target='_blank' download> example submission file</a>. For anonymous submissions please contact us at fabian.caba@kaust.edu.sa</p><pre><code id=example-captioning></code></pre>"
  captioning_ = sprintf(captioning_, SERVERURL + "/submission_formats/example_captioning.json");
  //var captioning_ = "<h4>Dense-Captioning Events in Videos</h4><p>Evaluation server for this task will be available soon.</p>"

  var trimmed_ = "<h3>Submit Your Results</h3><h4>Trimmed Activity Recognition (Kinetics)</h4><p>Please format your results as illustrated in the example below. You can also download this <a href='%s' target='_blank' download> example submission file</a>. For anonymous submissions please contact us at fabian.caba@kaust.edu.sa</p><pre><code id=example-trimmed></code></pre>"
  trimmed_ = sprintf(trimmed_, SERVERURL + "/submission_formats/example_trimmed.json");

  var spatiotemporal_ = "<h3>Submit Your Results</h3><h4>Spatio-temporal Action Localization (AVA - Computer Vision ONLY)</h4><p>Please format your results as illustrated in the example below. You can also download this <a href='%s' target='_blank' download> example submission file</a>. For anonymous submissions please contact us at fabian.caba@kaust.edu.sa</p><pre><code id=example-spatiotemporal></code></pre>"
  spatiotemporal_ = sprintf(spatiotemporal_, SERVERURL + "/submission_formats/example_spatiotemporal.csv");

  var spatiotemporal_full_ = "<h3>Submit Your Results</h3><h4>Spatio-temporal Action Localization (AVA - Full)</h4><p>Please format your results as illustrated in the example below. You can also download this <a href='%s' target='_blank' download> example submission file</a>. For anonymous submissions please contact us at fabian.caba@kaust.edu.sa</p><pre><code id=example-spatiotemporal_full></code></pre>"
  spatiotemporal_full_ = sprintf(spatiotemporal_full_, SERVERURL + "/submission_formats/example_spatiotemporal.csv");

  //html = sprintf(html, untrimmed_, trimmed_, proposals_, localization_, captioning_);
  html = sprintf(html, proposals_, localization_, captioning_, trimmed_, spatiotemporal_, spatiotemporal_full_);
  return html;
}

function print_classification_content() {
 	TASKID = 1;

    var html = '<div id="evaluate" >'+
          '<div class="row"><div class="col-md-12"><div class="panel with-nav-tabs panel-default">'+
            '<div class="panel-heading">'+//<span class="nav-tab-title pull-right">Upload your results </span>'+
            '<ul class="nav nav-tabs"><li class="active"><a href="#proposals" data-toggle="tab">&nbsp;Proposals</a></li>'+
            '<li><a href="#localization" data-toggle="tab">&nbsp;Temporal Localization</a></li>'+
            '<li><a href="#captioning" data-toggle="tab">&nbsp;Captioning</a></li>'+
            '<li><a href="#trimmed" data-toggle="tab">&nbsp;Kinetics</a></li>'+
            '<li><a href="#spatiotemporal" data-toggle="tab">&nbsp;AVA (#1)</a></li>'+
            '<li><a href="#spatiotemporal_full" data-toggle="tab">&nbsp;AVA (#2)</a></li></ul></div>'+
            '<div class="panel-body"><div class="tab-content">'+
              '<div class="tab-pane active" id="proposals">%s</div>'+
              '<div class="tab-pane" id="localization">%s</div>'+
              '<div class="tab-pane" id="captioning">%s</div>'+
              '<div class="tab-pane" id="trimmed">%s</div>'+
              '<div class="tab-pane" id="spatiotemporal">%s</div>'+
              '<div class="tab-pane" id="spatiotemporal_full">%s</div>'+
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
        allowedFileExtensions: ["json", "csv"],
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
		$('#kv-success-2').html('<div style="background:url(../../images/process_48.gif) no-repeat center center; width=100%; height:107px;"><div class="section-title text-center" style="padding-top:86px"><span >Uploading and evaluating your JSON file. This might take few minutes. We will send you an email when we are done processing your file.</span></div></div>').show();
		}

    if(file_extension=="csv"){
    $('#kv-success-2').html('<div style="background:url(../../images/process_48.gif) no-repeat center center; width=100%; height:107px;"><div class="section-title text-center" style="padding-top:86px"><span >Uploading and evaluating your JSON file. This might take few minutes. We will send you an email when we are done processing your file.</span></div></div>').show();
    }

    });

	$("#file_to_upload").on('filebatchuploadsuccess', function(event, data) {
		var out = '';
		//var result_url = data.response[0];
    TOSAVE = data;
		var metric1 = data.response;
		//var metric2 = data.response[2];
    //var metric3 = data.response[3];
		$.each(data.files, function(key, file) {
		  var fname = file.name;
		  out = out + '<li>' + fname + ' successfully uploaded.' + '</li><li>Performance = ' + metric1; //+ ';&nbsp;Top-1=' + metric3 + ';&nbsp;Top-3=' + metric2 + ' </li><li>Download your results <a href="' + result_url + '" download>click here!&nbsp <i class="fa fa-download"></i></a></li>';
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
		// if(currid == '#untrimmed'){
		// 	//$(this).addClass("active").siblings().removeClass("active");
		// 	TASKID = 1;
		// 	$('#file_to_upload').fileinput('clear');
  //     		$('#kv-success-2').hide();
		// 	$('#kv-error-2').hide();
		// }else if(currid == '#trimmed'){
		// 	//$(this).addClass("active").siblings().removeClass("active");
		// 	TASKID = 2;
		// 	$('#file_to_upload').fileinput('clear');
  //    		$('#kv-success-2').hide();
		// 	$('#kv-error-2').hide();
		// }else 
    if(currid == '#proposals'){
      //$(this).addClass("active").siblings().removeClass("active");
      TASKID = 1;
      $('#file_to_upload').fileinput('clear');
        $('#kv-success-2').hide();
      $('#kv-error-2').hide();
    }else if(currid == '#localization'){
      //$(this).addClass("active").siblings().removeClass("active");
      TASKID = 2;
      $('#file_to_upload').fileinput('clear');
        $('#kv-success-2').hide();
      $('#kv-error-2').hide();
    }else if(currid == '#captioning'){
      //$(this).addClass("active").siblings().removeClass("active");
      TASKID = 3;
      $('#file_to_upload').fileinput('clear');
        $('#kv-success-2').hide();
      $('#kv-error-2').hide();
    }else if(currid == '#trimmed'){
      //$(this).addClass("active").siblings().removeClass("active");
      TASKID = 4;
      $('#file_to_upload').fileinput('clear');
        $('#kv-success-2').hide();
      $('#kv-error-2').hide();
    }
    else if(currid == '#spatiotemporal'){
      //$(this).addClass("active").siblings().removeClass("active");
      TASKID = 5;
      $('#file_to_upload').fileinput('clear');
        $('#kv-success-2').hide();
      $('#kv-error-2').hide();
    }
    else if(currid == '#spatiotemporal_full'){
      //$(this).addClass("active").siblings().removeClass("active");
      TASKID = 6;
      $('#file_to_upload').fileinput('clear');
        $('#kv-success-2').hide();
      $('#kv-error-2').hide();
    }
    check_time();

	});
}

function print_results() {

    var html = '<div id="leaderboard" >'+
          '<div class="row"><div class="col-md-12"><div class="panel with-nav-tabs panel-default">'+
            '<div class="panel-heading">'+//<span class="nav-tab-title pull-right">Leadership board </span>'+
            '<ul class="nav nav-tabs"><li class="active"><a href="#leaderboard_proposals" data-toggle="tab">&nbsp;Proposals</a></li>'+
            '<li><a href="#leaderboard_localization" data-toggle="tab">&nbsp;Temporal Localization</a></li>'+
            '<li><a href="#leaderboard_captioning" data-toggle="tab">&nbsp;Captioning</a></li>'+
            '<li><a href="#leaderboard_trimmed" data-toggle="tab">&nbsp;Kinetics</a></li>'+
            '<li><a href="#leaderboard_spatiotemporal" data-toggle="tab">&nbsp;AVA (#1)</a></li>'+
            '<li><a href="#leaderboard_spatiotemporal_full" data-toggle="tab">&nbsp;AVA (#2)</a></li></ul></div>'+
            '<div class="panel-body"><div class="tab-content">'+
              '<div class="tab-pane active" id="leaderboard_proposals"></div>'+
              '<div class="tab-pane" id="leaderboard_localization"></div>'+
              '<div class="tab-pane" id="leaderboard_captioning"></div>'+
              '<div class="tab-pane" id="leaderboard_trimmed"></div>'+
              '<div class="tab-pane" id="leaderboard_spatiotemporal"></div>'+
              '<div class="tab-pane" id="leaderboard_spatiotemporal_full"></div>'+
            '</div><div id="table-content" class="container-fluid" style="margin-top:30px;"></div></div>';

    $("#leader_div").append(html);
    $("#leader_div").show();
  load_leaderboard(actionstatus='proposals');
  $('#leaderboard li').on('click', function(){
    var currid = $(this).children(':first').attr('href');

    if(currid == "#leaderboard_proposals"){
      $('#myTable tbody>tr').empty();
      actionstatus = "proposals";
      load_leaderboard(actionstatus);
    }
    else if(currid == "#leaderboard_localization"){
      $('#myTable tbody>tr').empty();
      actionstatus = "localization";
      load_leaderboard(actionstatus);
    }
    else if (currid == "#leaderboard_captioning"){
      $('#myTable tbody>tr').empty();
      actionstatus = "captioning";
      load_leaderboard(actionstatus);
    }
    else if (currid == "#leaderboard_trimmed"){
      $('#myTable tbody>tr').empty();
      actionstatus = "trimmed";
      load_leaderboard(actionstatus);
    }
    else if (currid == "#leaderboard_spatiotemporal"){
      $('#myTable tbody>tr').empty();
      actionstatus = "spatiotemporal";
      load_leaderboard(actionstatus);
    }
    else if (currid == "#leaderboard_spatiotemporal_full"){
      $('#myTable tbody>tr').empty();
      actionstatus = "spatiotemporal_full";
      load_leaderboard(actionstatus);
    }
  });
}

function load_leaderboard(STATUS){
	var typecontent;
 
  if(STATUS == "proposals"){
    typecontent = "Temporal Action Proposals";
    var performance = 'AUC'
  }
  else if(STATUS == "localization"){
    typecontent = "Temporal Action Localization";
    var performance = 'Avg. mAP'
  }
  else if(STATUS == "captioning"){
    typecontent = "Dense-Captioning Events in Videos";
    var performance = 'Avg. Meteor'
  }
  else if(STATUS == "trimmed"){
    typecontent = "Trimmed Activity Recognition (Kinetics)";
    var performance = 'Avg. Error'
  }
  else if(STATUS == "spatiotemporal"){
    typecontent = "Spatio-temporal Action Localization (AVA - Computer Vision ONLY)";
    var performance = 'mAP@0.5IoU'
  }
  else if(STATUS == "spatiotemporal_full"){
    typecontent = "Spatio-temporal Action Localization (AVA - Full)";
    var performance = 'mAP@0.5IoU'
  }
  var html = '<h3>' + typecontent + '</h3>'+
		   '<table id="myTable" class="table table-striped dataTable no-footer sort_table" role="grid" style=" background-color:#EBEBEB;width:100%"><thead><tr role="row">'+
			      '<th class="sort sorting_desc_disabled" style="width:50px" rowspan="1" colspan="1">Ranking</th>'+
		   	  '<th class="sort" style="width:50px" rowspan="1" colspan="1">Username</th>'+
		      '<th class="sort" style="width:50px" rowspan="1" colspan="1">Organization</th>'+
		      '<th class="sort" sort_status="sortable" style="width:50px" rowspan="1" colspan="1">Upload time</th>'+
		      '<th class="sort" sort_status="sortable" style="width:50px" rowspan="1" colspan="1">' + performance + '</th>'+
		   '</tr></thead><tbody></tbody></table>';

	$("#table-content").html(html);

  var task_mapping = {'proposals': 1, 'localization': 2, 'captioning': 3, 'trimmed': 4, 'spatiotemporal': 5, 'spatiotemporal_full': 6}
  get_best_result(USERID, task_mapping[STATUS])

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
      for (var i=0; i<data_lst.length; i++) {
      var data = data_lst[i];
      var result_rank = i+1;
      console.log(data)
      $('#myTable').append('<tr><td>'+ result_rank +'</td><td>'+ data['username'] +'</td><td>'+ data['organization'] +'</td><td>'+ data['uploadtime'] +'</td><td>'+ data['metric'] +'</td></tr>');
      }
      $("table.sort_table").sort_table({ "action" : "init" });
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
