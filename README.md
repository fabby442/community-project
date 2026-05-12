

Community Project
A full-stack community web application with a dedicated frontend and backend, managed as a monorepo.
📁 Project Structure

community-project/
├── backend/        # Server-side code (API, database, etc.)
├── frontend/       # Client-side code (UI, styles, etc.)
├── package.json    # Root package — runs both services concurrently
└── .gitignore


🚀 Getting Started
Prerequisites
	•	Node.js (v16 or higher recommended)
	•	npm
Installation
	1.	Clone the repository:

git clone https://github.com/fabby442/community-project.git
cd community-project


	2.	Install root dependencies:

npm install


	3.	Install backend dependencies:

cd backend && npm install


	4.	Install frontend dependencies:

cd frontend && npm install


Running the App
From the root of the project, run both the frontend and backend simultaneously:

npm run dev


This uses concurrently to start both services at once.
Alternatively, run each service individually:

# Backend only
cd backend && npm run dev

# Frontend only
cd frontend && npm run dev


🛠️ Tech Stack



|Layer   |Technology           |
|--------|---------------------|
|Frontend|JavaScript, CSS, HTML|
|Backend |Node.js / JavaScript |
|Dev Tool|concurrently         |

🤝 Contributing
Contributions are welcome! To get started:
	1.	Fork the repository
	2.	Create a new branch: git checkout -b feature/your-feature-name
	3.	Make your changes and commit: git commit -m "Add your feature"
	4.	Push to your branch: git push origin feature/your-feature-name
	5.	Open a Pull Request
📄 License
This project is open source. See the repository for details.​​​​​​​​​​​