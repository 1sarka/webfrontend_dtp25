const contactForm = document.getElementById("contactForm");
const successMessage = document.getElementById("successMessage");

const postalCodeInput = document.getElementById("postalCode");
const cityInput = document.getElementById("city");

const postalCodeDropdown = document.getElementById("postalCodeDropdown");
const cityDropdown = document.getElementById("cityDropdown");

const apiMessage = document.getElementById("apiMessage");

let isAutoFilling = false;

/* ---------- OPENPLZ: PLZ -> CITY ---------- */

postalCodeInput.addEventListener("input", async function () {
  if (isAutoFilling) return;

  const postalCode = postalCodeInput.value.trim();

  cityInput.value = "";
  hideDropdowns();
  clearMessage();

  if (postalCode.length < 2) return;

  const places = await searchPlaces("postalCode", postalCode);
  showPostalCodeDropdown(places);
});

/* ---------- OPENPLZ: CITY -> PLZ ---------- */

cityInput.addEventListener("input", async function () {
  if (isAutoFilling) return;

  const city = cityInput.value.trim();

  postalCodeInput.value = "";
  hideDropdowns();
  clearMessage();

  if (city.length < 2) return;

  const places = await searchPlaces("name", city);
  showCityDropdown(places);
});

/* ---------- OPENPLZ API SEARCH ---------- */

async function searchPlaces(type, value) {
  try {
    const response = await fetch(
      `https://openplzapi.org/ch/Localities?${type}=${encodeURIComponent(value)}&pageSize=10`
    );

    if (!response.ok) {
      throw new Error("OpenPLZ request failed.");
    }

    return await response.json();
  } catch (error) {
    showMessage("Address lookup is currently unavailable.", "danger");
    return [];
  }
}

/* ---------- DROPDOWN FOR PLZ FIELD ---------- */

function showPostalCodeDropdown(places) {
  postalCodeDropdown.innerHTML = "";

  places.forEach(function (place) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "list-group-item list-group-item-action";
    button.textContent = `${getPostalCode(place)} ${place.name}`;

    button.addEventListener("click", function () {
      selectPlace(place);
    });

    postalCodeDropdown.appendChild(button);
  });

  postalCodeDropdown.classList.toggle("d-none", places.length === 0);
}

/* ---------- DROPDOWN FOR CITY FIELD ---------- */

function showCityDropdown(places) {
  cityDropdown.innerHTML = "";

  places.forEach(function (place) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "list-group-item list-group-item-action";
    button.textContent = `${place.name} (${getPostalCode(place)})`;

    button.addEventListener("click", function () {
      selectPlace(place);
    });

    cityDropdown.appendChild(button);
  });

  cityDropdown.classList.toggle("d-none", places.length === 0);
}

/* ---------- SELECT ONE ADDRESS OPTION ---------- */

function selectPlace(place) {
  isAutoFilling = true;

  postalCodeInput.value = getPostalCode(place);
  cityInput.value = place.name;

  isAutoFilling = false;

  hideDropdowns();
  showMessage("Address selected.", "success");
}

/* ---------- HELPERS ---------- */

function hideDropdowns() {
  postalCodeDropdown.classList.add("d-none");
  cityDropdown.classList.add("d-none");
}

function getPostalCode(place) {
  return place.postalCode || place.postalcode || "";
}

function showMessage(text, type) {
  apiMessage.textContent = text;
  apiMessage.className = `small mb-3 text-${type}`;
}

function clearMessage() {
  apiMessage.textContent = "";
  apiMessage.className = "small mb-3";
}

document.addEventListener("click", function (event) {
  const clickedInsideAddress =
    postalCodeInput.contains(event.target) ||
    cityInput.contains(event.target) ||
    postalCodeDropdown.contains(event.target) ||
    cityDropdown.contains(event.target);

  if (!clickedInsideAddress) {
    hideDropdowns();
  }
});

/* ---------- FORM VALIDATION + FORMSPREE SUBMIT ---------- */

contactForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  successMessage.classList.add("d-none");
  successMessage.classList.remove("alert-success", "alert-danger");

  if (!contactForm.checkValidity()) {
    contactForm.classList.add("was-validated");
    return;
  }

  const formData = new FormData(contactForm);

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Formspree request failed.");
    }

    successMessage.textContent = "Your message was sent successfully.";
    successMessage.classList.add("alert-success");
    successMessage.classList.remove("d-none");

    contactForm.reset();
    contactForm.classList.remove("was-validated");

    hideDropdowns();
    clearMessage();
  } catch (error) {
    successMessage.textContent = "Message could not be sent. Please try again.";
    successMessage.classList.add("alert-danger");
    successMessage.classList.remove("d-none");
  }
});

/* ---------- MOBILE NAVBAR CLOSE ---------- */

const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
const navbarCollapse = document.querySelector(".navbar-collapse");

navLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    if (navbarCollapse.classList.contains("show")) {
      const bsCollapse = new bootstrap.Collapse(navbarCollapse);
      bsCollapse.hide();
    }
  });
});