document.getElementById("btnConsignar").addEventListener("click", () => {
    const cantidad = document.getElementById("cantidad").value;
    if (cantidad && !isNaN(cantidad) && cantidad > 0) {
        consignarDinero(parseFloat(cantidad));
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

function consignarDinero(cantidad) {
    const usuario = obtenerUsuarioActual();
    if (usuario) {
        const openDB = window.indexedDB.open('usuariosRegistrados', 1);
        openDB.onsuccess = () => {
            let usuariosDB = openDB.result;
            const transaction = usuariosDB.transaction(["usuariosRegistrados"], "readwrite");
            const usuariosStore = transaction.objectStore("usuariosRegistrados");

            // Crear el objeto del movimiento
            const movimiento = {
                tipo: "Consignación", // Tipo de movimiento
                referencia: new Date().toISOString(), // Referencia (puede ser la fecha y hora)
                descripcion: "Consignación de dinero", // Descripción del movimiento
                valor: +cantidad // Valor del movimiento
            };

            // Agregar el movimiento al array de movimientos del usuario
            usuario.movimientos.push(movimiento);

            // Actualizar el saldo del usuario
            usuario.saldo += cantidad;

            // Guardar el usuario actualizado en la base de datos
            const request = usuariosStore.put(usuario);

            request.onsuccess = () => {
                // Actualizar el usuario en sessionStorage
                sessionStorage.setItem("usuarioLogueado", JSON.stringify(usuario));
                alert(`Dinero consignado correctamente. Nuevo saldo: ${usuario.saldo}`);
            };

            request.onerror = () => {
                alert("Error al actualizar el saldo.");
            };
        };
    }
}