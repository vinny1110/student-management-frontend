const API = "http://localhost:5000/students";
let studentsData = [];
let editId = null;

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

        <div class="actions">
          <button class="edit-btn" onclick="editStudent('${s._id}', '${s.name}', '${s.age}')">Edit</button>
          <button class="delete-btn" onclick="deleteStudent('${s._id}')">Delete</button>
        </div>

      </div>
    `;
  });
}

// ➕ Add OR 🔁 Update student
async function addStudent() {
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;

  if (!name || !age) {
    alert("Please enter all fields");
    return;
  }

  if (editId) {
    // 🔁 UPDATE
    await fetch(`${API}/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, age })
    });

    editId = null; // reset after update

  } else {
    // ➕ ADD
    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, age })
    });
  }

  // Clear inputs
  document.getElementById("name").value = "";
  document.getElementById("age").value = "";

  // ✅ RESET BUTTON TEXT BACK
  document.getElementById("submitBtn").innerText = "Add Student";

  fetchStudents();
}

// ✏️ Edit student (fill form)
function editStudent(id, name, age) {
  document.getElementById("name").value = name;
  document.getElementById("age").value = age;

  editId = id;

  // ✅ CHANGE BUTTON TEXT TO UPDATE
  document.getElementById("submitBtn").innerText = "Update Student";
}

// ❌ Delete student
async function deleteStudent(id) {
  try {
    await fetch(`${API}/${id}`, {
      method: "DELETE"
    });

    fetchStudents();
  } catch (err) {
    console.error("Delete error:", err);
  }
}

// 🔍 Search
function searchStudent() {
  const search = document.getElementById("search").value.toLowerCase();

  const filtered = studentsData.filter(s =>
    s.name.toLowerCase().includes(search)
  );

  displayStudents(filtered);
}

// Initial load
fetchStudents();