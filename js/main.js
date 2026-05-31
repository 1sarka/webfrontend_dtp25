const contactForm = document.getElementById("contactForm");
const successMessage = document.getElementById("successMessage");

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!contactForm.checkValidity()) {
    contactForm.classList.add("was-validated");
    successMessage.classList.add("d-none");
    return;
  }

  successMessage.classList.remove("d-none");
  contactForm.reset();
  contactForm.classList.remove("was-validated");
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