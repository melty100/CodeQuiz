class Question {
    constructor(questionText, response, correctResponse) {
        this.questionText = questionText;
        this.response = response;
        this.correctResponse = correctResponse;
    }
}

class Record {
    constructor(initials, score, date){
        this.initials = initials;
        this.score = score;
        this.date = date;
    }
}

var qIndex = 0;
var questions = [
    new Question("Which of the following is not a method for an array?", ["concat()", "fill()", "keys()", "copy()"], 3),
    new Question("Which of the following expressions will return false?", ["[1] == [1]", "\"1\" == true", "\"\" == false", "[1] == \"1\""], 0),
    new Question("What does the parseInt() function return if it's argument cannot be converted to a number?", ["undefined", "null", "NaN", "infinity"], 2),
    new Question("Which of the following is the method for converting an object to a JSON string?", ["toString()", "parse()", "stringify()", "splice()"], 2),
    new Question("True or False: In order to use the Math object we need to create it first.", ["True", "False"], 1),
    new Question("What is the value of z, Given: var y = 3; var x = 9; z = x++ * ++y;", [30, 40, 27, 36], 0)];

var startingTime = 60;
var timeElapsed = 0;
var score = 0;
var wasCorrect = false;
var interval;
var userInitials;
var submitted = false;
var promptDisplay = document.querySelector("#prompt-display");
var timeDisplay = document.querySelector("#time-left");
var scoreDisplay = document.querySelector("#score-col");


document.addEventListener("click", function () {

    let targetId = event.target.id;
    let targetValue = event.target.value;
    let targetTagName = event.target.nodeName;

    //Changes prompt when a button is pushed
    if (targetTagName == "BUTTON") {
        if(targetValue == "RESPONSE") {
            if (targetId == "start") {
                interval = setInterval(startTimer, 1000);
            }
            else if (qIndex > 0 && targetId == questions[qIndex - 1].correctResponse) {
                wasCorrect = true;
                score++;
            }
            else {
                wasCorrect = false;
                timeElapsed = timeElapsed + 10;
            }
    
            if (qIndex < questions.length) {
                renderNextQuestion();
                qIndex++;
            }
            else {
                clearInterval(interval);
                renderReport();
            }
        }
        else if(targetValue == "GETSCORES") {
            renderScores();
        }
        else if(targetValue == "HIDESCORES") {
            hideScores();
        }
    }
});

document.addEventListener("submit", function () {

    event.preventDefault();

    if(!submitted){

        let r = new Record (userInitials.value, score, new Date());
        let temp = localStorage.getItem("Records");

        if(temp == null){
            let myRecords = [r];
            localStorage.setItem("Records", JSON.stringify(myRecords));
        }
        else{
            temp = JSON.parse(temp);
            temp.push(r);
            localStorage.setItem("Records", JSON.stringify(temp));
        }
        submitted = true;
    }
    userInitials.value = "";
});

function renderNextQuestion() {
    //clear prompt
    promptDisplay.innerHTML = "";

    //Adds question text to prompt
    var node = document.createElement("H3");
    var textNode = document.createTextNode(questions[qIndex].questionText);
    node.appendChild(textNode);
    promptDisplay.appendChild(node);

    //Adds buttons for choices
    for (i = 0; i < questions[qIndex].response.length; i++) {
        let buttonNode = document.createElement("BUTTON");
        buttonNode.textContent = questions[qIndex].response[i];
        buttonNode.className += "btn btn-primary btn-lg";
        buttonNode.value = "RESPONSE";
        buttonNode.id = i;
        promptDisplay.appendChild(buttonNode);
    }

    //Adds line with with text describing if last question was answered correctly
    node = document.createElement("hr");
    promptDisplay.appendChild(node);

    if (qIndex != 0) {
        node = document.createElement("H4");
        wasCorrect != 0 ? node.innerHTML = "Correct" : node.textContent = "Incorrect";
        promptDisplay.appendChild(node);
    }
}

function renderStart() {
    promptDisplay.innerHTML = "";

    //Adds quiz details
    var node = document.createElement("H3");
    node.textContent = "Answer as many questions within the given amount of time. Keep in mind that answering incorrectly will deduct 10 seconds from the clock. Your score is equal to the amount of questions answered correctly plus the amount of time left on the clock divided by 10. Press start to begin!";
    promptDisplay.appendChild(node);

    //Adds start button
    node = document.createElement("BUTTON");
    node.textContent = "Start Quiz";
    node.value = "RESPONSE";
    node.className += "btn btn-danger btn-lg";
    node.id = "start";
    promptDisplay.appendChild(node);
}

function renderReport() {

    promptDisplay.innerHTML = "";
    var timeRemaining = startingTime - timeElapsed;

    //Shows user their final score
    var node = document.createElement("H3");
    node.textContent = "You scored : " + (score + timeRemaining / 10);
    node.style.color = "gold";
    promptDisplay.appendChild(node);

    //Shows questions answered correctly and time remaining
    node = document.createElement("H3");
    node.textContent = "You answered " + score + " question(s) correctly with " + timeRemaining + " second(s) remaining.";
    promptDisplay.appendChild(node);

    //Creates a form for user name and score recording
    node = document.createElement("FORM");
    node.id = "initials-form";
    node.method = "POST";

    var childNode = document.createElement("LABEL");
    childNode.textContent = "Enter intials: ";
    childNode.for = "initials"
    node.appendChild(childNode);

    childNode = document.createElement("INPUT");
    childNode.id = "initials";
    childNode.type = "Text";
    node.appendChild(childNode);
    promptDisplay.appendChild(node);

    //Points at our new element for submit event handler
    userInitials = document.querySelector("#initials");
}

function renderScores() {

    //Creating ordered list to append to score column
    let node = document.createElement("OL")
    node.id = "score-list";
    let records = localStorage.getItem("Records");
    let scoreButton = document.querySelector("#score-col").children[0];


    records == null ? records = '': records = JSON.parse(records);

    records.forEach(function (item) {
        let childNode = document.createElement("LI");
        childNode.innerHTML = "Name: " + item.initials + " Score: " + item.score + " Date: " + item.date.toString();
        node.appendChild(childNode);
    });

    scoreDisplay.appendChild(node);

    //Change score button
    scoreButton.textContent = "Hide Scores";
    scoreButton.value = "HIDESCORES";

}

function hideScores() {
    let scoreButton = document.querySelector("#score-col").children[0];
    scoreButton.value = "GETSCORES";
    scoreButton.textContent = "View Highscores";

    document.querySelector("#score-list").remove();
}

function startTimer() {

    timeElapsed++;

    if (startingTime <= timeElapsed) {
        timeElapsed = startingTime;
        renderReport();
        clearInterval(interval);
    }

    timeDisplay.textContent = startingTime - timeElapsed;
}

function shuffleQuestions() {
    for (i = 0; i < questions.length; i++) {
        const j = Math.floor(Math.random() * i);
        const temp = questions[i];
        questions[i] = questions[j];
        questions[j] = temp;
    }
}

renderStart();

//shuffleQuestions();

