import tkinter as tk
from tkinter import ttk
import ttkbootstrap
import os
from tkinter import messagebox
from tkinter import simpledialog
import subprocess

try:
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
except Exception as e:
    print(e)
window = tk.Tk()
window.geometry("400x300")
window.title("手势识别管理器")
style = ttkbootstrap.Style()
style = ttkbootstrap.Style(theme="solar")

def get_models():
    with open("./hand_tracking.txt", encoding="utf-8", mode="r") as f:
        read_list = f.readlines()
        model_list = []
        for i in read_list:
            model_list.append(str(i).split(" : ")[1])
    settings_list = []
    lev_2_list = []
    settings_list.append(model_list[1])
    lev_2_list.append(model_list[0])
    trained_model = os.listdir('./hand_tracking_model_file')
    total_list = []
    for i in trained_model:
        total_list.append(i)
        settings_list.append(i)
        lev_2_list.append(i)
    settings_set = tuple(settings_list)
    lev_2_set = tuple(lev_2_list)
    total_set = tuple(total_list)
    if len(lev_2_set) != 0 and len(total_list) != 0 and len(settings_set) != 0:
        login_choose.configure(values=lev_2_set)
        login_choose.set(lev_2_set[0])
        settings_enter_choose.configure(values=settings_set)
        settings_enter_choose.set(settings_set[0])
        total_manage_choose.configure(values=total_set)
        total_manage_choose.set(total_set[0])
    else:
        pass
def submit_change():
    get_lev_2 = logi_var.get()
    get_settings = settings_var.get()
    list_dir = os.listdir("./hand_tracking_model_file")
    if get_lev_2 not in list_dir and get_lev_2 != "none" or get_settings not in list_dir and get_settings != "none":
        messagebox.showerror(message="模型名不存在！")
    else:
        try:
            with open("./hand_tracking.txt", encoding="utf-8", mode="r") as f:
                read_list = f.readlines()
            read_list[0] = read_list[0].split(" : ")[0] + " : " + get_lev_2
            read_list[1] = read_list[1].split(" : ")[0] + " : " + get_settings
            with open("./hand_tracking.txt", encoding="utf-8", mode="w") as f:
                f.write("\n".join(read_list))
            messagebox.showinfo(message="修改成功，请回到设置页面修改登陆方式到手势识别")
        except FileNotFoundError:
            messagebox.showerror(message="系统无法找到文件！")
def train_new_model():
    try:
        messagebox.showinfo(message="由于训练模块较大\n加载需要一定时间\n请稍等")
        subprocess.Popen(["E:/Python/python.exe", ".\\Trainer\\trainer_tkinter.py"])
        print("ok")
    except Exception as e:
        messagebox.showerror(message="Error:" + e)
        print(e)
def delete_modle():
    if_yes = messagebox.askyesnocancel(message="确认删除这个模型以及他的训练文件吗？")
    if if_yes == "yes":
        try:
            get_current = total.get()
            name = get_current.split("_")[0]
            os.remove(f"./hand_tracking_model_file/{get_current}")
            os.remove(f"./hand_tracking_training_file/{name}.csv")
            os.remove(f"./hand_tracking_training_file/{name}-#final-.csv")
        except Exception as e:
            print(e)
            messagebox.showerror(message="Error" + e)
    else:
        pass
def rename_modle():
    get_old = total.get()
    get_old = get_old.split(".")[0]
    new_name = simpledialog.askstring(title="输入新名字", prompt="输入新名字!")
    if new_name == "":
        messagebox.showerror(message="模型名不能为空！")
    elif "_" in list(new_name):
        messagebox.showerror(message="模型名不能含有下划线!")
    elif "." in list(new_name):
        messagebox.showerror(message="名字中不能含有'.'")
    else:
        try:
            os.rename(src=f"./hand_tracking_model_file/{get_old}.pkl", dst=f"./hand_tracking_model_file/{new_name}.pkl")
            os.rename(src=f"./hand_tracking_training_file/{get_old}.csv", dst=f"./hand_tracking_training_file/{new_name}.csv")
            os.rename(src=f"./hand_tracking_training_file/{get_old}-#final#.csv", dst=f"./hand_tracking_training_file/{new_name}-#final#.csv")
        except FileNotFoundError as e:
            print(e)
            messagebox.showerror(message="系统无法找到模型文件！")
            return
        with open("./hand_tracking.txt", encoding="utf-8", mode="r") as f:
            read_list = f.readlines()
        for i in range(len(read_list)):
            if get_old + ".pkl" in read_list[i]:
                read_list[i] = read_list[i].split(" : ")[0] + " : " + new_name + ".pkl\n"
        with open("./hand_tracking.txt", encoding="utf-8", mode="w") as f:
            f.writelines(read_list)
        get_models()
        messagebox.showinfo(message="修改完成！")
def main():
    global logi_var,settings_var, total
    global login_choose, total_manage_choose, settings_enter_choose
    logi_var = tk.StringVar()
    settings_var = tk.StringVar()
    total = tk.StringVar()
    login_label = tk.Label(window, text="二层登录-手势识别", font=(20))
    login_label.place(x=5, y=5)
    login_choose = ttk.Combobox(window, textvariable=logi_var, width=30, values=())
    login_choose.place(x=150, y=5)
    settings_enter_label = tk.Label(window, text="设置-手势识别", font=(20))
    settings_enter_label.place(x=5, y=40)
    settings_enter_choose = ttk.Combobox(window, textvariable=settings_var, width=30, values=())
    settings_enter_choose.place(x=150, y=40)
    submit = ttk.Button(window, text="提交修该", width=50, command=submit_change)
    submit.place(x=5, y=80)
    train_new = ttk.Button(window, text="训练新模型", width=50, command=train_new_model)
    train_new.place(x=5,y=120)
    total_manage_choose = ttk.Combobox(window, width=50, textvariable=total, values=())
    total_manage_choose.place(x=5, y=160)
    delete_model = ttk.Button(window, text="删除此模型", width=50, command=delete_modle)
    delete_model.place(x=5, y=200)
    rename_model = ttk.Button(window, text="重命名模型", width=50, command=rename_modle)
    rename_model.place(x=5, y=240)
    get_models() 
    window.mainloop()
if __name__ == "__main__":
    main()