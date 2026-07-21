let mathEquations = [];  // Isinya [[first factor, second factor, correct answer]]
let multiplicationWorksheet = []; // Soal, answer siswa, true/false
let repeatQuestionWorksheet = [];  // Soal, answer siswa, true/false
let currentQuestion = 0;
let totalQuestion = 0; // Menghitung akumulasi seluruh soal yang dikerjakan
let repeatStatus = false;
let batchOfRepeatQuestion = -1;
let currentWorksheetLength = 0; // Pembantu untuk batas akhir indeks tiap babak

function generateQuestion(startFrom) {
    // Ditambahkan 'let' agar variabel loop tidak bocor ke global scope
    for (let firstFactor = startFrom; firstFactor <= 10; firstFactor++) {
        let tempQuestion = [];
        for (let secondFactor = firstFactor; secondFactor <= 10; secondFactor++) {
            let result = firstFactor * secondFactor;
            tempQuestion.push([firstFactor, secondFactor, result]);
        }
        mathEquations.push(tempQuestion);
    }

    for (let i = 0; i < mathEquations.length; i++) {
        let tempLength = mathEquations[i].length;
        for (let j = 0; j < tempLength; j++) {
            let question = `${mathEquations[i][j][0]} x ${mathEquations[i][j][1]}`;
            let reverseQuestion = `${mathEquations[i][j][1]} x ${mathEquations[i][j][0]}`;
            let tempQuestion = [question, reverseQuestion];
            let randomNum = Math.floor(Math.random() * 2);
            multiplicationWorksheet.push([tempQuestion[randomNum]]);
            totalQuestion++; // Menghitung soal babak utama
        }
    }
}

function checkResult(worksheetResult) {
    for (let i = 0; i < worksheetResult.length; i++) {
        // Hanya jalankan pengecekan jika data true/false belum dimasukkan (panjang masih 2)
        if (worksheetResult[i].length === 2) {
            let tempQuestion = worksheetResult[i][0];
            let tempSplit = tempQuestion.split(' ');
            let check = tempSplit[0] * tempSplit[2];
            let result = check === worksheetResult[i][1];
            worksheetResult[i].push(result);
        }
    }
}

function restart() {
    location.reload();
}
function isRepeatQuestion(worksheetResult) {
    for (let i = 0; i < worksheetResult.length; i++) {
        if (worksheetResult[i][2] === false) {
            return true;
        }
    }
    return false;
}

function generateRepeatQuestion(worksheetResult) {
    let tempFalseAns = [];
    let tempQuestionList = [];
    for (let i = 0; i < worksheetResult.length; i++) {
        if (worksheetResult[i][2] === false) {
            tempFalseAns.push(worksheetResult[i]);
        }
    }

    for (let i = 0; i < tempFalseAns.length; i++) {
        let tempSplit = tempFalseAns[i][0].split(' ');
        let question = `${tempSplit[0]} x ${tempSplit[2]}`;
        let reverseQuestion = `${tempSplit[2]} x ${tempSplit[0]}`;
        let pickQuestion = [question, reverseQuestion];
        let randomNum = Math.floor(Math.random() * 2);
        tempQuestionList.push([pickQuestion[randomNum]]);
        totalQuestion++; // Menghitung soal remedial tambahan
    }
    repeatQuestionWorksheet.push(tempQuestionList);
    batchOfRepeatQuestion++;
}

function displayQuestion() {
    if (repeatStatus) {
        return repeatQuestionWorksheet[batchOfRepeatQuestion][currentQuestion][0];
    } else {
        return multiplicationWorksheet[currentQuestion][0];
    }
}

function inputAnswer(answer) {
    if (repeatStatus) {
        repeatQuestionWorksheet[batchOfRepeatQuestion][currentQuestion].push(answer);
    } else {
        multiplicationWorksheet[currentQuestion].push(answer);
    }
}

function controlPanelPerkalian() {
    document.getElementById("startPage").style.display = "none";
    document.getElementById("quizPage").style.display = "block";
    generateQuestion(2);

    // Set batas panjang kuis utama pertama kali
    currentWorksheetLength = multiplicationWorksheet.length;

    document.getElementById("question").innerHTML = displayQuestion();

    let answerInput = document.getElementById("answer");
    if (answerInput) answerInput.focus();
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

    // Tentukan worksheet mana yang sedang dikerjakan user saat ini
    let activeWorksheet = repeatStatus ? repeatQuestionWorksheet[batchOfRepeatQuestion] : multiplicationWorksheet;

    // JIKA USER SUDAH MENCAPAI UJUNG ARRAY BATCH SAAT INI
    if (currentQuestion === currentWorksheetLength - 1) {
        checkResult(activeWorksheet);

        if (isRepeatQuestion(activeWorksheet)) {
            generateRepeatQuestion(activeWorksheet);

            // Aktifkan mode repeat dan reset indeks soal kembali ke 0
            repeatStatus = true;
            currentQuestion = 0;

            // Perbarui batas akhir kuis mengikuti jumlah soal remedi yang baru dibuat
            currentWorksheetLength = repeatQuestionWorksheet[batchOfRepeatQuestion].length;

            alert("Ada jawaban yang salah. Mari ulangi soal yang salah!");
            document.getElementById("question").innerHTML = displayQuestion();
            if (answerInput) answerInput.focus();
        } else {
            printFinalResult();
        }
    } else {
        // JIKA BELUM SOAL TERAKHIR, LANJUT KE INDEKS BERIKUTNYA
        currentQuestion++;
        document.getElementById("question").innerHTML = displayQuestion();
        if (answerInput) answerInput.focus();
    }
}

function printFinalResult() {
    // Menyembunyikan elemen input UI dan menampilkan total statistik akhir di layar HTML
    document.getElementById("answer").style.display = "none";

    // Cari tombol di dalam quizPage dan sembunyikan
    let nextButton = document.querySelector("#quizPage button");
    if (nextButton) nextButton.style.display = "none";

    document.getElementById("question").innerHTML = `
        Selesai! Semua jawaban sudah benar.<br><br>
        <span style="font-size: 18px; font-weight: normal;">
            Total seluruh soal yang kamu kerjakan (termasuk remedi): <strong>${totalQuestion}</strong> soal.
        </span>
    `;

    console.log("Kuis Selesai!");
    console.log(`Total soal dikerjakan: ${totalQuestion}`);
}

// Otomatisasi tombol enter agar langsung mentrigger fungsi next() tanpa harus klik tombol di layar
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
