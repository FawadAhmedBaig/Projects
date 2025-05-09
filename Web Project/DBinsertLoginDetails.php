<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Establish a database connection
$con = mysqli_connect('localhost', 'root', '', 'quizapp') or die('Unable to connect!');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die('Invalid request method. Only POST is allowed.');
}

// Retrieve form data securely
$name = mysqli_real_escape_string($con, $_POST['txtName']);
$email = mysqli_real_escape_string($con, $_POST['txtEmail']);
$password = mysqli_real_escape_string($con, $_POST['txtPassword']);
$user_role = mysqli_real_escape_string($con, $_POST['user_role']);

// Secure password using hashing
$hashed_password = password_hash($password, PASSWORD_BCRYPT);

// Initialize the query
$query = '';
if ($user_role === 'student') {
    $table = 'StudentLoginDetails';
} elseif ($user_role === 'teacher') {
    $table = 'TeacherLoginDetails';
} else {
    die("<h2>Invalid user role specified!</h2>");
}

$query = "INSERT INTO $table (name, email, password) 
         VALUES ('$name', '$email', '$hashed_password')";

// Execute the query
if (!empty($query) && mysqli_query($con, $query)) 
{
$message = "Registered Successfully!";
echo "<script>alert('$message');</script>";
header("Location: LoginForm.html");
} 
else 
{
    echo "<h2>Error: " . mysqli_error($con) . "</h2>";
}

// Close the connection
mysqli_close($con);
?>
