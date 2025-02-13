function fetch_for_diaries() {
    fetch("http://localhost:8000/diary-list", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ values: "no" })
    })
    .then(response => response.json())
    .then(data => {
        const diary_list = data['message']
        diary_list.forEach(function(diary) {
            new_tr = document.createElement("tr")
            new_tr.innerText = diary
            new_tr.addEventListener("click", show_diary)
            document.getElementById("diary-list").appendChild(new_tr)
        })
    })
    .catch(error => {
        console.error("Error:"+ error)
        return [];
    })
}
function check_argu() {
    const urlParams = new URLSearchParams(window.location.search)
    const data = urlParams.get("argu")
    if (data == "login-to-main") {
        fetch_for_diaries()
    }
    else {
        window.location.href = "./surface_calculator.html"
    }
}
check_argu()
var current_diary = ""
function show_diary() {
    get_text = this.innerText
    fetch("http://localhost:8000/diary-read", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ values:  get_text})
    })
    .then(response => response.json())
    .then(data => {
        get_data = data['message']
        document.getElementById("diary-showbox").innerHTML = ""
        for (var i =0;i<=get_data.length -1;i++) {
            new_div = document.createElement("div")
            new_div.innerText = get_data[i][0] + "  :  " + get_data[i][1]
            new_div.className = "message-box"
            document.getElementById("diary-showbox").appendChild(new_div)
        }
        current_diary = get_text
        document.getElementById("diary-list").querySelector("p").innerText = current_diary
        console.log("current-diary : ", current_diary)
    })
    .catch(error => {
        console.error("Error:"+ error)
        return [];
    })
}
function write_message() {
    get_message = document.getElementById("message-input-box").innerText
    console.log(get_message)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    var get_current_time =`${year}-${month}-${day} ${hours}:${minutes}`
    if (get_message != ""){
        fetch("http://localhost:8000/write_message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ values: [current_diary, get_current_time,get_message]})
        })
        .then(response => response.json())
        .then(data => {
            if (data['message'] == "succeed") {
                document.getElementById("message-input-box").innerText = ""
                new_line = document.createElement("div")
                new_line.innerText = get_current_time + "  :  " + get_message
                new_line.className = "message-box"
                document.getElementById("diary-showbox").appendChild(new_line)
            }
            else {
                window.alert("无法找到对应配置文件！")
            }
        })
        .catch(error => {
            console.error("Error:"+ error)
            return [];
        })
    }
    else {
        window.alert("请输入内容再提交！")
    }
}
function new_diary() {
    new_name = prompt("输入新名字：")
    if (new_name != "" && new_name != null) {
        fetch("http://localhost:8000/new_diary", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ values: new_name})
        })
        .then(response => response.json())
        .then(data => {
            if (data['message'] == "succeed") {
                new_tr = document.createElement("tr")
                new_tr.innerText = new_name + ".txt"
                new_tr.addEventListener("click", show_diary)
                document.getElementById("diary-list").appendChild(new_tr)
            }
            else {
                window.alert("出错！")
            }
        })
        .catch(error => {
            console.error("Error:"+ error)
            return [];
        })
    }
}
function delete_diary() {
    ask_if = window.confirm("确认要删除日记 " + current_diary + " 吗？")
    if (ask_if == true) {
        delete_name = current_diary
        fetch("http://localhost:8000/delete_diary", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ values: delete_name})
        })
        .then(response => response.json())
        .then(data => {
            if (data['message'] == "succeed") {
                get_diary_list = document.getElementById("diary-list").querySelectorAll("tr")
                get_diary_list.forEach(diary => {
                    if (diary.innerText == delete_name) {
                        console.log("ok")
                        document.getElementById("diary-list").removeChild(diary)
                        current_diary = ""
                        document.getElementById("diary-list").querySelector("p").innerText = ""
                        document.getElementById("diary-showbox").innerHTML = ""
                    } 
                })
            }
            else {
                window.alert(data['message'])
            }
        })
        .catch(error => {
            console.error("Error:"+ error)
            return [];
        })
    }
    else {}
}
function rename_diary() {
    new_name = prompt("请输入新的名字：")
    old_name = current_diary
    if (new_name != "" && new_name != null) {
        fetch("http://localhost:8000/rename_diary", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ values: [old_name, new_name]})
        })
        .then(response => response.json())
        .then(data => {
            if (data['message'] == "succeed") {
                get_diary_list = document.getElementById("diary-list").querySelectorAll("tr")
                get_diary_list.forEach(diary => {
                    if (diary.innerText == old_name) {
                        get_diary_list = document.getElementById("diary-list").querySelectorAll("tr")
                        get_diary_list.forEach(diary => {
                            if (diary.innerText == old_name) {diary.innerText = new_name + ".txt"}
                        })
                    } 
                })
            }
            else {
                window.alert(data['message'])
            }
        })
        .catch(error => {
            console.error("Error:"+ error)
            return [];
        })
    }
}
function settings_login_type_check() {
    fetch("http://localhost:8000/settings-login-type", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ values: ""})
    })
    .then(response => response.json())
    .then(data => {
        console.log("ok")
        if (data['message'] == "password") {
            password_input = prompt("请输入密码：")
            settings_login(password_input)
        }
        else if (data['message'] == "hand-tracking") {
            settings_enter_hand_tracking()
        }
        else {
            window.alert(data['message'])
        }
    })
    .catch(error => {
        console.error("Error:"+ error)
        return [];
    })
}
function settings_login(prompt) {
    fetch("http://localhost:8000/settings-login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ values: prompt})
    })
    .then(response => response.json())
    .then(data => {
        if (data['message'] == "succeed") {
            window.open("./settings.html?argu=open-settings")
        }
        else if (data['message'] == "failed") {
            window.alert("登陆失败！")
        }
        else {
            window.alert(data['message'])
        }
    })
    .catch(error => {
        console.error("Error:"+ error)
        return [];
    })
}
function settings_enter_hand_tracking() {
    fetch('http://localhost:8000/hand_tracking', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values: "settings"}) // Updated JSON.stringify to send an object with key 'values'
    })
    .then(response => response.json())
    .then(data => {
        if (data['message'] == "succeed") {
            window.open("./settings.html?argu=open-settings")
        }
        else if (data['message'] == "failed") {
            window.alert("登陆失败!")
        }
    })
    .catch(error => {
        console.error('Error:', error);
        return []; // Return an empty array in case of error
    })
}