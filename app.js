$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})
let taskDB=[];
let taskID = 1;
//taskDetails
const taskTitle = document.querySelector('#taskTitle');
const taskDescription = document.querySelector('#taskDescription');
const taskAssignedTo = document.querySelector('#taskAssignedTo');
const taskDueDate = document.querySelector('#taskDueDate');
const taskDueTime = document.querySelector('#taskDueTime');
//Priority
const high = document.querySelector('#highPriority');
const medium = document.querySelector('#mediumPriority');
const low = document.querySelector('#lowPriority');
const no = document.querySelector('#noPriority');
//Status
const done = document.querySelector('#statusDone');
const review = document.querySelector('#statusReview');
const inProgress = document.querySelector('#statusInProgress');
const toDo = document.querySelector('#statusToDo');
const newToDo = document.querySelector("#newToDo");
const openForm = document.querySelector("#openForm");
//const openForm = document.querySelector("#newTask");
openForm.addEventListener("click", function(event){
  clearValues();
  clearValidations();
  console.log(newToDo.value);
  taskTitle.value = newToDo.value;
  if(taskTitle.value && taskTitle.value.length > 8){
    taskTitle.classList.add("is-valid");
  } else {
    taskTitle.classList.add("is-invalid");
  }
  newToDo.value = null;
});

function clearValues(){
  taskTitle.value = null;
  taskDescription.value = null;
  taskAssignedTo.value = null;
  taskDueDate.value = null;
  taskDueTime.value = null;
  high.checked = false;
  medium.checked = false;
  low.checked = false;
  no.checked = false;
  done.checked = false;
  review.checked = false;
  inProgress.checked = false;
  toDo.checked = false;
}
function clearValidations(){
  taskTitle.classList.remove("is-invalid", "is-valid");
  taskDescription.classList.remove("is-invalid", "is-valid");
  taskAssignedTo.classList.remove("is-invalid", "is-valid");
  taskDueDate.classList.remove("is-invalid", "is-valid");
}
const taskContainer = document.querySelector("#tasks");
const taskModalSaveButton = document.querySelector("#taskForm");

taskModalSaveButton.addEventListener("submit",saveButtonClicked);

function saveButtonClicked(event){
  event.preventDefault();
  const title = taskTitle.value;
  const description = taskDescription.value;
  const assignee = taskAssignedTo.value;
  const date = taskDueDate.value;
  const time = taskDueTime.value;
    //select Priority , select Status
  const priority = selectedPriority();
  const status = selectedStatus();

  if(validationTaskForm(title,description,assignee, date, priority, status)){
    addTask(title,description,assignee, date, time, priority, status);
    $("#newTaskInput").modal("hide");
  }  else {
    alert("Please complete the form");
  }
}
//find priority
function selectedPriority(){

  if (high.checked){
    return high.value;
  }else if (medium.checked) {
    return medium.value;
  } else if (low.checked) {
    return low.value;
  } else if (no.checked) {
    return no.value;
  }
    return false;
}
function selectedStatus(){

  if (done.checked){
    return done.value;
  }else if (review.checked) {
    return review.value;
  } else if (inProgress.checked) {
    return inProgress.value;
  } else if (toDo.checked) {
    return toDo.value;
  }
   return false;
}

taskTitle.addEventListener("input", function(event){
  validation(notEmptyandLongerThan(8));
});
taskDescription.addEventListener("input", function(event){
  validation(notEmptyandLongerThan(15));
});
taskAssignedTo.addEventListener("input", function(event){
  validation(notEmptyandLongerThan(8));
});
taskDueDate.addEventListener("input", function(event){
  const today = todayConvertor();
  const dueDate = new Date(event.target.value);
  validation(today <= dueDate);
})

function todayConvertor(){
  const today = new Date();
  return today.setHours(0,0,0,0);
}


function validation(boolean){
  if(boolean){
    event.target.classList.remove("is-invalid");
    event.target.classList.add("is-valid");
  } else {
    event.target.classList.remove("is-valid");
    event.target.classList.add("is-invalid");
  }
};
function notEmptyandLongerThan (number){
  return event.target.value && event.target.value.length > number;
}
function validationTaskForm(title,description,assignee, date, priority, status){
  const dueDate = new Date(date);
  const today = todayConvertor();
  if(title && title.length > 8){
    console.log("pass title");
    if(description && description.length > 15){
      console.log("pass description");
      if(assignee && assignee.length > 8){
        console.log("pass assignee");
        if(dueDate && today <= dueDate ){
          console.log("pass dueDate");
          if(priority){
            console.log("pass priority");
            if(status){
              console.log("pass status")
              return true;
            }
          }
        }
      }
    }
  }
  return false;
}
function addTask(title,description,assignee, date, time, priority, status){
  taskID++;
  const task = {title,description,assignee, date, time, priority, status, id:taskID};
  taskDB.push(task);
  refreshPage()
}

function refreshPage(){
  clearAll();
  taskDB.forEach(task => addTaskToPage(task));
}

function clearAll(){
  taskContainer.innerHTML = "";
}

//function name changed edit later
function addTaskToPage(task){

  const html = `
  <div class="row task" id="task${task.id}">
    <div class="col-lg-6 taskTitle order-2 order-lg-1">
      <a href="#newTaskInput" role=button class="d-inline btn btn-link col-2 ml-0 pl-0 mb-0 pb-0 text-dark" data-toggle="modal" data-target="#newTaskInput">
        <i class="fas fa-edit"></i></a>
        <p class="text-left d-inline"><sapn class="h6">${task.title}</span> <a href="#task${task.id}Description" class="text-secondary icon ml-0 pl-0 small" data-toggle="collapse" data-target="#task${task.id}Description"> See More
      </a>

          </p>
        <p id="task${task.id}Description" class="collapse">
              ${task.description}
        </p>
    </div>
    <div class="col-lg-6 order-1 order-lg-2">
      <ul class="row taskSummary justify-content-between">
        <li class="col-4 col-sm-1 order-1 order-sm-1">
          <span class="dot rounded-circle ${task.priority} icon" data-toggle="tooltip" data-placement="top" title="Priority"></span>
        </li>
        <li class="col-4 col-sm-1 order-2 order-sm-2 text-center">
          <i class="icon fas fa-tag ${task.status}" data-toggle="tooltip" data-placement="top" title="Status"></i>
        </li>
        <li class="col-6 col-sm-4 order-4 order-sm-3 text-sm-right">
          ${task.date} ${task.time}
        </li>
        <li class="col-6 col-sm-4 order-5 order-sm-4 text-sm-center text-right">
        ${task.assignee}
        </li>
        <li class="col-4 col-sm-2 order-3 order-sm-5 text-right">
        <form class="bin" action="" method="post">
            <input type="checkbox" class="border border-info">
            <button type="button" class="ml-0 pl-0 btn btn-link text-info bin"><i class="icon fas fa-trash"></i></button>
            </form>
        </li>
      </ul>
    </div>
  </div>
  <hr>
`;
 const taskElement = document.createRange().createContextualFragment(html);
  const deleteTask= taskElement.querySelector('button.bin');
  deleteTask.addEventListener("click", function(){
    deleteTask.closest("div.task").remove();
  });
  const checkbox = taskElement.querySelector('.bin > input[type="checkbox"]');
  clearChecked.addEventListener('click', function(){
    if (checkbox.checked){
       checkbox.closest("div.task").remove();
        }
       });

  taskContainer.append(taskElement);

}
addTask("Team work Project",
`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type
specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
"Yumi Patton",
"2020-07-31",
"02:05",
"bg-danger",
"text-info");
addTask("Javescript project",
`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type
specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
"Yumi Patton",
"2020-08-31",
"10:05",
"bg-warning",
"text-danger");
