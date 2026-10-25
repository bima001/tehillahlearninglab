document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');

  if (!form) return;

  const fields = {
    fullName: document.getElementById('fullName'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    message: document.getElementById('message')
  };

  const errors = {
    fullName: document.getElementById('fullNameError'),
    email: document.getElementById('emailError'),
    phone: document.getElementById('phoneError'),
    message: document.getElementById('messageError')
  };

  const successMessage = document.getElementById('successMessage');

  function setError(fieldName, message) {
    const input = fields[fieldName];
    const errorElement = errors[fieldName];

    if (input) {
      input.setAttribute('aria-invalid', 'true');
    }

    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  function clearError(fieldName) {
    const input = fields[fieldName];
    const errorElement = errors[fieldName];

    if (input) {
      input.setAttribute('aria-invalid', 'false');
    }

    if (errorElement) {
      errorElement.textContent = '';
    }
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    return /^\d+$/.test(phone);
  }

  function validateField(fieldName) {
    const value = (fields[fieldName].value || '').trim();

    if (!value) {
      setError(fieldName, `${fieldName === 'fullName' ? 'Full name' : fieldName === 'email' ? 'Email address' : fieldName === 'phone' ? 'Phone number' : 'Message'} is required.`);
      return false;
    }

    if (fieldName === 'email' && !validateEmail(value)) {
      setError(fieldName, 'Please enter a valid email address.');
      return false;
    }

    if (fieldName === 'phone' && !validatePhone(value)) {
      setError(fieldName, 'Phone number must contain digits only.');
      return false;
    }

    clearError(fieldName);
    return true;
  }

  Object.keys(fields).forEach((fieldName) => {
    fields[fieldName].addEventListener('input', () => validateField(fieldName));
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    successMessage.textContent = '';

    let isValid = true;

    Object.keys(fields).forEach((fieldName) => {
      const result = validateField(fieldName);
      if (!result) {
        isValid = false;
      }
    });

    if (!isValid) {
      return;
    }

    successMessage.textContent = 'Form submitted successfully. This is a front-end demonstration only: validation passed locally, and a real email or backend service can be connected later.';
    form.reset();
    Object.keys(fields).forEach((fieldName) => clearError(fieldName));
  });
});
