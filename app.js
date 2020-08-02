
const taskDB=[];
let taskID = 0;

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

const openNewTask = document.querySelector("#openForm");
const taskForm = document.querySelector("#taskForm");

openNewTask.addEventListener("click", function(event){
  clearValues();
  clearValidations();
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


function addTask(title,description,assignee, date, time, priority, status){
  taskID++;
  const task = {title,description,assignee, date, time, priority, status, id:taskID};
  taskDB.push(task);
  refreshPage();
  clearValues();
  clearValidations();
  statusStats()
}


function saveButtonClicked(event){
  event.preventDefault();
  //console.log("check ID in saveButtonClicked "+temp);
  const title = taskTitle.value;
  const description = taskDescription.value;
  const assignee = taskAssignedTo.value;
  const date = taskDueDate.value;
  const time = taskDueTime.value;
    //select Priority , select Status
  const priority = selectedPriority();
  const status = selectedStatus();
  console.log("check ID in saveButtonClicked"+ taskForm.classList.item(0));

  //let task = {title,description,assignee, date, time, priority, status, id};
  if(validationTaskForm(title,description,assignee, date, priority, status)){
    if(!taskForm.classList.item(0)){
    addTask(title,description,assignee, date, time, priority, status);
    console.log(taskForm.classList.item(0));
    } else {
    const id = taskForm.classList.item(0);
    const task = {title,description,assignee, date, time, priority, status, id};

    console.log("debugging review ", task);
    console.log(taskForm.classList.item(0));//class list is still there remove all after use
    editTask(task);
    console.log("debugging review ", task);
    taskForm.classList.remove(`${id}`);
    }
    $("#newTaskInput").modal("hide");
  }  else {
    alert("Please complete the form");
  }
}

const formCancel = document.querySelector("#cancelButton");
const formClose=document.querySelector("#close");
formCancel.addEventListener("click", function(event){
  const id = taskForm.classList.item(0);
  if (id){
  taskForm.classList.remove(`${id}`);
  }
});
formClose.addEventListener("click", function(event){
  const id = taskForm.classList.item(0);
  if (id){
  taskForm.classList.remove(`${id}`);
  }
});

//find priority
function selectedPriority(){

  if (high.checked){
    return high.value;
  }else if (medium.checked) {
    return medium.value;
  } else if (low.checked) {
    return low.value;
  } else {
    return no.value;
  }
}

//Status


function selectedStatus(){

  if (done.checked){
    return done.value;
  } else if (review.checked) {
    return review.value;
  } else if (inProgress.checked) {
    return inProgress.value;
  } else if (toDo.checked) {
    return toDo.value;
  } else {
    return false;
  }
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

const getTotal = document.querySelector("#getTotal");
const totalNumber = document.querySelector("#getTotal > span");
getTotal.addEventListener("click", getAllTask);
function getAllTask(){
  clearAll();
  taskDB.forEach(task => addTaskToPage(task));
  totalNumber.innerHTML = `${taskDB.length}`;
}

const getDone = document.querySelector("#getDone");
const getReview = document.querySelector("#getReview");
const getInProgress = document.querySelector("#getInProgress");
const getToDo = document.querySelector("#getToDo");
getDone.addEventListener("click", function(){
  getTasksWithStatus("text-success");
});
getReview.addEventListener("click", function(){
  getTasksWithStatus("text-info");
});
getInProgress.addEventListener("click", function(){
  getTasksWithStatus("text-warning");
});
getToDo.addEventListener("click", function(){
  getTasksWithStatus("text-danger");
});
function getTasksWithStatus(status){
  clearAll();
  // const getStatus = taskDB.map(function(task) {
  //   if(task.status === status){
  //     addTaskToPage(task);
  //     i++;
  //   }});

  taskDB.forEach(function (task){
    if (status === task.status){addTaskToPage(task)};
  });
}
const findTaskIndex = (task) => taskDB.findIndex(taskInDB => (taskInDB.id == task.id));//something wrong in this functioin return's negative

function deleteTask(task){
  let taskIndex = findTaskIndex(task);
  console.log("deleted  " + findTaskIndex(task));
  taskDB.splice(taskIndex,1);
  refreshPage();
  statusStats();
}
function statusStats(){
  totalNumber.innerHTML = `${taskDB.length}`;
  getDone.querySelector("span").innerHTML=`${taskDB.filter(task => task.status === "text-success").length}`;
  getReview.querySelector("span").innerHTML=`${taskDB.filter(task => task.status === "text-info").length}`;
  getInProgress.querySelector("span").innerHTML=`${taskDB.filter(task => task.status === "text-warning").length}`;
  getToDo.querySelector("span").innerHTML=`${taskDB.filter(task => task.status === "text-danger").length}`;
}
function editTask(task){
  taskDB.splice(findTaskIndex(task),1,task);
  refreshPage();
  clearValues();
  clearValidations();
  statusStats();
}

// function updateTaskDescription(taskID, assignee){
//  taskDB[taskID].description = description;
// }
// function updateAssignTask(taskID, assignee){
//   taskDB[taskID].assignee = assignee;
// }
// function updateTaskDate(taskID, date){
//    taskDB[taskID].date = date;
// }
// function updateTaskTime(taskID, time){
//    taskDB[taskID].time= time;
// }
// function updateTaskPriority(taskID, priority){
//    taskDB[taskID].status = priority;
// }
// function updateTaskStatus(taskID, status){
//    taskDB[taskID].status = status;
// }


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

  <div class="task" id="task${task.id}">
    <div  class="row">
      <div class="col-lg-6 taskTitle order-2 order-lg-1">
        <a href="#newTaskInput" id = "editTaskButton" role=button class="d-inline btn btn-link col-2 ml-0 pl-0 mb-0 pb-0 text-dark" data-toggle="modal" data-target="#newTaskInput">
          <i class="fas fa-edit"></i></a>
          <p class="text-left d-inline"><sapn class="h6">${task.title}</span> <a href="#task${task.id}Description" class="text-secondary icon ml-0 pl-0 small" data-toggle="collapse" data-target="#task${task.id}Description"> See More
        </a>

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
              <button type="button" class="ml-0 pl-0 btn btn-link text-info bin" id="binForOne"><i class="icon fas fa-trash"></i></button>
              </form>
          </li>
        </ul>
      </div>
    </div>
    <div id="task${task.id}Description" class="collapse">
          ${task.description}
    </div>
    <hr>
  </div>`;
 const taskElement = document.createRange().createContextualFragment(html);
 const editTaskOnPage = taskElement.querySelector("#editTaskButton");
  editTaskOnPage.addEventListener("click", function(){
    clearValues();
    clearValidations();
    taskForm.classList.add(task.id);
    taskTitle.value=task.title;
    taskDescription.value = task.description;
    taskAssignedTo.value = task.assignee;
    taskDueDate.value = task.date;
    taskDueTime.value =task.time;
    switch (task.priority) {
      case 'bg-danger':
      high.checked  = true;
      break;
      case 'bg-warning':
      medium.checked  = true;
      break;
      case 'bg-info':
      low.checked  = true;
      break;
      default:
      no.checked  = true;
    }
    switch (task.status) {
      case 'text-success':
      done.checked = true;
      break;
      case 'text-info':
      review.checked  = true;
      break;
      case 'text-warning':
      inProgress.checked  = true;
      break;
      default:
      toDo.checked  = true;
    }
  });

  const deleteTaskOnPage = taskElement.querySelector('#binForOne');
  deleteTaskOnPage.addEventListener("click", function(){
    deleteTask(task);
    deleteTaskOnPage.closest("div.task").remove();
  });

  const checkbox = taskElement.querySelector('.bin > input[type="checkbox"]');
  const clearChecked = document.querySelector("#clearChecked");
  clearChecked.addEventListener('click', checkboxClicked);

  function checkboxClicked (event){
       if (checkbox.checked){
         console.log("checked " + task.id);
         deleteTask(task);
         console.log("post checked " + task.id);
          checkbox.closest("div.task").remove();
          clearChecked.removeEventListener('click', checkboxClicked);
           }
         }
  taskContainer.append(taskElement);
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  });
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
addTask("Team work Project",
`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type
specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
"Yumi Patton",
"2020-07-31",
"02:05",
"bg-info",
"text-info");
addTask("Javescript project",
`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type
specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
"Yumi Patton",
"2020-08-31",
"10:05",
"bg-warning",
"text-warning");
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
addTask("Team work Project",
`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type
specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
"Yumi Patton",
"2020-07-31",
"02:05",
"bg-info",
"text-info");
addTask("Javescript project",
`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type
specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
"Yumi Patton",
"2020-08-31",
"10:05",
"bg-warning",
"text-warning");
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
addTask("Team work Project",
`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type
specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
"Yumi Patton",
"2020-07-31",
"02:05",
"bg-info",
"text-info");
addTask("Javescript project",
`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type
specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
"Yumi Patton",
"2020-08-31",
"10:05",
"bg-warning",
"text-warning");
