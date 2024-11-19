class TaskManager {
  constructor() {
    // Select DOM elements
    this.displayLists = document.getElementById("displayLists");
    this.inputText = document.getElementById("input_text");
    this.submitTask = document.getElementById("sumbitTask");
    this.body = document.getElementById("body");

    // Initialize TaskStorage from localStorage or empty array if none exists
    this.TaskStorage = JSON.parse(localStorage.getItem("TaskStorage")) || [];

    // Event listener for adding a new task
    this.submitTask.addEventListener("click", (e) => this.addTask(e));

    // Render tasks on page load
    this.updateDisplayLists();
  }

  // Creates a task item as a list element (li)
  createTaskItem(taskText, index, isCompleted) {
    const li = document.createElement("li");
    li.setAttribute("data-index", index); // Assign index to a data attribute
    li.style.transition = "opacity 0.5s ease-in-out"; // Add transition for smooth appearance
    li.classList.toggle('completed', isCompleted); // Apply 'completed' class if task is completed

    // Create task content div
    const divInsideLi = document.createElement("div");
    divInsideLi.classList.add("div_inside_li");

    // Checkbox for marking task as complete
    const label = document.createElement("label");
    label.classList.add("checkbox");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "checkbox";
    checkbox.checked = isCompleted; // Load checked status from localStorage

    const h5 = document.createElement("h5");
    h5.textContent = taskText;

    // Line-through styling when checkbox is clicked
    checkbox.addEventListener("click", () => {
      if (checkbox.checked) {
        h5.style.textDecorationLine = "line-through";
      } else {
        h5.style.textDecorationLine = "none";
      }
      this.TaskStorage[index].isCompleted = checkbox.checked; // Update completed status in storage
      this.saveToLocalStorage(); // Save to localStorage
    });

    const span = document.createElement("span");
    label.appendChild(checkbox);
    label.appendChild(span);

    divInsideLi.appendChild(label);
    divInsideLi.appendChild(h5);

    // Create buttons for edit and delete
    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add("buttons_edit_delete");

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => this.editTask(h5, index, editButton));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => this.deleteTask(index));

    buttonDiv.appendChild(deleteButton);
    buttonDiv.appendChild(editButton);

    li.appendChild(divInsideLi);
    li.appendChild(buttonDiv);

    return li;
  }

  // Adds a new task
  addTask(e) {
    e.preventDefault();
    const value = this.inputText.value;

    if (value.trim() === "") {
      alert("Please enter a task!");
    } else {
      // Push the task to storage with an initial 'isCompleted' status as false
      this.TaskStorage.push({ text: value, isCompleted: false });
      this.notificationMessage(
        "Task Added Successfully!",
        "rgba(220,237,200,255)",
        "rgba(51,105,31,255)"
      );
      this.updateDisplayLists();
      this.saveToLocalStorage();
      this.inputText.value = ""; // Clear the input field
    }
  }

  // Updates the displayed list of tasks
  updateDisplayLists() {
    this.displayLists.innerHTML = ""; // Clear current list
    this.TaskStorage.forEach((task, index) => {
      this.displayLists.append(this.createTaskItem(task.text, index, task.isCompleted)); // Render tasks
    });
  }

  // Saves the current TaskStorage array to localStorage
  saveToLocalStorage() {
    localStorage.setItem("TaskStorage", JSON.stringify(this.TaskStorage));
  }

  // Edits a task
  editTask(h5, index, editButton) {
    const inputEdited = document.createElement("input");
    inputEdited.type = "text";
    inputEdited.classList.add("input_edited");
    inputEdited.value = h5.textContent;

    // disable Edit Button After Clicking it
    editButton.setAttribute("disabled", "disabled");

    h5.textContent = ""; // Clear the h5 content
    h5.appendChild(inputEdited);

    // Create save button
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";

    saveButton.addEventListener("click", () => {
      if (inputEdited.value.trim() === "") {
        alert("Task cannot be empty!");
      } else {
        // Update task text
        this.TaskStorage[index].text = inputEdited.value;
        h5.textContent = inputEdited.value; // Update the UI
        this.saveToLocalStorage();
        this.notificationMessage(
          "Task Updated Successfully!",
          "rgba(179,229,252,255)",
          "rgba(91,184,232,255)"
        );
        editButton.removeAttribute("disabled");
      }
    });

    h5.appendChild(saveButton);
  }

  // Deletes a task
  deleteTask(index) {
    this.TaskStorage.splice(index, 1); // Remove the task from array
    this.notificationMessage(
      "Task Deleted",
      "rgba(255,204,188,255)",
      "rgba(202,39,35,255)"
    );
    this.updateDisplayLists(); // Update the UI
    this.saveToLocalStorage(); // Save changes to localStorage
  }

  // Displays a notification message
  notificationMessage(text, color, colorText) {
    const div = document.createElement("div");
    div.classList.add("notification_message");
    div.textContent = text;
    div.style.backgroundColor = color;
    div.style.color = colorText;

    this.body.append(div);

    setTimeout(() => {
      div.style.transform = "translateX(-200vw)";
    }, 3000);

    setTimeout(() => {
      div.remove();
    }, 4000);
  }
}

// Initialize TaskManager
const taskManager = new TaskManager();
