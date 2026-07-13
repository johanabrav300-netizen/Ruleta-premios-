    // --- CONFIGURACIÓN ESTÉTICA ---
const URL_IMAGEN_RULETA = 'ruleta.png';
const URL_IMAGEN_AGUJA = 'aguja.png';

// Lista completa de las 20 porciones que deben coincidir con el diseño de tu imagen circular
const visualPrizes = [
  "PREMIO 1", "PREMIO 2", "PREMIO 3", "PREMIO 4", "PREMIO 5",
  "PREMIO 6", "PREMIO 7", "PREMIO 8", "PREMIO 9", "PREMIO 10",
  "PREMIO 11", "PREMIO 12", "PREMIO 13", "PREMIO 14", "PREMIO 15",
  "PREMIO 16", "PREMIO 17", "PREMIO 18", "PREMIO 19", "PREMIO 20"
];
// --- FIN DE CONFIGURACIÓN ---

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const result = document.getElementById("result");

const angle = (2 * Math.PI) / visualPrizes.length;
let isSpinning = false;
let currentRotation = 0;

const imgRuleta = new Image();
imgRuleta.src = URL_IMAGEN_RULETA;

const imgAguja = new Image();
imgAguja.src = URL_IMAGEN_AGUJA;

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(currentRotation);
    ctx.drawImage(imgRuleta, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    ctx.restore();
    
    const wAguja = canvas.width * 0.15;
    const hAguja = canvas.width * 0.25;
    ctx.drawImage(imgAguja, (canvas.width / 2) - (wAguja / 2), -canvas.height * 0.05, wAguja, hAguja);
}

function iniciarGiro() {
    result.innerText = "✨ ¡Mucha suerte...!";
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

    result.innerText = "🔄 Validando tu premio de forma segura...";

    try {
        const respuesta = await fetch('https://ruleta-backend-eight.vercel.app/api/sorteo');
        const datos = await respuesta.json();

        // Muestra el nombre del premio, el detalle descriptivo y su identificador/código
        result.innerText = `🎉 ¡Ganaste: ${datos.nombreRuleta}!\n🎁 ${datos.detallePremio}\n🔑 Token: ${datos.codigoSecreto}`;

    } catch (error) {
        console.error("Error al obtener el premio seguro:", error);
        result.innerText = "❌ Error al validar el premio. Intenta de nuevo.";
    }
}

spinBtn.addEventListener("click", () => {
    if (isSpinning) return;
    isSpinning = true;
    iniciarGiro();
});

imgRuleta.onload = () => {
    drawWheel();
};
