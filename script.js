const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const result = document.getElementById("result");

// Lista completa de las 20 porciones idénticas a tu solicitud
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

// Renderizado nativo de la ruleta igual a la foto
function drawWheel() {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = canvas.width / 2 - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(currentRotation);

    // 1. Dibujar los 20 sectores alternando colores rosa y negro de la imagen
    for (let i = 0; i < numPremios; i++) {
        const startAngle = i * angle;
        const endAngle = startAngle + angle;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.closePath();

        // Colores alternados precisos
        ctx.fillStyle = (i % 2 === 0) ? "#ff69b4" : "#111111";
        ctx.fill();

        // Texto interno de cada porción (ej: "P. 1")
        ctx.save();
        ctx.rotate(startAngle + angle / 2);
        ctx.fillStyle = (i % 2 === 0) ? "#000000" : "#ffffff";
        ctx.font = "bold 18px Montserrat";
        ctx.textAlign = "right";
        ctx.fillText(`P. ${i + 1}`, radius - 25, 6);
        ctx.restore();
    }

    // 2. Anillo de separación negro interno
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.65, 0, 2 * Math.PI);
    ctx.lineWidth = 14;
    ctx.strokeStyle = "#000000";
    ctx.stroke();

    // 3. Centro de la ruleta enteramente Rosa
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.62, 0, 2 * Math.PI);
    ctx.fillStyle = "#ff69b4";
    ctx.fill();

    // 4. Dibujar el Corazón Negro del Centro exacto
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.translate(0, -10); // Centrado estético del corazón
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

function iniciarGiro() {
    result.innerText = "✨ ¡Mucha suerte...!";
    // Fuerza un giro largo y elegante
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
            await calcularPremio();
        }
    }
    animar();
}

async function calcularPremio() {
    // Cálculo de la porción matemática apuntada por el marcador superior (3 * Math.PI / 2)
    const ratacionNormalizada = (2 * Math.PI - (currentRotation % (2 * Math.PI))) % (2 * Math.PI);
    const anguloMarcador = (3 * Math.PI / 2) % (2 * Math.PI);
    const anguloPremio = (anguloMarcador + ratacionNormalizada) % (2 * Math.PI);
    let index = Math.floor(anguloPremio / angle);

    result.innerText = "🔄 Validando tu premio de forma segura...";

    try {
        const respuesta = await fetch('https://ruleta-backend-eight.vercel.app/api/sorteo');
        const datos = await respuesta.json();

        result.innerHTML = `<span style="color:#ff69b4; font-size:20px;">🎉 ¡Ganaste ${datos.nombreRuleta}!</span><br><small style="color:#222">${datos.detallePremio}</small><br><b style="font-size:13px; background:#000; color:#fff; padding:3px 8px; display:inline-block; margin-top:5px; border-radius:4px;">TOKEN: ${datos.codigoSecreto}</b>`;

    } catch (error) {
        console.error("Error backend:", error);
        result.innerText = "❌ Error al validar el premio. Intenta de nuevo.";
    }
}

spinBtn.addEventListener("click", () => {
    if (isSpinning) return;
    isSpinning = true;
    iniciarGiro();
});

// Inicializar render inicial sin requerir archivos pesados
drawWheel();
                                            
