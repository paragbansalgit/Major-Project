// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()



function toggleComment(id) {
    const comment = document.getElementById(`comment-${id}`);
    comment.classList.toggle('expanded');
}

document.addEventListener("DOMContentLoaded", function () {
  const alertElement = document.getElementById("autoDismissAlert");
  console.log("Alert found:", alertElement); // Debug line
  if (alertElement) {
    setTimeout(function () {
      const alertInstance = bootstrap.Alert.getOrCreateInstance(alertElement);
      alertInstance.close();
    }, 5000);
  }
});

