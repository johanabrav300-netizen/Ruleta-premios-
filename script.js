import { db } from "./firebase-config.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ... aquí abajo continúa tu código normal (const canvas = document.getElementById("wheel");, etc.)

const canvas =
document.getElementById("wheel");

const ctx =
canvas.getContext("2d");

const spinBtn =
document.getElementById("spinBtn");

const result =
document.getElementById("result");

const prizes = [
"Premio 1",
"Premio 2",
"Premio 3",
"Premio 4",
"Premio 5",
"Premio 6",
"Premio 7",
"Premio 8",
"Premio 9",
"Premio 10",
"Premio 11",
"Premio 12",
"Premio 13",
"Premio 14",
"Premio 15",
"Premio 16",
"Premio 17",
"Premio 18",
"Premio 19",
"Premio 20"
];

const colors = [
"#ff595e",
"#ff924c",
"#ffca3a",
"#8ac926",
"#1982c4",
"#6a4c93"
];

const angle =
(2*Math.PI)/prizes.length;

function drawWheel(){

      ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(currentRotation);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    
    const center =
    canvas.width/2;

    const radius =
    canvas.width/2;

    prizes.forEach(
    (prize,index)=>{

        const start =
        index*angle;

        const end =
        start+angle;

        ctx.beginPath();

        ctx.moveTo(
        center,
        center
        );

        ctx.arc(
        center,
        center,
        radius,
        start,
        end
        );

        ctx.fillStyle =
        colors[
        index%
        colors.length
        ];

        ctx.fill();

        ctx.save();

        ctx.rotate(start + angle / 2 + currentRotation);
        
        ctx.rotate(
        start+
        angle/2
        );

        ctx.fillStyle =
        "white";

        ctx.font =
        "bold 12px Arial";

        ctx.textAlign =
        "right";

        ctx.fillText(
        prize,
        radius-15,
        5
        );

        ctx.restore();

    });
}

drawWheel();

// Variable para evitar que hagan click mientras la ruleta ya está girando
let isSpinning = false;
let currentRotation = 0;

// Función que maneja la animación física del giro
function iniciarGiro() {
    result.innerText = "¡Mucha suerte...!";
    const vInicial = Math.random() * 0.4 + 0.3;
    let velocidad = vInicial;
    const desaceleracion = 0.985;

    function animar() {
        currentRotation += velocidad; // Incrementa el ángulo de giro global
        velocidad *= desaceleracion;  // Aplica la fricción para frenar

        // Limpiamos y redibujamos la ruleta
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawWheel(); 

        if (velocidad > 0.001) {
            requestAnimationFrame(animar); // Continúa el bucle
        } else {
            isSpinning = false;
            calcularPremio(); // Da el premio al detenerse
        }
    }

    animar(); // Arranca la animación
}


// Función para calcular matemáticamente qué premio cayó
function calcularPremio() {
  const rotacionNormalizada = (2 * Math.PI - (currentRotation % (2 * Math.PI))) % (2 * Math.PI);
  const anguloMarcador = (3 * Math.PI / 2) % (2 * Math.PI);
  let anguloPremio = (anguloMarcador + rotacionNormalizada) % (2 * Math.PI);

  let index = Math.floor(anguloPremio / angle);

  // 🚫 BLOQUEO DE PREMIOS 16, 17 y 18 (Índices 15, 16 y 17)
  if (index === 15 || index === 16 || index === 17) {
    index = 0; // Se cambia silenciosamente al Premio 1
  }

  result.innerText = `🎉 ¡Ganaste: ${prizes[index]}!`;
}

// Evento del botón conectado a Firebase
spinBtn.addEventListener("click", async () => {
  if (isSpinning) return; 

  const inputCodigo = document.getElementById("codigo");
  const codigoIngresado = inputCodigo.value.trim().toUpperCase();

  if (!codigoIngresado) {
    alert("Ingrese un código.");
    return;
  }

  try {
    const docRef = doc(db, "Tokens", codigoIngresado);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const datosCupon = docSnap.data();

      if (datosCupon.usado === false) {
        await updateDoc(docRef, {
          usado: true,
          fechaUso: new Date()
        });

        isSpinning = true;
        iniciarGiro(); 

      } else {
        alert("Este código ya fue utilizado.");
      }
    } else {
      alert("El código ingresado no existe.");
    }
  } catch (error) {
    console.error(error);
    alert("Error al conectar con la base de datos.");
  }
});
