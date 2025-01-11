const taskForm = document.getElementById('add-task-form');
    const taskTableBody = document.querySelector('#task-table tbody');

    // Função para adicionar tarefa
    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Coleta os dados do formulário
        const task = document.getElementById('task').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;

        // Cria um objeto para armazenar a tarefa
        const newTask = {
            task: task,
            date: date,
            time: time
        };

        // Obtém as tarefas existentes do localStorage
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        // Adiciona a nova tarefa ao array
        tasks.push(newTask);

        // Salva as tarefas atualizadas no localStorage
        localStorage.setItem('tasks', JSON.stringify(tasks));

        // Cria uma nova linha na tabela
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${task}</td>
            <td>${date}</td>
            <td>${time}</td>
            <td>
                <button class="btn btn-edit" onclick="editTask(this)">Editar</button>
                <button class="btn btn-delete" onclick="deleteTask(this)">Excluir</button>
            </td>
        `;
        taskTableBody.appendChild(newRow);

        // Limpa o formulário
        taskForm.reset();
    });

    // Função para excluir tarefa
    function deleteTask(button) {
        const row = button.parentElement.parentElement;
        const rowIndex = Array.from(row.parentNode.children).indexOf(row);

        // Obtém as tarefas existentes do localStorage
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        // Remove a tarefa do array
        tasks.splice(rowIndex, 1);

        // Salva as tarefas atualizadas no localStorage
        localStorage.setItem('tasks', JSON.stringify(tasks));

        taskTableBody.removeChild(row);
    }

    // Função para editar tarefa
    function editTask(button) {
        const row = button.parentElement.parentElement;
        const rowIndex = Array.from(row.parentNode.children).indexOf(row);

        // Obtém as tarefas existentes do localStorage
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        // Atualiza os dados da tarefa no array
        const task = document.getElementById('task').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        tasks[rowIndex] = { task: task, date: date, time: time };

        // Salva as tarefas atualizadas no localStorage
        localStorage.setItem('tasks', JSON.stringify(tasks));

        // Atualiza a linha da tabela
        row.cells[0].textContent = task;
        row.cells[1].textContent = date;
        row.cells[2].textContent = time;

        // Limpa o formulário
        taskForm.reset();
    }

    // Carrega as tarefas do localStorage ao carregar a página
    window.addEventListener('load', () => {
        const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

        storedTasks.forEach(task => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${task.task}</td>
                <td>${task.date}</td>
                <td>${task.time}</td>
                <td>
                    <button class="btn btn-edit" onclick="editTask(this)">Editar</button>
                    <button class="btn btn-delete" onclick="deleteTask(this)">Excluir</button>
                </td>
            `;
            taskTableBody.appendChild(newRow);
        });
});