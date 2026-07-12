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

        ctx.translate(
        center,
        center
        );

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

let played = false;

spinBtn.addEventListener(
"click",
()=>{

    if(played){

        alert(
        "Ya utilizaste tu giro."
        );

        return;
    }

    const codigo =
    document
    .getElementById(
    "codigo"
    )
    .value
    .trim();

    if(!codigo){

        alert(
        "Ingrese un código."
        );

        return;
    }

    played = true;

    const available = prizes.filter(
    p =>
    p !== "Premio 16" &&
    p !== "Premio 17" &&
    p !== "Premio 18"
    );

    const winner =
    available[
    Math.floor(
    Math.random()*
    available.length
    )
    ];

    const winnerIndex =
    prizes.indexOf(
    winner
    );

    const degrees =
    (360/prizes.length)
    *
    winnerIndex;

    const rotation =
    3600 +
    (360-degrees);

    canvas.style.transition =
    "transform 6s ease-out";

    canvas.style.transform =
    `rotate(${rotation}deg)`;

    setTimeout(()=>{

        result.textContent =
        "🎉 Ganaste: "
        + winner;

    },6000);

});
