# Online Quiz Website (QuizMaster)

Welcome to **QuizMaster**, your ultimate platform for creating, managing, and taking online quizzes! This project is a web-based quiz application that allows students to take quizzes across various categories and enables teachers to manage quiz questions.

## 🚀 Features

### For Students
- **User Authentication:** Secure signup and login for students.
- **Multiple Categories:** Choose from various quiz categories like General Knowledge (GK), Physics, and Sports.
- **Interactive Quizzes:** Take quizzes with a user-friendly interface.
- **Instant Results:** Get your score calculated immediately after submitting the quiz.

### For Teachers (Admin)
- **Admin Panel:** A dedicated dashboard for teachers.
- **Manage Questions:** Add new questions with options and the correct answer directly to the database.
- **Secure Access:** Separate login system for teachers to ensure secure access to the admin panel.

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** PHP
- **Database:** MySQL

## 📂 Project Structure

- `MainPage.html` - The landing page of the application.
- `LoginForm.html` & `SignupForm.html` - User authentication pages.
- `AdminPanel.html` - Dashboard for teachers to manage questions.
- `quizGK.html`, `quizPhysics.html`, `quizSports.html` - Quiz pages for different categories.
- `DBcheckLoginDetails.php`, `DBinsertLoginDetails.php` - PHP scripts for user authentication (hashing passwords with bcrypt).
- `DBaddEditQuestions.php` - PHP script for adding new questions to the database.
- `Style.css`, `StyleAdminPanel.css`, `StyleLogin.css`, etc. - Stylesheets for different pages.

## ⚙️ Setup and Installation

To run this project locally, follow these steps:

1. **Prerequisites:** Make sure you have a local web server environment installed, such as [XAMPP](https://www.apachefriends.org/index.html), [WAMP](https://www.wampserver.com/en/), or MAMP.
2. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/Online-Quiz-Website.git
   ```
3. **Move Files:** Move the project folder to your web server's root directory (e.g., `htdocs` for XAMPP or `www` for WAMP).
4. **Database Setup:**
   - Open phpMyAdmin (usually `http://localhost/phpmyadmin`).
   - Create a new database named `quizapp`.
   - Run the necessary SQL queries to create the following tables:
     - `StudentLoginDetails` (columns: id, name, email, password)
     - `TeacherLoginDetails` (columns: id, name, email, password)
     - `questions` (columns: id, question, opt1, opt2, opt3, opt4, answer)
5. **Configuration:** If your MySQL setup uses a different username or password, update the database connection strings in the PHP files (`DBcheckLoginDetails.php`, `DBinsertLoginDetails.php`, `DBaddEditQuestions.php`).
   ```php
   $con = mysqli_connect('localhost', 'root', '', 'quizapp');
   ```
6. **Run the Application:** Open your web browser and navigate to `http://localhost/Online-Quiz-Website/MainPage.html`.

## 🔒 Security

- Passwords are securely hashed using `password_hash()` (bcrypt) before being stored in the database.
- Database queries use prepared statements and `mysqli_real_escape_string()` to prevent SQL injection attacks.

## 📄 License

This project is open-source and available under the MIT License.
