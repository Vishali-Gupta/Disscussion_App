/**
 * When a question form in the right pane is submitted add a question to the left
 * 
 * --> Listen for the submit button to create question.
 * -->Append question to the left pane
 * -->listen for click on question and display in right pane
 * -->when user click on submit response button
 * -->Display response in response section.
 * 
 * https://projects.codequotient.com/project/discussionapp-3p34g81bvhl0anb34j
 * 
 * 1:46 minutes video
 * 
 */
 var submitQuestionNode = document.getElementById("submitBtn");
var questionTitleNode=document.getElementById("subject");
var questionDescriptionNode = document.getElementById("question");
var allQuestionsListNode=document.getElementById("dataList");
var createQuestionFormNode = document.getElementById("toggleDisplay");
var questionDetailContainerNode = document.getElementById("respondQue");
var resolveQuestionContainerNode=document.getElementById("resolveHolder");
var responseContainerNode = document.getElementById("respondAns");
var commentContainerNode = document.getElementById("commentHolder");
var commentatorNameNode = document.getElementById("pickName");
var commentNode=document.getElementById("pickComment");
var submitCommentNode = document.getElementById("commentBtn");
var questionSearchNode = document.getElementById("questionSearch");
var upvote = document.getElementById("upvote");
var downvote = document.getElementById("downvote");
var resolve = document.getElementById("resolveQuestion");
var newQuestionForm = document.getElementById("newQuestionForm");

 //--> Listen for the submit button to create question.
 submitQuestionNode.addEventListener("click",onQuestionSubmit);
questionSearchNode.addEventListener("change",function(event){
    filterResult(event.target.value);
  })
  newQuestionForm.addEventListener("click",displayQuestionForm);
  
  function displayQuestionForm(){
    createQuestionFormNode.style.display="block";
    hideDetailsOfResponse();
  }
  
  function hideDetailsOfResponse()
  {
    questionDetailContainerNode.style.display = "none";
    resolveQuestionContainerNode.style.display = "none";
    responseContainerNode.style.display = "none";
    commentContainerNode.style.display = "none";
  }
  

 //-->Display all existing question
 function onLoad(){
    addAllQuestionToPanel();


 }
 onLoad();


function onQuestionSubmit()
{ 
  if(questionTitleNode.value!=="" && questionDescriptionNode!==""){
    var question = {
      title:questionTitleNode.value,
      description : questionDescriptionNode.value,
      responses : [],
      upvote:0,
      downvote:0,
      Date:new Date().toDateString()
    }
    saveQuestion(question);
    addQuestionToPanel(question);
    aftersubmit();
  }
  else{
    alert("Both Fields are required!!")
  }
}

function aftersubmit(){
  questionTitleNode.value="";
  questionDescriptionNode.value="";
}
// add ques to local storage
function saveQuestion(question)
{
  //get all ques and add new ques
  // then store again in storage

  var allQuestions = getAllQuestions();
  allQuestions.push(question);
  localStorage.setItem("questions",JSON.stringify(allQuestions));
}

//get all ques from storage
function getAllQuestions()
{
  var allQuestions = localStorage.getItem("questions");
  if(allQuestions){
    allQuestions = JSON.parse(allQuestions)
  }
  else{
    allQuestions = []
  }
  return allQuestions;
}

// add ques to left panel
function addQuestionToPanel(question)
{
  var questionContainer = document.createElement("div");
  questionContainer.setAttribute("id",question.title);
  questionContainer.style.background = "grey";

  var newQuestionTitleNode = document.createElement("h2");
  newQuestionTitleNode.innerHTML=question.title;
  questionContainer.appendChild(newQuestionTitleNode);

  var newQuestionDescriptionNode=document.createElement("h4");
  newQuestionDescriptionNode.innerHTML=question.description;
  questionContainer.appendChild(newQuestionDescriptionNode);

  var dateNode = document.createElement("h5");
  dateNode.innerHTML = question.Date;
  questionContainer.appendChild(dateNode);
  
  var updownCountNode = document.createElement("h5");
  updownCountNode.innerHTML = "UP: " + question.upvote + " DOWN: " + question.downvote;
  questionContainer.appendChild(updownCountNode);
  allQuestionsListNode.appendChild(questionContainer);
  questionContainer.onclick = onQuestionClick(question);
}
function addAllQuestionToPanel(){
  var allQuestions = getAllQuestions();
  allQuestions.forEach(function(question){
    addQuestionToPanel(question);
  })
}
function clearQuestionForm()
{
  createQuestionFormNode.style.display = "none";
}

//click on ques and display to the left plane
function onQuestionClick(question)
{
  return function()
  {
    clearQuestionForm();
    hideQuestionPanel();
    clearQuestionDetails();
    clearResponsePanel();
    showDetails();

    addQuestionToRight(question);
    var allQuestions = getAllQuestions();
    var ques = allQuestions.filter((obj) => {
    return obj.title === question.title
        })
        
    showAllResponses(ques[0]);
   submitCommentNode.onclick=(onResponseSubmit(question));
  }
}
function showAllResponses(question) {
    question.responses.forEach(function (response) {
        addResponseInPanel(response)
    })
}
//Hide question
function hideQuestionPanel()
{
  createQuestionFormNode.style.display = "none";

}

function clearQuestionDetails()
{
  questionDetailContainerNode.innerHTML = "";
}

function clearResponsePanel()
{
  responseContainerNode.innerHTML="";
}

function showDetails()
{
  questionDetailContainerNode.style.display = "block";
  resolveQuestionContainerNode.style.display="block";
  responseContainerNode.style.display="block";
  commentContainerNode.style.display="block";
}

function addQuestionToRight(question)
{
  var titleNode = document.createElement("h3");
  titleNode.innerHTML = question.title;

  var descriptionNode = document.createElement("h5");
  descriptionNode.innerHTML=question.description;

  questionDetailContainerNode.appendChild(titleNode);
  questionDetailContainerNode.appendChild(descriptionNode);
  upvote.onclick = upvoteQuestion(question);
  downvote.onclick = downvoteQuestion(question);
  resolve.onclick = resolveQuestion(question);
}

function upvoteQuestion(question)
{
  return function()
  {
    question.upvote++;
    updateQuestion(question);
    updateQuestionUI(question);
  }
}

function downvoteQuestion(question)
{
  return function()
  {
    question.downvote++;
    updateQuestion(question);
    updateQuestionUI(question);
  }
}

function updateQuestionUI(question)
{
  var questionContainerNode = document.getElementById(question.title);
  questionContainerNode.childNodes[2].innerHTML = "upvote = "+question.upvote;
  questionContainerNode.childNodes[3].innerHTML = "downvote = "+question.downvote;
}

function onResponseSubmit(question)
{
  return function()
  {
    var response = {
      name:commentatorNameNode.value,
      description:commentNode.value
    }
    
    saveResponse(question,response);
    addResponseInPanel(response);

    aftercommentclick();
   
  }
}
function aftercommentclick(){
   commentatorNameNode.value="";
   commentNode.value="";
}

function saveResponse(updatedQuestion,response)
{
  var allQuestions = getAllQuestions();
  var revisedQuestions = allQuestions.map(function(question){
    if (updatedQuestion.title == question.title){
      question.responses.push(response)
    }
    return question;
  })
  localStorage.setItem("questions",JSON.stringify(revisedQuestions));
}

//display response
function addResponseInPanel(response)
{
  // debugger;
  var userNameNode = document.createElement("h2");
  userNameNode.innerHTML = response.name;
  var userCommentNode = document.createElement("h6");
  userCommentNode.innerHTML = response.description;

  var container = document.createElement("div");
  container.appendChild(userNameNode);
  container.appendChild(userCommentNode);

  responseContainerNode.appendChild(container);
}

function resolveQuestion(question){
  return function(){
    var allQuestions = getAllQuestions();
    allQuestions.forEach(function(singleque){
      if(singleque.title === question.title){
        var index=allQuestions.indexOf(singleque);
        allQuestions.splice(index,1);
      }
    }) 
    localStorage.setItem("questions",JSON.stringify(allQuestions));
    var resolveque = document.getElementById(question.title);
    resolveque.remove();
    hideDetailsOfResponse();
    displayQuestionForm();
  }
}
function updateQuestion(updatedQuestion){
  var allQuestions=getAllQuestions();
  var revisedQuestions = allQuestions.map(function(question){
    if(updatedQuestion.value===question.value){
      return updatedQuestion
    }
    return question;
  })
  localStorage.setItem("questions",JSON.stringify(revisedQuestions));
}

function filterResult(query)
{
  var allQuestions = getAllQuestions();
  if(query)
  {
    clearQuestionPanel();

    var filteredQuestions = allQuestions.filter(function(question)
    {
      if(question.title.includes(query))
      {
        return true;
      }
    });
    if(filteredQuestions.length)
    {
      filteredQuestions.forEach(function(question)
      {
        addQuestionToPanel(question);
      })
    }
    else{
      printNoMatchFound();
    }
  }
  else
  {
    //clearQuestionPanel();
    allQuestions.forEach(function(question)
    {
      addQuestionToPanel(question);
    });
  }
}

function clearQuestionPanel()
{
  allQuestionsListNode.innerHTML="";
}

function printNoMatchFound(){
  var title = document.createElement("h1");
  title.innerHTML="No match found!!";
  allQuestionsListNode.appendChild(title)
}