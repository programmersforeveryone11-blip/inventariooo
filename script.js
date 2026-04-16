// 1. CONFIGURACIÓN (ESPACIO ELIMINADO)
const firebaseConfig = {
    apiKey: "AIzaSyByut8gy78zjcC0r0DDxwyiwdKU7B8HGoQ",
    authDomain: "gesstion-inventario.firebaseapp.com",
    projectId: "gesstion-inventario",
    storageBucket: "gesstion-inventario.firebasestorage.app",
    messagingSenderId: "398550130665",
    appId: "1:398550130665:web:b3a77108f500e092ca7578",
    measurementId: "G-RVSMKP85LF"
};

// 2. INICIALIZACIÓN
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

// 3. FUNCIONES DE ACCESO
function registrar() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    if (!email || !pass) return alert("Llena los campos");

    auth.createUserWithEmailAndPassword(email, pass)
        .then(() => alert("¡Cuenta creada! Haz clic en Entrar."))
        .catch(error => alert("Error: " + error.message));
}

function login() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, pass)
        .then(() => {
            document.getElementById('auth-section').style.display = 'none';
            document.getElementById('inventory-section').style.display = 'block';
            cargarProductos();
        })
        .catch(error => alert("Error al entrar: " + error.message));
}

function logout() {
    auth.signOut().then(() => location.reload());
}

// 4. FUNCIONES DE INVENTARIO
function guardarProducto() {
    const nombre = document.getElementById('prod-nombre').value;
    const cantidad = document.getElementById('prod-cantidad').value;

    if (!nombre || !cantidad) return alert("Faltan datos");

    db.collection("inventarios").add({
        usuario: auth.currentUser.uid,
        nombre: nombre,
        cantidad: parseInt(cantidad)
    }).then(() => {
        document.getElementById('prod-nombre').value = "";
        document.getElementById('prod-cantidad').value = "";
    });
}

function cargarProductos() {
    const lista = document.getElementById('lista-productos');
    db.collection("inventarios")
        .where("usuario", "==", auth.currentUser.uid)
        .onSnapshot((snapshot) => {
            lista.innerHTML = "";
            snapshot.forEach((doc) => {
                const p = doc.data();
                lista.innerHTML += `
                    <tr>
                        <td><strong>${p.nombre}</strong></td>
                        <td>${p.cantidad} unidades</td>
                        <td>
                            <button onclick="eliminar('${doc.id}')" style="background:#e74c3c; color:white; border:none; padding:5px; border-radius:4px; cursor:pointer;">
                                Borrar
                            </button>
                        </td>
                    </tr>`;
            });
        });
}

function eliminar(id) {
    if (confirm("¿Borrar producto?")) {
        db.collection("inventarios").doc(id).delete();
    }
}