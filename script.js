    import { db } from "./firebase-config.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const result = document.getElementById("result");

// Lista con tu orden específico
const prizes = [
    "Premio 1", "Premio 20", "Premio 10", "Premio 15", "Premio 3", 
    "Premio 18", "Premio 12", "Premio 5", "Premio 2", "Premio 19", 
    "Premio 4", "Premio 17", "Premio 6", "Premio 13", "Premio 7", 
    "Premio 16", "Premio 8", "Premio 14", "Premio 9", "Premio 11"
];

const colors = ["#ff595e", "#ff924c", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93"];
const angle = (2 * Math.PI) / prizes.length;
let isSpinning = false;
let currentRotation = 0;

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(currentRotation);

    const radius = canvas.width / 2;

    prizes.forEach((prize, index) => {
        const start = index * angle;
        const end = start + angle;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, start, end);
        ctx.closePath();
        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();

        ctx.save();
        ctx.rotate(start + angle / 2);
        ctx.fillStyle = "black"; // Texto en negro para que resalte
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.fillText(prize, radius / 2, 5); 
        ctx.restore();
    });
    ctx.restore();
}

function iniciarGiro() {
    result.innerText = "¡Mucha suerte...!";
    const vInicial = Math.random() * 0.4 + 0.3;
    let velocidad = vInicial;
    const desaceleracion = 0.985;

    async function animar() {
        currentRotation += velocidad;
        velocidad *= desaceleracion;
        drawWheel();
        if (velocidad > 0.001) {
            requestAnimationFrame(animar);
        } else {
            isSpinning = false;
            await calcularPremio();
        }
    }
    animar();
}

async function calcularPremio() {
    const ratacionNormalizada = (2 * Math.PI - (currentRotation % (2 * Math.PI))) % (2 * Math.PI);
    const anguloMarcador = (3 * Math.PI / 2) % (2 * Math.PI);
    const anguloPremio = (anguloMarcador + ratacionNormalizada) % (2 * Math.PI);
    let index = Math.floor(anguloPremio / angle);

    // Guardamos el premio visual de la ruleta física
    let premioVisual = prizes[index];

    // Cambiamos el texto en pantalla por un mensaje temporal de carga
    result.innerText = "🔄 Validando tu premio de forma segura...";

    try {
        // Consultamos a tu backend en Vercel
        const respuesta = await fetch('https://ruleta-backend-eight.vercel.app/api/sorteo');
        const datos = await respuesta.json();

        // Mostramos el resultado real que envió el servidor seguro
        result.innerText = `🎉 ¡Ganaste: ${datos.nombreRuleta}! \n Tu código es: ${datos.codigoSecreto}`;

    } catch (error) {
        console.error("Error al obtener el premio seguro:", error);
        result.innerText = "❌ Error al validar el premio. Intenta de nuevo.";
    }
}


spinBtn.addEventListener("click", async () => {
    if (isSpinning) return;
    const inputCodigo = document.getElementById("codigo").value.trim().toUpperCase();
    if (!inputCodigo) { alert("Ingrese un código."); return; }
    
    try {
        const docRef = doc(db, "Tokens", inputCodigo);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().usado === false) {
            await updateDoc(docRef, { usado: true, fechaUso: new Date() });
            isSpinning = true;
            iniciarGiro();
        } else {
            alert("Código inválido o ya utilizado.");
        }
    } catch (e) { alert("Error de conexión."); }
});

drawWheel();
    
