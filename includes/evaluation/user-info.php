<?php
      if( isset($_SESSION['user_logged']) ){
?>
	<blockquote>
	<span style="float:left;">Welcome, <strong><?php	echo $_SESSION['user_name'] . ' ' . $_SESSION['user_lastname']; ?></strong> - </span>
	<a href="logout.php" target="_self">Sign out</a>	
	</blockquote>
<?php
      }

?>

