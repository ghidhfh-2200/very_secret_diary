function show_data() {
    fetch("http://localhost:8000/settings-show-data", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ values: ""})
    })
    .then(response => response.json())
    .then(data => {
        if (data['message'] != "failed") {
            console.log(data['message'][0])
            document.getElementById("calculator_password_change").value = data['message'][0]
            console.log(data['message'][1])
            if (data['message'][1] == "password") {
                document.getElementById("login-type-password").checked = true
                document.getElementById("lev2_hand_tracking").style.display = "none"
                document.getElementById("lev2_password_login").style.display = "inline-block"
                if (data['message'][2]) {
                    document.getElementById("lv2_password_change").value = data['message'][2]
                }
            }
            else if (data['message'][1] == "hand-tracking") {
                document.getElementById("login-type-handtracking").checked = true
                document.getElementById("lev2_password_login").style.display = "none"
                document.getElementById("lev2_hand_tracking").style.display = "inline-block"
            }
            if (data['message'][6] && data['message'][7]) {
                if (data['message'][6] == "password") {
                    document.getElementById('settings-enter-type-password').checked = true
                    document.getElementById("settings_enter_hand_tracking").style.display = 'none'
                    document.getElementById("settings_enter_password_login").style.display = "inline-block"
                    document.getElementById("settings_enter_password_change").value = data['message'][7]
                }
                else if (data['message'][6] == "hand-tracking") {
                    document.getElementById("settings-enter-type-handtracking").checked = true
                    document.getElementById("settings_enter_hand_tracking").style.display = "inline-block"
                    document.getElementById("settings_enter_password_login").style.display = "none"
                }
            }
        }
    })
    .catch(error => {
        console.error("Error:"+ error)
        alert("无法连接到服务器,请确保服务器开启!")
    })
}
function check_argu() {
    const urlParams = new URLSearchParams(window.location.search)
    const data = urlParams.get("argu")
    if (data == "open-settings") {
        show_data()
    }
    else {
        window.location.href = "./surface_calculator.html"
    }
}
check_argu()
function enable_calculator_password_change() {
    if (document.getElementById("calculator-change").innerText == "修改") {
        document.getElementById("calculator-change").innerText = "完成"
        get_input = document.getElementById("calculator_password_change")
        get_input.disabled = false
    }
    else {
        document.getElementById("calculator-change").innerText = "修改"
        get_input = document.getElementById("calculator_password_change")
        get_input.disabled = true
        value = get_input.value
        fetch("http://localhost:8000/settings-calculator-login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ values: value})
        })
        .then(response => response.json())
        .then(data => {
            if (data['message'] == "succeed") {
                alert("修改成功！")
            }
            else {alert("出错！")}
        })
        .catch(error => {
            console.error("Error:"+ error)
            alert("无法连接到服务器,请确保服务器开启!")
        })
    }
}
function hand_tracking() {
    fetch("http://localhost:8000/lev_2_login_way_change", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ values: "hand-tracking"})
    })
    .then(response => response.json())
    .then(data => {
        if (data['message'] == "succeed") {
            document.getElementById("lev2_password_login").style.display = "none"
            document.getElementById("lev2_hand_tracking").style.display = "inline-block"
            alert("修改成功")
        }
        else if (data['message'] == "failed") {
            alert(data['err'])
        }
        else if (data['message'] == "no change") {}
    })
    .catch(error => {
        console.error("Error:"+ error)
        alert("无法连接到服务器,请确保服务器开启!")
    })
}
function password_login() {
    fetch("http://localhost:8000/lev_2_login_way_change", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ values: "password"})
    })
    .then(response => response.json())
    .then(data => {
        if (data['message'] == "succeed") {
            document.getElementById("lev2_password_login").style.display = "inline-block"
            document.getElementById("lev2_hand_tracking").style.display = "none"
            alert("修改成功！刷新页面，你将会看到你的新密码！")
        }
        else if (data['message'] == "failed") {
            alert(data['err'])
        }
        else if (data['message'] == "no change") {}
    })
    .catch(error => {
        console.error("Error:"+ error)
        alert("无法连接到服务器,请确保服务器开启!")
    })
}
function lev2_password_change() {
    if (document.getElementById("lv2-change").innerText == "修改") {
        document.getElementById("lv2_password_change").disabled = false
        document.getElementById("lv2-change").innerText = "完成"
    }
    else {
        document.getElementById("lv2_password_change").disabled = true
        get_value = document.getElementById("lv2_password_change").value
        if (get_value != "" && get_value != null) {
            fetch("http://localhost:8000/lev2_password_change", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ values: get_value})
            })
            .then(response => response.json())
            .then(data => {
                if (data['message'] == "succeed") {
                    alert("修改成功！")
                }
                else {
                    alert(data['message'])
                }
            })
            .catch(error => {
                console.error("Error:"+ error)
                alert("无法连接到服务器,请确保服务器开启!")
            })
        }
    }
}
function enable_settings_password() {
    fetch("http://localhost:8000/settings_enter_type_to_password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ values:"password"})
    })
    .then(response => response.json())
    .then(data => {
        if (data['message'] == "succeed") {
            document.getElementById("settings_enter_hand_tracking").style.display = 'none'
            document.getElementById("settings_enter_password_login").style.display = "inline-block"
            alert("修改成功！请刷新页面，然后你会看到你的新密码！")
        }
        else if (data['message'] == "no chnage") {}
        else {
            alert(data['message'])
        }
    })
    .catch(error => {
        console.error("Error:"+ error)
        alert("无法连接到服务器,请确保服务器开启!")
    })
}
function enable_settings_handtracking() {
    fetch("http://localhost:8000/settings_enter_type_to_password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ values:"hand-tracking"})
    })
    .then(response => response.json())
    .then(data => {
        if (data['message'] == "succeed") {
            document.getElementById("settings_enter_hand_tracking").style.display = 'inline-block'
            document.getElementById("settings_enter_password_login").style.display = "none"
            alert("修改成功！")
        }
        else if (data['message'] == "no chnage") {}
        else {
            alert(data['message'])
        }
    })
    .catch(error => {
        console.error("Error:"+ error)
        alert("无法连接到服务器,请确保服务器开启!")
    })
}
function settings_change_password() {
    if (document.getElementById("settings_enter_change").innerText == "修改") {
        document.getElementById("settings_enter_change").innerText = "完成"
        document.getElementById("settings_enter_password_change").disabled = false
    }
    else {
        document.getElementById("settings_enter_change").innerHTML = "修改"
        document.getElementById("settings_enter_password_change").disabled = true
        get_data = document.getElementById("settings_enter_password_change").value
        fetch("http://localhost:8000/settings_enter_change_a_password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ values: get_data})
        })
        .then(response => response.json())
        .then(data => {
            if (data['message'] == "succeed") {
                alert("修改成功！")
            }
            else {
                alert(data['message'])
            }
        })
        .catch(error => {
            console.error("Error:"+ error)
            alert("无法连接到服务器,请确保服务器开启!")
        })
    }
}
function start_hand_tracking_manager() {
    fetch('http://localhost:8000/start_hand_tracking_manager', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values: ""}) // Updated JSON.stringify to send an object with key 'values'
    })
    .then(response => response.json())
    .then(data => {
        if (data['message'] == "failed") {
            alert("无法打开手势识别管理器！")
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("无法连接到服务器,请确保服务器开启!") // Return an empty array in case of error
    })
}
function forever_hide() {
    const if_continue = confirm("是否继续操作？请慎重选择，此操作无法撤销！")
    if (if_continue == true) {window.location.href = "./forever_hide.html?argu=fh"}
    else {}
}
function fetch_for_logs() {
    console.log("fetch_for_logs");
    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1; // 月份需要加1
    month = month < 10 ? `0${month}` : month; // 确保月份是两位数
    const current_time = `${year}-${month}`;
    document.getElementById("log-context").innerHTML = ""; // Corrected assignment operator from '==' to '=' to clear the content
    fetch("http://localhost:8000/fetch_for_logs", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ values: current_time })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data['message']);
        if (data['message'] == "failed") {
            alert("出错！");
        } else {
            const lines = data['message'];
            document.getElementById("log-context").innerHTML = ""; // Clearing the content before adding new entries
            lines.forEach(line => {
                const line_list = line.split(",");
                const tr_1 = document.createElement("tr");
                tr_1.innerText = line_list[0];
                tr_1.style.width = "150px";
                const tr_2 = document.createElement("tr");
                if (line_list[1] == "succeed") {
                    tr_2.style.color = "green";
                } else if (line_list[1] == "fail") {
                    tr_2.style.color = "orangered";
                } else if (line_list[1] == "invasion") {
                    tr_2.style.color = "red";
                }
                tr_2.innerText = line_list[1];
                tr_2.style.width = "200px";
                const tr_3 = document.createElement("tr");
                tr_3.innerText = line_list[2];
                tr_3.style.width = "300px";
                const tr_4 = document.createElement("tr");
                tr_4.innerText = line_list[3];
                tr_4.style.width = "500px";
                const new_div = document.createElement("div");
                new_div.className = "log-bar";
                new_div.appendChild(tr_1);
                new_div.appendChild(tr_2);
                new_div.appendChild(tr_3);
                new_div.appendChild(tr_4);
                document.getElementById("log-context").appendChild(new_div);
            });
        }
    })
    .catch(err => {
        console.error(err);
        alert("无法连接到服务器！请检查服务器是否开启!");
    });
}
function search(mode) {
    const get_context = document.getElementById("log-context")
    Array.from(get_context.children).forEach(line => {
        const state = line.children[1].innerText
        if (mode == "succeed") {
            if (state != "succeed") {
                get_context.removeChild(line)
            }
        }
        else if (mode == "fail") {
            if (state != "fail") {
                get_context.removeChild(line)
            }
        }
        else if (mode == "invasion") {
            if (state != "invasion") {
                get_context.removeChild(line)
            }
        }
        else if (mode == "all") {
            fetch_for_logs()
        }
    })
}
function find_date() {
    const date = document.getElementById("find_date").value
    try {
        let split_list = date.split("-")
        if (Number(split_list[1] < 10)) {
            split_list[1] = "0" + String(split_list[1])
        }
        if (Number(split_list[2]) < 10) {
            split_list[2] = "0" + String(split_list[2])
        }
        const new_date = split_list[0] + "-" + split_list[1] + "-" + split_list[2]
        fetch("http://localhost:8000/find_date", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ values: new_date })
        })
       .then(response => response.json())
       .then(data => {
            if (data['message'] == "failed") {
                alert("出错！")
            }
            else {
                const lines = data['message'];
                document.getElementById("log-context").innerHTML = ""; // Clearing the content before adding new entries
                lines.forEach(line => {
                    const line_list = line.split(",");
                    const tr_1 = document.createElement("tr");
                    tr_1.innerText = line_list[0];
                    tr_1.style.width = "150px";
                    const tr_2 = document.createElement("tr");
                    if (line_list[1] == "succeed") {
                        tr_2.style.color = "green";
                    } else if (line_list[1] == "fail") {
                        tr_2.style.color = "orangered";
                    } else if (line_list[1] == "invasion") {
                        tr_2.style.color = "red";
                    }
                    tr_2.innerText = line_list[1];
                    tr_2.style.width = "200px";
                    const tr_3 = document.createElement("tr");
                    tr_3.innerText = line_list[2];
                    tr_3.style.width = "300px";
                    const tr_4 = document.createElement("tr");
                    tr_4.innerText = line_list[3];
                    tr_4.style.width = "500px";
                    const new_div = document.createElement("div");
                    new_div.className = "log-bar";
                    new_div.appendChild(tr_1);
                    new_div.appendChild(tr_2);
                    new_div.appendChild(tr_3);
                    new_div.appendChild(tr_4);
                    document.getElementById("log-context").appendChild(new_div);
                });
            }
        })
    }
    catch (e) {
        console.error(e)
        alert("请正确合法输入！")
    }
}
