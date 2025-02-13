# Very Secret Diary v1.0.0
##### Safe diary programme
***
### 1.Highlights
- **Hiden Entrance** The whole App is hidden in an calculator.The only way to enter it is to enter a certain string.Nobody will suspect a calculator,right?
- **Two level Check** After the challenge of the calculator,you have to pass another check.You can choose to use hand tracking or password.Defult is hand tracking.
- **AES-256** All the diarys is encoded by the AES-256,which is the most safe way to encrypt things.
- **Hand tracking** With whe hand tracking based on KNN,you can train a model with a high quality with in 90s.You'll never have the need to remember such long passwords!
- **Fake password** I have set some dirs to hide the password configuration file,which have 676 other files. Do you have the patience to open them one by one?
- **Enter Settings with separate key** The key to the settings page is different from the entrance key.You also have the choice of whather to use password or hand tracking.
### 2.Structure
- **temp dir** It isn't used to store temp files.Instead,it is used to store password files.Along with it,it has 675 other files.It can stop people trying to find the password.
- **Hand Tracking Manager** The dir contains the Hand Tracking manager written with Python.Include:trainer,manager and reconizer.
- **diary_file dir** This dir is used to store diary files in the type of .txt
- **surface_calculator.html** The entrance calcuator programme
- **diary-login.html** The page used to make the second level of check.
- **diary-mainpage.html** The main page of the diary.
- **settings.html** The settings page of the programme.
- **backend-server.js** The server based on Node.js using the Express model

### 3.Requirement
- **Python** Not lower than 3.9.9,with sklearn,tkinter,opencv
- **Node.js** Express,crypto.js,fs.js

### 4.Usage
Download the source code,and click surface_calculaor.html
Default PAssword:
Calculator:[abc]
Lev2:make a "5" gesture
settinsg:make a "5" gesture

### 5.Licence
MIT