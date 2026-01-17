const API_URL = "https://6969dfe53a2b2151f8466cc2.mockapi.io/phonebook";

const contactForm = document.getElementById("contactForm");
const contactList = document.getElementById("contactList");
const errorMsg = document.getElementById("error");
const searchInput = document.getElementById("search");

let contacts = [];

// FETCH  CONTACTS //
async function fetchContacts() {
    try {
        const response = await fetch(API_URL);
        if (!Response.ok) throw new Error("Network Error");
        contacts = await Response.json();
        displayContacts(contacts);
    } catch (error) {
        errorMsg.textContent = "Failed to load contacts";
    }
}


// DISPLAY CONTACTS //
function displayContacts(data) {
    contactList.innerHTML = "";
    data.forEach(contact => {
        const li = document.createElement("li");

        li.innerHTML = `
            <span>${contact.name} - ${contact.phone}</span>
            <div class="actions">
                <button onclick="editContact(${contact.id})">Edit</button>
                <button class="delete" onclick="deleteContact(${contact.id})">Delete</button>
            </div>
        `;

        contactList.appendChild(li);
    });
}


// ADD CONTACT //
contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const id = document.getElementById("contactId").value;
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (name === "" || phone === "") {
        errorMsg.textContent = "All fields are required";
        return;
    }

    errorMsg.textContent = "";

    if (id) {
        // Update //
        const index = contacts.findIndex(c => c.id == id);
        contacts[index].name = name;
        contacts[index].phone = phone;
    } else {
        // Add //
        const newContact = {
            id: Date.now(),
            name,
            phone
        };
        contacts.unshift(newContact);
    }

    contactForm.reset();
    document.getElementById("contactId").value = "";
    displayContacts(contacts);
});


// EDIT CONTACT //
function editContact(id) {
    const contact = contacts.find(c => c.id === id);
    document.getElementById("contactId").value = contact.id;
    document.getElementById("name").value = contact.name;
    document.getElementById("phone").value = contact.phone;
}


// DELETE CONTACT //
function deleteContact(id) {
    if (!confirm("Are you want to delete this contact?")) return;
    contacts = contacts.filter(c => c.id !== id);
    displayContacts(contacts);
}


// SEARCH CONTACTS //
searchInput.addEventListener("input", function () {
    const value = this.value.toLowerCase();
    const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(value) ||
        contact.phone.includes(value)
    );
    displayContacts(filtered);
});

fetchContacts();