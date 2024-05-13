document.getElementById("myForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita que el formulario se envíe automáticamente
    
    // Obtener los valores del formulario
    var nombre = document.getElementById("nombre").value;
    var email = document.getElementById("email").value;
    var empresa = document.getElementById("empresa").value;
    var numero = document.getElementById("numero").value;
    var mensaje = document.getElementById("mensaje").value;
    
    // Aquí puedes validar los datos del formulario si es necesario
    
    // Enviar los datos a Google Sheets utilizando Fetch API
    fetch('https://script.google.com/macros/s/AKfycbzlxIJlhiIHf6q7VOyRFbOenkKT5UJZEis8N3sd1ftsAlVF3j9wm_A6lRZLJkka6CDQ/exec', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre: nombre,
        email: email,
        empresa: empresa,
        numero: numero,
        mensaje: mensaje
      })
    })
    .then(response => {
      // Aquí puedes manejar la respuesta, por ejemplo, mostrar un mensaje de éxito o error
      console.log('¡Datos enviados con éxito!');
    })
    .catch(error => {
      // Manejar cualquier error que pueda ocurrir
      console.error('Error al enviar los datos:', error);
    });
  });
  