const contactForm = document.getElementById("contactForm");
const successMessage = document.getElementById("successMessage");
const postalCodeInput = document.getElementById("postalCode");
const cityInput = document.getElementById("city");
const apiMessage = document.getElementById("apiMessage");

postalCodeInput.addEventListener("input", function () {
  const postalCode = postalCodeInput.value.trim();

  cityInput.value = "";
  apiMessage.textContent = "";
  apiMessage.className = "small mb-3";

  if (postalCode.length === 4 && /^[0-9]{4}$/.test(postalCode)) {
    fetchCityByPostalCode(postalCode);
  }
});

async function fetchCityByPostalCode(postalCode) {
  try {
    apiMessage.textContent = "Searching city...";
    apiMessage.classList.add("text-muted");

    const response = await fetch(
      `https://openplzapi.org/ch/Localities?postalCode=${postalCode}`
    );

    if (!response.ok) {
      throw new Error("API request failed.");
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      apiMessage.textContent = "No city found for this PLZ.";
      apiMessage.className = "small mb-3 text-danger";
      return;
    }

    cityInput.value = data[0].name;
    apiMessage.textContent = "City automatically filled.";
    apiMessage.className = "small mb-3 text-success";
  } catch (error) {
    apiMessage.textContent = "City lookup is currently unavailable.";
    apiMessage.className = "small mb-3 text-danger";
  }
}

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  successMessage.classList.add("d-none");

  if (!contactForm.checkValidity()) {
    contactForm.classList.add("was-validated");
    return;
  }

  successMessage.classList.remove("d-none");
  contactForm.reset();
  contactForm.classList.remove("was-validated");
  apiMessage.textContent = "";
});

// Close mobile navbar after clicking a link
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