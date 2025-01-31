const usuarios = {};
const btnGuardar = document.getElementById("btnRegistro");
const btnIngresar = document.querySelector("#ingresar");
const frmUsuarios = document.querySelector("#frmUsuarios");
initDB ();

btnGuardar.addEventListener("click", () => {
    const frmData = new FormData(frmUsuarios);
    let documento = frmData.get("numeroDocumento");
    let nombre = frmData.get("nombre");
    let clave = frmData.get("clave");

    if (!documento || !nombre || !clave) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    agregarUsuario(documento, nombre, clave, 0, []);
});

function initDB () {
    const openDB = window.indexedDB.open("usuariosRegistrados", 1);

    openDB.onupgradeneeded = (init) => {
        let usuariosDB = init.target.result;

        usuariosDB.onerror = (event) => console.error("Error Cargando la base de datos: ", event.target.error);

        let table = usuariosDB.createObjectStore('usuariosRegistrados', { keyPath: 'id', autoIncrement:true});
        table.createIndex('documento', 'documento', {unique:true})
    };

    openDB.onerror = (event) => console.error("Error abriendo la base de datos!", event.target.error)

    openDB.onsuccess = () => {
        console.log("base de datos abierta")
    }

}

function agregarUsuario(documento, nombre, clave, saldo, movimientos) {
    const openDB = window.indexedDB.open('usuariosRegistrados', 1);
    openDB.onsuccess = () => {
        let usuariosDB = openDB.result;
        const transaction = usuariosDB.transaction(["usuariosRegistrados"], "readwrite");
        const usuariosStore = transaction.objectStore("usuariosRegistrados");

        const nuevoUsuario = {documento,nombre,clave,saldo,movimientos};
        
        const agregarRequest = usuariosStore.add(nuevoUsuario);

        agregarRequest.onerror = (error) => {
            if(error.target.error.name == "ConstraintError") {
                console.log("Error: El número de documento ya está registrado.");
                alert("Este número de documento ya existe. Intenta con otro.");
            } else {
                console.log("Error desconocido.", error.target.error.name);
            }
        };
        agregarRequest.onsuccess = () => {
            const nuevoId = agregarRequest.result;

            alert(`
                ¡Usuario registrado con éxito!

                Número de cuenta (ID): ${nuevoId}
                Número de documento: ${documento}
                Nombre: ${nombre}
                Clave: ${clave}
                Saldo: ${saldo}
            `);
        };
    }
}