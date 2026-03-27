const API = "http://localhost:5000/students";
let studentsData = [];

// Fetch all students
async function fetchStudents() {
  const res = await fetch(API);
  studentsData = await res.json();
  displayStudents(studentsData);
}

// Display students
function displayStudents(data) {
  const list = document.getElementById("list");
  list.innerHTML = "";

  data.forEach(s => {
    list.innerHTML += `
      <div class="student">
        <span>${s.name} (${s.age})</span>
        <button onclick="deleteStudent('${s._id}')">Delete</button>
      </div>
    `;
  });
}

// Add student
async function addStudent() {
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;

  if (!name || !age) {
    alert("Please enter all fields");
    return;
  }

  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, age })
  });

  document.getElementById("name").value = "";
  document.getElementById("age").value = "";

  fetchStudents();
}

// Delete student
async function deleteStudent(id) {
  try {
    await fetch(`http://localhost:5000/students/${id}`, {
      method: "DELETE"
    });

    fetchStudents(); // refresh list

  } catch (err) {
    console.error("Delete error:", err);
  }
}
// Search
function searchStudent() {
  const search = document.getElementById("search").value.toLowerCase();

  const filtered = studentsData.filter(s =>
    s.name.toLowerCase().includes(search)
  );

  displayStudents(filtered);
}

// Initial load
fetchStudents();