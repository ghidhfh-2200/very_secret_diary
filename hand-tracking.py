import cv2
import mediapipe as mp

# 初始化MediaPipe手势识别模块
mp_hands = mp.solutions.hands
hands = mp_hands.Hands()
mp_draw = mp.solutions.drawing_utils

# 使用OpenCV捕获视频帧
cap = cv2.VideoCapture(0)
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
        for hand_landmarks in results.multi_hand_landmarks:
            mp_draw.draw_landmarks(image, hand_landmarks, mp_hands.HAND_CONNECTIONS)
    # 显示结果
    cv2.imshow('Hand Tracking', image)
    if cv2.waitKey(5) & 0xFF == 27:
        break

cap.release()