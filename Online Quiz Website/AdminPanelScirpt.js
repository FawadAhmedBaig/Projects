// script.js

document.addEventListener("DOMContentLoaded", () => {
    const addQuestionBtn = document.getElementById("add-question-btn");
    const manageQuestionsBtn = document.getElementById("manage-questions-btn");
    const addQuestionSection = document.getElementById("add-question-section");
    const manageQuestionsSection = document.getElementById("manage-questions-section");
    const addQuestionForm = document.getElementById("add-question-form");
    const questionsList = document.getElementById("questions-list");
  
    let questions = [];
  
    addQuestionBtn.addEventListener("click", () => {
      addQuestionSection.classList.remove("hidden");
      manageQuestionsSection.classList.add("hidden");
    });
  
    manageQuestionsBtn.addEventListener("click", () => {
      manageQuestionsSection.classList.remove("hidden");
      addQuestionSection.classList.add("hidden");
      renderQuestions();
    });
  
    addQuestionForm.addEventListener("submit", (e) => {
      alert("Question Added!");
      addQuestionForm.reset();
    });
  
    function renderQuestions() {
      questionsList.innerHTML = "";
      questions.forEach((q, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.innerHTML = `
          <p><strong>Q${index + 1}:</strong> ${q.text}</p>
          <ul>
            ${q.options.map((opt, i) => `<li>${i + 1}. ${opt}</li>`).join("")}
          </ul>
          <p><strong>Correct Answer:</strong> Option ${q.correct}</p>
        `;
        questionsList.appendChild(questionDiv);
      });
    }
  });
  