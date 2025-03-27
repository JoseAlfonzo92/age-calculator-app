// DOM elements for form, inputs, and results
const form = document.getElementById('age-form');
const inputs = {
  day: document.getElementById('day'),
  month: document.getElementById('month'),
  year: document.getElementById('year'),
};
const results = {
  year: document.getElementById('years').querySelector('span'),
  month: document.getElementById('months').querySelector('span'),
  day: document.getElementById('days').querySelector('span'),
};
const errors = {
  day: document.getElementById('day-error'),
  month: document.getElementById('month-error'),
  year: document.getElementById('year-error'),
};

// Helper to reset validation state
function resetState() {
  Object.values(errors).forEach(error => (error.textContent = ""));
  Object.values(inputs).forEach(input => {
    input.classList.remove("error");
    input.previousElementSibling.classList.remove("error");
  });
}

// Helper to set error state
function setError(input, errorMessage) {
  const error = errors[input.id];
  error.textContent = errorMessage;
  input.classList.add("error");
  input.previousElementSibling.classList.add("error");
}

// Form submission handler
form.addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent page reload
  resetState(); // Clear previous errors

  const today = new Date();
  let hasErrors = false;

  // Parse and validate input values
  const day = parseInt(inputs.day.value, 10);
  const month = parseInt(inputs.month.value, 10);
  const year = parseInt(inputs.year.value, 10);

  // Validate required fields and number ranges
  if (!inputs.day.value.trim() || isNaN(day) || day < 1 || day > 31) {
    setError(inputs.day, "Must be a valid day");
    hasErrors = true;
  }
  if (!inputs.month.value.trim() || isNaN(month) || month < 1 || month > 12) {
    setError(inputs.month, "Must be a valid month");
    hasErrors = true;
  }
  if (!inputs.year.value.trim() || isNaN(year) || year > today.getFullYear()) {
    setError(inputs.year, year > today.getFullYear() ? "Must be in the past" : "Must be a valid year");
    hasErrors = true;
  }

  // Validate complete date
  const enteredDate = new Date(year, month - 1, day);
  if (!hasErrors && (enteredDate > today || !isValidDate(day, month, year))) {
    setError(inputs.day, "Must be a valid date");
    hasErrors = true;
  }

  if (hasErrors) return; // Stop if validation fails

  // Age calculation
  let ageYears = today.getFullYear() - year;
  let ageMonths = today.getMonth() - (month - 1);
  let ageDays = today.getDate() - day;

  if (ageDays < 0) {
    ageMonths--;
    ageDays += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }
  if (ageMonths < 0) {
    ageYears--;
    ageMonths += 12;
  }

  // Display results with animation
  animateNumber(results.year, ageYears);
  animateNumber(results.month, ageMonths);
  animateNumber(results.day, ageDays);
});

// Helper function to validate date
function isValidDate(day, month, year) {
  const date = new Date(year, month - 1, day);
  return date.getDate() === day && date.getMonth() === month - 1;
}

// Animation helper
function animateNumber(element, finalValue) {
  let start = 0;
  const duration = 1000;
  const stepTime = Math.max(duration / Math.abs(finalValue || 1), 50);

  const interval = setInterval(() => {
    if (start >= finalValue) {
      clearInterval(interval);
    } else {
      start++;
      element.textContent = start;
    }
  }, stepTime);
}
  