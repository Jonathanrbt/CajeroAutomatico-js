document.getElementById("btnRetirar").addEventListener("click", () => {
    const cantidad = document.getElementById("cantidad").value;
    if (cantidad && !isNaN(cantidad) && cantidad > 0) {
        retirarDinero(parseFloat(cantidad));
    } else {
        alert("Por favor ingrese un valor válido.");
    }
});

function obtenerUsuarioActual() {
    const usuarioLogueado = sessionStorage.getItem("usuarioLogueado");
    if (usuarioLogueado) {
        return JSON.parse(usuarioLogueado); // Convierte el string JSON a un objeto
    } else {
        alert("No hay ningún usuario logueado.");
        return null;
    }
}

function retirarDinero(cantidad) {
    const usuario = obtenerUsuarioActual();
    if (usuario && usuario.saldo >= cantidad) {
        const openDB = window.indexedDB.open('usuariosRegistrados', 1);
        openDB.onsuccess = () => {
            let usuariosDB = openDB.result;
            const transaction = usuariosDB.transaction(["usuariosRegistrados"], "readwrite");
            const usuariosStore = transaction.objectStore("usuariosRegistrados");

            // Crear el objeto del movimiento
            const movimiento = {
                tipo: "Retiro", // Tipo de movimiento
                referencia: new Date().toISOString(), // Referencia (puede ser la fecha y hora)
                descripcion: "Retiro de dinero", // Descripción del movimiento
                valor: -cantidad // Valor del movimiento (negativo porque es un retiro)
            };

            // Asegurarse de que el array movimientos exista
            if (!usuario.movimientos) {
                usuario.movimientos = [];
            }

            // Agregar el movimiento al array de movimientos del usuario
            usuario.movimientos.push(movimiento);

            // Actualizar el saldo del usuario
            usuario.saldo -= cantidad;

            // Guardar el usuario actualizado en la base de datos
            const request = usuariosStore.put(usuario);

            request.onsuccess = () => {
                // Actualizar el usuario en sessionStorage
                sessionStorage.setItem("usuarioLogueado", JSON.stringify(usuario));
                alert(`Retiro exitoso. Saldo restante: ${usuario.saldo}`);
            };

            request.onerror = () => {
                alert("Error al actualizar el saldo.");
            };
        };
    } else {
        alert("Saldo insuficiente para realizar el retiro.");
    }
}
