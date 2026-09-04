// Usamos localStorage para guardar a los usuarios localmente
// Leemos los datos del disco duro del navegador
const datosGuardados = localStorage.getItem('usuarios');

// Mapa de los usuarios
let usuarios;
let idUsuario = 0;

if (datosGuardados) {
    // Lo transformamos de texto plano al formato Map (JSON)
    usuarios = new Map(JSON.parse(datosGuardados));
    // Volvemos al registro común (último usuario registrado)
    idUsuario = usuarios.size;
} else {
    usuarios = new Map();
}

// Ejemplo de entrada:

// usuarios.set(1, [
// "Rodrigo",
// "rodrigo@duoc.cl",
// "jRf9832%.%",
// 962312249,
// [fantasia, ciencia-ficcion]
// ]);


// Elementos del HTML por ID
const inputNombre = document.getElementById('nombre');
const inputCorreo = document.getElementById('correo');
const inputContrasena = document.getElementById('contraseña');
const inputConfirmContrasena = document.getElementById('confirm-contraseña');
const inputTelefono = document.getElementById('telefono');

// Botones de REGISTRAR e INICIAR SESIÓN
const botonRegistro = document.getElementById('registro');
const botonLogin = document.getElementById('login');


function validarCampos() {
    // trim() quita los espacios en los extremos del texto
    let nombreCompleto = inputNombre.value.trim();
    let correo = inputCorreo.value.trim();
    let contrasena = inputContrasena.value.trim();
    let confirmarContrasena = inputConfirmContrasena.value.trim();
    let telefono = inputTelefono.value.trim();

    // Nombre:
    if (nombreCompleto === "") {
        alert("El nombre no puede estar vacío.");
        return false;
    }

    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚäëïöüÄËÏÖÜñÑ\s]+$/;
    if (!regexNombre.test(nombreCompleto)) {
        alert("El nombre solo puede contener letras y espacios.")
        return false;
    }

    if (correo.length > 100) {
        alert("El nombre no puede superar los 100 caracteres.")
        return false;
    }

    // Correo:
    // La 'i' final valida el correo escrito en mayúsculas o minúsculas 
    const regexCorreo = /^[a-zñ]+@duoc\.cl$/i;
    if (!regexCorreo.test(correo)) {
        alert("El correo ingresado no es válido.");
        return false;
    }

    // Determinamos si el correo existe
    let correoExistente = false
    // Estructura del forEach para los mapas: (valor, clave) => {}
    // Usamos solo el valor
    usuarios.forEach((datosUsuario) => {
        // [1] corresponde al correo en el Array
        if (datosUsuario[1] === correo) {
            correoExistente = true;
        }
    })

    // Si existe, se detiene
    if (correoExistente) {
        alert("El correo ya se encuentra registrado. Pruebe con uno diferente.");
        return false;
    }

    if (correo.length > 60) {
        alert("El correo no puede superar los 60 caracteres.")
        return false;
    }

    // Si no existe el correo en el Map ingresar, si existe restringir

    // Contraseña:

    // Explicación del Regex:
    // (?=.*[a-z]) -> al menos una minúscula
    // (?=.*[A-Z]) -> al menos una mayúscula
    // (?=.*\d)    -> al menos un dígito
    // (?=.*[\W_]) -> al menos un carácter especial
    // .{10,}      -> largo mínimo de 10
    const regexContra = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{10,}$/;
    if (!regexContra.test(contrasena)) {
        alert("La contraseña debe tener al menos 10 caracteres, una mayúscula, una minúscula, un número y un caracter especial.");
        return false;
    }

    // Validar la contraseña:
    if (confirmarContrasena !== contrasena) {
        alert("Las contraseñas no coinciden.")
        return false;
    }

    // Teléfono (opcional):
    if (telefono !== "") {
        const regexTelefono = /^\+?[0-9\s]{9,15}$/;
        if (!regexTelefono.test(telefono)) {
            alert("El teléfono ingresado no es válido.");
            return false;
            // +56 9 1234 5678: True
            // +56912345678: True
            // 912345678: True
            // 12345678: False
        }
    }

    // Chechbox de Géneros
    const generosSeleccionados = document.querySelectorAll(
        '.generos input[name = "genero"]:checked'
    );

    // Validación de géneros
    if (generosSeleccionados.length === 0) {
        alert("Debes seleccionar al menos un tipo de género");
        return false;
    }

    return true;
}


if (botonRegistro) {
    botonRegistro.addEventListener('click', (evento) => {
        // Evita que la página se recargue
        evento.preventDefault();


        if (validarCampos()) {
            idUsuario++;

            let listaGeneros = [];
            const generosSeleccionados = document.querySelectorAll(
                '.generos input[name = "genero"]:checked'
            );

            // Para cada checkbox seleccionado, agarrar el id del HTML
            generosSeleccionados.forEach((checkbox) => {
                listaGeneros.push(checkbox.id);
            });

            usuarios.set(idUsuario, [
                inputNombre.value.trim(),
                inputCorreo.value.trim(),
                inputContrasena.value.trim(),
                inputTelefono.value.trim(),
                listaGeneros]);

            // Aquí tansformamos de JSON a texto plano para guardar localmente
            // Array.from hace ese mismo trabajo
            localStorage.setItem('usuarios', JSON.stringify(Array.from(usuarios.entries())));

            console.log(`Usuario registrado con éxito: ${usuarios.get(idUsuario)}`);
            alert("¡Registro exitoso!");

            window.location.href = "Home-logout.html";
        }
    });
}






function validarSesión() {
    let correoIngresado = inputCorreo.value.trim();
    let contrasenaIngresada = inputContrasena.value.trim();
    let usuarioRegistrado = false;

    usuarios.forEach((datosUsuario) => {
        if (datosUsuario[1] === correoIngresado && datosUsuario[2] === contrasenaIngresada) {
            usuarioRegistrado = true;
        }
    })

    if (usuarioRegistrado) {
        alert("¡Bienvenido al sistema!");
        window.location.href = "Home-logout.html";
    } else {
        alert("Usuario o contraseña incorrectos");
    }
}


if (botonLogin) {
    botonLogin.addEventListener('click', (evento) => {
        evento.preventDefault();

        validarSesión();
    });
}