// toggling side menue (Offcanva) for small screens 
document.addEventListener("DOMContentLoaded", function () {
  const offcanvasEl = document.getElementById("offcanvas");
  const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);

  const burgerBtn = document.getElementById("burgerBtn");
  const closeBtn = document.getElementById("customCloseBtn");
  const header = document.getElementById("header");

  function updateOffcanvasPosition() {
    const headerHeight = header.offsetHeight;
    offcanvasEl.style.top = `${headerHeight + 0.5}px`;
    offcanvasEl.style.height = `calc(100% - ${headerHeight}px)`;

    const backdrop = document.querySelector(".offcanvas-backdrop");
    if (backdrop) {
      backdrop.style.top = `${headerHeight}px`;
      backdrop.style.height = `calc(100% - ${headerHeight}px)`;
    }
  }

  updateOffcanvasPosition();
  window.addEventListener("resize", updateOffcanvasPosition);

  burgerBtn.addEventListener("click", () => bsOffcanvas.toggle());
  closeBtn.addEventListener("click", () => bsOffcanvas.hide());

  offcanvasEl.addEventListener("shown.bs.offcanvas", () => {
    updateOffcanvasPosition();
    burgerBtn.classList.add("hide");
    closeBtn.classList.remove("hide");

  });

  offcanvasEl.addEventListener("hidden.bs.offcanvas", () => {
    burgerBtn.classList.remove("hide");
    closeBtn.classList.add("hide");
  });
});




// Country dropdown search - result only shown
document.addEventListener("DOMContentLoaded", function () {
  // Find all dropdowns
  document.querySelectorAll('.dropdown').forEach(dropdownEl => {
    const searchInput = dropdownEl.querySelector('.country-search');
    const countryLinks = dropdownEl.querySelectorAll('.countries-list li a');
    const dropdownButton = dropdownEl.querySelector('[data-bs-toggle="dropdown"]');

    if (!searchInput || !dropdownButton) return;

    // Create dropdown instance
    const dropdownInstance = bootstrap.Dropdown.getOrCreateInstance(dropdownButton);

    // Live search filter
    searchInput.addEventListener('input', function () {
      const searchValue = this.value.toLowerCase();
      dropdownEl.querySelectorAll('.countries-list li a').forEach(item => {
        const countryName = item.querySelector('span').textContent.toLowerCase();
        item.parentElement.style.display = countryName.includes(searchValue) ? '' : 'none';
      });
    });

    // Clear input when clicking a country
    countryLinks.forEach(link => {
      link.addEventListener('click', () => {
        searchInput.value = '';
        resetList(dropdownEl);
      });
    });

    // Clear search when dropdown closes
    dropdownButton.addEventListener('hide.bs.dropdown', () => {
      searchInput.value = '';
      resetList(dropdownEl);
    });

    function resetList(container) {
      container.querySelectorAll('.countries-list li').forEach(li => li.style.display = '');
    }
  });
});


// toggle offcanva mobile country dropdown
function toggleOffcanvasBodyOverflow() {
  const dropdownMenu = document.getElementById('dropdown-menu');
  const offcanvasBody = document.getElementById('offcanvas-body');

  if (dropdownMenu && !dropdownMenu.classList.contains('show')) {
    offcanvasBody.style.overflow = 'auto';
  } else if (dropdownMenu && dropdownMenu.classList.contains('show')) {
    offcanvasBody.scrollTop = 0;
    offcanvasBody.style.overflow = 'hidden';
  }
}

toggleOffcanvasBodyOverflow();
document.addEventListener('click', toggleOffcanvasBodyOverflow);
document.addEventListener('resize', toggleOffcanvasBodyOverflow);


// disable user to interact with hero cover video and auto play loop muted video
const video = document.getElementById('hero-cover-video');

video.addEventListener('contextmenu', e => e.preventDefault());

video.addEventListener('pause', () => video.play());

document.addEventListener('keydown', e => {
  if (['Space', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
    e.preventDefault();
  }
});


// change image relative to open accordion of our story section, hide other all
document.querySelectorAll('.our-story-section #accordionExample .accordion-button').forEach(button => {
  button.addEventListener('click', function () {
    const imgId = this.getAttribute('data-img');

    // Hide all images
    document.querySelectorAll('.our-story-section .img-container img').forEach(img => {
      img.classList.add('d-none');
      img.classList.remove('d-block');
    });

    // Show the selected image
    const targetImg = document.getElementById(imgId);
    if (targetImg) {
      targetImg.classList.remove('d-none');
      targetImg.classList.add('d-block');
    }
  });
});


// bs backdrop toggling relative to footer country dropdown, at below screens < md
const footerDropdown = document.getElementById('footer-dropdown');
const backdrop = document.getElementById('dropdown-backdrop');
const smallScreen = () => window.matchMedia('(max-width: 767.98px)').matches;

function showBackdrop() {
  backdrop.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function hideBackdrop() {
  backdrop.style.display = 'none';
  document.body.style.overflow = '';
}

function isDropdownOpen() {
  return footerDropdown.classList.contains('show');
}

function closeDropdown() {
  const toggle = footerDropdown.querySelector('.dropdown-toggle');
  if (toggle) bootstrap.Dropdown.getInstance(toggle)?.hide();
}

// Events
document.addEventListener('shown.bs.dropdown', e => {
  if (footerDropdown.contains(e.target) && smallScreen()) showBackdrop();
});

document.addEventListener('hidden.bs.dropdown', e => {
  if (footerDropdown.contains(e.target)) hideBackdrop();
});

backdrop.addEventListener('click', () => {
  if (smallScreen()) closeDropdown();
});

// Resize handler
window.addEventListener('resize', () => {
  if (smallScreen()) {
    if (isDropdownOpen()) showBackdrop(); // ensure backdrop appears

  } else {
    if (backdrop.style.display === 'block') hideBackdrop();
    if (isDropdownOpen()) closeDropdown();
  }
});


// slide up footers element.fade-up when they visible in screen
document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll("footer .fade-up");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("show");
        }, index * 200); // stagger animation
        observer.unobserve(entry.target); // only once
      }
    });
  }, { threshold: 0.2 });

  elements.forEach(el => observer.observe(el));
});