const form = document.getElementById("customer-form");
const idInput = document.getElementById("customerId");
const addBtn = document.getElementById("addBtn");
const updateBtn = document.getElementById("updateBtn");
const deleteBtn = document.getElementById("deleteBtn");
const clearBtn = document.getElementById("clearBtn");

async function loadCustomers() {
  const container = document.getElementById("customer-list");

  try {
    const res = await fetch("/api/persons");

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();
    container.innerHTML = "";

    if (data.length === 0) {
      container.innerHTML = "<p>No customers found.</p>";
      return;
    }

    data.forEach(person => {
      const div = document.createElement("div");
      div.className = "customer-card";

      div.innerHTML = `
        <strong>${person.first_name} ${person.last_name}</strong><br>
        Email: ${person.email}<br>
        Phone: ${person.phone || "-"}
      `;

      div.addEventListener("click", () => selectCustomer(person));
      container.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p style='color:red;'>Error loading data</p>";
  }
}

function selectCustomer(person) {
  idInput.value = person.id;
  document.getElementById("firstName").value = person.first_name || "";
  document.getElementById("lastName").value = person.last_name || "";
  document.getElementById("email").value = person.email || "";
  document.getElementById("phone").value = person.phone || "";
  
  if (person.birth_date) {
    document.getElementById("birthDate").value = person.birth_date.split('T')[0];
  } else {
    document.getElementById("birthDate").value = "";
  }

  addBtn.style.display = "none";
  updateBtn.style.display = "block";
  deleteBtn.style.display = "block";
  clearBtn.style.display = "block";
}

function resetForm() {
  form.reset();
  idInput.value = "";
  addBtn.style.display = "block";
  updateBtn.style.display = "none";
  deleteBtn.style.display = "none";
  clearBtn.style.display = "none";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const payload = {
    first_name: document.getElementById("firstName").value,
    last_name: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    birth_date: document.getElementById("birthDate").value
  };

  try {
    const res = await fetch("/api/persons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    
    if (res.ok) {
      resetForm();
      loadCustomers();
    }
  } catch (err) {
    console.error(err);
  }
});

updateBtn.addEventListener("click", async () => {
  // Check HTML requirements (prevents sending blank required fields)
  if (!form.reportValidity()) return;

  const id = idInput.value;
  if (!id) return;

  const payload = {
    first_name: document.getElementById("firstName").value,
    last_name: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    birth_date: document.getElementById("birthDate").value
  };

  try {
    const res = await fetch(`/api/persons/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      resetForm();
      loadCustomers();
    }
  } catch (err) {
    console.error(err);
  }
});

deleteBtn.addEventListener("click", async () => {
  const id = idInput.value;
  if (!id) return;

  if (!confirm("Are you sure you want to delete this customer?")) return;

  try {
    const res = await fetch(`/api/persons/${id}`, {
      method: "DELETE"
    });

    if (res.ok) {
      resetForm();
      loadCustomers();
    }
  } catch (err) {
    console.error(err);
  }
});

clearBtn.addEventListener("click", resetForm);

loadCustomers();