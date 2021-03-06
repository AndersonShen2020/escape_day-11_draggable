console.clear();

// ====== DOM ======
const urgent = document.querySelector(".stacked-list-js.urgent");
const important = document.querySelector(".stacked-list-js.important");
const normal = document.querySelector(".stacked-list-js.normal");

const containers = document.querySelectorAll("#multiple-containers-js .stacked-list-js");
const stackedListJs = document.querySelector("#multiple-containers-js");
const addTodoBtn = document.querySelector(".addTodoBtn-js");
const form = document.getElementById("form");

// ====== draggable var ======
const containerTwoCapacity = 3;
const limitCapacity = {
  urgent: 5,
  important: 3,
};
const limitIndexMapping = {
  urgent: 0,
  important: 1,
};
let dragBeforeIndex;
let dragAfterIndex;
let dragIndex;

// ====== Data ======
let defaultData = [
  {
    category: "urgent",
    data: {
      id: 0,
      title: "第一關",
      done: false,
    },
  },
  {
    category: "urgent",
    data: {
      id: 1,
      title: "第二關",
      done: true,
    },
  },
  {
    category: "urgent",
    data: {
      id: 2,
      title: "第三關",
      done: false,
    },
  },
  {
    category: "urgent",
    data: {
      id: 3,
      title: "第四關",
      done: false,
    },
  },
  {
    category: "urgent",
    data: {
      id: 4,
      title: "第五關",
      done: false,
    },
  },
  {
    category: "important",
    data: {
      id: 5,
      title: "第六關",
      done: false,
    },
  },
  {
    category: "important",
    data: {
      id: 6,
      title: "第七關",
      done: false,
    },
  },
  {
    category: "important",
    data: {
      id: 7,
      title: "第八關",
      done: false,
    },
  },
  {
    category: "normal",
    data: {
      id: 8,
      title: "第九關",
      done: false,
    },
  },
  {
    category: "normal",
    data: {
      id: 9,
      title: "第十關",
      done: false,
    },
  },
];

let todoData = JSON.parse(localStorage.getItem("todoData")) || defaultData;

// ====== draggable ======

const Classes = {
  draggable: "StackedListItem--isDraggable",
  capacity: "draggable-container-parent--capacity",
};

const sortable = new Sortable.default(containers, {
  draggable: ".box--isDraggable",
  mirror: {
    constrainDimensions: true,
  },
  // handle: ".task-point",
});

// 開始抓取
sortable.on("sortable:start", (evt) => {
  lastOverContainer = evt.sourceContainer;

  // 取得對應的 limitCapacity
  isUrgentLimit = urgent.childElementCount === limitCapacity.urgent;
  isImportantLimit = important.childElementCount === limitCapacity.important;
  
  // 當點擊確認或刪除時，取消拖曳的動作
  const sensorTarget = evt.data.dragEvent.data.sensorEvent.data.target;
  const targetDone = sensorTarget.classList.contains("task-done");
  const targetText = sensorTarget.classList.contains("task-text");
  const targetDel = sensorTarget.classList.contains("task-del-js");
  if (targetDone || targetDel || targetText) {
    evt.cancel();
  }
});

// 移動途中
sortable.on("sortable:sort", (evt) => {
  // 抓到 capacity 用來判斷事件所在的位置
  const target = evt.overContainer.dataset.category;

  // const targetMirror = document.querySelector('.draggable-mirror');
  // targetMirror.querySelector('.item-center');
  // targetMirror.style.color = 'rgb(255,255,255)';
  // console.log(targetMirror.style);

  // 設定當該 list 到達存放限制，就不可再放入
  if (target === "urgent" && isUrgentLimit) {
    evt.cancel();
  } else if (target === "important" && isImportantLimit) {
    evt.cancel();
  }
});

// 元件放下，移動結束
// 要寫入時必須轉換元件的 category
sortable.on("sortable:sorted", (evt) => {
  // 取得元件的新種類
  const updateCategory = evt.newContainer.dataset.category;
  console.log(updateCategory);

  // 取得元件加入對應的種類內
  const id = evt.data.dragEvent.data.source.dataset.id;
  const idx = todoData.findIndex((item) => item.data.id == id);
  // 更改元件種類
  todoData[idx].category = updateCategory;

  // 寫入 localStorage
  localStorage.setItem("todoData", JSON.stringify(todoData));
});

// ====== function ======
function renderTodo(data) {
  let todoStr = {
    urgent: "",
    important: "",
    normal: "",
  };
  data.forEach((item, index) => {
    todoStr[item.category] += `<li class="box box--isDraggable" data-id=${item.data.id}>
          <div class="flex items-center">
            <input class="task-done hover:border-green-500 mr-2 ${
              item.data.done && "checked"
            }" type="checkbox" id=${item.data.id}>
            <label class="task-text cursor-pointer" for="${item.data.id}">${item.data.title}</label>
          </div>
          <div class="text-base text-gray-200 hover:text-orange-700 cursor-pointer"><span class="task-del-js fas fa-times pl-2" data-id=${
            item.data.id
          }></span></div>
        </li>`;
  });
  urgent.innerHTML = todoStr["urgent"];
  important.innerHTML = todoStr["important"];
  normal.innerHTML = todoStr["normal"];
}

function doneToggle(id) {
  let index = todoData.findIndex((item) => item.data.id == id);
  todoData[index].data.done = !todoData[index].data.done;
  // 寫入 localStorage
  localStorage.setItem("todoData", JSON.stringify(todoData));
}

function addTodo(title) {
  todoData.push({
    category: "normal",
    data: {
      id: new Date().getTime(), // UNIX Timestamp
      title: title,
      done: false,
    },
  });
  // 寫入 localStorage
  localStorage.setItem("todoData", JSON.stringify(todoData));
  renderTodo(todoData);
}

function delTodo(id) {
  let index = todoData.findIndex((item) => item.data.id == id);
  todoData.splice(index, 1);
  // 寫入 localStorage
  localStorage.setItem("todoData", JSON.stringify(todoData));
  renderTodo(todoData);
}

function init() {
  renderTodo(todoData);
}

// ====== addEventListener ======
stackedListJs.addEventListener(
  "click",
  function (e) {
    const targetIsDone = e.target.classList.contains("task-done");
    const targetIsDel = e.target.classList.contains("task-del-js");
    if (targetIsDone) {
      e.target.classList.toggle("checked");
      doneToggle(e.target.id);
    } else if (targetIsDel) {
      targetIsDel && delTodo(e.target.dataset.id);
    }
  },
  false
);

form.addEventListener(
  "submit",
  function (e) {
    e.preventDefault();
    const todoInput = document.getElementById("addTodo");
    addTodo(todoInput.value);
    todoInput.value = "";
  },
  false
);

init();
