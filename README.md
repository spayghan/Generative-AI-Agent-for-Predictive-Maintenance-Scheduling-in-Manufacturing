# 🔧 Predictive Maintenance AI Agent for Manufacturing

An AI-powered system that analyzes equipment maintenance logs, detects potential failures, and generates prioritized maintenance schedules with clear explanations.

---

## 🚀 Project Overview

Manufacturing plants often face unexpected downtime due to unstructured maintenance logs and lack of real-time insights.

This project solves that problem by using **AI (LLMs)** to:

* Understand textual maintenance logs
* Identify failure patterns
* Predict risks
* Generate actionable maintenance schedules

It also provides a **chat-based interface** for querying insights and supports **role-based portals** for Admins and Employees.

---

## 🧠 Key Features

### 👨‍💼 Admin Portal

* Upload and manage maintenance logs
* Run AI-based log analysis
* View prioritized maintenance schedules
* Monitor employee-reported issues
* Mark issues as resolved

### 👷 User (Employee) Portal

* View machine risk status
* Access maintenance schedules
* Interact with AI chatbot
* Report machine issues in real-time

### 🤖 AI Capabilities

* Detect issues like:

  * Overheating
  * Vibration
  * Leakage
  * Pressure drops
* Assign risk levels:

  * 🔴 High
  * 🟡 Medium
  * 🟢 Low
* Generate maintenance recommendations
* Provide explainable insights

---

## 🔄 System Workflow

1. Admin uploads maintenance logs
2. Logs are sent to AI service for analysis
3. AI detects risk patterns and assigns priority
4. System generates maintenance schedule
5. Employees view schedule and interact with chatbot
6. Employees can report new issues
7. Admin reviews and manages reported issues

---

## 🏗️ Architecture

```
Frontend (User & Admin Portals)
        ↓
Node.js Backend (API Layer)
        ↓
Python AI Service (Analysis Engine)
        ↓
Database (Logs, Schedules, Reports)
```

---

## 🛠️ Technologies Used

### 🔹 Frontend

* Streamlit / React (depending on implementation)

### 🔹 Backend

* Node.js (Express.js)

### 🔹 AI Service

* Python (FastAPI)

### 🔹 AI / LLM

* OpenAI GPT (or mock logic for demo)

### 🔹 Database

* MongoDB / Local Storage (for hackathon)

---

## 📁 Project Structure

```
project/
│
├── node-backend/        # Node.js API server
├── ai-service/          # Python AI microservice
├── frontend/            # UI (Streamlit/React)
├── data/                # Sample logs
└── README.md
```

---

## ▶️ How to Run the Project

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

---

### 2️⃣ Start AI Service (Python)

```bash
cd ai-service
pip install -r requirements.txt
uvicorn app:app --reload
```

---

### 3️⃣ Start Backend (Node.js)

```bash
cd node-backend
npm install
node server.js
```

---

### 4️⃣ Start Frontend

```bash
cd frontend
streamlit run app.py
```

---

## 🔐 Demo Credentials

### Admin Login

* Email: [admin@factory.com](mailto:admin@factory.com)
* Password: admin123

### User Login

* Email: [user@factory.com](mailto:user@factory.com)
* Password: user123

---

## 📊 Sample Use Cases

* Predict machine failures before breakdown
* Optimize maintenance scheduling
* Reduce operational downtime
* Improve decision-making with AI insights

---

## 💡 Future Improvements

* Real-time IoT sensor integration
* Advanced ML-based prediction models
* Email/SMS alerts for critical issues
* Interactive dashboards with analytics
* Cloud deployment (AWS/GCP)

---

## 🏆 Hackathon Value

This project demonstrates:

* Real-world industrial problem solving
* AI + full-stack integration
* Role-based system design
* Explainable AI outputs

---

## 📸 Screenshots (Add Here)

*Add screenshots of your UI for better presentation*

---

## 🤝 Contributing

Feel free to fork this repository and improve the project.

---

## 📜 License

This project is for educational and hackathon purposes.

---

## 🙌 Acknowledgements

* Inspired by real-world manufacturing challenges
* Built using modern AI and full-stack technologies

---

## ⭐ If you like this project

Give it a star on GitHub ⭐
