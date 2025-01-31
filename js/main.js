
document.getElementById("frmIngreso").addEventListener("submit", function(event) {
    event.preventDefault();
    let id = parseInt(document.getElementById("noCuentaLogin").value);
    let clave = document.getElementById("claveLogin").value;
    validarUsuario(id, clave);
});

function validarUsuario(id, clave) {
    const openDB = window.indexedDB.open("usuariosRegistrados", 1);

    openDB.onsuccess = () => {
        let usuariosDB = openDB.result;
        const transaction = usuariosDB.transaction(["usuariosRegistrados"], "readonly");
        const usuariosStore = transaction.objectStore("usuariosRegistrados");

        const request = usuariosStore.get(id);

        request.onsuccess = () => {
            let usuario = request.result;

            if (usuario) {
                if (usuario.clave === clave) {
                    alert("Inicio de sesión exitoso");
                    sessionStorage.setItem("usuarioLogueado", JSON.stringify(usuario)); 
                    window.location.href = "/pages/menuPrincipal.html"; // Redirige a la página exclusiva
                } else {
                    alert("Clave incorrecta");
                }
            } else {
                alert("No existe una cuenta con ese ID");
            }
        };
    };

    openDB.onerror = () => {
        console.error("Error al abrir la base de datos.");
    };
}