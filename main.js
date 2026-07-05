
let questionList = [];
let productList = [];
let answerHistory = {}; 
let currentQuestion = 0;
let totalQuestion;
let minimumRange;
let maximumRange;


function restart() {
    location.reload();
}

function errorCheck() { //input
    if(minimumRange < maximumRange){
        document.getElementById("startPage").style.display = "none";
        document.getElementById("quizPage").style.display = "block";
    }else{
            alert("Masukkan rentang angka yang benar");
            return;
    }
}

function generateQuestion(totalQuestion, minimumRange, maximumRange) {
    let firstFactor = [];
    let secondFactor = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    

    for(let i = minimumRange; i <= maximumRange; i++){ //push first factor kedalam array (range number)
        firstFactor.push(i);
    }
    
    if(maximumRange > 10) { //push second factor kalau dikali 2
        for(let i = 10; i <= maximumRange; i++){
            secondFactor.push(i);
        }
    }
    
    for(let i = 0; i < totalQuestion; i++){
        const firstFactorLength = firstFactor.length;
        const secondFactorLength = secondFactor.length;
        const questionLength = questionList.length;
        let isDuplicate;

        const pickRandomFirstFactor = Math.floor(Math.random() * firstFactorLength); //ini ngambil random by index array
        const pickRandomSecondFactor = Math.floor(Math.random() * secondFactorLength); //ini ngambil random by index array

        const question = `${firstFactor[pickRandomFirstFactor]} * ${secondFactor[pickRandomSecondFactor]}`;
        const reverseQuestion = `${secondFactor[pickRandomSecondFactor]} * ${firstFactor[pickRandomFirstFactor]}`;

        const result = firstFactor[pickRandomFirstFactor] * secondFactor[pickRandomSecondFactor];

        for(let i = 0; i < questionLength; i++){
            if(question === questionList[i] || reverseQuestion === questionList[i]){
                isDuplicate = true
                break;
            } else{
                isDuplicate = false
            }
        }
        if(isDuplicate){
            i--;
        } else{
            questionList.push(question);
            productList.push(result);
        }
    }
    
    return questionList;
}

function displayQuestion() {
    
   return questionList[currentQuestion]; //nanti ini ditampilkan ke layar
    
}

function checkResult(answer) {
    if(answer /*dari html */ === productList[currentQuestion]){
        answerHistory[questionList[currentQuestion]] = true;
    }else{
        answerHistory[questionList[currentQuestion]] = false;
    }
}

function controlPanel() {
    totalQuestion = parseInt(document.getElementById("totalQuestion").value);
    minimumRange = parseInt(document.getElementById("minimumRange").value);
    maximumRange = parseInt(document.getElementById("maximumRange").value);

    errorCheck();
    generateQuestion(totalQuestion, minimumRange, maximumRange);

    document.getElementById("question").innerHTML = displayQuestion();
    // for(let i = 0; i < totalQuestion; i++){
    //     console.log(displayQuestion());
    //     const answer = +readline.question('Enter an answer: '); //input
    //     checkResult(answer);
    //     currentQuestion++;
    // }

    // printFinalResult() //output
}

function next() {
    let answer = parseInt(document.getElementById("answer").value);

    if(currentQuestion === totalQuestion - 1){
        checkResult(answer);
        printFinalResult();
    } else{
        checkResult(answer);
        currentQuestion++;
        document.getElementById("question").innerHTML = displayQuestion();

    }
    
}


function printFinalResult() {
    let correct = 0;
    let wrong = 0;

    for(key in answerHistory){
        if(answerHistory[key]){
            correct++;
        } else{
            wrong++;
        }
    }

    document.getElementById("quizPage").style.display = "none";
    document.getElementById("resultPage").style.display = "block";

    document.getElementById("correct").innerHTML = "BENAR: " + correct;
    document.getElementById("wrong").innerHTML = "SALAH: " + wrong;
}

function tableResult() {
    let html = "";

    for(let i = 0; i < questionList.length; i++){
        html += `
            <tr>
               <td>${i + 1}</td>
                <td>${questionList[i]}</td>
               <td>${answerHistory[questionList[i]]}</td>
            </tr>
        `;
    }

    document.getElementById("tableQuestion").innerHTML = html;

    document.getElementById("resultPage").style.display = "none";
    document.getElementById("tableResult").style.display = "block";
}