#!/usr/bin/env python3

import cv2
import mediapipe as mp
import numpy as np
import pickle
import os
import sys
from sklearn.neighbors import KNeighborsClassifier

def calculate_distance(list_1):
    wrist = [float(list_1[0]), float(list_1[1]), float(list_1[2])]
    distance_list = []
    for i in range(1, 21):
        list_2 = [float(list_1[3*i]), float(list_1[3*i+1]), float(list_1[3*i+2])]
        distance = ((wrist[0] - list_2[0]) ** 2 + (wrist[1] - list_2[1]) ** 2 + (wrist[2] - list_2[2]) ** 2) ** 0.5
        distance = round(distance, 5)
        distance_list.append(distance)
    return distance_list

def main():
    print("python is running")
    try:
        os.chdir(os.path.dirname(os.path.abspath(__file__)))
    except Exception as e:
        print(e)
    
    # Load the trained KNN model
    try:
        if len(sys.argv) > 1:
            name = sys.argv[1]
        with open(f"../hand_tracking_model_file/{name}.pkl", 'rb') as model_file:
            knn: KNeighborsClassifier = pickle.load(model_file)

        # Initialize MediaPipe Hands
        mp_hands = mp.solutions.hands
        hands = mp_hands.Hands()
        mp_draw = mp.solutions.drawing_utils

        # Start video capture
        cap = cv2.VideoCapture(0)
    except Exception as e:
        print(e)
        return

    try:
        number = 0
        fail_number = 0
        while cap.isOpened():
            success, image = cap.read()
            if not success:
                print("Failed to read from camera.")
                continue

            # Convert the BGR image to RGB
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            results = hands.process(image_rgb)

            if results.multi_hand_landmarks:
                for hand_landmarks in results.multi_hand_landmarks:
                    # Extract landmarks
                    list_1 = []
                    for land_mark in hand_landmarks.landmark:
                        x = round(land_mark.x, 3)
                        y = round(land_mark.y, 3)
                        z = round(land_mark.z, 3)
                        list_1.extend([x, y, z])
                    distance = calculate_distance(list_1=list_1)
                    # Predict the gesture
                    prediction = knn.predict([distance])

                    if prediction[0] == 1:
                        number += 1
                        fail_number = 0
                        gesture = "succeed"
                    else:
                        fail_number += 1
                        number = 0
                        gesture = "Failed"
                    if number >= 30:
                        print("succeed")
                        sys.exit(0)
                    if fail_number >= 30:
                        print("failed")
                        sys.exit(1)
                    # Draw landmarks and display the gesture
                    mp_draw.draw_landmarks(image, hand_landmarks, mp_hands.HAND_CONNECTIONS)
                    cv2.putText(image, gesture, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)
            else:
                # Reset counters if no hand landmarks are detected
                number = 0
                fail_number = 0

            # Display the image
            cv2.imshow('Hand Gesture Recognition', image)

            if cv2.waitKey(5) & 0xFF == 27:
                break
    except Exception as e:
        print(e)
    finally:
        cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    main()