// Dark mode toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  darkModeToggle.innerHTML = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// Load dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
  darkModeToggle.innerHTML = '☀️';
}

// Smooth scroll animation for all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(anchor.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Animate on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
    }
  });
});

document.querySelectorAll('.skill, .testimonial, .project-card').forEach(el => {
  observer.observe(el);
});

// Contact form validation and submission
const contactForm = document.getElementById('contact-form');
const statusMessage = document.getElementById('status');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const honeypot = document.querySelector('input[name="honeypot"]').value;

    // Honeypot check
    if (honeypot) return;

    // Validation
    if (!name) {
      statusMessage.textContent = 'Please enter your name.';
      statusMessage.style.color = 'red';
      return;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      statusMessage.textContent = 'Please enter a valid email address.';
      statusMessage.style.color = 'red';
      return;
    }
    if (!message) {
      statusMessage.textContent = 'Please enter a message.';
      statusMessage.style.color = 'red';
      return;
    }

    // Mock email submission (replace with actual backend)
    fetch('https://formspree.io/f/your-form-id', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, message })
    })
    .then(response => {
      if (response.ok) {
        statusMessage.textContent = 'Thank you for your message! I will get back to you soon.';
        statusMessage.style.color = 'green';
        contactForm.reset();
      } else {
        throw new Error('Submission failed');
      }
    })
    .catch(error => {
      statusMessage.textContent = 'There was an error sending your message. Please try again.';
      statusMessage.style.color = 'red';
    });
  });
}

// Modal functionality for projects
const modal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalLink = document.getElementById('modal-link');
const closeBtn = document.querySelector('.close');

if (modal) {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('h3').textContent;
      const description = card.querySelector('p').textContent;
      const link = card.querySelector('.btn').href;

      modalTitle.textContent = title;
      modalDescription.textContent = description;
      modalLink.href = link;
      modal.style.display = 'block';
    });
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal && modal.style.display === 'block') {
    modal.style.display = 'none';
  }
});
