<?php
// Establish a database connection
$con = mysqli_connect('localhost', 'root', '', 'quizapp');

if (!$con) {
    die("Database connection failed: " . mysqli_connect_error());
}

// Debug: Output POST data
echo "<pre>";
print_r($_POST);
echo "</pre>";

// Retrieve and validate form data
$question = $_POST['question'] ?? '';
$option1 = $_POST['option1'] ?? '';
$option2 = $_POST['option2'] ?? '';
$option3 = $_POST['option3'] ?? '';
$option4 = $_POST['option4'] ?? '';
$answer = $_POST['correct-answer'] ?? '';

// Validate inputs
if (empty($question) || empty($option1) || empty($option2) || 
    empty($option3) || empty($option4) || empty($answer)) {
    die("<h2>Error: All fields are required.</h2>");
}

// Use a prepared statement to insert data
$query = "INSERT INTO questions (question, opt1, opt2, opt3, opt4, answer)
          VALUES (?, ?, ?, ?, ?, ?)";

$stmt = mysqli_prepare($con, $query);
if (!$stmt) {
    die("Statement preparation failed: " . mysqli_error($con));
}

// Bind parameters and execute the statement
mysqli_stmt_bind_param($stmt, 'ssssss', $question, $option1, $option2, $option3, $option4, $answer);

if (mysqli_stmt_execute($stmt)) {
    header("Location: AdminPanel.html");
    exit();
} else {
    echo "<h2>Error: " . mysqli_stmt_error($stmt) . "</h2>";
}

// Close the statement and connection
mysqli_stmt_close($stmt);
mysqli_close($con);
?>
