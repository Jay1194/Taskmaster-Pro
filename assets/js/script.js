var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
    
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};



// uses event delegating clicks to the parent <ul> with class list-group.
$(".list-group").on("click", "p", function() {


  // This blur event will trigger as soon as the user interacts with anything other than the <textarea> element.
  $(".list-group").on("blur", "textarea", function() {

    //These data points will help us update the correct task in the tasks object.
    // get the textarea's current value/text
    var text = $(this)
    .val()
    .trim();


    // get the parent ul's id attribute
    var status = $(this)
    .closest(".list-group") 

    //returning the ID, which will be "list-" followed by the category.
    .attr("id")

    // to remove "list-" from the text, which will give us the category name "toDo" (that will match one of the arrays on the tasks object)
    .replace("list-", "");


    //get the task's position in the list of other li elements
    var index = $(this)
    .closest(".list-group-item")
    .index();


    // Because we don't know the values, we'll have to use the variable names as placeholders.
    tasks[status][index].text = text;

    //Updating this tasks object was necessary for localStorage, so we call saveTasks() immediately afterwards.
    saveTasks();

/* tasks is an object.

tasks[status] returns an array (e.g., toDo).

tasks[status][index] returns the object at the given index in the array.

tasks[status][index].text returns the text property of the object at the given index. */


// recreate p element
var taskP = $("<p>")
.addClass("m-1")
.text(text);

// replace textarea with p element
$(this).replaceWith(taskP);
  });

  // converts $(this) to an object
  var text = $(this)

  // will get inner text content of current element, represented by $(this).
  .text()

  // remove any extra white space before or after.
  .trim();
  
  // create dynamic elements
  var textInput = $("<textarea>")
  
  // adds new class
  .addClass("form-control")
  
  // adds (text) value
  .val(text);

// swap out the existing <p> element with new <textare>
$(this).replaceWith(textInput);

textInput.trigger("focus");
});


// due date was clicked
$(".list-group").on("click", "span", function() {
  
  //convert them back when the user clicks outside
  // value of due date was changed
  $(".list-group").on("blur", "input[type='text']", function() {

    //get current text
    var date = $(this)
    .val()
    .trim();

    //get the parent ul's id attribute
    var status = $(this)
    .closest(".list-group")
    .attr("id")
    .replace("list-", "");

    // get the tasks position in the list of other li elements
    var index = $(this)
    .closest(".list-group-item")
    .index();

    // update task in array and resave to localstorage
    tasks[status][index].date = date;
    saveTasks();

    // recreate span element with bootstrap classes 
    var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(date);
    
    // replace input with span element
    $(this).replaceWith(taskSpan);
  });


  // get current text
  var date = $(this)
    .text()
    .trim();

  // create new input element
  var dateInput = $("<input>")

  // With two arguments, it sets an attribute
    .attr("type", "text")

    .addClass("form-control")
    .val(date);

  // swap out elements
  $(this).replaceWith(dateInput);

  // automatically focus on new element
  dateInput.trigger("focus");
});



// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// load tasks for the first time
loadTasks();


