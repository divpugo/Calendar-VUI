const startBtn = document.querySelector("#start-btn");
    helpPanel = document.querySelector(".help_panel");
    chatbox = document.querySelector(".full-chat-block");
    audioBtn = document.querySelector(".audio");
    chatboxBtnExt = document.querySelector(".ext");

const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const synth = window.speechSynthesis;

var scrolled = false;

function updateScroll(){
    if(!scrolled){
        var element = document.getElementById("full-chat-block");
        element.scrollTop = element.scrollHeight;
    }
}

chatboxBtnExt.addEventListener("click", () => {
    chatbox.classList.remove("active");
    recognition.stop();
    $('#vui-btn').removeClass('rotate');
})

//function to view chatbox
audioBtn.addEventListener("click", () => {
    chatbox.classList.toggle("active");
    $('#vui-btn').toggleClass('rotate');
    recognition.start()
})

chatbox.addEventListener("click", () => {
    scrolled = true;
  })
    

// Function to get time for time stamp
function getTime(){
    let today = new Date();
    hours = today.getHours();
    minutes = today.getMinutes();

    if (hours < 10) {
        minutes = "0" + hours;
    }

    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    let time = hours + ":" + minutes;
    return time;
}

let time = getTime();

$("#chat-timestamp").append(time);

document.getElementById("botStartMessage").scrollIntoView(true);

function sayTodaysDate(){
    recognition.stop();
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    today = new Date();
    let botHtml = '<p class="botText"><span> Today is ' + weekday[today.getDay()] + ' '+ month[today.getMonth()] + ' ' + today.getDate() + ' '  + today.getFullYear() +'</span></p>'
    $("#chatbox").append(botHtml);
    let utter = new SpeechSynthesisUtterance("Today is" + weekday[today.getDay()] + ' ' + today.getDate() + ' ' + month[today.getMonth()] + ' ' + today.getFullYear());
    synth.speak(utter);
    utter.onend = () => {
        recognition.start();
    }
}

let possibleInput = [
    ["hi","hey","hello"],
    ["help", "guide", "assist","commands"],
    ["home", "homepage", "main"],
    ["play","lecture","video", "videos", "lectures", "recording","recordings"],
    ["previous month", "month before"],
    ["next month", "month after"],
    ["today", "now"],
    ["reminder"],
    ["save", "add", "submit"],
    ["how", "create"],
    ["delete", "erase"],
    ["bye", "good bye", "goodbye", "see you later"]
];

let responses = [
    ["Hello, how may I help you?"],
    ["Here are available commands in the help area, please choose"],
    ["You will be redirected to myUniHub homepage shortly"],
    ["You will be redirected to MDX Play where you can access your lecture recordings shortly"],
    ["The calendar displayed has been updated to the previous month"],
    ["The calendar displayed has been updated to the next month"],
    ["Today's date is highlighted on the calendar"],
    ["You will now be prompted to manually create an event on the highlighted date. To create an event for another date, say 'close' and ask 'how to create an event'."],
    ["Your reminder has been set. Navigate to the date on the calendar to view it."],
    ["To create an event for any other date aside from today, click on your desired date on the calendar first then say 'set a reminder'."],
    ["Navigate to the date on the calendar and click on the event to delete it"],
    [ "Goodbye, see you later"]
]

let alternative = ["Invalid command, please refer to help section for accepted commands."]

//function to check if user input matches accepted command and has a corresponding respond available 
function compare(arr, array, string){
    let items = "";
    console.log(string);
    for(let x=0; x<arr.length; x++){
        for(let y=0; y<array.length; y++){
            if(arr[x][y] == string || string.includes(arr[x][y]) ){
                switch(x) {
                    case 1:
                        setTimeout(() => {
                            helpPanel.classList.toggle("active");
                        }, 4000)

                        break;
                    case 2:
                        setTimeout(() => {
                            window.location.replace("https://mdx.mrooms.net/");
                        }, 4500)
                        
                        break;
                    case 3:
                        setTimeout(() => {
                            window.location.replace("https://www.play.mdx.ac.uk/#");
                        }, 4500)
                        
                        break;
                    case 4: 
                    
                        prevMonth();

                        break;
                    case 5:
                        nextMonth();

                        break;
                    case 6:
                        goToToday();
                        setTimeout(() => {
                            sayTodaysDate();                           
                        }, 2000)
                        
                        break;
                    case 7:
                        setTimeout(() => {
                            addReminder();                           
                        }, 10000)
                        
                        break;
                        
                }
                items = array[x];
                
            }
        }
    }
    console.log(items);
    return items;
}

function generateBotReply(string){
    let output;
    let utter;
    output = compare(possibleInput, responses, string);
    if (output == ""){
        chatbox.classList.toggle("active");
        let botHtml = '<p class="botText"><span>' + alternative[0] + '</span></p>'
        $("#chatbox").append(botHtml);
        utter = new SpeechSynthesisUtterance(alternative[0]);
        recognition.stop();
        synth.speak(utter);
        setTimeout(() => {
            helpPanel.classList.toggle("active");
        }, 3000)
    }
    else {
        let botHtml = '<p class="botText"><span>' + output + '</span></p>'
        $("#chatbox").append(botHtml);
        utter = new SpeechSynthesisUtterance(output);
        recognition.stop();

        synth.speak(utter);
    }

    if(output !== responses[6] && output !== responses[7]) {
        console.log("not 7 or 6")
        utter.onend = () => {
            recognition.start();
        }
    }

}

recognition.onresult = (e) => {
    const transcript = e.results[e.results.length -1][0].transcript.trim();
    if (transcript === "close"){
        helpPanel.classList.remove("active");
        addEventWrapper.classList.remove("active");

        let botHtml = '<p class="botText"><span>' + "Try asking something else" + '</span></p>'
        $("#chatbox").append(botHtml);
        utter = new SpeechSynthesisUtterance("Try asking something else");
        recognition.stop();

        synth.speak(utter);
        utter.onend = () => {
            recognition.start();
        }
    }
    else {
        let userHtml = '<p class="userText"><span>' + transcript + '</span></p>';
        $("#chatbox").append(userHtml);
        setInterval(updateScroll,1000);
        generateBotReply(transcript);
    }
};

//Gets the text text from the input box and processes it
function getResponse() {
    scrolled = false;
    setInterval(updateScroll,1000);
    let userText = $("#textInput").val();

    if (userText == "") {
        userText = "help";

        let userHtml = '<p class="userText"><span>' + userText + '</span></p>';
        $("#textInput").val("");
        $("#chatbox").append(userHtml);

        setTimeout(() => {
            helpPanel.classList.toggle("active");
        }, 4000)
    }
    let userHtml = '<p class="userText"><span>' + userText + '</span></p>';
    $("#textInput").val("");
    $("#chatbox").append(userHtml);
    generateBotReply(userText);
}

function sendButton() {
    getResponse();
}


// Press enter to send a message
$("#textInput").keypress(function (e) {
    if (e.which == 13) {
        getResponse();
    }
});

function addReminder(){
    chatbox.classList.remove("active");
    addEventWrapper.classList.toggle("active");
    let utter = new SpeechSynthesisUtterance("Please type in the title, start time and end time of the event you are adding to the calendar. Say 'add event' to save log the reminder.");
    synth.speak(utter);
    utter.onend = () => {
        recognition.start();
    }
    recognition.onresult = (e) => {
    const transcript = e.results[e.results.length -1][0].transcript.trim();

    if (transcript === "close"){
        helpPanel.classList.remove("active");
        addEventWrapper.classList.remove("active");

        let botHtml = '<p class="botText"><span>' + "Try asking something else" + '</span></p>'
        $("#chatbox").append(botHtml);
        utter = new SpeechSynthesisUtterance("Try asking something else");
        recognition.stop();

        synth.speak(utter);
        utter.onend = () => {
            recognition.start();
            chatbox.classList.toggle("active");
        }
    }
    else if (transcript == "submit" || "save"){
        addEvent();
        generateBotReply(transcript);
        chatbox.classList.toggle("active");
    }
    else{
        let utter = new SpeechSynthesisUtterance("No reminder has been set as fields were empty.")
        synth.speak(utter);
        utter.onend = () => {
          recognition.start();
        }
        addEventWrapper.classList.remove("active");
    }
    }

}