# Very Secret Diary v1.0.0
##### Secure Diary Program
***
### 1. Highlights
- **Hidden Entrance**  
  The entire app is concealed within a calculator. The only way to access it is by entering a specific string. Nobody would suspect a calculator, right?

- **Two-Level Check**  
  After passing the calculator challenge, you must pass another check. You can choose between hand tracking or a password. The default is hand tracking.

- **AES-256 Encryption**  
  All diaries are encrypted using AES-256, which is one of the most secure encryption methods available.

- **Hand Tracking**  
  With hand tracking based on KNN, you can train a high-quality model within 90 seconds. You'll never need to remember long passwords again!

- **Fake Password**  
  I've set up some directories to hide the password configuration file, which is among 676 other files. Do you have the patience to open them one by one?

- **Enter Settings with a Separate Key**  
  The key to the settings page is different from the entrance key. You also have the option to use either a password or hand tracking.

### 2. Structure
- **temp dir**  
  This directory is not used to store temporary files. Instead, it stores password files, along with 675 other files, to deter people from finding the password.

- **Hand Tracking Manager**  
  This directory contains the Hand Tracking Manager written in Python, including the trainer, manager, and recognizer.

- **diary_file dir**  
  This directory is used to store diary files in .txt format.

- **surface_calculator.html**  
  The entrance calculator program.

- **diary-login.html**  
  The page used for the second level of verification.

- **diary-mainpage.html**  
  The main page of the diary.

- **settings.html**  
  The settings page of the program.

- **backend-server.js**  
  The server is based on Node.js using the Express framework.

### 3. Requirements
- **Python**  
  Version 3.9.9 or higher, with sklearn, tkinter, opencv, numpy, pandas.

- **Node.js**  
  Express, crypto.js, fs.js, readline, body-parser.

- **Browser**  
  Any browser, preferably Edge.

- **Hard Disk**  
  At least 5MB for the source code and diary files. If you write a lot, you may need more space.

### 4. Usage
- Download the source code, run the backend-server.js. When you see the output "Server is running on localhost:8000", click on surface_calculator.html.

- Default Password:
  - Calculator: [abc]
  - Level 2: Make a "5" gesture
  - Settings: Make a "5" gesture

### 5. License
MIT