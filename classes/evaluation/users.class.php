<?php

Class Users
{
    private $connection;
    private static $instance;

    private function __construct()
    {
        require_once(__DIR__.'/../includes/configuration_evaluation.php');

        try
        {
            $this->connection = new PDO("mysql:host={$mysql_host};dbname={$mysql_database}", $mysql_user, $mysql_password);
            $this->connection->exec('SET CHARACTER SET uft8');
        }  
        catch(PDOException $exception)
        {
            echo "Connection error: " . $exception->getMessage();
            die();
        }
    }

    public static function singleton()
    {
        if(!isset(self::$instance))
        {
            $class = __CLASS__;
            self::$instance = new $class;
        }

        return self::$instance;
    }

    public function getUsers()
    {
        try
        {
            $query = $this->connection->prepare("SELECT id, name, lastname, email FROM users");
            $query->execute();
            return $query->fetchAll();
            $this->connection = null;
        }
        catch(PDOException $error)
        {
            echo "Error: " . $error;
        }
    }

    public function checkId($id)
    {
        if(isset($id))  
        {
            return $id;
        }
        else
        {
            header('Location: users.php');
        }
    }

    public function getUserbyId($id)
    {
        try
        {
            $query = $this->connection->prepare("SELECT id, name, lastname, email FROM users WHERE id = $id");
            $query->execute();
            return $query->fetchAll();
            $this->connection = null;
        }
        catch(PDOException $error)
        {
            echo "Error: " . $error;
        }        
    }

    public function checkUsers()
    {
        $ids = "";
      
        foreach($_POST as $key => $value)
        {      
            if($key != 'users-delete')
            {           
                $ids.="id=$value or ";            
            }                       
        }
        $ids.="id=-1";

        return $ids;
    }


    public function deleteUser($condition)
    {
        try
        {
            $query = $this->connection->prepare("DELETE FROM users WHERE $condition");
            $query->execute();
            echo '<div class="alert alert-success">User(s) deleted succesfully</div>';
        }
        catch(PDOException $error)
        {
            echo "Error: " . $error;
        }
    }

    public function addUser($name, $lastname, $email, $password, $created)
    {
		/*echo "test_addUser";*/
        try
        {
            $query = $this->connection->prepare("INSERT INTO users(name,lastname,email,password,created) VALUES('$name','$lastname','$email','$password','$created')");
			
			echo "name".$name."<br/>lastname".$lastname."<br/>email".$email."<br/>password".$password."<br/>created".$created;

            $query->execute();
            $this->connection = null;

        }
        catch(PDOException $error)
        {
            echo "Error: " . $error;
        }
		
    }

    public function updateUser($id, $name, $lastname, $email, $password, $modified)
    {
        try
        {
            $query = $this->connection->prepare("UPDATE users SET name = '$name', lastname = '$lastname', email = '$email', password = '$password', modified = '$modified' WHERE id = $id");
            $query->execute();  
        }
        catch(PDOException $error)
        {
            echo "Error: " . $error;
        }
    }

    public function checkFields($name, $lastname, $email, $password)
    {
        $results = array();
        $answer;

        if(!isset($name) || empty($name))     // If name is blank
        {
            $answer = "Field name is empty";
            $results[] = $answer;
        }

        if(!isset($lastname) || empty($lastname))     // If lastname is blank
        {
            $answer = "Field lastname is empty";
            $results[] = $answer;
        }

        if(!isset($email) || empty($email))     // If email is blank and it valid if exists
        {
            $answer = "Field email is empty";
            $results[] = $answer;            
        }
        else
        {
            if(!filter_var($email, FILTER_VALIDATE_EMAIL))
            {
                $answer = "This email is not a vaild email";
                $results[] = $answer;                
            }   
        }

        if(!isset($password) || empty($password))     // If password is blank
        {
            $answer = "Field password is empty";
            $results[] = $answer;            
        }        

        return $results;
    }

    public function adminLogin($email, $password)
    {
        try
        {
            $query = $this->connection->prepare("SELECT id, name, lastname, email FROM users WHERE email='$email' and password='$password' and enabled = 1");
            $query->execute();
            $admin = $query->fetchAll();
            $this->enableSession("admin", $admin);
            $this->connection = null;

        }
        catch(PDOException $error)
        {
            echo "Error: " . $error;
        }
    }

    public function userLogin($email, $password)
    {
        try
        {
            $query = $this->connection->prepare("SELECT id, name, lastname, email FROM users WHERE email='$email' and password='$password' and enabled = 0");
            $query->execute();
            $user = $query->fetch(PDO::FETCH_ASSOC);
            $this->enableSession("user", $user);
            $this->connection = null;

        }
        catch(PDOException $error)
        {
            echo "Error: " . $error;
        }
    }


    public function enableSession($condition, $row)
    {
        if($condition == "admin")
        {
            $_SESSION['logged'] = true;
            $_SESSION['id'] = $row['id'];
            $_SESSION['name'] = $row['name'];
            $_SESSION['lastname'] = $row['lastname'];
            $_SESSION['email'] = $row['email'];

            header('Location: users.php');
        }
        if($condition == "user")
        {
            $_SESSION['user_logged'] = true;
            $_SESSION['user_id'] = $row['id'];
            $_SESSION['user_name'] = $row['name'];
            $_SESSION['user_lastname'] = $row['lastname'];
            $_SESSION['user_email'] = $row['email'];

            //header('Location: browse.php');
        }
    }


    public function DisplayEmptyFields($results)
    {
        foreach ($results as $result) {
            echo '<div class="alert alert-danger">Whoops! error found: '. $result . ' </div>';
          }
    }

    public function DisplayMessage($message)
    {
        echo '<div class="alert alert-success">' . $message . '. Press <a href="users.php" target="_self">Here</a> to go back</div>';        
    }

    public function __clone()
    {
        trigger_error("Cloning unavailable",E_USER_ERROR);
    }

}

?>