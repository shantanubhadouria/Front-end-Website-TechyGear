document.addEventListener('DOMContentLoaded', function () {
    // Load user info from localStorage or backend
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('name').value = user.name;
        document.getElementById('email').value = user.email;
    }

    document.getElementById('personal-info-form').addEventListener('submit', function (event) {
        event.preventDefault();
        // Update user info
        user.name = document.getElementById('name').value;
        localStorage.setItem('user', JSON.stringify(user));
        alert('Information updated successfully!');
    });
});
