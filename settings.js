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
        return [];
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
            return [];
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
        return [];
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
        return [];
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
                return [];
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
        return [];
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
        return [];
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
            return [];
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
        return []; // Return an empty array in case of error
    })
}
function forever_hide() {
    window.location.href = "./forever_hide.html?argu=fh"
}
