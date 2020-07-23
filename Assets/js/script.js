class Question {
    constructor(questionText, response, correctResponse) {
        this.questionText = questionText;
        this.response = response;
        this.correctResponse = correctResponse;
    }
}

var questions = [new Question("Which of the following is not a method for an array?", ["concat()", "fill()", "keys()", "copy()"], 3), 
                 new Question("Which of the following expressions will return false?", ["[1] == [1]", "\"1\" == true", "\"\" == false", "[1] == \"1\""], 0),
                 new Question("What does the parseInt() function return if it's argument cannot be converted to a number?", ["undefined", "null", "NaN", "infinity"], 2),
                 new Question("Which of the following is the method for converting an object to a JSON string?", ["toString()", "parse()", "stringify()", "splice()"], 2),
                 new Question("True or False: In order to use the Math object we need to create it first.", ["True", "False"], 1),
                 new Question("What is the value of z, Given: var y = 3; var x = 9; z = x++ * ++y;", [30, 40, 27, 36], 0)];

var qIndex = 0;
var startingTime = 60;
var timeElapsed = 0;
var score = 0;
var wasCorrect = false;
var promptDisplay = document.querySelector("#prompt-display");
var timeDisplay = document.querySelector("#time-left").textContent = startingTime - timeElapsed;
var interval;

document.addEventListener("click", function() {

    let targetId = event.target.id;
    let targetTagName = event.target.nodeName;

    //Changes prompt when a button is pushed, else do nothing
    if(targetTagName == "BUTTON"){
        if(targetId == "start"){

            interval = setInterval(startTimer, 1000);
        }
        else if(qIndex > 0 && targetId == questions[qIndex - 1].correctResponse){
            wasCorrect = true;
            score++;
        }
        else{
            wasCorrect = false;
            timeElapsed = timeElapsed + 10;
        }
        
        if(qIndex < questions.length){
            renderNextQuestion();
            qIndex++;
        }
        else{
            clearInterval(interval);
            renderReport();
        }
    }
});

function renderNextQuestion(){
    //clear prompt
    promptDisplay.innerHTML = "";

    //Adds question text to prompt
    var node = document.createElement("H3");
    var textNode = document.createTextNode(questions[qIndex].questionText);
    node.appendChild(textNode);
    promptDisplay.appendChild(node);

    //Adds buttons for response
    for(i = 0; i < questions[qIndex].response.length; i++){
        let buttonNode = document.createElement("BUTTON");
        buttonNode.textContent = questions[qIndex].response[i];
        buttonNode.className += "btn btn-primary btn-lg";
        buttonNode.id = i;
        promptDisplay.appendChild(buttonNode);
    }

    node = document.createElement("hr");
    promptDisplay.appendChild(node);

    if(qIndex != 0){
        node = document.createElement("H4");
        wasCorrect != 0 ? node.innerHTML = "Correct" : node.textContent = "Incorrect";
        promptDisplay.appendChild(node);
    }
}

function renderReport(){
    promptDisplay.innerHTML = "";

    //Adds question text to prompt
    var timeRemaining = startingTime - timeElapsed;
    var node = document.createElement("H3");
    var textNode = document.createTextNode("You answered " + score + " question(s) correctly with " + timeRemaining + " second(s) remaining.");
    node.appendChild(textNode);
    promptDisplay.appendChild(node);

}

function startTimer(){

    timeElapsed++;

    if(startingTime <= timeElapsed) {
        timeElapsed = startingTime;
        renderReport();
        clearInterval(interval);
    }

    timeDisplay = document.querySelector("#time-left").textContent = startingTime - timeElapsed;
}

function shuffleQuestions(){
    for(i = 0; i < questions.length; i++){
        const j = Math.floor(Math.random() * i);
        const temp = questions[i];
        questions[i] = questions[j];
        questions[j] = temp;

        console.log(questions[i]);
    }
}

//shuffleQuestions();

