const questions = [
    { question: "Яка столиця України?", answer: "київ" },
    { question: "Яка найбільша річка України?", answer: "дніпро" },
    { question: "Яка найвища гора України?", answer: "говерла" },
    { question: "Яке місто є найбільшим за населенням в Україні?", answer: "київ" },
    { question: "Яка офіційна мова України?", answer: "українська" },
    { question: "Яка валюта України?", answer: "гривня" },
    { question: "Яка столиця Франції?", answer: "париж" },
    { question: "Яка найменша держава за площею у світі?", answer: "ватикан" },
    { question: "Яка планета відома як Червона планета?", answer: "марс" },
    { question: "Скільки місяців у році?", answer: "12" }
];

let currentIndex = 0;
let score = 0;

const questionText = document.getElementById("questionText");
const answerInput = document.getElementById("answerInput");
const submitBtn = document.getElementById("submitBtn");
const progressText = document.getElementById("progressText");
const resultText = document.getElementById("resultText");

function showQuestion() {
    const current = questions[currentIndex];
    questionText.textContent = current.question;
    progressText.textContent = `Питання ${currentIndex + 1} з ${questions.length}`;
    answerInput.value = "";
    answerInput.disabled = false;
    submitBtn.disabled = false;
    resultText.textContent = "";
    answerInput.focus();
}

function finishQuiz() {
    questionText.textContent = "Тест завершено";
    progressText.textContent = `Ваш результат: ${score} з ${questions.length}`;
    answerInput.disabled = true;
    submitBtn.disabled = true;
}

function submitAnswer() {
    const answer = answerInput.value.trim().toLowerCase();
    const current = questions[currentIndex];

    if (answer === current.answer) {
        score++;
        resultText.textContent = "Правильно!";
        resultText.style.color = "#15803d";
    } else {
        resultText.textContent = `Неправильно. Правильна відповідь: ${current.answer}`;
        resultText.style.color = "#b91c1c";
    }

    currentIndex += 1;
    answerInput.disabled = true;
    submitBtn.disabled = true;

    setTimeout(() => {
        if (currentIndex < questions.length) {
            showQuestion();
        } else {
            finishQuiz();
        }
    }, 600);
}

submitBtn.addEventListener("click", submitAnswer);
answerInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        submitAnswer();
    }
});

showQuestion();