document.addEventListener('DOMContentLoaded', () => {
    const resister = document.querySelector(".register-here span")
    const login = document.querySelector(".login-here span")
    const registerForm = document.querySelector("#register-form")
    const loginForm = document.querySelector("#login-form")
    const app = document.querySelector("#app")
    const auth = document.querySelector("#auth")
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const logOut = document.querySelector(".logout")
    const submitBtn = document.querySelector(".submit-btn")

    let currentUser = ''
    let taskId = 0



    resister.addEventListener("click", () => {
        registerForm.style.display = "flex"
        loginForm.style.display = "none"
    })
    login.addEventListener("click", () => {
        registerForm.style.display = "none"
        loginForm.style.display = "flex"
    })

    // const resisterIt = () => {
    //     console.log('resister')
    //     app.style.display = "block"
    //     auth.style.display = "none"
    // }
    // const loginIt = () => {
    //     console.log('login')
    //     app.style.display = "block"
    //     auth.style.display = "none"
    // }


    let users = JSON.parse(localStorage.getItem('users')) || [];
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const saveToLocalStorage = () => {
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const setCookie = (name, value, days) => {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    };

    const getCookie = (name) => {
        const cname = name + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(cname) == 0) {
                return c.substring(cname.length, c.length);
            }
        }
        return "";
    };


    const deleteCookie = (name) => {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    };



    const renderTasks = () => {
        document.querySelector(".username").innerHTML = currentUser
        app.style.display = "flex"



        taskList.innerHTML = '';
        reversedTasks = tasks.filter((item) => item.username == currentUser).reverse()
        // console.log(reversedTasks)
        reversedTasks.map((element, index) => {
            let newTask = `
                    <li class="task" key="${index}" >
                        <textarea name="" id="" class="task-text ${element.completed ? 'completed' : ''}"
                            readonly>${element.text}</textarea>
                        <div class="btns">
                            <button onClick="toggleComplete(${element.id})" >
                            ${element.completed ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-check"></i>'}
                             </button>
                            <button class="editTask" onClick="editTask(${element.id})" ><i class="fa-solid fa-pen"></i></button>
                            <button onClick="deleteTask(${element.id})"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </li>
            `
            taskList.innerHTML += newTask;
        });
    }



    // console.log(getCookie('currentUser'))
    // console.log(currentUser)
    if (getCookie('currentUser')) {
        currentUser = getCookie('currentUser')
        auth.classList.add('hidden');
        app.classList.remove('hidden');
        renderTasks()
        // return;
    }

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // console.log('resgister')
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        currentUser = username;
        setCookie('currentUser', currentUser, 1); // Set cookie for 1 day
        users.push({ username, password });
        saveToLocalStorage();
        alert('Registration successful!');
        registerForm.reset();
        auth.classList.add('hidden');
        app.classList.remove('hidden');
        renderTasks()
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // console.log('login')
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            // console.log(user) // {username: 'raj_meher', password: '12345'}
            currentUser = user.username
            setCookie('currentUser', currentUser, 1); // Set cookie for 1 day
            auth.classList.add('hidden');
            app.classList.remove('hidden');
            app.style.display = "flex"

            document.querySelector(".username").innerHTML = currentUser
            loginForm.reset();

            renderTasks();
        } else {
            alert('Invalid username or password');
        }
    });



    logOut.addEventListener('click', () => {
        currentUser = ''
        deleteCookie('currentUser');
        auth.classList.remove('hidden');
        app.classList.add('hidden');
        app.style.display = "none"
    });

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (submitBtn.innerHTML = 'Add Task') {
            tasks.push({ text: taskInput.value, id: Date.now(), username: currentUser, completed: false });
            taskInput.value = '';
        }
        if (submitBtn.innerHTML = 'Save') {
            tasks.map((task) => {
                if (task.id == taskId) {
                    task.text = taskInput.value
                }
            })
        }
        saveToLocalStorage();
        renderTasks();
        // console.log(tasks)
    });

    // document.querySelectorAll(".btns").forEach( btn =>{
    //     btn.addEventListener('click', (e) => {
    //         console.log(e.target.classList.include('toggle-complete'))
    //     })
    // })
    window.toggleComplete = (id) => {
        tasks.map((task) => {
            if (task.id == id) {
                task.completed = !task.completed
            }
            saveToLocalStorage()
            renderTasks()
        })
    }
    window.deleteTask = (id) => {
        tasks = tasks.filter((task) => task.id != id)
        saveToLocalStorage()
        renderTasks()
    }

    window.editTask = (id) => {
        submitBtn.innerHTML = 'Save'
        tasks.map((task) => {
            if (task.id == id) {
                taskInput.value = task.text
                tasks = tasks.filter((task) => task.id != id)
                
                taskId = id
                saveToLocalStorage()
                renderTasks()
            }
        })
    }
    // let count = 0;
    // document.querySelectorAll(".editTask").forEach(edit => {
    //     edit.addEventListener('click', (e) => {
    //         let textArea = e.target.closest(".task").querySelector("textarea");
    //         if(count = 0){
    //             textArea.removeAttribute('readonly')
    //             textArea.style.border = '1px solid black'
    //             textArea.focus()
    //             textArea.selectionStart = textArea.selectionEnd = textArea.value.length;
    //         }
    //     })
    // })




})