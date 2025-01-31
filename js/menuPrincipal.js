document.addEventListener("DOMContentLoaded", function() {
    let usuarioLogueado = sessionStorage.getItem("usuarioLogueado");

    if (!usuarioLogueado) {
        alert("No tienes acceso a esta página. Inicia sesión.");
        window.location.href = "/index.html"; // Redirige al login
    } else {
        document.getElementById("btnConsignar").addEventListener("click", () => {
            // Acción cuando se hace clic en "Consignar Dinero"
            console.log("Acción: Consignar dinero");
        });
        
        document.getElementById("btnRetirar").addEventListener("click", () => {
            // Acción cuando se hace clic en "Retirar Dinero"
            console.log("Acción: Retirar dinero");
        });
        
        document.getElementById("btnPagar").addEventListener("click", () => {
            // Acción cuando se hace clic en "Pagar Servicios"
            console.log("Acción: Pagar servicios");
        });
        
        document.getElementById("btnMovimientos").addEventListener("click", () => {
            // Acción cuando se hace clic en "Ver Movimientos"
            console.log("Acción: Ver movimientos");
        });
    }
});