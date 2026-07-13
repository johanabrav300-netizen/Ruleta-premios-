// --- CONFIGURACIÓN ESTÉTICA ---
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const result = document.getElementById("result");

// Lista completa de las 20 porciones que coinciden con tu diseño
const visualPrizes = [
  "PREMIO 1", "PREMIO 2", "PREMIO 3", "PREMIO 4", "PREMIO 5",
  "PREMIO 6", "PREMIO 7", "PREMIO 8", "PREMIO 9", "PREMIO 10",
  "PREMIO 11", "PREMIO 12", "PREMIO 13", "PREMIO 14", "PREMIO 15",
  "PREMIO 16", "PREMIO 17", "PREMIO 18", "PREMIO 19", "PREMIO 20"
];

const numPremios = visualPrizes.length;
const angle = (2 * Math.PI) / numPremios;
let isSpinning = false;
let currentRotation = 0;

// Renderizado nativo de la ruleta igual a la foto (Rosa y Negro)
function drawWheel() {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = canvas.width / 2 - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(currentRotation);

    for (let i = 0; i < numPremios; i++) {
        const startAngle = i * angle;
        const endAngle = startAngle + angle;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.closePath();

        ctx.fillStyle = (i % 2 === 0) ? "#ff69b4" : "#111111";
        ctx.fill();

        ctx.save();
        ctx.rotate(startAngle + angle / 2);
        ctx.fillStyle = (i % 2 === 0) ? "#000000" : "#ffffff";
        ctx.font = "bold 18px Montserrat";
        ctx.textAlign = "right";
        ctx.fillText(`P. ${i + 1}`, radius - 25, 6);
        ctx.restore();
    }

    // Anillo de separación negro interno
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.65, 0, 2 * Math.PI);
    ctx.lineWidth = 14;
    ctx.strokeStyle = "#000000";
    ctx.stroke();

    // Centro de la ruleta enteramente Rosa
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.62, 0, 2 * Math.PI);
    ctx.fillStyle = "#ff69b4";
    ctx.fill();

    // Corazón Negro del Centro exacto
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.translate(0, -10);
    const d = 90;
    ctx.beginPath();
    ctx.moveTo(0, 0 + d / 4);
    ctx.bezierCurveTo(0, 0, -d / 2, 0, -d / 2, 0 + d / 4);
    ctx.bezierCurveTo(-d / 2, 0 + (d * 2) / 3, 0, 0 + d, 0, 0 + d);
    ctx.bezierCurveTo(0, 0 + d, d / 2, 0 + (d * 2) / 3, d / 2, 0 + d / 4);
    ctx.bezierCurveTo(d / 2, 0, 0, 0, 0, 0 + d / 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.restore();
}

// Función física de la animación
function iniciarGiro() {
    result.innerText = "✨ ¡Mucha suerte...!";
    const vInicial = Math.random() * 0.3 + 0.4; 
    let velocidad = vInicial;
    const desaceleracion = 0.988;

    async function animar() {
        currentRotation += velocidad;
        velocidad *= desaceleracion;
        drawWheel();

        if (velocidad > 0.001) {
            requestAnimationFrame(animar);
        } else {
            isSpinning = false;
            await obtenerPremioDelServidor();
        }
    }
    animar();
}

// Lógica de validación del Token e inicio
spinBtn.addEventListener("click", async () => {
    if (isSpinning) return;

    // Tomamos el código que el cliente escribió en el input de la pantalla
    const inputCodigo = document.getElementById("tokenInput").value.trim().toUpperCase();
    
    if (!inputCodigo) {
        alert("Por favor, ingrese un código válido para jugar.");
        return;
    }

    result.innerText = "🔍 Validando tu código de acceso...";

    try {
        // Consultamos a tu Vercel si este token es válido y no ha sido usado
        const respuesta = await fetch('https://ruleta-backend-eight.vercel.app/api/sorteo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: inputCodigo })
        });

        const datos = await respuesta.json();

        if (respuesta.status === 200) {
            // Guardamos temporalmente el premio en una variable global oculta para mostrarlo al frenar
            window.premioGanadoSeguro = datos;
            isSpinning = true;
            iniciarGiro();
        } else {
            result.innerText = `❌ ${datos.error || "Código inválido o ya utilizado."}`;
        }

    } catch (e) {
        console.error(e);
        result.innerText = "❌ Error de conexión al validar. Intenta nuevamente.";
    }
});

// Muestra el premio final una vez que la ruleta se detiene por completo
async function obtenerPremioDelServidor() {
    const datos = window.premioGanadoSeguro;
    if (datos) {
        result.innerHTML = `
            <span style="color:#ff69b4; font-size:20px;">🎉 ¡Ganaste ${datos.nombreRuleta}!</span><br>
            <small style="color:#222">${datos.detallePremio}</small><br>
            <b style="font-size:13px; background:#000; color:#fff; padding:3px 8px; display:inline-block; margin-top:5px; border-radius:4px;">CÓDIGO DE RECLAMO: ${datos.codigoSecreto}</b>
        `;
    }
}

// Dibujo inicial de la ruleta
drawWheel();
          
