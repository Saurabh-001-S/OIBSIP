const modal = document.getElementById('modal')
const taskForm = document.getElementById("task-form");
const editList = document.getElementById('edit-form');
const overlayModal = document.getElementById('overlayModal')
const pendingTasksContainer = document.getElementById("pendingUl");
const inProgressTasksContainer = document.getElementById("progressUl");
const completedTasksContainer = document.getElementById("completedUl");
let editListId = -1;
let tasks = [];
let Id = 100;

const searchList = (listId) => {
   let task;
   for (const key in tasks) {
      if (tasks[key].taskId === listId) {
         task = tasks[key];
      }
   }
   return task;
}

const closeModal = () => {
   editList.innerHTML = ``;
   document.getElementById('detailContainer').innerHTML = ``;
   overlayModal.classList.remove("slide-bottom");
   modal.classList.remove("toggleModal");
}

const getTime = () => {
   const d = new Date();
   return d.getDate() + "/" + (d.getMonth() + 1) + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
}

const addToPending = async (Id) => {
   inProgressTasksContainer.removeChild(document.getElementById(Id))
   closeModal();
   let list = await searchList(Id)
   list.listState = "pending"
   const taskElement = createTaskElement(list);
   pendingTasksContainer.appendChild(taskElement);
}

const addToProgress = async (Id) => {
   pendingTasksContainer.removeChild(document.getElementById(Id))
   closeModal();
   let list = await searchList(Id)
   list.listState = "progressive"
   const taskElement = createTaskElement(list);
   inProgressTasksContainer.appendChild(taskElement);
}

const addToComplete = async (Id) => {
   let list = await searchList(Id);
   if (list.listState === "pending") {
      pendingTasksContainer.removeChild(document.getElementById(Id))
      closeModal();
      list.listState = "complete"
      const taskElement = createTaskElement(list);
      completedTasksContainer.appendChild(taskElement);
   } else {
      inProgressTasksContainer.removeChild(document.getElementById(Id))
      closeModal();
      list.listState = "complete"
      const taskElement = createTaskElement(list);
      completedTasksContainer.appendChild(taskElement);
   }
}

const callModal = async (id) => {
   let task = await searchList(id)
   overlayModal.classList.add("slide-bottom");
   modal.classList.add("toggleModal");
   document.getElementById('detailContainer').innerHTML =
      `
         <p class="flexCol">
            <span class="col-orange">Title </span>
            <span class="col-papaya" id="Mtitle">${task.detail.title}</span>
         </p>
         <p class="flexCol">
            <span class="col-orange">Description </span>
            <span class="col-papaya" id="Mdescription">${task.detail.des}</span>
         </p>
         <p id="MDate" class="col-papaya">${task.detail.date}</p>
         <div class="flexRow"> 
            ${task.listState === "pending" ? (`
            <button class="col-papaya btn ${task.listState === "complete" ? "visibility" : ""}" 
            type="button" onclick="addToProgress(${id})">
               +Progressive
               </button>
               `) : (`
            <button class="col-papaya btn ${task.listState === "complete" ? "visibility" : ""}" 
            type="button" onclick="addToPending(${id})">
               +Pending
            </button>`)}
            <button class="col-papaya btn" onclick="closeModal()">
               Close
            </button>
            <button class="col-papaya btn ${task.listState === "complete" ? "visibility" : ""}" 
            type="button" onclick="addToComplete(${id})">
               +Complete
            </button>
         </div>
      `
}

const callEditModal = async (Id) => {
   let task = await searchList(Id)
   editListId = task.taskId;
   overlayModal.classList.add("slide-bottom");
   modal.classList.add("toggleModal");
   editList.innerHTML =
      `
         <input class="bg-caribbean col-papaya" value="${task.detail.title}" type="text" id="eTitle" 
         name="eTitle" placeholder="Title" required>
         <textarea class="bg-caribbean col-papaya" value="${task.detail.des}" name="eDescription" 
         placeholder="Description" id="eDescription" cols="30" rows="10" required></textarea>
         <button class="bg-orange col-papaya btn" type="submit">
            Save
         </button>
      `
   document.getElementById('eDescription').innerText = task.detail.des;
}

const removeList = (Id) => {
   let list; let listIndex = -1;
   for (const key in tasks) {
      if (tasks[key].taskId === Id) {
         listIndex = key;
         list = tasks[key];
      }
   }
   if (list.listState === "pending") {
      pendingTasksContainer.removeChild(document.getElementById(Id));
   } else if (list.listState === "progressive") {
      inProgressTasksContainer.removeChild(document.getElementById(Id));
   } else {
      completedTasksContainer.removeChild(document.getElementById(Id));
   }
   tasks.splice(listIndex, 1);
}

const createTaskElement = (task) => {
   const taskElement = document.createElement("li");
   taskElement.classList.add("bg-papaya", "flexCol");
   taskElement.setAttribute("id", task.taskId);
   taskElement.innerHTML = `
            <div class="list_details flexRow">
               <p class="list_item_title col-sienna">${task.detail.title.slice(0, 25)}</p>
               <div class="button_container flexRow">
                  <button type="button" class="list_item_editIcon col-sienna" onclick="callModal(${task.taskId})">
                    <img src="./Detail.svg" alt="detail" />
                  </button>
                  ${task.listState === "complete" ? (`
                        <button type="button" class="list_item_editIcon col-sienna">
                           <img src="./Complete.svg" alt="Complete">
                        </button>
                  `) : (`
                        <button type="button" class="list_item_editIcon col-sienna" onclick="callEditModal(${task.taskId})">
                           <img src="./Edit.svg" alt="Edit" />
                        </button>
                  `)}
                  <button type="button" class="list_item_editIcon col-sienna" onclick="removeList(${task.taskId})">
                    <img src="./Delete.svg" alt="Delete" />
                  </button>
               </div>
            </div>
         `;
   return taskElement;
}

editList.addEventListener('submit', (e) => {
   e.preventDefault();
   let task = searchList(editListId)
   //Update the Tasks List Array 
   task.detail.title = document.getElementById('eTitle').value;
   task.detail.des = document.getElementById('eDescription').value;
   task.detail.Date = getTime();

   // Change the UI Text
   const taskList = document.getElementById(task.taskId);
   const collection = taskList.querySelector('p');
   collection.textContent = document.getElementById('eTitle').value;
   closeModal()
})

taskForm.addEventListener("submit", (e) => {
   e.preventDefault();
   const title = document.getElementById('title').value;
   const description = document.getElementById('description').value;
   const date = getTime();
   const task = {
      taskId: Id,
      detail: {
         title: title,
         des: description,
         date: date
      },
      listState: "pending"
   };
   tasks.push(task);
   const taskElement = createTaskElement(task);
   pendingTasksContainer.appendChild(taskElement);

   document.getElementById('title').value = "";
   document.getElementById('description').value = "";
   Id++;
});
