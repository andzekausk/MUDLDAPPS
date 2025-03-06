# MUDLDAPPS

## Project Setup Guide

Follow these steps to set up the **MUDLDAPPS** project.

---

## Prerequisites

- **Node.js**
- **MySQL**
- **Firebase Account** (For authentication & Admin SDK)
- **Vue.js & Vite**

---

## Installation & Setup

### 1. Set Up MySQL Database
Make sure **MySQL database** is created and correctly configured.

### 2. Install Dependencies
Run the following command in both **vue-backend** and **vue-frontend** folders:
```sh
npm install
```

### 3. Configure Backend Environment Variables
- Navigate to the `vue-backend` folder.
- Copy `.env.example` to `.env`.
- Fill out `.env` with the correct values.

### 4. Configure Frontend Environment Variables
- Navigate to the `vue-frontend` folder.
- Copy `.env.example` to `.env`.
- Fill out `.env` with Firebase credentials:
  - Go to **Firebase Console** → **Project Settings** → **General** → **SDK Setup and Configuration**.

### 5. Set Up Firebase Admin SDK
- Go to **Firebase Console** → **Project Settings** → **Service Accounts**.
- Click **Generate New Private Key**.
- Rename the downloaded file to **`firebase-adminsdk.json`**.
- Place it inside the `vue-backend` folder.

---

## 6. Running the Project

### Option 1: Manual Start
#### 6. Start the Backend
Navigate to the `vue-backend` folder and run:
```sh
node index.js
```

#### 7. Start the Frontend
Navigate to the `vue-frontend` folder and run:
```sh
npm run dev
```

#### 8. Open in Browser
Go to: [http://localhost:5173/](http://localhost:5173/)

### Option 2: Batch File
Alternatively to steps **6-8**, run the **start_project.bat** file

---
Should work ¯\\_(''3)_/¯
