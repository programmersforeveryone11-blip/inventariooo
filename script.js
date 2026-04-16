// CONFIGURACIÓN DE FIREBASE (SIN ESPACIOS)
const firebaseConfig = {
    apiKey: "AIzaSyByut8gy78zjcC0r0DDxwyiwdKU7B8HGoQ", 
    authDomain: "gesstion-inventario.firebaseapp.com",
    projectId: "gesstion-inventario",
    storageBucket: "gesstion-inventario.firebasestorage.app",
    messagingSenderId: "398550130665",
    appId: "1:398550130665:web:b3a77108f500e092ca7578",
    measurementId: "G-RVSMKP85LF"
};

// INICIALIZACIÓN
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

// FUNCIONES
function registrar() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    if(!email || !pass) return alert("Por favor escribe correo y clave");

    auth.createUserWithEmailAndPassword(email, pass)
        .then(() => alert("¡Usuario registrado! Ahora dale a Entrar."))
        .catch(error => alert("Error de Firebase: " + error.message));
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
        .catch(error => alert("Clave o correo incorrectos"));
}

function guardarProducto() {
    const nombre = document.getElementById('prod-nombre').value;
    const cantidad = document.getElementById('prod-cantidad').value;

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
    db.collection("inventarios").where("usuario", "==", auth.currentUser.uid)
        .onSnapshot((snapshot) => {
            lista.innerHTML = "";
            snapshot.forEach((doc) => {
                const p = doc.data();
                lista.innerHTML += `<tr><td>${p.nombre}</td><td>${p.cantidad}</td></tr>`;
            });
        });
}
