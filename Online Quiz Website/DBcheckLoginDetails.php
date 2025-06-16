<?php
// Establish a database connection
$con = mysqli_connect('localhost', 'root', '', 'quizapp') or die('Unable to connect!');

// Retrieve form data securely
$email = mysqli_real_escape_string($con, $_POST['txtEmail']);
$password = mysqli_real_escape_string($con, $_POST['txtPassword']);
$user_role = mysqli_real_escape_string($con, $_POST['user_role']);

// Determine table based on user role
if ($user_role === 'student') {
    $table = 'StudentLoginDetails';
} elseif ($user_role === 'teacher') {
    $table = 'TeacherLoginDetails';
} else {
    die("<h2>Invalid user role specified!</h2>");
}

// Query to fetch the user by email
$query = "SELECT * FROM $table WHERE email = '$email'";
$result = mysqli_query($con, $query);

if ($result && mysqli_num_rows($result) > 0) {
    $user = mysqli_fetch_assoc($result);

    var_dump($user['password']);
    var_dump(password_verify($password, $user['password']));
    
    // Verify the password
    if (password_verify($password, $user['password'])) {
        if ($user_role === 'teacher'){
        header("Location: AdminPanel.html");
        }
        else{
        header("Location: category.html");
        }
        exit();
        session_start();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_role'] = $user_role;
    } else {
        // echo "<h2>Invalid password!</h2>";
        header("Location: error2.html");
    }
} else {
    // echo "<h2>User not found in $user_role table!</h2>";
    header("Location: error.html");
}

// Close the connection
mysqli_close($con);
?>