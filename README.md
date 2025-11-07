
-----

# LearningMap 

LearningMap is an intelligent learning path generator. Enter any topic you want to learn, select your skill level (Beginner, Intermediate, or Advanced), and let AI generate a customized, interactive mind map of your learning journey.

This application provides a structured, node-based map where each node represents a sub-topic. You can click on any node to get curated learning resources, including articles, videos, books, and courses, sourced in real-time.

## Live Demo  **[https://learning-map.vercel.app/](https://learning-map.vercel.app/)**

---

## 📷 Preview
![LearningMap Preview](https://github.com/user-attachments/assets/eca532b7-b5c0-4926-8999-e293c5068acd)

---

---

## Features

* **AI-Powered:** Uses the Google Gemini API to generate dynamic and relevant learning paths.
* **Interactive Mind Map:** Visualizes the learning journey using React Flow, making complex topics easy to navigate.
* **Curated Resources:** Fetches real-time articles and videos from the Serper API for each learning node.
* **Clean & Simple UI:** A modern, light-themed interface built with Tailwind CSS.
* **Exportable:** Save your learning map as a JSON file, CSV, or print it as a PDF.
* **Full-Stack Deployment:** Deployed with a Vercel frontend and a Render backend.

---

##  Technologies Used

### Frontend
* **React 19**
* **Vite** (Build Tool)
* **React Flow** (For the interactive map)
* **Tailwind CSS** (For styling)
* **Axios** (For API communication)

### Backend
* **Node.js**
* **Express** (For the REST API)
* **Mongoose** (For MongoDB object modeling)
* **Google Generative AI (Gemini)** (For map generation)
* **Serper API** (For resource fetching)

### Database
* **MongoDB Atlas**

### Deployment
* **Vercel** (Frontend)
* **Render** (Backend)

---

## 📂 Project Structure

The project is organized into two main folders: `frontend` and `backend`.

```

/LearningMap
├── .gitignore
├── backend
│   ├── .env
│   ├── .gitignore
│   ├── config
│   │   └── db.js
│   ├── controllers
│   │   ├── mapController.js
│   │   └── utils
│   │       ├── resourceGenerator.js
│   │       └── transformData.js
│   ├── middleware
│   │   └── errorHandler.js
│   ├── models
│   │   └── Map.js
│   ├── routes
│   │   └── api.js
│   ├── index.js
│   └── package.json
│
└── frontend
    ├── .env
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── vite.config.js
    ├── public
    │   └── vite.svg
    └── src
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── components
    │   ├── ExportButton.jsx
    │   ├── Header.jsx
    │   ├── LearningMap.jsx
    │   ├── ResourceCard.jsx
    │   ├── ResourcePanel.jsx
    │   └── TopicForm.jsx
    └── services
    ├── api.js
    └── storage.js

````

---

##  Getting Started Locally

To run this project on your local machine, you will need to run both the `frontend` and `backend` services.

### Prerequisites

* Node.js (v18 or later)
* MongoDB Atlas account (or a local MongoDB instance)
* API keys for:
    * Google Gemini
    * Serper API

 
### 1. Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/prathamesonar/LearningMap.git
    ```


### 2. Backend Setup

1.  Navigate to the backend directory:
    ```sh
    cd backend
    ```
2.  Install dependencies:
    ```sh
    npm install
    ```
3.  Create a `.env` file in the `backend` folder and add your environment variables:
    ```.env
    MONGO_URI=your_mongodb_connection_string
    GEMINI_API_KEY=your_gemini_api_key
    SERPER_API_KEY=your_serper_api_key
    PORT=5000
    NODE_ENV=development
    FRONTEND_URL=http://localhost:5173
    ```
4.  Start the backend server:
    ```sh
    npm run dev
    ```
    backend will be running at `http://localhost:5000`.

### 3. Frontend Setup

1.  From the root directory, navigate to the frontend directory:
    ```sh
    cd frontend
    ```
2.  Install dependencies:
    ```sh
    npm install
    ```
3.  Create a `.env` file in the `frontend` folder:
    ```.env
    VITE_API_URL=http://localhost:5000/api
    ```
4.  Start the frontend development server:
    ```sh
    npm run dev
    ```
    frontend will open and run at `http://localhost:5173`.
