const readline = require('readline-sync');
let questionList = [];
let productList = [];
let answerHistory = {}; 
let currentQuestion = 0;
let totalQuestion;
let minimumRange;
let maximumRange;


function settingOfQuestion() { //input
    do{
        totalQuestion = readline.question('Enter total question: ');
        minimumRange = readline.question('Enter minimum range: ');
        maximumRange = readline.question('Enter maximum range: ');
    }while(minimumRange > maximumRange);
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
    settingOfQuestion();
    generateQuestion(totalQuestion, minimumRange, maximumRange);

    for(let i = 0; i < totalQuestion; i++){
        console.log(displayQuestion());
        const answer = +readline.question('Enter an answer: '); //input
        checkResult(answer);
        currentQuestion++;
    }

    printFinalResult() //output
}



function printFinalResult() {
    console.log(answerHistory);
}

controlPanel();
