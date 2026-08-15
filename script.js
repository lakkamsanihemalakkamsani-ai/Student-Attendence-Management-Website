let students = JSON.parse(localStorage.getItem('attendanceStudents')) || [];

const studentForm = document.getElementById('student-form');
const studentNameInput = document.getElementById('student-name');
const studentRollInput = document.getElementById('student-roll');
const studentList = document.getElementById('student-list');
const currentDateEl = document.getElementById('current-date');

const totalCountEl = document.getElementById('total-count');
const presentCountEl = document.getElementById('present-count');
const absentCountEl = document.getElementById('absent-count');

const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
currentDateEl.textContent = new Date().toLocaleDateString('en-US', options);

function init() {
    renderStudents();
    updateSummary();
}

studentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = studentNameInput.value.trim();
    const roll = studentRollInput.value.trim();

    if (students.some(student => student.roll === roll)) {
        alert('A student with this Roll Number already exists!');
        return;
    }

    const newStudent = {
        id: Date.now().toString(),
        name: name,
        roll: roll,
        status: 'absent' // Default status
    };

    students.push(newStudent);
    saveAndRefresh();
    
    studentNameInput.value = '';
    studentRollInput.value = '';
});

function toggleStatus(id, newStatus) {
    students = students.map(student => {
        if (student.id === id) {
            return { ...student, status: newStatus };
        }
        return student;
    });
    saveAndRefresh();
}

function deleteStudent(id) {
    if(confirm("Are you sure you want to remove this student?")) {
        students = students.filter(student => student.id !== id);
        saveAndRefresh();
    }
}

function saveAndRefresh() {
    localStorage.setItem('attendanceStudents', JSON.stringify(students));
    renderStudents();
    updateSummary();
}

function renderStudents() {
    studentList.innerHTML = '';

    if (students.length === 0) {
        studentList.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#94a3b8;">No students registered yet.</td></tr>`;
        return;
    }

    students.forEach(student => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td><strong>${student.roll}</strong></td>
            <td>${student.name}</td>
            <td>
                <button class="status-btn present-btn ${student.status === 'present' ? 'active' : ''}" onclick="toggleStatus('${student.id}', 'present')">Present</button>
                <button class="status-btn absent-btn ${student.status === 'absent' ? 'active' : ''}" onclick="toggleStatus('${student.id}', 'absent')">Absent</button>
            </td>
            <td>
                <button class="delete-btn" onclick="deleteStudent('${student.id}')" title="Delete Student">🗑️</button>
            </td>
        `;
        studentList.appendChild(row);
    });
}

function updateSummary() {
    const total = students.length;
    const present = students.filter(s => s.status === 'present').length;
    const absent = total - present;

    totalCountEl.textContent = total;
    presentCountEl.textContent = present;
    absentCountEl.textContent = absent;
}

init();
