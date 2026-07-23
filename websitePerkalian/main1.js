let mathEquations = [];
let multiplicationWorksheet = [];
let divisionWorksheet = [];
let repeatQuestionWorksheet = [];

let currentQuestion = 0;
let totalQuestion = 0;
let repeatStatus = false;
let batchOfRepeatQuestion = -1;
let currentWorksheetLength = 0;

let currentSession = "multiplication";
let startTime;

function generateQuestion(startFrom) {
    mathEquations = [];
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
    totalQuestion++;
    if (repeatStatus) {
        repeatQuestionWorksheet[batchOfRepeatQuestion][currentQuestion].push(answer);
    } else {
        if (currentSession === "multiplication") {
            multiplicationWorksheet[currentQuestion].push(answer);
        } else {
            divisionWorksheet[currentQuestion].push(answer);
        }
    }
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

    document.getElementById("question").innerHTML = `<h3>Sesi 1: Perkalian</h3>` + displayQuestion();

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

    document.getElementById("answer").style.display = "inline-block";
    let nextButton = document.querySelector("#quizPage button");
    if (nextButton) nextButton.style.display = "inline-block";

    document.getElementById("question").innerHTML = `<h3>Sesi 2: Pembagian</h3>` + displayQuestion();

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
        if (answerInput) answerInput.focus();
        return;
    }
    inputAnswer(answer);
    answerInput.value = "";

    let activeWorksheet = repeatStatus ? repeatQuestionWorksheet[batchOfRepeatQuestion] : (currentSession === "multiplication" ? multiplicationWorksheet : divisionWorksheet);

    if (currentQuestion === currentWorksheetLength - 1) {
        checkResult(activeWorksheet);

        if (isRepeatQuestion(activeWorksheet)) {
            generateRepeatQuestion(activeWorksheet);

            repeatStatus = true;
            currentQuestion = 0;
            currentWorksheetLength = repeatQuestionWorksheet[batchOfRepeatQuestion].length;

            alert("Ada jawaban yang salah. Mari ulangi soal yang salah!");
            let title = currentSession === "multiplication" ? "Sesi 1: Perkalian (Remedi)" : "Sesi 2: Pembagian (Remedi)";
            document.getElementById("question").innerHTML = `<h3>${title}</h3>` + displayQuestion();
            if (answerInput) answerInput.focus();
        } else {
            if (currentSession === "multiplication") {
                document.getElementById("answer").style.display = "none";
                let nextButton = document.querySelector("#quizPage button");
                if (nextButton) nextButton.style.display = "none";

                document.getElementById("question").innerHTML = `
                    <p style="color: green; font-weight: bold;">Sesi Perkalian Selesai dengan Sempurna!</p>
                    <button onclick="controlPanelDivision()" style="font-size: 18px; padding: 10px 20px;">Lanjut ke Sesi Pembagian</button>
                `;
            } else {
                printFinalResult();
            }
        }
    } else {
        currentQuestion++;
        let title = currentSession === "multiplication" ? "Sesi 1: Perkalian" : "Sesi 2: Pembagian";
        if (repeatStatus) title += " (Remedi)";
        document.getElementById("question").innerHTML = `<h3>${title}</h3>` + displayQuestion();
        if (answerInput) answerInput.focus();
    }
}

function printFinalResult() {
    let endTime = new Date();

    document.getElementById("answer").style.display = "none";
    let nextButton = document.querySelector("#quizPage button");
    if (nextButton) nextButton.style.display = "none";

    let totalDetik = Math.floor((endTime - startTime) / 1000);
    let menitDurasi = Math.floor(totalDetik / 60);
    let detikDurasi = totalDetik % 60;

    document.getElementById("question").innerHTML = `
        <h2>🎉 Selesai! Semua Kuis Berhasil Dikerjakan 🎉</h2>
        <p>Hebat! Kamu telah menyelesaikan babak Perkalian dan Pembagian dengan benar.</p>
        <span style="font-size: 18px; font-weight: normal; line-height: 1.6;">
            Waktu Mulai: <strong>${formatWaktu(startTime)}</strong><br>
            Waktu Selesai: <strong>${formatWaktu(endTime)}</strong><br>
            Durasi Pengerjaan: <strong>${menitDurasi} menit ${detikDurasi} detik</strong><br>
            Total Soal Dikerjakan (termasuk remedi): <strong>${totalQuestion}</strong> soal.
        </span>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
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
    document.getElementById("tableResultPage").style.display = "block"; // ID Terbarui

    let tableBody = document.getElementById("tableQuestion");
    tableBody.innerHTML = "";

    let no = 1;
    multiplicationWorksheet.forEach(item => {
        if (item[1] !== undefined) {
            tableBody.innerHTML += `<tr><td>${no++}</td><td>${item[0]}</td><td>${item[1]} (${item[2] ? 'Benar' : 'Salah'})</td></tr>`;
        }
    });
    divisionWorksheet.forEach(item => {
        if (item[1] !== undefined) {
            tableBody.innerHTML += `<tr><td>${no++}</td><td>${item[0]}</td><td>${item[1]} (${item[2] ? 'Benar' : 'Salah'})</td></tr>`;
        }
    });
}

// Update fungsi ini di main.js agar ikut mereset halaman tabel baru
function restart() {
    currentQuestion = 0;
    totalQuestion = 0;
    correctCount = 0;
    wrongCount = 0;
    repeatStatus = false;
    batchOfRepeatQuestion = -1;
    repeatQuestionWorksheet = [];

    document.getElementById("resultPage").style.display = "none";
    document.getElementById("tableResultPage").style.display = "none"; // ID Terbarui
    document.getElementById("startPage").style.display = "block";
}

