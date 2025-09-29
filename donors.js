async function loadDonors() {
  try {
    const res = await fetch('/api/donors');
    const donors = await res.json();
    const tbody = document.querySelector('#donorsTable tbody');
    tbody.innerHTML = '';
    if (!donors.length) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center">No donors found</td></tr>';
      return;
    }
    donors.forEach(d => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${d.fullName}</td>
        <td>${d.bloodGroup}</td>
        <td>${d.city}</td>
        <td>${d.mobile}</td>
        <td>${d.email}</td>
        <td>${d.lastDonated}</td>
        <td>${d.healthIssues?.join(', ') || 'None'}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Error loading donors:', err);
  }
}

document.getElementById('refresh').addEventListener('click', loadDonors);
loadDonors();
