$(document).ready(function () {
    fetchTasks();

    // Create
    $('#taskForm').on('submit', function (e) {
        e.preventDefault();
        const task = {
            title: $('#title').val(),
            description: $('#description').val(),
            status: $('#status').val(),
            due_date: $('#due_date').val()
        };

        axios.post('/api/tasks', task)
        .then(response => {
            fetchTasks();
            $('#taskForm')[0].reset();
            
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Task added successfully!'
            });
        })
        .catch(error => {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add task!'
            });
        });
    });

    // Read
    function fetchTasks(filters = {}) {
        let url = '/api/tasks';
        let queryParams = [];

        if (filters.status) {
            queryParams.push(`status=${filters.status}`);
        }
        if (filters.due_date) {
            queryParams.push(`due_date=${filters.due_date}`);
        }

        if (queryParams.length > 0) {
            url += `?${queryParams.join('&')}`;
        }
    
        axios.get(url)
        .then(response => {
            const tasks = response.data;
            if (tasks.length === 0) {
                $('#taskTableBody').html('<tr><td colspan="5">No tasks found</td></tr>');
            } else {
                let rows = '';
    
                tasks.forEach(task => {
                    rows += `
                        <tr>
                            <td>${task.title}</td>
                            <td>${task.description}</td>
                            <td>${task.status}</td>
                            <td>${task.due_date}</td>
                            <td>
                                <button class="btn btn-info btn-sm" onclick="showTask(${task.id})">Show</button>
                                <button class="btn btn-warning btn-sm" onclick="editTask(${task.id})">Edit</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">Delete</button>
                            </td>
                        </tr>
                    `;
                });
    
                $('#taskTableBody').html(rows);
            }
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
            $('#taskTableBody').html('<tr><td colspan="5">Error loading tasks</td></tr>');
        });
    }
    

     // Filter status dan tanggal jatuh tempo
     $('#filterBtn').on('click', function () {
        const status = $('#filterStatus').val();
        const due_date = $('#filterDueDate').val();
    
        fetchTasks({
            status: status,
            due_date: due_date
        });
    });
    
    // Reset filter
    $('#resetFilterBtn').on('click', function () {
        $('#filterStatus').val('');
        $('#filterDueDate').val('');
        fetchTasks(); // Menampilkan semua tugas kembali
    });

    // Fungsi Delete
    window.deleteTask = function (id) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/api/tasks/${id}`)
                    .then(() => {
                        fetchTasks();

                        Swal.fire(
                            'Deleted!',
                            'Task has been deleted.',
                            'success'
                        );
                    })
                    .catch(error => {
                        console.error(error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Failed to delete task!'
                        });
                    });
            }
        });
    };


    // Fungsi show berdasarkan id
    window.showTask = function (id) {
        axios.get(`/api/tasks/${id}`)
            .then(response => {
                const task = response.data;
                $('#showTitle').text(task.title);
                $('#showDescription').text(task.description);
                $('#showStatus').text(task.status);
                $('#showDueDate').text(task.due_date);
                $('#showTaskModal').modal('show');
            })
            .catch(error => {
                console.error('Error fetching task details:', error);
            });
    };

    // Fungsi edit
    window.editTask = function (id) {
        axios.get(`/api/tasks/${id}`)
            .then(response => {
                const task = response.data;
                $('#editTaskId').val(task.id);
                $('#editTitle').val(task.title);
                $('#editDescription').val(task.description);
                $('#editStatus').val(task.status);
                $('#editDueDate').val(task.due_date);
                $('#editTaskModal').modal('show');
            })
            .catch(error => console.error(error));
    };

    // Fungsi Update
    $('#saveEditTask').on('click', function () {
        const id = $('#editTaskId').val();
        const updatedTask = {
            title: $('#editTitle').val(),
            description: $('#editDescription').val(),
            status: $('#editStatus').val(),
            due_date: $('#editDueDate').val()
        };
    
        axios.put(`/api/tasks/${id}`, updatedTask)
            .then(response => {
                fetchTasks();
                $('#editTaskModal').modal('hide');
    
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Task updated successfully!'
                });
            })
            .catch(error => {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to update task!'
                });
            });
    });
});
