const regForm = document.getElementById("registrationForm");
const firstName = document.getElementById("first-name");
const lastName = document.getElementById("last-name");
const userEmail = document.getElementById("email");
const userNumber = document.getElementById("number");
const userPassword = document.getElementById("password");
const errorMessage = document.getElementById("error-message");

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;

// form validation
if (regForm) {
  regForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await formValidation();
  });
}

async function formValidation() {
  errorMessage.textContent = "";

  if (!firstName.value.trim()) {
    window.alert("First Name is Required");
    return;
  }
  if (!lastName.value.trim()) {
    window.alert("Last Name is Required");
    return;
  }
  if (!userEmail.value.trim()) {
    window.alert("Email is Required");
    return;
  }
  if (!emailPattern.test(userEmail.value.trim())) {
    errorMessage.textContent = "❌ Invalid email format";
    errorMessage.style.color = "red";
    return;
  }
  if (!userNumber.value.trim()) {
    window.alert("Phone Number is Required");
    return;
  }
  if (!userPassword.value.trim()) {
    window.alert("Password is Required");
    return;
  }
  if (!passwordPattern.test(userPassword.value.trim())) {
    errorMessage.textContent =
      "❌ Must include uppercase, lowercase, number, special character, and 8+ characters";
    errorMessage.style.color = "red";
    return;
  }

  // Send data to backend
  try {
    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        userEmail: userEmail.value.trim(),
        userNumber: userNumber.value.trim(),
        userPassword: userPassword.value.trim(),
      }),
    });
    const data = await response.json();
    if (data.success) {
      errorMessage.textContent = "Form Submitted Successfully!";
      errorMessage.style.color = "green";
      window.location.href = "./login.html";
      regForm.reset();
    } else {
      errorMessage.textContent = data.message || "Registration failed";
      errorMessage.style.color = "red";
    }
  } catch (error) {
    errorMessage.textContent = "Server error";
    errorMessage.style.color = "red";
  }
}

// login form
const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginError = document.getElementById("error-message");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await loginValidation();
  });
}

async function loginValidation() {
  loginError.textContent = "";

  if (!loginEmail.value.trim()) {
    window.alert("Email is Required");
    return;
  }
  if (!loginPassword.value.trim()) {
    window.alert("Password is Required");
    return;
  }

  // Send data to backend
  try {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userEmail: loginEmail.value.trim(),
        userPassword: loginPassword.value.trim(),
      }),
    });
    const data = await response.json();
    if (data.success) {
      loginError.textContent = "Login Successful!";
      loginError.style.color = "green";
      window.location.href = "./dashboard.html";
    } else {
      loginError.textContent = data.message || "Login failed";
      loginError.style.color = "red";
    }
  } catch (error) {
    loginError.textContent = "Server error";
    loginError.style.color = "red";
  }
}

//modal js

// const openModalBtn = document.getElementById("openModalBtn");
// const closeModalBtn = document.getElementById("closeModalBtn");
// const modal = document.getElementById("modal");

// if (openModalBtn && modal) {
//   openModalBtn.addEventListener("click", () => {
//     modal.classList.remove("hidden");
//   });
// }

// if (closeModalBtn && modal) {
//   closeModalBtn.addEventListener("click", () => {
//     modal.classList.add("hidden");
//   });
// }

// Add Contact form logic
const addContactForm = document.getElementById("contactForm");
const contactName = document.getElementById("contact-name");
const contactEmail = document.getElementById("contact-email");
const contactPhone = document.getElementById("contact-phone");
const contactTag = document.getElementById("contact-tag");
const contactError = document.getElementById("contact-error-message");

if (addContactForm) {
  addContactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    contactError.textContent = "";

    // Basic validation
    if (
      !contactName.value.trim() ||
      !contactEmail.value.trim() ||
      !contactPhone.value.trim() ||
      !contactTag.value.trim()
    ) {
      contactError.textContent = "All fields are required.";
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName.value.trim(),
          email: contactEmail.value.trim(),
          phone: contactPhone.value.trim(),
          tag: contactTag.value.trim(),
        }),
      });
      const data = await response.json();
      if (data.success) {
        contactError.textContent = "Contact added!";
        contactError.style.color = "green";
        addContactForm.reset();

        // Optionally, refresh your contact list here
      } else {
        contactError.textContent = data.message || "Failed to add contact.";
        contactError.style.color = "red";
      }
    } catch (error) {
      contactError.textContent = "Server error";
      contactError.style.color = "red";
    }
  });
}

// Add event listener to "Add Contact" button to open modal
const addContactBtn = document.getElementById("addContactBtn");
if (addContactBtn) {
  addContactBtn.addEventListener("click", () => {
    window.location.href = "add.html";
  });
}

//link to contact page
const contactsBtn = document.getElementById("contactsBtn");
if (contactsBtn) {
  contactsBtn.addEventListener("click", () => {
    window.location.href = "contact.html";
  });
}

//link to dashboard page
const dashboardBtn = document.getElementById("dashboardBtn");
if (dashboardBtn) {
  dashboardBtn.addEventListener("click", () => {
    window.location.href = "dashboard.html";
  });
}

// to get contacts and display them

async function loadContactsTable() {
  const tableBody = document.getElementById("contactTable");
  if (!tableBody) return;

  tableBody.innerHTML = `<tr><td colspan="4" class="py-4 text-center">Loading...</td></tr>`;

  try {
    const res = await fetch("http://localhost:5000/contacts");
    const data = await res.json();
    if (data.success && data.contacts.length > 0) {
      tableBody.innerHTML = data.contacts
        .map(
          (c) => `
            <tr>
              <td class="py-2 px-4 border-b">${c.name || ""}</td>
              <td class="py-2 px-4 border-b">${c.email || ""}</td>
              <td class="py-2 px-4 border-b">${c.phone || ""}</td>
              <td class="py-2 px-4 border-b">${c.tag || ""}</td>
            </tr>
          `
        )
        .join("");
    } else {
      tableBody.innerHTML = `<tr><td colspan="4" class="py-4 text-center">No contacts found.</td></tr>`;
    }
  } catch {
    tableBody.innerHTML = `<tr><td colspan="4" class="py-4 text-center text-red-500">Failed to load contacts.</td></tr>`;
  }
}

window.addEventListener("DOMContentLoaded", loadContactsTable);
