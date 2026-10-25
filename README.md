# Tehillah's Learning Lab

## Project Title
A responsive student portfolio, learning journal, and academic workspace.

## Student Information
- Student Name: Tehillah Samuel
- Institution: Miva Open University, Nigeria
- Programme: B.Sc. Data Science
- Level: 100 Level
- Course: COS 106 – Introduction to Web Technologies

## Project Description
Tehillah's Learning Lab is a multi-page portfolio and digital learning journal built with HTML5, CSS3, and vanilla JavaScript. It keeps the existing home, about, projects, planner, and contact pages, and is designed to remain responsive, accessible, and compatible with GitHub Pages.

## Technologies Used
- HTML5
- CSS3
- Vanilla JavaScript
- SVG illustrations for local project assets
- Bricolage Grotesque, Space Grotesk, and IBM Plex Mono typography

## Website Features
- Responsive multi-page navigation
- Interactive home status panel and learning-journey timeline
- About page with an interactive skill explorer, first-semester result, and second-semester course list
- Filterable project gallery
- Keyboard-accessible command palette (Ctrl/Cmd+K)
- Academic planner with task totals, overdue and priority indicators, filters, and local storage
- Contact links and contact form validation
- Reduced-motion support, responsive layouts, and keyboard focus states

## Folder Structure
```text
student-portfolio/
├── index.html
├── about.html
├── projects.html
├── planner.html
├── contact.html
├── README.md
├── .gitignore
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── planner.js
│   ├── contact.js
│   └── projects.js
├── assets/
│   ├── images/
│   │   ├── profile-placeholder.svg
│   │   ├── profile.jpeg
│   │   ├── project-data-analysis.svg
│   │   ├── project-student-planner.svg
│   │   └── project-portfolio.svg
│   └── media/
│       └── README.md
└── .gitignore
```

## How to Run the Website Locally
1. Open the project folder in VS Code or any code editor.
2. Open the `index.html` file directly in a browser, or use a local web server.
3. If you want to use a local server, run the following command in the project folder:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

## How to Upload to GitHub
1. Create a new repository on GitHub.
2. Open the project folder in Git Bash, PowerShell, or Terminal.
3. Run the following commands:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

4. Replace the placeholder GitHub username and repository name with your actual details.

## How to Deploy with GitHub Pages
1. Open your GitHub repository.
2. Go to Settings.
3. Select Pages.
4. Under Source, choose the main branch and root folder.
5. Save the settings.
6. GitHub will provide a live URL like:

```text
https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/
```

> Do not claim the website is published until GitHub Pages is actually enabled and the URL is working.

## Personalisation Checklist Before Submission
- [ ] Confirm the profile image and contact links are current.
- [ ] Review the displayed academic record for accuracy before publishing.
- [ ] Review all text for personal accuracy.
- [ ] Confirm the project matches your actual learning progress.
- [ ] Check that all internal links work.
- [ ] Add any real project details or media later if needed.
- [ ] Ensure contact form messaging reflects the fact that it is a front-end demo.

## Submission Notes
For Miva Open University, you may need to submit:
- The live GitHub Pages URL.
- The GitHub repository link.
- A local or hosted version of the website.
- Short documentation explaining the design and JavaScript features.

## Additional Guidance
This project uses relative file paths so it can work when hosted on GitHub Pages without a backend. Keep the file names and links consistent when editing the site.
