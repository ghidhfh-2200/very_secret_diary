document.addEventListener("DOMContentLoaded", () => {
    var time = 0;
    seal_all_data(); // Call seal_all_data function before other code
    
    const text = document.querySelectorAll(".text");
    let index = 0;
    
    function check_args() {
        const urlParams = new URLSearchParams(window.location.search)
        const data = urlParams.get("argu")
        if (data == "fh") {
            showtext()
        }
        else {
            window.location.href = "./surface_calculator.html"
        }
    }
    
    function showtext() {
        if (time == 1) {

        }
        text.forEach((subtitle, i) => {
            if (i === index) {
                subtitle.style.display = "block";
            } else {
                subtitle.style.display = "none";
            }
        });
        index = (index + 1) % text.length;
        console.log(index)
        if (index === 0) {
            time ++
        }
    }

    showtext(); // Show the first subtitle initially
    setInterval(showtext, 4000)
    
    function seal_all_data() {
        fetch('http://localhost:8000/seal_all_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ values: time}) // Updated JSON.stringify to send an object with key 'values'
        })
        .then(response => response.json())
        .then(data => {
            if (data['message'] == "failed") {alert("加密失败！")}
        })
        .catch(error => {
            console.error('Error:', error);
            alert("无法连接到服务器,请确保服务器开启!") // Return an empty array in case of error
        })
        time ++
    }
});