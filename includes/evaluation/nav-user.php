<nav class="navbar navbar-default" role="navigation">
  <!-- Collect the nav links, forms, and other content for toggling -->
  <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
  <ul class="nav navbar-nav navbar-left">
  <?php
    if(!isset($_SESSION['user_logged'])) 
    {
      echo '<li><a href="evaluation.php"><img src="images/activity-logo.png" height="40" width="160"alt="logo"></a></li>';
    }
    else
    {
      echo '<li><a href="evaluation.php">Welcome! <strong>' . $_SESSION['user_name'] . ' ' . $_SESSION['user_lastname'] . '</strong></a></li>';
    }
  ?>    

  </ul>
    <ul class="nav navbar-nav navbar-right">
    <?php
      // If there is no user logged, display login form
      if(!isset($_SESSION['user_logged'])) {
        ?>
              <li><a data-toggle="modal" data-target="#signup-modal"  href="#"> <span class="glyphicon glyphicon-user"></span> Sign up</a></li>
              <form action="" method="post" class="navbar-form navbar-left" role="form">
                <div class="form-group">
                  <input type="email" class="form-control" name="email" id="email" placeholder="Email">
                </div>
                <div class="form-group">            
                  <input type="password" class="form-control" name="password" id="password" placeholder="Password">
                </div>
                <button type="submit" id="login-button" name="login" class="btn btn-primary btn-xs"> <span class="glyphicon glyphicon-ok-sign"></span> Sign in</button>
              </form>

            <?php
      } else {
      // Displaying common navbar in case there is a user logged
        ?>
              <li><a href="#"> <span class="glyphicon glyphicon-film"></span> Evoluation</a></li>
              <li><a href="#"> <span class="glyphicon glyphicon-tasks"></span> Leaderboard</a></li>
              <li><a href="#"> <span class="glyphicon glyphicon-user"></span> Contact</a></li>
              <li><a style="font-size: 16px;" href="logout.php"><span class="label label-danger">Sign out</span> </a></li>
        <?php
      }

    ?>
    </ul>
  </div><!-- /.navbar-collapse -->
</nav>




