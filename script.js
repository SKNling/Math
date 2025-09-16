class MathProblemsApp {
    constructor() {
        this.uploadedProblems = [];
        this.currentProblemIndex = 0;
        this.initializeEventListeners();
        this.loadFromStorage();
    }

    initializeEventListeners() {
        // File upload elements
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const browseBtn = document.getElementById('browseBtn');

        // Practice elements
        const startPracticeBtn = document.getElementById('startPracticeBtn');
        const randomProblemBtn = document.getElementById('randomProblemBtn');
        const clearAllBtn = document.getElementById('clearAllBtn');
        const loadDemoBtn = document.getElementById('loadDemoBtn');

        // Upload area events
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        uploadArea.addEventListener('drop', this.handleDrop.bind(this));

        // File input change
        fileInput.addEventListener('change', this.handleFileSelect.bind(this));

        // Browse button
        browseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput.click();
        });

        // Practice buttons
        startPracticeBtn.addEventListener('click', this.startPractice.bind(this));
        randomProblemBtn.addEventListener('click', this.showRandomProblem.bind(this));
        clearAllBtn.addEventListener('click', this.clearAllProblems.bind(this));
        
        // Demo button (if present)
        if (loadDemoBtn) {
            loadDemoBtn.addEventListener('click', this.loadDemoData.bind(this));
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        document.getElementById('uploadArea').classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        document.getElementById('uploadArea').classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        document.getElementById('uploadArea').classList.remove('dragover');
        
        const files = Array.from(e.dataTransfer.files);
        this.processFiles(files);
    }

    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.processFiles(files);
    }

    processFiles(files) {
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length === 0) {
            alert('Please select image files only.');
            return;
        }

        imageFiles.forEach(file => this.addProblem(file));
    }

    addProblem(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const problem = {
                id: Date.now() + Math.random(),
                name: file.name,
                image: e.target.result,
                uploadDate: new Date().toLocaleDateString(),
                size: this.formatFileSize(file.size)
            };

            this.uploadedProblems.push(problem);
            this.displayUploadedFile(problem);
            this.displayProblem(problem);
            this.updatePracticeSection();
            this.saveToStorage();
        };

        reader.readAsDataURL(file);
    }

    displayUploadedFile(problem) {
        const uploadedFiles = document.getElementById('uploadedFiles');
        
        const filePreview = document.createElement('div');
        filePreview.className = 'file-preview';
        filePreview.innerHTML = `
            <img src="${problem.image}" alt="${problem.name}">
            <div class="file-info">
                <div>${problem.name}</div>
                <div>${problem.size}</div>
            </div>
            <button class="remove-file" onclick="app.removeUploadedFile('${problem.id}')">×</button>
        `;

        uploadedFiles.appendChild(filePreview);
    }

    displayProblem(problem) {
        const problemsGrid = document.getElementById('problemsGrid');
        
        // Remove empty state if it exists
        const emptyState = problemsGrid.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }

        const problemCard = document.createElement('div');
        problemCard.className = 'problem-card';
        problemCard.setAttribute('data-id', problem.id);
        problemCard.innerHTML = `
            <img src="${problem.image}" alt="${problem.name}" class="problem-image">
            <h3>${problem.name}</h3>
            <p>Uploaded: ${problem.uploadDate}</p>
            <div class="problem-actions">
                <button class="btn btn-primary" onclick="app.practiceThis('${problem.id}')">Practice This</button>
                <button class="btn btn-secondary" onclick="app.viewFullSize('${problem.id}')">View Full Size</button>
                <button class="btn btn-danger" onclick="app.removeProblem('${problem.id}')">Remove</button>
            </div>
        `;

        problemsGrid.appendChild(problemCard);
    }

    removeUploadedFile(problemId) {
        // Remove from uploaded files display
        const filePreview = document.querySelector(`[data-id="${problemId}"]`);
        if (filePreview && filePreview.closest('.uploaded-files')) {
            filePreview.remove();
        }
    }

    removeProblem(problemId) {
        // Remove from problems array
        this.uploadedProblems = this.uploadedProblems.filter(p => p.id != problemId);
        
        // Remove from DOM
        const problemCard = document.querySelector(`[data-id="${problemId}"]`);
        if (problemCard) {
            problemCard.remove();
        }

        // Remove from uploaded files
        this.removeUploadedFile(problemId);

        // Show empty state if no problems left
        if (this.uploadedProblems.length === 0) {
            this.showEmptyState();
        }

        this.updatePracticeSection();
        this.saveToStorage();
    }

    showEmptyState() {
        const problemsGrid = document.getElementById('problemsGrid');
        problemsGrid.innerHTML = `
            <div class="empty-state">
                <p>Upload photos to see your math problems here</p>
            </div>
        `;
    }

    practiceThis(problemId) {
        const problem = this.uploadedProblems.find(p => p.id == problemId);
        if (problem) {
            this.showProblemInPractice(problem);
        }
    }

    viewFullSize(problemId) {
        const problem = this.uploadedProblems.find(p => p.id == problemId);
        if (problem) {
            // Create modal or new window to show full-size image
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                cursor: pointer;
            `;
            
            const img = document.createElement('img');
            img.src = problem.image;
            img.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                border-radius: 8px;
            `;
            
            modal.appendChild(img);
            document.body.appendChild(modal);
            
            modal.addEventListener('click', () => {
                document.body.removeChild(modal);
            });
        }
    }

    startPractice() {
        if (this.uploadedProblems.length === 0) {
            alert('Please upload some math problems first!');
            return;
        }

        this.currentProblemIndex = 0;
        this.showProblemInPractice(this.uploadedProblems[0]);
    }

    showRandomProblem() {
        if (this.uploadedProblems.length === 0) {
            alert('Please upload some math problems first!');
            return;
        }

        const randomIndex = Math.floor(Math.random() * this.uploadedProblems.length);
        this.currentProblemIndex = randomIndex;
        this.showProblemInPractice(this.uploadedProblems[randomIndex]);
    }

    showProblemInPractice(problem) {
        const practiceSection = document.getElementById('practiceSection');
        const currentProblem = document.getElementById('currentProblem');
        
        currentProblem.innerHTML = `
            <div>
                <h3 style="margin-bottom: 20px;">${problem.name}</h3>
                <img src="${problem.image}" alt="${problem.name}">
                <div style="margin-top: 20px;">
                    <button class="btn btn-primary" onclick="app.nextProblem()">Next Problem</button>
                    <button class="btn btn-secondary" onclick="app.previousProblem()">Previous Problem</button>
                </div>
            </div>
        `;

        practiceSection.style.display = 'block';
        practiceSection.scrollIntoView({ behavior: 'smooth' });
        this.updateStats();
    }

    nextProblem() {
        if (this.uploadedProblems.length === 0) return;
        
        this.currentProblemIndex = (this.currentProblemIndex + 1) % this.uploadedProblems.length;
        this.showProblemInPractice(this.uploadedProblems[this.currentProblemIndex]);
    }

    previousProblem() {
        if (this.uploadedProblems.length === 0) return;
        
        this.currentProblemIndex = this.currentProblemIndex === 0 
            ? this.uploadedProblems.length - 1 
            : this.currentProblemIndex - 1;
        this.showProblemInPractice(this.uploadedProblems[this.currentProblemIndex]);
    }

    updatePracticeSection() {
        const practiceSection = document.getElementById('practiceSection');
        if (this.uploadedProblems.length > 0) {
            practiceSection.style.display = 'block';
        } else {
            practiceSection.style.display = 'none';
        }
        this.updateStats();
    }

    updateStats() {
        const totalProblems = document.getElementById('totalProblems');
        const currentIndex = document.getElementById('currentIndex');
        
        totalProblems.textContent = this.uploadedProblems.length;
        
        if (this.uploadedProblems.length > 0 && this.currentProblemIndex >= 0) {
            currentIndex.textContent = `${this.currentProblemIndex + 1} of ${this.uploadedProblems.length}`;
        } else {
            currentIndex.textContent = '-';
        }
    }

    clearAllProblems() {
        if (this.uploadedProblems.length === 0) {
            alert('No problems to clear!');
            return;
        }

        if (confirm('Are you sure you want to clear all math problems? This action cannot be undone.')) {
            this.uploadedProblems = [];
            this.currentProblemIndex = 0;
            
            // Clear uploaded files display
            document.getElementById('uploadedFiles').innerHTML = '';
            
            // Show empty state
            this.showEmptyState();
            
            // Hide practice section
            this.updatePracticeSection();
            
            // Clear current problem
            document.getElementById('currentProblem').innerHTML = '';
            
            // Clear storage
            this.saveToStorage();
            
            alert('All problems have been cleared!');
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    saveToStorage() {
        try {
            localStorage.setItem('mathProblems', JSON.stringify(this.uploadedProblems));
        } catch (e) {
            console.warn('Could not save to localStorage:', e);
        }
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem('mathProblems');
            if (saved) {
                this.uploadedProblems = JSON.parse(saved);
                this.uploadedProblems.forEach(problem => {
                    this.displayProblem(problem);
                });
                this.updatePracticeSection();
            }
        } catch (e) {
            console.warn('Could not load from localStorage:', e);
        }
    }

    loadDemoData() {
        // Clear existing problems first
        this.uploadedProblems = [];
        document.getElementById('problemsGrid').innerHTML = '';
        document.getElementById('uploadedFiles').innerHTML = '';

        // Sample SVG images as data URLs (properly encoded)
        const sampleProblems = [
            {
                id: Date.now() + 1,
                name: 'Algebra - Linear Equation.png',
                image: 'data:image/svg+xml,' + encodeURIComponent(`
                    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                        <rect width="400" height="300" fill="white"/>
                        <rect x="20" y="20" width="360" height="260" fill="none" stroke="black" stroke-width="2"/>
                        <text x="50" y="60" font-family="Arial" font-size="18" fill="black">Problem 1: Algebra</text>
                        <text x="50" y="100" font-family="Arial" font-size="24" fill="blue">2x + 5 = 13</text>
                        <text x="50" y="140" font-family="Arial" font-size="18" fill="black">Solve for x</text>
                        <text x="50" y="200" font-family="Arial" font-size="14" fill="gray">Hint: Subtract 5 from both sides, then divide by 2</text>
                    </svg>
                `),
                uploadDate: new Date().toLocaleDateString(),
                size: '2.1 KB'
            },
            {
                id: Date.now() + 2,
                name: 'Geometry - Triangle Area.png',
                image: 'data:image/svg+xml,' + encodeURIComponent(`
                    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                        <rect width="400" height="300" fill="white"/>
                        <rect x="20" y="20" width="360" height="260" fill="none" stroke="black" stroke-width="2"/>
                        <text x="50" y="60" font-family="Arial" font-size="18" fill="black">Problem 2: Geometry</text>
                        <polygon points="150,120 250,120 200,80" fill="none" stroke="blue" stroke-width="2"/>
                        <text x="50" y="160" font-family="Arial" font-size="16" fill="black">Base = 10 cm, Height = 4 cm</text>
                        <text x="50" y="190" font-family="Arial" font-size="16" fill="black">Find the area of the triangle</text>
                        <text x="50" y="230" font-family="Arial" font-size="14" fill="gray">Formula: Area = (1/2) x base x height</text>
                    </svg>
                `),
                uploadDate: new Date().toLocaleDateString(),
                size: '1.8 KB'
            },
            {
                id: Date.now() + 3,
                name: 'Calculus - Derivative.png',
                image: 'data:image/svg+xml,' + encodeURIComponent(`
                    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                        <rect width="400" height="300" fill="white"/>
                        <rect x="20" y="20" width="360" height="260" fill="none" stroke="black" stroke-width="2"/>
                        <text x="50" y="60" font-family="Arial" font-size="18" fill="black">Problem 3: Calculus</text>
                        <text x="50" y="100" font-family="Arial" font-size="20" fill="purple">f(x) = 3x^2 + 2x - 1</text>
                        <text x="50" y="140" font-family="Arial" font-size="16" fill="black">Find f'(x)</text>
                        <text x="50" y="180" font-family="Arial" font-size="14" fill="gray">Use the power rule: d/dx(x^n) = nx^(n-1)</text>
                    </svg>
                `),
                uploadDate: new Date().toLocaleDateString(),
                size: '1.5 KB'
            }
        ];

        // Add each sample problem
        sampleProblems.forEach(problem => {
            this.uploadedProblems.push(problem);
            this.displayProblem(problem);
        });

        this.updatePracticeSection();
        this.saveToStorage();

        alert('Demo problems loaded! You can now practice with sample math problems.');
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MathProblemsApp();
});

// Prevent default drag behavior on the entire page
document.addEventListener('dragover', (e) => e.preventDefault());
document.addEventListener('drop', (e) => e.preventDefault());