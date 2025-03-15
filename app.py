from flask import Flask, render_template, request, jsonify
import json
import os
from datetime import datetime

app = Flask(__name__)

TASKS_FILE = "tasks.json"
SETTINGS_FILE = "settings.json"

# Load tasks from file
def load_tasks():
    if not os.path.exists(TASKS_FILE):
        return []
    with open(TASKS_FILE, "r") as file:
        try:
            return json.load(file)
        except json.JSONDecodeError:
            return []

# Save tasks to file
def save_tasks(tasks):
    with open(TASKS_FILE, "w") as file:
        json.dump(tasks, file, indent=4)

# Load settings
def load_settings():
    if not os.path.exists(SETTINGS_FILE):
        return {"work_time": 25, "break_time": 5}
    with open(SETTINGS_FILE, "r") as file:
        try:
            return json.load(file)
        except json.JSONDecodeError:
            return {"work_time": 25, "break_time": 5}

# Save settings
def save_settings(settings):
    with open(SETTINGS_FILE, "w") as file:
        json.dump(settings, file, indent=4)

@app.route("/")
def index():
    tasks = load_tasks()
    settings = load_settings()
    return render_template("index.html", tasks=tasks, settings=settings)

@app.route("/save_task", methods=["POST"])
def save_task():
    data = request.get_json()
    task_name = data.get("task")
    duration = data.get("duration")

    if task_name and duration:
        tasks = load_tasks()
        # Insert new task at the beginning
        tasks.insert(0, {
            "task": task_name,
            "duration": duration,
            "completed_at": datetime.now().strftime("%Y-%m-%d")  # Only date
        })
        save_tasks(tasks)
        return jsonify({"message": "Task saved successfully!"}), 200

    return jsonify({"error": "Invalid data"}), 400

@app.route("/save_settings", methods=["POST"])
def save_settings_route():
    data = request.get_json()
    work_time = data.get("work_time")
    break_time = data.get("break_time")

    if isinstance(work_time, int) and isinstance(break_time, int):
        settings = {"work_time": work_time, "break_time": break_time}
        save_settings(settings)
        return jsonify({"message": "Settings updated successfully!"}), 200

    return jsonify({"error": "Invalid settings"}), 400

if __name__ == "__main__":
    app.run(debug=True)
