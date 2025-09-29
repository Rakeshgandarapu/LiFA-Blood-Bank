document.getElementById('donorForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = document.getElementById('message');

  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirmPassword').value;
  if (password !== confirm) {
    msg.textContent = "❌ Passwords do not match";
    msg.style.color = "red";
    return;
  }

  const healthIssues = Array.from(document.querySelectorAll('#healthGroup input:checked')).map(cb => cb.value);

  const payload = {
    fullName: document.getElementById('fullName').value,
    mobile: document.getElementById('mobile').value,
    email: document.getElementById('email').value,
    password,
    bloodGroup: document.getElementById('bloodGroup').value,
    city: document.getElementById('city').value,
    lastDonated: document.getElementById('lastDonated').value,
    healthIssues
  };

  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    msg.textContent = data.message;
    msg.style.color = res.ok ? "green" : "red";
    if (res.ok) document.getElementById('donorForm').reset();
  } catch (err) {
    msg.textContent = "Server error";
    msg.style.color = "red";
  }
  const token = jwt.sign({ id: donor._id, email: donor.email }, JWT_SECRET, { expiresIn: "1h" });
res.status(201).json({ 
  message: "✅ Donor registered successfully!", 
  token,
  donor: { fullName: donor.fullName, email: donor.email }
});

if (res.ok) {
  msgEl.style.color = 'green';
  msgEl.textContent = data.message;
  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.donor));
    window.location.href = "donors.html"; // auto redirect
  }
  document.getElementById('donorForm').reset();
}


});
