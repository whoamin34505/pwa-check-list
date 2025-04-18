function btn_add() {
  console.log('func btn_add');
  const addDiv = document.querySelector('.add1');
  addDiv.innerHTML = `
    <label>Введите новый пункт:</label>
    <input type="text" id="new-task">
    <button onclick="saveTask()">Сохранить</button>
  `;
}


function saveTask() {
  console.log('func saveTask');
  const input = document.getElementById('new-task');
  const value = input.value.trim();
  if (value) {
    const task = { text: value, done: false };
    addTaskToDOM(task);
    saveToStorage(task);
    document.querySelector('.add1').innerHTML = '';
  }
}


function addTaskToDOM(task) {
  console.log('func addTaskToDOM');
  const taskContainer = document.querySelector('.add2');

  const newItem = document.createElement('div');
  newItem.classList.add('task-item');
  newItem.dataset.text = task.text;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.done;
  checkbox.addEventListener('change', () => toggleDone(task.text, checkbox.checked));

  const span = document.createElement('span');
  span.textContent = task.text;

  const delButton = document.createElement('button');
  delButton.textContent = '✖';
  delButton.onclick = () => deleteTask(task.text, newItem);

  newItem.appendChild(checkbox);
  newItem.appendChild(span);
  newItem.appendChild(delButton);
  newItem.appendChild(document.createElement('br'));

  taskContainer.appendChild(newItem);
}


function toggleDone(taskText, isDone) {
  console.log('func toggleDone');
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = tasks.map(task =>
    task.text === taskText ? { ...task, done: isDone } : task
  );
  localStorage.setItem('tasks', JSON.stringify(tasks));
}


function deleteTask(taskText, element) {
  console.log('func deleteTask');
  const isConfirmed = confirm(`Вы уверены, что хотите удалить: "${taskText}"?`);
  if (isConfirmed) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    element.remove();
  }
}


function saveToStorage(task) {
  console.log('func saveToStorage');
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}


function loadTasks() {
  console.log('func loadTasks');
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => addTaskToDOM(task));
}


function isIos() {
  return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
}


function isInStandaloneMode() {
  return ('standalone' in window.navigator) && window.navigator.standalone;
}

function handleIosInstallPrompt() {
  const installBtn = document.getElementById('install-btn');
  const modal = document.getElementById('ios-modal');
  const closeModalBtn = document.getElementById('close-modal');

  if (isIos() && !isInStandaloneMode()) {
    installBtn.style.display = 'inline-block';
    installBtn.textContent = '📲 Как установить на iOS';
    installBtn.onclick = () => {
      modal.style.display = 'block';
    };

    closeModalBtn.onclick = () => {
      modal.style.display = 'none';
    };

    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    };
  }
}

let deferredPrompt = null;

function handleBeforeInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    const installBtn = document.getElementById('install-btn');
    installBtn.style.display = 'inline-block';
    installBtn.textContent = '📲 Установить приложение';

    installBtn.onclick = async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`🛠️ Выбор пользователя: ${outcome}`);
        if (outcome === 'accepted') {
          console.log('✅ Установлено');
        } else {
          console.log('❌ Отклонено');
        }
        installBtn.style.display = 'none';
        deferredPrompt = null;
      }
    };
  });
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('✅ ServiceWorker зарегистрирован'))
      .catch(err => console.log('❌ Ошибка регистрации ServiceWorker:', err));
  }
}

document.getElementById('clear-btn').addEventListener('click', () => {
  const confirm1 = confirm('Вы точно хотите удалить все задачи?');
  if (!confirm1) return;
  console.log("1")
  const confirm2 = confirm('Точно???');
  if (!confirm2) return;
  console.log("2")
  localStorage.removeItem('tasks');
  document.querySelector('.add2').innerHTML = '';
  alert('✅ Все задачи удалены.');
  console.log("✅ Все задачи удалены.")
});


window.addEventListener('load', () => {
  loadTasks();
  handleIosInstallPrompt();
  handleBeforeInstallPrompt();
  registerServiceWorker();
});
