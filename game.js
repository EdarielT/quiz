const question = document.getElementById ('question');
const choices = Array.from(document.getElementsByClassName ('choice-text'));
const quesCounterText = document.getElementById('questionCounter');
const scoreText = document.getElementById('score');
const loader = document.getElementById('loader');
const game = document.getElementById('game');


let currentQues = {};
let acceptChoice = false;
let score = 0;
let quesCounter = 0;
let availableQues = [];

let questions = [];

fetch ('https://opentdb.com/api.php?amount=10&category=17&difficulty=easy&type=multiple')
    .then(res => {
        return res.json();
    })
    .then(loadedQuestions => {
        questions = loadedQuestions.results.map(loadedQuestion => {
            const formattedQuestion = {
                question: loadedQuestion.question
        };
        

        const answerChoices = [...loadedQuestion.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random()*3) + 1;
        answerChoices.splice(formattedQuestion.answer -1, 0, loadedQuestion.correct_answer);

        answerChoices.forEach((choice, index) => {
            formattedQuestion['choice' + (index + 1)] = choice;    
        });
        return formattedQuestion;
    });
    startGame();
})

//constants

const correctPoints = 5; //how many points user gets for a correct answer
const quesMax = 3; //how many questions does it take to end the game

startGame = () => {
    quesCounter = 0;
    score = 0;
    availableQues = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

getNewQuestion = () => {
    if(availableQues === 0 || quesCounter >= quesMax) {
        localStorage.setItem('mostRecentScore', score);
        //end of the game
        return window.location.assign('end.html');
    }
    quesCounter++;
    quesCounterText.innerText = `${quesCounter}/${quesMax}`;
    const quesIndex = Math.floor(Math.random()*availableQues.length);
    currentQues = availableQues[quesIndex];
    question.innerText = currentQues.question;

    choices.forEach( choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQues['choice' + number];  //to get the needed set of choices for each question
    });

    availableQues.splice(quesIndex, 1);  //to get rid of the question that we just answered

    acceptChoice = true;
};

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if(!acceptChoice) return;

        acceptChoice = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        let classToApply = 'incorrect';
        if(selectedAnswer == currentQues.answer){
            classToApply = 'correct';
        };

        if(classToApply === 'correct') {
            incrementScore(correctPoints);
        }

        selectedChoice.parentElement.classList.add(classToApply);
        
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000); //wait 1sec before removing the class and going to the next ques
    });

});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
}
