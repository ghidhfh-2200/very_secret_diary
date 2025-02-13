import tkinter as tk
from tkinter import ttk
import pandas as pd
import mediapipe as mp
import numpy as np
import cv2 
import time
import ttkbootstrap
import os
from tkinter import messagebox
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
import pickle

try:
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
except Exception as e:
    print(e)
window = tk.Tk()
window.geometry("400x300")
window.title("训练新模型")
style = ttkbootstrap.Style()
style = ttkbootstrap.Style(theme="solar")
name = ""
def show_name_frame():
    start_frame.pack_forget()
    name_frame.pack()
def show_start_frame():
    name_frame.pack_forget()
    start_frame.pack()
def show_test_frame():
    global name
    if name_entry.get() != "":
        if "_" not in list(name_entry.get()) and "." not in list(name_entry.get()):
            name = name_entry.get()
            name_frame.pack_forget()
            test_frame.pack()
            print(name)
            path = f"../hand_tracking_training_file/{name}.csv"
            # Create an empty CSV file to initialize
            pd.DataFrame().to_csv(path, index=False)
        else:
            messagebox.showerror("名称不能含有下划线！")
    else:
        messagebox.showerror(message="模型名不能为空！")

def hand_tracking(mode):
    mp_hands = mp.solutions.hands
    hands = mp_hands.Hands()
    mp_draw = mp.solutions.drawing_utils

    # 使用OpenCV捕获视频帧
    cap = cv2.VideoCapture(0)
    start = time.time()
    try:
        number = 0
        print("ok")
        while cap.isOpened():
            success, image = cap.read()
            if not success:
                continue

            # 将BGR图像转换为RGB
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            # 处理图像并获取手势识别结果
            results = hands.process(image)
            # 绘制手势关键点
            if results.multi_hand_landmarks:
                if len(results.multi_hand_landmarks) > 1:
                    cv2.putText(image, "Only one hand!", (100,30), cv2.FONT_HERSHEY_SIMPLEX,
                                1, (0,0,255), 2,cv2.LINE_AA)
                else:
                    list_1 = []
                    for land_mark in results.multi_hand_landmarks[0].landmark:
                        x = round(land_mark.x,3)
                        y = round(land_mark.y, 3)
                        z = round(land_mark.z, 3)
                        list_1.extend([x, y, z])
                    # Save to CSV
                    df = pd.DataFrame([list_1])
                    df.to_csv(f"../hand_tracking_training_file/{name}.csv", mode='a', header=False, index=False)
                    number += 1
                    mp_draw.draw_landmarks(image, results.multi_hand_landmarks[0], mp_hands.HAND_CONNECTIONS)
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            if int(time.time() - start) <= 3:
                cv2.putText(image, "The whole process takes 30s", (10,30), cv2.FONT_HERSHEY_SIMPLEX,
                            1, (0,0,255), 2,cv2.LINE_AA)
            elif int(time.time() - start) > 3 and int(time.time() - start) < 30:
                cv2.putText(image, str(45-int(time.time() -start)), (10,30), cv2.FONT_HERSHEY_SIMPLEX,
                            1, (0,0,255), 2,cv2.LINE_AA)
            # 显示结果
            cv2.imshow('Hand Tracking', image)
            if int(time.time() - start) >= 45:
                break
            if cv2.waitKey(5) & 0xFF == 27:
                break
        cap.release()
        return number
    except Exception as e:
        print(e)
        messagebox.showerror(message=f"无法写入文件: {e}")
def collect_data():
    number = hand_tracking(mode=True)
    next_step = messagebox.showinfo(message=f"正数据集收集完成，请关闭该窗口！共收集 {number} 组数据")
    if next_step == "ok":
        message = messagebox.showinfo(message="接下来请做出除了刚才的手势外的其他手势\n什么都可以！\n尽可能多，可以提高识别准确率哦！")
        if message == "ok":
            num_2 = hand_tracking(mode=False)
            test_label.configure(text = "点击按钮进入下一步")
            start_collect.configure(text = "下一步")
            next_step = messagebox.showinfo(message=f"反数据集收集完成，请关闭该窗口！共收集 {num_2} 组数据")
            if next_step == "ok":
                train(num_1=number,num_2=num_2)
        
def train(num_1, num_2):
    print(num_1)
    print(num_2)
    test_frame.pack_forget()
    train_frame.pack()
    try:
        # Load the CSV file
        df = pd.read_csv(f"../hand_tracking_training_file/{name}.csv")
        for index, row in df.iterrows():
            list_1 = []
            wrist_xyz = [float(row[0]), float(row[1]), float(row[2])]
            for i in range(1, 21):  # Corrected range to include all 21 landmarks
                point_xyz = [float(row[3*i]), float(row[3*i+1]), float(row[3*i+2])]
                distance = ((wrist_xyz[0] - point_xyz[0])**2 + (wrist_xyz[1] - point_xyz[1])**2 + (wrist_xyz[2] - point_xyz[2])**2) ** 0.5
                list_1.append(round(distance, 5))
            if index + 1 <= num_1:
                list_1.append(1)
            elif index + 1 > num_1 and index+1 <= num_2 + num_1:  
                list_1.append(0)
            final_dataframe = pd.DataFrame([list_1])
            final_dataframe.to_csv(f"../hand_tracking_training_file/{name}-#final#.csv", mode='a', header=False, index=False)
        
        train_df = pd.read_csv(f"../hand_tracking_training_file/{name}-#final#.csv")
        arry = np.array(train_df)
        
        # Assuming the last column is the label
        X = arry[:, :-1]
        y = arry[:, -1].astype(int)
        
        knn = KNeighborsClassifier(n_neighbors=5)
        knn.fit(X, y)
        
        # Save the trained model
        with open(f"../hand_tracking_model_file/{name}.pkl", 'wb') as model_file:
            pickle.dump(knn, model_file)
        
        messagebox.showinfo(message="模型训练完成！")
        
    except Exception as e:
        print(e)
        messagebox.showerror(message=f"训练过程中出现错误: {e}")
def main():
    global start_frame, name_frame, test_frame, train_frame
    global name_entry, back_button, test_label, start_collect
    start_frame = tk.Frame(window, width=400, height=300)
    start_frame.pack()
    start_label = tk.Label(start_frame, text="点击按钮开始训练新模型！", font=(20))
    start_label.place(x=130, y=130)
    start_button = ttk.Button(start_frame, text="开始", width=30, command=show_name_frame)
    start_button.place(x=100, y=160)
    name_frame = tk.Frame(window, width=400, height=300)
    name_label = tk.Label(name_frame, text="请给你的新模型命名：", font=(20))
    name_label.place(x=130, y=100)
    name_entry = tk.Entry(name_frame, width=30)
    name_entry.place(x=100, y=130)
    name_next_step = ttk.Button(name_frame, text="下一步", width=30, command=show_test_frame)
    name_next_step.place(x=95, y=160)
    back_button = ttk.Button(name_frame, text="返回", width=30, command=show_start_frame)
    back_button.place(x=95, y=200)

    test_frame = tk.Frame(window, width=400, height=300)
    test_label = tk.Label(test_frame, text="模块准备就绪，可以开始", font = (20))
    test_label.place(x=130, y=100)
    start_collect = ttk.Button(test_frame, text="开始数据采集", width=30, command=collect_data)
    start_collect.place(x=95, y=130)

    train_frame = tk.Frame(window, width=400, height=300)
    train_label = tk.Label(train_frame, text="正在训练数据，请稍等……", font=(20))
    train_label.place(x=10, y=100)
    train_end_button = ttk.Button(train_frame, text="紧急停止", width=30)
    train_end_button.place(x=95, y=130)
    train_close_button = ttk.Button(train_frame, text="关闭", state=tk.DISABLED, command=window.destroy)
    train_close_button.place(x=95, y=170)
    window.mainloop()

if __name__ == "__main__":
    main()

