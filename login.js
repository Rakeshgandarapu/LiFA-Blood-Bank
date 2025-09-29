document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = document.getElementById('loginMsg');

  const payload = {
    email: document.getElementById('email').value,
    password: document.getElementById('password').value
  };

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    msg.textContent = data.message;
    msg.style.color = res.ok ? "green" : "red";
    if (res.ok) window.location.href = "donors.html";
  } catch (err) {
    msg.textContent = "Server error";
    msg.style.color = "red";
  }
});
const response = await fetch("http://localhost:3000/api/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: email, password: pwd }),
});

