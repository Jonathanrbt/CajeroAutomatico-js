document.addEventListener("DOMContentLoaded", () => {
    verMovimientos();
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

function verMovimientos() {
    const usuario = obtenerUsuarioActual();
    const movimientosContainer = document.getElementById("movimientos");

    if (usuario && usuario.movimientos.length > 0) {
        const movimientosList = usuario.movimientos.map(mov => {
            return `<p><h3>${mov.tipo}</h3> <br>
                    Referencia: ${mov.referencia} <br>
                    Descripcion: ${mov.descripcion} <br>
                    Valor: ${mov.valor}</p>`;
        }).join("");
        movimientosContainer.innerHTML = movimientosList;
    } else {
        movimientosContainer.innerHTML = "<p>No hay movimientos registrados.</p>";
    }
}
