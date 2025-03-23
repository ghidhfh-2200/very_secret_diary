import express from 'express'
import bodyParser from 'body-parser'; 
import { appendFile, createReadStream, readFile, ReadStream, rename, unlink, writeFile } from 'fs';
import { createInterface } from 'readline';// Import bodyParser for parsing request body
import { readdir } from 'fs';
import { createCipheriv, randomBytes } from 'crypto';
import { createDecipheriv } from 'crypto';
import { exitCode, stderr, stdout } from 'process';
import { type } from 'os';
import { exec } from 'child_process';
import { error } from 'console';
import { promises as fsPromises } from 'fs';
import { createHash } from 'crypto';
const app = express()

app.use(bodyParser.json()); // Add bodyParser middleware to parse JSON data
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// 创建路由 /process1

async function create_password(line) {
    try {
        const data = await fsPromises.readFile("./passwords.txt", 'utf8');
        const read_list = data.split('\n');
        return read_list[line].split(" : ")[1];
    } catch (err) {
        console.error(err);
        return null;
    }
}

app.post('/calculator-login-check', async (req, res) => {
    // 处理 /process1 路由的POST请求
    const password_input = req.body['values'];
    try {
        const data = await fsPromises.readFile('./temp/l/o/password.txt', 'utf8');
        const read_result = data.split('\n');
        const fake_password = await create_password(0);
        const calculator_login_password = String(read_result[0]).split(" : ")[1];
        
        if (fake_password === password_input) {
            write_log("invasion", "calculator", fake_password)
            res.json({ 'message': "fake-login" });
        }
        else if (calculator_login_password.trim() === password_input) {
            write_log("succeed", "calculator", "/")
            res.json({ "message": "check-pass" });
        } else {
            write_log("fail", "calculator", password_input)
            res.json({ 'message': "check-not-pass" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ 'message': "internal-error" });
    }
});
// 创建路由 /process2
app.post('/diary-login-way-check', (req, res) => {
    const rl = createInterface({
        input: createReadStream("./temp/l/o/password.txt"),
        output: process.stdout,
        terminal: false
    })
    const read_result = []
    rl.on("line", function(line) {
        read_result.push(line)
    })
    rl.on("close", function() {
        const diary_login_type = String(read_result[1]).split(" : ")[1]
        if (diary_login_type == "password") {
            res.json({
                'message': "password"
            })
        }
        else if (diary_login_type == "hand-tracking") {
            res.json({
                'message': "hand-tracking"
            })
        }
        else {
            res.json({
                'message': "not_supported_type"
            })
        }
    })
});
app.post("/diary-login-password-check", (req,res) => {
    const password_input = req.body['values']
    const rl = createInterface({
        input: createReadStream("./temp/l/o/password.txt"),
        output: process.stdout,
        terminal: false
    })
    const read_result = []
    rl.on("line", function(line) {
        read_result.push(line)
    })
    rl.on("close", function() {
        const pasword = String(read_result[2]).split(" : ")[1]
        if (password_input == pasword) {
            write_log("succeed", "lev2", "/")
            res.json({"message": "succeeded"})
        }
        else {
            write_log("fail", "lev2", password_input)
            res.json({'message': "failed"})
        }
    })
})
app.post("/diary-list",(req,res) => {
    const read_dir = "./diary_file"
    readdir(read_dir, function(err, data) {
        const diary_list = data
        const new_list = []
        diary_list.forEach(element => {
            if (String(element).split(".")[String(element).split('.').length - 1] == "txt") {
                new_list.push(element)
            }
        });
        if (new_list == []) {res.json({'message': "empty"})}
        else if (new_list != []) {
            const key_iv_rl = createInterface({
                input: createReadStream("./temp/l/o/password.txt"),
                output: process.stdout,
                terminal: false
            })
            const read_result = []
            key_iv_rl.on("line", line => {
                read_result.push(line)
            })
            key_iv_rl.on("close", function() {
                const key = read_result[4].split(" : ")[1]
                const iv = read_result[5].split(" : ")[1]
                const aes_list = []
                new_list.forEach(list_item => {
                    const name = list_item.split(".")[0]
                    const dec_name = decrypt(name,key,iv) + ".txt"
                    aes_list.push(dec_name)
                })
                res.json({'message': aes_list})
            })
        }
    })
})
app.post("/diary-read", (req,res) => {
    const password_iv_rl = createInterface({
        input: createReadStream("./temp/l/o/password.txt"),
        output: process.stdout,
        terminal: false
    })
    const key_iv_result = []
    password_iv_rl.on("line", function(line) {
        key_iv_result.push(line)
    })
    password_iv_rl.on("close", function() {
        const key = key_iv_result[4].split(" : ")[1]
        const iv = key_iv_result[5].split(" : ")[1]
        const name = encrypt(req.body['values'].split(".")[0],key,iv) + ".txt"
        const rl = createInterface({
            input: createReadStream("./diary_file/" + name),
            output: process.stdout,
            terminal: false
        })
        const read_result = []
        rl.on("line", function(line) {
            read_result.push(line)
        })
        rl.on("close", function() {
            if (read_result[0] == "") {
                read_result.splice(0, 1)
            }
            const decode_result = []
            read_result.forEach(line => {
                const split_list = String(line).split("   ")
                var temp_list = []
                temp_list.push(decrypt(split_list[0],key,iv))
                temp_list.push(decrypt(split_list[1], key, iv))
                decode_result.push(temp_list)
                temp_list = []
            })
            res.json({'message': decode_result})
        })
    })
})
app.post("/write_message", (req, res) => {
    const get_input = req.body['values']
    const key_iv_rl = createInterface({
        input: createReadStream("./temp/l/o/password.txt"),
        output: process.stdout,
        terminal: false
    })
    const read_result = []
    key_iv_rl.on("line", function(result) {
        read_result.push(result)
    })
    key_iv_rl.on("close", function() {
        const key = read_result[4].split(" : ")[1]
        const iv = read_result[5].split(" : ")[1]
        const aes_1 = encrypt(get_input[1], key ,iv)
        const aes_2 = encrypt(get_input[2], key, iv)
        const aes_name = encrypt(get_input[0].split(".")[0], key, iv)
        console.log(aes_name)
        if (read_result.length == 0) {
            appendFile("./diary_file/"+aes_name + ".txt", aes_1 + "   " + aes_2, (err) => {
                if (err) {
                    console.error(err)
                    res.json({'message': "failed"})
                }
                else {
                    res.json({'message': "succeed"})
                }
            })
        }
        else {
            appendFile("./diary_file/"+aes_name + ".txt", "\n" + aes_1 + "   " + aes_2, (err) => {
                if (err) {
                    console.error(err)
                    res.json({'message': "failed"})
                }
                else {
                    res.json({'message': "succeed"})
                }
            })
        }
    })
})
app.post("/new_diary", (req, res) => {
    const new_name = req.body['values']
    const key_iv_rl = createInterface({
        input: createReadStream("./temp/l/o/password.txt"),
        output: process.stdout,
        terminal: false
    })
    const read_result = []
    key_iv_rl.on("line", line => {
        read_result.push(line)
    })
    key_iv_rl.on("close", function() {
        // 检查read_result的长度以确保索引不会超出范围
        if (read_result.length > 5) {
            const key = read_result[4].split(" : ")[1]
            const iv = read_result[5].split(" : ")[1]
            const aes_name = encrypt(new_name, key, iv)
            writeFile("./diary_file/" + aes_name + ".txt", "", (err) => {
                if (err) {
                    res.json({'message': "Failed"})
                } else {
                    res.json({'message': "succeed"})
                }
            })
        } else {
            // 如果read_result的长度不足，返回错误信息
            res.json({'message': "Failed to read key and iv"})
        }
    })
})
app.post("/delete_diary", (req, res) => {
    const delete_name = req.body['values']
    const del = delete_name.split(".")[0]
    const key_iv_rl = createInterface({
        input: createReadStream("./temp/l/o/password.txt"),
        output: process.stdout,
        terminal: false
    })
    const read_result = []
    key_iv_rl.on("line", line => {
        read_result.push(line)
    })
    key_iv_rl.on("close", function() {
        const key = read_result[4].split(" : ")[1]
        const iv = read_result[5].split(" : ")[1]
        const aes_delete_name = encrypt(del, key,iv)
        unlink("./diary_file/" + aes_delete_name + ".txt", (err) => {
            if (err) res.json({'message': err})
            else res.json({'message': "succeed"})
        })
    })
})
app.post("/rename_diary", (req, res) => {
    const old_new_list = req.body['values'];
    console.log(old_new_list)
    const key_iv_rl = createInterface({
        input: createReadStream("./temp/l/o/password.txt"),
        output: process.stdout,
        terminal: false
    });
    const read_result = [];
    key_iv_rl.on("line", line => {
        read_result.push(line);
    });
    key_iv_rl.on("close", function() {
        const key = read_result[4].split(" : ")[1];
        const iv = read_result[5].split(" : ")[1];
        const aes_old = encrypt(old_new_list[0].split(".")[0], key, iv);
        const aes_new = encrypt(old_new_list[1], key, iv);
        rename("./diary_file/" + aes_old + ".txt", "./diary_file/" + aes_new + ".txt", (err) => {
            if (err) {
                res.json({'message': "Failed to rename file: " + err.message});
            } else {
                res.json({'message': "succeed"});
            }
        });
    });
});
app.post("/settings-login-type", (req, res) => {
    const rl = createInterface({
        input: createReadStream("./temp/l/o/password.txt"),
        output: process.stdout,
        terminal: false
    })
    const read_result = []
    rl.on("line", function(line) {
        read_result.push(line)
    })
    rl.on("close", function() {
        const login_type = String(read_result[6]).split(" : ")[1]
        if (login_type == "password") {
            res.json({'message': "password"})
        }
        else if (login_type == "hand-tracking") {
            res.json({'message': "hand-tracking"})
        }
        else {res.json({'message': login_type})}
    })
})
app.post("/settings-login", (req,res) => {
    const input = req.body['values']
    const rl = createInterface({
        input: createReadStream("./temp/l/o/password.txt"),
        output: process.stdout,
        terminal: false
    })
    const read_result = []
    rl.on("line", function(line) { 
        read_result.push(line)
    })
    rl.on("close", function() {
        const password = read_result[7].split(" : ")[1]
        if (password == input) {
            write_log("succeed", "settings", "/")
            res.json({'message': "succeed"})
        }
        else {
            write_log("fail", "settings", input)
            res.json({'message': "failed"})
        }
    })
})
app.post("/settings-show-data", (req,res) => {
    try {
        const rl = createInterface({
            input: createReadStream("./temp/l/o/password.txt"),
            output: process.stdout,
            terminal: false
        })
        const read_result = []
        const result_list = []
        rl.on("line", function(line) {
            read_result.push(line)
        })
        rl.on("close", function() {
            read_result.forEach(line => {
                result_list.push(String(line).split(" : ")[1])
            })
            res.json({'message': result_list})
        })
    } catch (err) {
        res.json({'message': "failed"})
    }
})
app.post("/settings-calculator-login", (req, res) => {
    const get_value = req.body['values'];
    const rl = createInterface({
        input: createReadStream("./temp/l/o/password.txt"),
        output: process.stdout,
        terminal: false
    });
    const read_result = [];
    rl.on("line", line => {
        read_result.push(line);
    });
    rl.on("close", function() {
        read_result[0] = "calculator-login-p : " + get_value;
        const text = read_result.join("\n");
        writeFile('./temp/l/o/password.txt', text, 'utf8', (err) => {
            if (err) {
                console.error(err);
                res.json({'message': "failed"});
            } else {
                res.json({'message': "succeed"});
            }
        });
    });
});
app.post("/lev_2_login_way_change", (req,res) => {
    try{
        const get_data = req.body['values']
        const rl = createInterface({
            input: createReadStream("./temp/l/o/password.txt"),
            output: process.stdout,
            terminal: false
        })
        const read_result = []
        rl.on("line", line => {
            read_result.push(line)

        })
        rl.on("close", function() {
            const type = read_result[1].split(" : ")[1]
            if (type == get_data) {
                res.json({'message': "no change"})
            }
            else {
                read_result[1] = "diary-login-type : " + get_data
                const text = read_result.join("\n")
                writeFile("./temp/l/o/password.txt", text, "utf-8", (err) => {
                    if (err) {
                        res.json({'message': "failed", "err": err})
                    }
                    else {
                        res.json({"message": "succeed"})
                    }
                })
            }
        })
    } catch(err) {
        res.json({'message': "failed", "err": err})
    }
})
app.post("/lev2_password_change", (req,res) => {
    try{
        const get_data = req.body['values']
        const rl = createInterface({
            input: createReadStream("./temp/l/o/password.txt"),
            output: process.stdout,
            terminal: false
        })
        const read_result = []
        rl.on("line", line => {
            read_result.push(line)
        })
        rl.on("close", function() {
            read_result[2] = "diary-login-password : " + get_data
            const text = read_result.join("\n")
            writeFile("./temp/l/o/password.txt", text, "utf-8", (err) => {
                if (err) {
                    res.json({'message': "failed", "err": err})
                }
                else {
                    res.json({"message": "succeed"})
                }
            })
        })
    } catch(err) {
        res.json({'message': "failed", "err": err})
    }
})
app.post("/settings_enter_type_to_password", (req,res) => {
    try{
        const get_data = req.body['values']
        const rl = createInterface({
            input: createReadStream("./temp/l/o/password.txt"),
            output: process.stdout,
            terminal: false
        })
        const read_result = []
        rl.on("line", line => {
            read_result.push(line)
        })
        rl.on("close", function() {
            const type = read_result[6].split(" : ")[1]
            if (type == get_data) {
                res.json({'message': "no change"})
                return
            }
            else {
                read_result[6] = "settings-login-type : " + get_data
                const text = read_result.join("\n")
                writeFile("./temp/l/o/password.txt", text, "utf-8", (err) => {
                    if (err) {
                        res.json({'message': "failed", "err": err})
                    }
                    else {
                        res.json({"message": "succeed"})
                    }
                })
            }
        })
    } catch(err) {
        res.json({'message': "failed", "err": err})
    }
})
app.post("/settings_enter_change_a_password", (req,res) => {
    try{
        const get_data = req.body['values']
        const rl = createInterface({
            input: createReadStream("./temp/l/o/password.txt"),
            output: process.stdout,
            terminal: false
        })
        const read_result = []
        rl.on("line", line => {
            read_result.push(line)
        })
        rl.on("close", function() {
            read_result[7] = "settings-login-password : " + get_data
            const text = read_result.join("\n")
            writeFile("./temp/l/o/password.txt", text, "utf-8", (err) => {
                if (err) {
                    res.json({'message': "failed", "err": err})
                }
                else {
                    res.json({"message": "succeed"})
                }
            })
        })
    } catch(err) {
        res.json({'message': "failed", "err": err})
    }
})
app.post("/hand_tracking", (req,res) => {
    const get_mode = req.body['values']
    let index = new Number
    if (get_mode == "lev2") {index = 0}
    else if (get_mode == "settings") {index = 1}
    const rl = createInterface({
        input: createReadStream("./Hand_Tracking_Manager/hand_tracking.txt"),
        output: process.stdout,
        terminal: false
    })
    const read_result = []
    rl.on("line", result => {
        read_result.push(result)
    })
    rl.on("close", function() {
        let model = String(read_result[index]).split(" : ")[1]
        model = model.split(".")[0]
        exec("python ./Hand_Tracking_Manager/Recognizer/recognizer.py " + model, (err, stdout, stderr) => {
            if (err) {
                res.json({'message': 'failed'});  // Send failure message
                return;
            }
            stdout = stdout.trim();  // Trim any extra whitespace
            if (stdout.includes("succeed") == true) {
                if (index == 0) {
                    write_log("succeed", "lev2", "/")
                }
                else {
                    write_log("succeed", "settings", "/")
                }
                res.json({'message': "succeed"});
            } else if (stdout.includes("failed") == true) {
                if (index == 0) {
                    write_log("fail", "lev2", "/")
                }
                else {
                    write_log("fail", "settings", "/")
                }
                res.json({'message': "failed"})
            } else {
            }
            if (stderr) {
            }
        });
    })
})
app.post("/start_hand_tracking_manager", (req,res) => {
    try {
        exec("python ./Hand_Tracking_Manager/hand_tracking_manager.py", (err, stdout, stderr) => {
            if (err || stderr) {
                res.json({"message": "failed"})
            }
        })
    } catch (err) {
        res.json({'message': "failed"})
    }
})
app.post("/seal_all_data", (req, res) => {
    const rl = createInterface({
        input: createReadStream("./temp/l/o/password.txt"),
        output: process.stdout,
        terminal: false
    });
    const read_result = [];
    rl.on("line", line => {
        read_result.push(line);
    });
    rl.on("close", function() {
        read_result[0] = "calculator-login-p : " + "123";
        const text = read_result.join("\n");
        writeFile('./temp/l/o/password.txt', text, 'utf8', (err) => {
            if (err) {
                console.error(err);
                res.json({'message': "failed"});
            } else {
                unlink("./temp/l/o/password.txt", (err) => {
                    if (err) {
                        console.error(err);
                        res.json({'message': "failed"});
                        return;
                    } else {
                    }
                });
            }
        });
    });

    try {
        readdir("./diary_file", (err, file) => {
            if (err) {
                return
            }
            if (file.length > 0) {
                file.forEach(path => {
                    readFile("./diary_file/" + path, (err, data) => {
                        if (err) {
                            res.json({'message': "failed"});
                            return;
                        } else {
                            const hash_data = sha3_256(data);
                            writeFile("./diary_file/" + path, hash_data, err => {
                                if (err) {
                                    res.json({'message': "failed"});
                                    return
                                } else {
                                    res.json({'message': "succeed"});
                                }
                            });
                        }
                    });
                });
            }
        });
    } catch (e) {
        return
    }
});
app.post("/fetch_for_logs", (req, res) => {
    const get_data = req.body['values'];
    readdir("./logs", (err, files) => {
        if (err) {
            console.error("Error reading directory:", err);
            res.json({'message': "failed"});
        } else {
            let fileFound = false;
            files.forEach(file => {
                if (file.split(".")[0] == get_data) {
                    fileFound = true;
                    const rl = createInterface({
                        input: createReadStream(`./logs/${file}`), // Ensure correct path
                        output: process.stdout,
                        terminal: false
                    });
                    const read_result = [];
                    rl.on("line", line => {
                        read_result.push(line);
                    });
                    rl.on("close", function() {
                        res.json({'message': read_result});
                    });
                }
            });
            if (!fileFound) {
                console.error("File not found for date:", get_data);
                res.json({'message': "file not found"});
            }
        }
    });
});
app.post("/find_date", (req, res) => {
    const get_data = req.body['values'];
    const date_parts = get_data.split("-");
    const len = date_parts.length;
    const file_name = date_parts[0] + "-" + date_parts[1] + ".txt";
    const rl = createInterface({
        input: createReadStream("./logs/" + file_name),
        output: process.stdout
    });
    const read_result = [];
    const send_list = [];
    rl.on("line", line => { read_result.push(line); });
    rl.on("close", function() {
        if (len === 2) {
            // If only year and month are provided, return all logs for that month
            res.json({'message': read_result});
        } else {
            // If day is also provided, filter logs for that specific day
            read_result.forEach(line => {
                if (line.split(",")[0].split(" ")[0] === get_data) {
                    send_list.push(line);
                }
            });
            if (send_list.length === 0) {
                res.json({'message': "failed"});
            } else {
                res.json({'message': send_list});
            }
        }
    });
    rl.on("error", function(err) {
        res.json({'message': "failed"});
    });
});

function sha3_256(input) {
    const hash = createHash("sha3-256")
    hash.update(input)
    return hash.digest(hash)
}
function decrypt(text,key,iv) {
    const decipher = createDecipheriv("aes-128-cbc",key,iv)
    let decrypted = decipher.update(text, "base64", 'utf-8')
    decrypted += decipher.final("utf-8")
    return decrypted
}
function encrypt(text, key, iv) {
    const cipher = createCipheriv("aes-128-cbc", key, iv)
    let encrypted = cipher.update(text, 'utf-8', "base64")
    encrypted += cipher.final('base64')
    return encrypted
}
function write_log(type, level, password) {
    console.log("log-run");
    const date = new Date();
    const year = String(date.getFullYear());
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    let hour = String(date.getHours()).padStart(2, '0');
    let minute = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');
    const time = `${year}-${month}-${day} ${hour}:${minute}:${seconds}`;
    console.log(time);
    readdir("./logs", function (err, data) {
        if (err) {
            console.error(err); // Log the error instead of returning "error"
            return;
        }
        const file_list = [];
        data.forEach(file => {
            file_list.push(file);
        });
        if (file_list.includes(`${year}-${month}.txt`)) { // Check if the file exists in the list
            const rl = createInterface({
                input: createReadStream(`./logs/${year}-${month}.txt`),
                output: process.stdout
            });
            const read_result = [];
            rl.on("line", line => { read_result.push(line); });
            rl.on("close", function () {
                const log = `${time},${type},${level},${password}`; // Using template literals
                console.log(log);
                read_result.push(log);
                appendFile(`./logs/${year}-${month}.txt`, "\n" + log, err => {
                    if (err) {
                        console.error(err); // Log the error instead of returning "failed"
                    } else {
                        console.log("Log appended successfully");
                    }
                });
            });
        } else {
            const log = `${time},${type},${level},${password}`; // Using template literals
            writeFile(`./logs/${year}-${month}.txt`, log, (err) => {
                if (err) {
                    console.error(err); // Log the error instead of returning "failed"
                } else {
                    console.log("Log written successfully");
                }
            });
        }
    });
}
// 启动服务器
app.listen(8000, () => {
});