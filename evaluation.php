<?php
  /*require ('classes/videos.class.php');*/
  require ('classes/evaluation/users.class.php');

  //If the user has logged
  if(isset($_POST['login']))
  {
    $users = users::singleton();

    //Capture variables from POST
    $email = $_POST['email'];
    $password = md5($_POST['password']);

    $users->userLogin($email, $password);
  }
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>ActivityNet</title>
  <link rel="stylesheet" type="text/css" href="css/yeti.css">
	<link rel="stylesheet" type="text/css" href="css/style.css">
  <script type="text/javascript" src="js/evaluation/jquery.js"></script>  
  <script type="text/javascript" src="js/evaluation/bootstrap.js"></script>

  <!-- Add Fancybox plugin -->
  <link rel="stylesheet" href="js/fancybox/source/jquery.fancybox.css" type="text/css" media="screen" />
  <script type="text/javascript" src="js/fancybox/source/jquery.fancybox.js"></script>
</head>
<body>

<?php include ('includes/evaluation/nav-user.php'); ?>	

<header class="bs-header title" id="content">
<div class="container" id="title">
  <h1>ActivityNet</h1>
  <p>A Large-Scale Video Benchmark for Human Activity Understanding</p>
  <br>
</div>
</header>

<div class="container"> <?php include('includes/evaluation/user-reg.php'); ?></div>

<!--<div class="container">
<div class="col-md-4">
<h2 class="subtitle">Categories</h2>
</div>
</div>-->
</body>
</html>
