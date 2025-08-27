document.addEventListener("DOMContentLoaded", function () {
    const sections = {
        dashboard: "Welcome to the admin dashboard!",
        users: "Manage your users here.",
        settings: "Adjust your system settings here."
    };

    function showSection(section) {
        const contentDiv = document.getElementById("content");
        if (contentDiv) {
            contentDiv.innerHTML = `<h2>${section.charAt(0).toUpperCase() + section.slice(1)}</h2><p>${sections[section]}</p>`;
        }
    }

    function addClickListener(id, section) {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener("click", function () {
                showSection(section);
            });
        } else {
            console.error(`Element with ID '${id}' not found.`);
        }
    }

    addClickListener("dashboardBtn", "dashboard");
    addClickListener("usersBtn", "users");
    addClickListener("settingsBtn", "settings");

    // Initialize with the dashboard section
    showSection("dashboard");
});
