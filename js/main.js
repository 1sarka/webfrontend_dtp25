const contactForm = document.getElementById("contactForm");
const successMessage = document.getElementById("successMessage");

const postalCodeInput = document.getElementById("postalCode");
const cityInput = document.getElementById("city");

const postalCodeSuggestions = document.getElementById("postalCodeSuggestions");
const citySuggestions = document.getElementById("citySuggestions");

const apiMessage = document.getElementById("apiMessage"); 

let places = [];

let isAutoFilling = false;

// PLZ input -> city suggestions + auto-fill city
postalCodeInput.addEventListener("input", async function () {
  if (isAutoFilling) return;

  const postalCode = postalCodeInput.value.trim();

  cityInput.value = "";
  postalCodeSuggestions.innerHTML = "";
  citySuggestions.innerHTML = "";
  clearMessage();

  if (postalCode.length < 2) {
    return;
  }

  places = await searchPlaces("postalCode", postalCode);
  showSuggestions();

  if (postalCode.length === 4 && places.length > 0) {
    isAutoFilling = true;
    cityInput.value = places[0].name;
    isAutoFilling = false;

    showMessage("City was filled from PLZ.", "success");
  }
});

// City input -> PLZ suggestions + auto-fill PLZ
cityInput.addEventListener("input", async function () {
  if (isAutoFilling) return;

  const city = cityInput.value.trim();

  postalCodeInput.value = "";
  postalCodeSuggestions.innerHTML = "";
  citySuggestions.innerHTML = "";
  clearMessage();

  if (city.length < 2) {
    return;
  }

  places = await searchPlaces("name", city);
  showSuggestions();

  const match = places.find(function (place) {
    return place.name.toLowerCase() === city.toLowerCase();
  });

  if (match) {
    isAutoFilling = true;
    postalCodeInput.value = getPostalCode(match);
    isAutoFilling = false;

    showMessage("PLZ was filled from city.", "success");
  }
});
// API search
async function searchPlaces(type, value) {
  try {
    const response = await fetch(
      `https://openplzapi.org/ch/Localities?${type}=${encodeURIComponent(value)}&pageSize=10`
    );

    if (!response.ok) {
      throw new Error("OpenPLZ request failed");
    }

    return await response.json();
  } catch (error) {
    showMessage("Address lookup is currently unavailable.", "danger");
    return [];
  }
}

// Fill both dropdowns
function showSuggestions() {
  postalCodeSuggestions.innerHTML = "";
  citySuggestions.innerHTML = "";

  places.forEach(function (place) {
    const postalCode = getPostalCode(place);
    const city = place.name;

    const postalOption = document.createElement("option");
    postalOption.value = postalCode;
    postalOption.label = city;
    postalCodeSuggestions.appendChild(postalOption);

    const cityOption = document.createElement("option");
    cityOption.value = city;
    cityOption.label = postalCode;
    citySuggestions.appendChild(cityOption);
  });
}

// Helper because API field name can vary
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
// Form validation + real Formspree submit
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

    postalCodeSuggestions.innerHTML = "";
    citySuggestions.innerHTML = "";
    clearMessage();
  } catch (error) {
    successMessage.textContent = "Message could not be sent. Please try again.";
    successMessage.classList.add("alert-danger");
    successMessage.classList.remove("d-none");
  }
});

// Close mobile navbar after link click
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