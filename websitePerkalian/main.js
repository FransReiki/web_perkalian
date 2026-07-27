let mathEquations = [];
let multiplicationWorksheet = [];
let divisionWorksheet = [];
let repeatQuestionWorksheet = [];

let currentQuestion = 0;
let currentWorksheetLength = 0;

let repeatStatus = false;
let batchOfRepeatQuestion = -1;

let currentSession = "multiplication";

let totalQuestion = 0;          // Total soal yang harus dikerjakan (termasuk remedi)
let answeredQuestion = 0;       // Jumlah soal yang sudah dijawab

let currentProgress = 0;

let startTime;

function generateQuestion(startFrom) {
    mathEquations = [];
    multiplicationWorksheet = [];
    divisionWorksheet = [];
    for (let firstFactor = startFrom; firstFactor <= 10; firstFactor++) {
        for (let secondFactor = firstFactor; secondFactor <= 10; secondFactor++) {
            let result = firstFactor * secondFactor;
            mathEquations.push([firstFactor, secondFactor, result]);
        }
    }

    let tempMultPool = [];
    let tempDivPool = [];

    for (let i = 0; i < mathEquations.length; i++) {
        let f1 = mathEquations[i][0];
        let f2 = mathEquations[i][1];
        let res = mathEquations[i][2];

        let qMult1 = `${f1} x ${f2}`;
        let qMult2 = `${f2} x ${f1}`;
        let pickMult = [qMult1, qMult2];
        tempMultPool.push(pickMult[Math.floor(Math.random() * 2)]);

        tempDivPool.push(`${res} : ${f1}`);
        if (f1 !== f2) {
            tempDivPool.push(`${res} : ${f2}`);
        }
    }

    for (let i = tempMultPool.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [tempMultPool[i], tempMultPool[j]] = [tempMultPool[j], tempMultPool[i]];
    }

    for (let i = tempDivPool.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [tempDivPool[i], tempDivPool[j]] = [tempDivPool[j], tempDivPool[i]];
    }

    for (let i = 0; i < tempMultPool.length; i++) {
        multiplicationWorksheet.push([tempMultPool[i]]);
    }
    for (let i = 0; i < tempDivPool.length; i++) {
        divisionWorksheet.push([tempDivPool[i]]);
    }
}

function checkResult(worksheetResult) {
    for (let i = 0; i < worksheetResult.length; i++) {
        if (worksheetResult[i].length === 2) {
            let tempQuestion = worksheetResult[i][0];
            let studentAnswer = worksheetResult[i][1];
            let tempSplit = tempQuestion.split(' ');

            let angka1 = parseInt(tempSplit[0]);
            let operator = tempSplit[1];
            let angka2 = parseInt(tempSplit[2]);

            let correctAnswer = operator === "x" ? (angka1 * angka2) : (angka1 / angka2);
            let result = correctAnswer === studentAnswer;
            worksheetResult[i].push(result);
        }
    }
}

function isRepeatQuestion(worksheetResult) {
    for (let i = 0; i < worksheetResult.length; i++) {
        if (worksheetResult[i][2] === false) return true;
    }
    return false;
}

function generateRepeatQuestion(worksheetResult) {
    let tempFalseAns = [];
    let tempQuestionList = [];
    for (let i = 0; i < worksheetResult.length; i++) {
        if (worksheetResult[i][2] === false) {
            tempFalseAns.push(worksheetResult[i][0]);
        }
    }

    for (let i = tempFalseAns.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [tempFalseAns[i], tempFalseAns[j]] = [tempFalseAns[j], tempFalseAns[i]];
    }

    for (let i = 0; i < tempFalseAns.length; i++) {
        tempQuestionList.push([tempFalseAns[i]]);
    }
    repeatQuestionWorksheet.push(tempQuestionList);
    batchOfRepeatQuestion++;
}

function displayQuestion() {
    if (repeatStatus) {
        return repeatQuestionWorksheet[batchOfRepeatQuestion][currentQuestion][0];
    } else {
        return currentSession === "multiplication"
            ? multiplicationWorksheet[currentQuestion][0]
            : divisionWorksheet[currentQuestion][0];
    }
}

function inputAnswer(answer) {
    answeredQuestion++;
    if (repeatStatus) {
        repeatQuestionWorksheet[batchOfRepeatQuestion][currentQuestion].push(answer);
    } else {
        if (currentSession === "multiplication") {
            multiplicationWorksheet[currentQuestion].push(answer);
        } else {
            divisionWorksheet[currentQuestion].push(answer);
        }
    }
    saveProgress();
}

function formatWaktu(dateObj) {
    let jam = String(dateObj.getHours()).padStart(2, '0');
    let menit = String(dateObj.getMinutes()).padStart(2, '0');
    let detik = String(dateObj.getSeconds()).padStart(2, '0');
    return `${jam}:${menit}:${detik}`;
}

function controlPanelPerkalian() {
    document.getElementById("startPage").style.display = "none";
    document.getElementById("quizPage").style.display = "block";

    startTime = new Date();
    generateQuestion(2);

    currentSession = "multiplication";
    currentWorksheetLength = multiplicationWorksheet.length;

    totalQuestion = currentWorksheetLength;
    currentProgress = 0;

    document.getElementById("progress").innerHTML =
        `${currentProgress}/${totalQuestion} Soal`;

    document.getElementById("question").innerHTML =
        `<h3>Sesi 1: Perkalian</h3>` + displayQuestion();

    let answerInput = document.getElementById("answer");
    if (answerInput) answerInput.focus();
}

function controlPanelDivision() {
    repeatStatus = false;
    repeatQuestionWorksheet = [];
    batchOfRepeatQuestion = -1;
    currentQuestion = 0;

    currentSession = "division";
    currentWorksheetLength = divisionWorksheet.length;

    totalQuestion = currentWorksheetLength;
    currentProgress = 0;

    document.getElementById("answer").style.display = "inline-block";

    let nextButton = document.querySelector("#quizPage button");
    if (nextButton) nextButton.style.display = "inline-block";

    document.getElementById("progress").innerHTML =
        `${currentProgress}/${totalQuestion} Soal`;

    document.getElementById("question").innerHTML =
        `<h3>Sesi 2: Pembagian</h3>` + displayQuestion();

    let answerInput = document.getElementById("answer");
    if (answerInput) {
        answerInput.value = "";
        answerInput.focus();
    }
}

function next() {

    let answerInput = document.getElementById("answer");
    let answer = parseInt(answerInput.value);

    if (isNaN(answer)) {
        alert("Tolong Isi kotak Jawaban");
        answerInput.focus();
        return;
    }

    inputAnswer(answer);
    currentProgress++;
    answerInput.value = "";

    let activeWorksheet = repeatStatus
        ? repeatQuestionWorksheet[batchOfRepeatQuestion]
        : (currentSession === "multiplication"
            ? multiplicationWorksheet
            : divisionWorksheet);

    if (currentQuestion === currentWorksheetLength - 1) {

        checkResult(activeWorksheet);

        if (isRepeatQuestion(activeWorksheet)) {

            generateRepeatQuestion(activeWorksheet);

            repeatStatus = true;
            currentQuestion = 0;

            currentWorksheetLength =
                repeatQuestionWorksheet[batchOfRepeatQuestion].length;

            // Tambahkan jumlah soal remedi
            totalQuestion += currentWorksheetLength;

            // Progress tetap di soal terakhir
            document.getElementById("progress").innerHTML =
                `${answeredQuestion}/${totalQuestion} Soal`;

            alert("Ada jawaban yang salah. Mari ulangi soal yang salah!");

            let title = currentSession === "multiplication"
                ? "Sesi 1: Perkalian (Remedi)"
                : "Sesi 2: Pembagian (Remedi)";

            document.getElementById("question").innerHTML =
                `<h3>${title}</h3>` + displayQuestion();

            answerInput.focus();

        } else {

            if (currentSession === "multiplication") {

                document.getElementById("progress").innerHTML = "";

                document.getElementById("answer").style.display = "none";

                let nextButton = document.getElementById("nextButton");
                if (nextButton) nextButton.style.display = "none";

                document.getElementById("question").innerHTML = `
                    <p style="color:green;font-weight:bold">
                        Sesi Perkalian Selesai dengan Sempurna!
                    </p>

                    <button onclick="controlPanelDivision()">
                        Lanjut ke Sesi Pembagian
                    </button>
                `;

            } else {

                document.getElementById("progress").innerHTML = "";
                printFinalResult();

            }

        }

    } else {

        currentQuestion++;

        document.getElementById("progress").innerHTML =
            `${answeredQuestion}/${totalQuestion} Soal`;

        let title = currentSession === "multiplication"
            ? "Sesi 1: Perkalian"
            : "Sesi 2: Pembagian";

        if (repeatStatus) title += " (Remedi)";

        document.getElementById("question").innerHTML =
            `<h3>${title}</h3>` + displayQuestion();

        answerInput.focus();
    }

    saveProgress();
}

function printFinalResult() {
    let endTime = new Date();

    let totalDetik = Math.floor((endTime - startTime) / 1000);
    let menitDurasi = Math.floor(totalDetik / 60);
    let detikDurasi = totalDetik % 60;

    // Sembunyikan halaman kuis
    document.getElementById("quizPage").style.display = "none";

    // Tampilkan halaman hasil
    document.getElementById("resultPage").style.display = "block";

    // Isi hasil
    document.getElementById("correct").innerHTML = `
        🎉 Selesai! 🎉<br><br>

        Waktu Mulai: <strong>${formatWaktu(startTime)}</strong><br>
        Waktu Selesai: <strong>${formatWaktu(endTime)}</strong><br>
        Durasi: <strong>${menitDurasi} menit ${detikDurasi} detik</strong><br>
        Total Soal: <strong>${answeredQuestion}</strong> soal
    `;

    document.getElementById("wrong").innerHTML =
        "Silakan pilih <b>Lihat Tabel Hasil</b> atau <b>Main Lagi</b>.";

    localStorage.removeItem("quizProgress");
}

document.addEventListener("DOMContentLoaded", () => {

    // Cek apakah ada progress yang tersimpan
    if (loadProgress()) {

        document.getElementById("startPage").style.display = "none";
        document.getElementById("quizPage").style.display = "block";

        document.getElementById("progress").innerHTML =
            `${answeredQuestion}/${totalQuestion} Soal`;

        let title =
            currentSession === "multiplication"
                ? "Sesi 1: Perkalian"
                : "Sesi 2: Pembagian";

        if (repeatStatus) {
            title += " (Remedi)";
        }

        document.getElementById("question").innerHTML =
            `<h3>${title}</h3>` + displayQuestion();
    }

    // Event tombol Enter
    let answerInput = document.getElementById("answer");

    if (answerInput) {
        answerInput.focus();

        answerInput.addEventListener("keydown", function (event) {

            if (event.key === "Enter") {

                let activeButton = document.querySelector("#quizPage button");

                if (activeButton && activeButton.style.display !== "none") {
                    event.preventDefault();
                    next();
                }

            }

        });

    }

});

// Tambahkan ini di main.js agar tombol "Mulai Pembagian" di awal bisa langsung bekerja
function controlPanelPembagianLangsung() {
    document.getElementById("startPage").style.display = "none";
    document.getElementById("quizPage").style.display = "block";
    startTime = new Date();
    generateQuestion(2);
    controlPanelDivision();
}

// Update fungsi ini di main.js agar ID-nya merujuk ke tableResultPage
function tableResult() {
    document.getElementById("resultPage").style.display = "none";
    document.getElementById("tableResultPage").style.display = "block";

    let tableBody = document.getElementById("tableQuestion");
    tableBody.innerHTML = "";

    let no = 1;

    multiplicationWorksheet.forEach(item => {
        if (item[1] !== undefined) {
            tableBody.innerHTML += `
                <tr>
                    <td>${no++}</td>
                    <td>${item[0]}</td>
                    <td>${item[1]}</td>
                    <td>${item[2] ? "✅ Benar" : "❌ Salah"}</td>
                </tr>
            `;
        }
    });

    divisionWorksheet.forEach(item => {
        if (item[1] !== undefined) {
            tableBody.innerHTML += `
                <tr>
                    <td>${no++}</td>
                    <td>${item[0]}</td>
                    <td>${item[1]}</td>
                    <td>${item[2] ? "✅ Benar" : "❌ Salah"}</td>
                </tr>
            `;
        }
    });
}

// Update fungsi ini di main.js agar ikut mereset halaman tabel baru
function restart() {
    // Reset data soal
    mathEquations = [];
    multiplicationWorksheet = [];
    divisionWorksheet = [];
    repeatQuestionWorksheet = [];

    // Reset status pengerjaan
    currentQuestion = 0;
    currentWorksheetLength = 0;
    repeatStatus = false;
    batchOfRepeatQuestion = -1;
    currentSession = "multiplication";

    // Reset progress
    totalQuestion = 0;
    answeredQuestion = 0;

    startTime = null;

    document.getElementById("resultPage").style.display = "none";
    document.getElementById("tableResultPage").style.display = "none";
    document.getElementById("quizPage").style.display = "none";
    document.getElementById("startPage").style.display = "block";

    document.getElementById("progress").innerHTML = "";
    document.getElementById("question").innerHTML = "";

    let answerInput = document.getElementById("answer");
    answerInput.value = "";
    answerInput.style.display = "inline-block";

    let nextButton = document.querySelector("#quizPage button");
    if (nextButton) {
        nextButton.style.display = "inline-block";
    }
    localStorage.removeItem("quizProgress");
}

function saveProgress() {
    const data = {
        currentSession,
        currentQuestion,
        currentWorksheetLength,
        answeredQuestion,
        totalQuestion,
        repeatStatus,
        batchOfRepeatQuestion,

        multiplicationWorksheet,
        divisionWorksheet,
        repeatQuestionWorksheet,

        startTime
    };

    localStorage.setItem("quizProgress", JSON.stringify(data));
}

function loadProgress() {

    const data = JSON.parse(localStorage.getItem("quizProgress"));

    if (!data) return false;

    currentSession = data.currentSession;
    currentQuestion = data.currentQuestion;
    currentWorksheetLength = data.currentWorksheetLength;

    answeredQuestion = data.answeredQuestion;
    totalQuestion = data.totalQuestion;

    repeatStatus = data.repeatStatus;
    batchOfRepeatQuestion = data.batchOfRepeatQuestion;

    multiplicationWorksheet = data.multiplicationWorksheet;
    divisionWorksheet = data.divisionWorksheet;
    repeatQuestionWorksheet = data.repeatQuestionWorksheet;

    startTime = new Date(data.startTime);

    return true;
}

function backToResult() {
    document.getElementById("tableResultPage").style.display = "none";
    document.getElementById("resultPage").style.display = "block";
}

function debugResult() {
    startTime = new Date(Date.now() - 1000 * 60 * 15);
    answeredQuestion = 57;
    printFinalResult();
}