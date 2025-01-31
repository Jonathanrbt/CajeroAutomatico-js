document.getElementById("btnPagar").addEventListener("click", () => {
    const servicio = document.getElementById("servicio").value;
    const referencia = document.getElementById("referencia").value;
    const monto = document.getElementById("valorPago").value

    if (servicio && referencia) {
        pagarServicio(servicio, referencia, monto);
    } else {
        alert("Debe ingresar todos los datos.");
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

function pagarServicio(servicio, referencia, monto) {
    const usuario = obtenerUsuarioActual();

    if (usuario && usuario.saldo >= monto) {
        const openDB = window.indexedDB.open('usuariosRegistrados', 1);
        openDB.onsuccess = () => {
            let usuariosDB = openDB.result;
            const transaction = usuariosDB.transaction(["usuariosRegistrados"], "readwrite");
            const usuariosStore = transaction.objectStore("usuariosRegistrados");

            // Asegurarse de que el array movimientos exista
            if (!usuario.movimientos) {
                usuario.movimientos = [];
            }

            // Crear el objeto del movimiento
            const movimiento = {
                tipo: "Pago de servicio", // Tipo de movimiento
                referencia: referencia, // Nombre del servicio (por ejemplo, "Agua", "Luz", etc.)
                descripcion: `El usuario pagó el recibo de ${servicio}`, // Referencia ingresada por el usuario
                valor: -monto, // Monto del pago (negativo porque es un gasto)
            };

            // Agregar el movimiento al array de movimientos del usuario
            usuario.movimientos.push(movimiento);

            // Actualizar el saldo del usuario
            usuario.saldo -= monto;

            // Guardar el usuario actualizado en la base de datos
            const request = usuariosStore.put(usuario);

            request.onsuccess = () => {
                // Actualizar el usuario en sessionStorage
                sessionStorage.setItem("usuarioLogueado", JSON.stringify(usuario));
                alert(`Pago de ${servicio} realizado. Nuevo saldo: ${usuario.saldo}`);
            };

            request.onerror = () => {
                alert("Error al actualizar el saldo.");
            };
        };
    } else {
        alert("Saldo insuficiente para realizar el pago.");
    }
}
