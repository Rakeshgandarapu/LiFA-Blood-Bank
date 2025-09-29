// ✅ Example: Fetch latest donors (limit 5) and show on home page
async function loadRecentDonors() {
  try {
    const token = localStorage.getItem("token"); // from login
    const res = await fetch("/api/donors", {
      headers: { "Authorization": token }
    });

    if (!res.ok) {
      console.log("Not logged in. Showing guest view.");
      return;
    }

    const donors = await res.json();
    const list = document.createElement("ul");
    list.style.listStyle = "none";
    list.style.padding = "0";

    donors.slice(0, 5).forEach(donor => {
      const li = document.createElement("li");
      li.style.padding = "8px 0";
      li.innerHTML = `<strong>${donor.fullName}</strong> (${donor.bloodGroup}) - ${donor.city}`;
      list.appendChild(li);
    });

    const content = document.querySelector(".content");
    const recentSection = document.createElement("div");
    recentSection.innerHTML = "<h2>Recent Donors</h2>";
    recentSection.appendChild(list);

    content.appendChild(recentSection);
  } catch (err) {
    console.error("Error loading donors:", err);
  }
}

// ✅ Example: Handle logout
function logout() {
  localStorage.removeItem("token");
  alert("Logged out successfully!");
  window.location.reload();
}

// Run when page loads
document.addEventListener("DOMContentLoaded", loadRecentDonors);
