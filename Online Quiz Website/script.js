document.getElementById('roleSwitch').addEventListener('change', function() {
    var roleLabel = document.getElementById('roleLabel');
    var roleInput = document.getElementById('roleValue');
    roleLabel.textContent = this.checked ? 'Teacher' : 'Student';
    roleInput.value = this.checked ? 'teacher' : 'student';
});
