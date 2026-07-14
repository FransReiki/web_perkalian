let questionList = []; //isinya [[first factor, second factor, correct answer]]
let worksheet = []; //isinya [[soal, jawaban siswa]]
let repeatQuestionHistory = []; //isinya [[soal 1, jawaban, jawaban benar, true/false]]
let answerHistory = []; //isinya [[soal 1, jawaban, jawaban benar, true/false], [soal 2, jawaban, jawaban benar, true/false] ]
let currentQuestion = 0;
let isRepeatQuestionStatus = false;
let totalQuestion = 0;

function restart() {
    location.reload();
}

function generateQuestion() {
    let firstFactor;
    let secondFactor;

    questionList = [];
    worksheet = [];
    totalQuestion = 0;
    currentQuestion = 0;

    for (firstFactor = 0; firstFactor <= 10; firstFactor++) {
        let repeatFactor = [];
        for (secondFactor = firstFactor; secondFactor <= 10; secondFactor++) {
            let result = firstFactor * secondFactor
            repeatFactor.push([firstFactor, secondFactor, result]);
        }
        questionList.push(repeatFactor);
    }

    for (let i = 0; i <= 10; i++) {
        let tempLength = questionList[i].length
        for (let j = 0; j < tempLength; j++) {
            let question = `${questionList[i][j][0]} x ${questionList[i][j][1]}`  //nanti yang ditampilkan
            // currentQuestion = result;
            worksheet.push([question]);
            totalQuestion++;
        }
    }

}

function displayQuestion() {
    let question = worksheet[currentQuestion][0];
    return question;
}

function inputAnswer(answer) {
    worksheet[currentQuestion].push(answer)
}

function findAnswerKey(worksheet) {
    let status = false;
    let rowCheck;
    let indexCheck;

    if (isRepeatQuestionStatus) { //kalau ada pengulangan
        let startIndex = totalQuestion - (worksheet.length - totalQuestion);
        if (startIndex < 0 || startIndex >= worksheet.length) startIndex = 0;

        for (let index = startIndex; index < worksheet.length; index++) {
            if (worksheet[index].length < 2) continue;

            let question = worksheet[index][0].split(' ')
            let firstFactor = question[0];
            let secondFactor = question[2];

            for (let i = 0; i <= 10; i++) {//mencari di questionList
                let tempLength = questionList[i].length;
                for (let j = 0; j < tempLength; j++) {
                    if (questionList[i][j][0] === Number(firstFactor) && questionList[i][j][1] === Number(secondFactor)) {
                        rowCheck = i;
                        indexCheck = j;
                        status = true;
                        break;
                    }
                    status = false;
                }
                if (status) break;
            }
            let answer = worksheet[index][1]
            checkResult(rowCheck, indexCheck, answer)
        }

    } else { //kalau gaada perulangan
        for (let index = 0; index < worksheet.length; index++) {
            if (worksheet[index].length < 2) continue;

            let question = worksheet[index][0].split(' ')
            let firstFactor = question[0];
            let secondFactor = question[2];

            for (let i = 0; i <= 10; i++) {
                let tempLength = questionList[i].length;
                for (let j = 0; j < tempLength; j++) {
                    if (questionList[i][j][0] === Number(firstFactor) && questionList[i][j][1] === Number(secondFactor)) {
                        rowCheck = i;
                        indexCheck = j;
                        status = true;
                        break;
                    }
                    status = false;
                }
                if (status) break;
            }
            let answer = worksheet[index][1]
            checkResult(rowCheck, indexCheck, answer)
        }
    }


}
function checkResult(rowCheck, indexCheck, answer) {
    let tempQuestion = `${questionList[rowCheck][indexCheck][0]} x ${questionList[rowCheck][indexCheck][1]}`
    let correctAnswer = questionList[rowCheck][indexCheck][2]
    let isCorrect = (answer === correctAnswer);

    if (isRepeatQuestionStatus) { //kalau ada pengulangan
        repeatQuestionHistory.push([tempQuestion, answer, correctAnswer, isCorrect]);
    } else { //kalau gaada perulangan
        answerHistory.push([tempQuestion, answer, correctAnswer, isCorrect]);
    }


}

function controlPanelPerkalian() {
    document.getElementById("startPage").style.display = "none";
    document.getElementById("quizPage").style.display = "block";
    generateQuestion();
    document.getElementById("question").innerHTML = displayQuestion();
    // printFinalResult() //output

    let answerInput = document.getElementById("answer");
    if (answerInput) answerInput.focus();
}

function isRepeatQuestion() {
    let wrongAnswer = 0;

    if (repeatQuestionHistory.length === 0) {
        for (let i = 0; i < answerHistory.length; i++) {
            let result = answerHistory[i][3];
            if (result === false) {
                wrongAnswer++;
            }
        }
        if (wrongAnswer === 0) {
            isRepeatQuestionStatus = false;
            return false;
        } else {
            isRepeatQuestionStatus = true;
            return true;
        }
    } else {
        for (let i = 0; i < repeatQuestionHistory.length; i++) {
            let result = repeatQuestionHistory[i][3];
            if (result === false) {
                wrongAnswer++;
            }
        }
        if (wrongAnswer === 0) {
            isRepeatQuestionStatus = false;
            return false;
        } else {
            isRepeatQuestionStatus = true;
            return true;
        }
    }

}

function generateRepeatQuestion() {
    if (repeatQuestionHistory.length === 0) {
        for (let i = 0; i < answerHistory.length; i++) {
            let result = answerHistory[i][3];
            if (result === false) {
                let question = answerHistory[i][0]
                worksheet.push([question]);
                totalQuestion++;
            }

        }
    } else {
        let tempHistory = [...repeatQuestionHistory];
        repeatQuestionHistory = [];

        for (let i = 0; i < tempHistory.length; i++) {
            let result = tempHistory[i][3];
            if (result === false) {
                let question = tempHistory[i][0]
                worksheet.push([question]);
                totalQuestion++;
            }
        }
    }

}

function next() { //next selama current question belum mencapai totalquestion dia bakal next question, tapi ketika sudah mendekati total question dia bakal menjalankan is repeat question?
    let answerInput = document.getElementById("answer");
    let answer = parseInt(answerInput.value);
    if (isNaN(answer)) {
        alert("Tolong Isi kotak Jawaban");
        if (answerInput) answerInput.focus();
        return;
    }
    inputAnswer(answer);
    answerInput.value = "";

    if (currentQuestion === totalQuestion - 1) {
        findAnswerKey(worksheet);
        if (isRepeatQuestion()) {
            generateRepeatQuestion();
            currentQuestion++;
            document.getElementById("question").innerHTML = displayQuestion();
            if (answerInput) answerInput.focus();
        } else {
            document.getElementById("question").innerHTML = "Selesai! Semua jawaban benar.";
            printFinalResult();
            //kalau gaada soal yang salah
        }
        // kalau sudah halaman terakhir
    } else {
        currentQuestion++;
        document.getElementById("question").innerHTML = displayQuestion();
        if (answerInput) answerInput.focus();
    }
}

function printFinalResult() {
    console.log(answerHistory);
}

document.addEventListener("DOMContentLoaded", () => {
    let answerInput = document.getElementById("answer");
    if (answerInput) {
        answerInput.focus();
        answerInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                next();
            }
        });
    }
});

