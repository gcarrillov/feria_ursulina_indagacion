import {
    db,
    collection,
    getDocs,
    addDoc
} from "./firebase.js";
let chartHoras = null;
let chartDispositivos = null;
let chartApps = null;
let chartEdad = null;

/* ==========================
CALCULAR PUNTAJE
========================== */



function calcularPuntaje() {

    let puntaje = 0;

    const estrella =
        document.getElementById("estrella").value;

    const animal =
        document.getElementById("animal").value;

    const color =
        document.getElementById("color").value;

    if (estrella === "2") {
        puntaje += 33;
    }

    if (animal === "Gato") {
        puntaje += 33;
    }

    if (color === "Azul") {
        puntaje += 34;
    }

    return puntaje;
}

/* ==========================
GUARDAR RESPUESTA
========================== */

async function guardarRespuesta() {

    try {

        const puntaje =
            calcularPuntaje();

        const datos = {

            edad:
                document.getElementById("edad").value,

            horas:
                document.getElementById("horas").value,

            dispositivo:
                document.getElementById("dispositivo").value,

            app:
                document.getElementById("app").value,

            doomscroll:
                document.getElementById("doomscroll").value,

            estrella:
                document.getElementById("estrella").value,

            animal:
                document.getElementById("animal").value,

            color:
                document.getElementById("color").value,

            dificultad:
                document.getElementById("dificultad").value,

            puntaje: puntaje,

            fecha:
                new Date().toISOString()
        };

        await addDoc(
            collection(db, "responses"),
            datos
        );
        await actualizarDashboard();

        document
            .getElementById("puntajeTexto")
            .textContent =
            `Tu puntaje fue: ${puntaje}/100`;

        alert(
            "Respuestas guardadas correctamente"
        );

        console.log(datos);

    }
    catch(error){

        console.error(error);

        alert(
            "Error al guardar respuestas"
        );

    }

}

/* ==========================
EVENTO BOTON
========================== */

document
.getElementById("btnEnviar")
.addEventListener(
    "click",
    guardarRespuesta
);

/* ==========================
   DASHBOARD
========================== */

async function actualizarDashboard() {

    try {

        const querySnapshot =
            await getDocs(
                collection(db, "responses")
            );

        let total = 0;

        let sumaPuntajes = 0;

        let dispositivos = {};

        let aplicaciones = {};
        
        let horas = {};

        let edades = {};

        querySnapshot.forEach((doc) => {

            total++;

            const data = doc.data();

            sumaPuntajes +=
                data.puntaje || 0;

            const dispositivo =
                data.dispositivo;

            const app =
                data.app;

            const horasPantalla =
                data.horas;

            const edad =
                data.edad;

            dispositivos[dispositivo] =
                (dispositivos[dispositivo] || 0) + 1;

            aplicaciones[app] =
                (aplicaciones[app] || 0) + 1;
            
                horas[horasPantalla] =
                (horas[horasPantalla] || 0) + 1;

            if(!edades[edad]){

                edades[edad] = {
                    suma: 0,
                    cantidad: 0
                };

            }

            edades[edad].suma +=
                data.puntaje || 0;

            edades[edad].cantidad++;

        });

        const edadPromedios = {};

        for(const edad in edades){

            edadPromedios[edad] = (
                edades[edad].suma /
                edades[edad].cantidad
            ).toFixed(1);

        }
        
        const promedio =
            total > 0
            ? (sumaPuntajes / total).toFixed(1)
            : 0;

        const dispositivoMasUsado =
            Object.keys(dispositivos)
            .reduce((a,b)=>
                dispositivos[a] > dispositivos[b]
                ? a : b
            );

        const appMasUsada =
            Object.keys(aplicaciones)
            .reduce((a,b)=>
                aplicaciones[a] > aplicaciones[b]
                ? a : b
            );

        document
        .getElementById("estadisticas")
        .innerHTML = `
            <p><strong>Participantes: </strong> ${total}</p>

            <p><strong>Puntaje promedio: </strong> ${promedio}</p>

            <p><strong>Dispositivo más usado: </strong>
            ${dispositivoMasUsado}</p>

            <p><strong>Aplicación más usada: </strong>
            ${appMasUsada}</p>
        `;
        crearGraficos(
            horas,
            dispositivos,
            aplicaciones,
            edadPromedios
        );

    }
    catch(error){

        console.error(error);

    }

}
/* ==========================
   CONTROL DE VIDEO
========================== */

const video =
    document.getElementById(
        "videoAtencion"
    );

video.addEventListener(
    "ended",
    () => {

        document
        .getElementById("test")
        .style.display = "block";

        document
        .getElementById("btnEnviar")
        .disabled = false;

        alert(
            "¡Muy bien! Ya puedes responder las preguntas del video y enviar tu encuesta."
        );

    }
);

function crearGraficos(
    horasData,
    dispositivosData,
    appsData,
    edadPromedios
){

    // Destruir gráficos anteriores

    if(chartHoras) chartHoras.destroy();
    if(chartDispositivos) chartDispositivos.destroy();
    if(chartApps) chartApps.destroy();
    if(chartEdad) chartEdad.destroy();

    /* HORAS */

    chartHoras = new Chart(
        document.getElementById("graficoHoras"),
        {
            type: "bar",
            data: {
                labels: Object.keys(horasData),
                datasets: [{
                    label: "Horas de pantalla",
                    data: Object.values(horasData)
                }]
            }
        }
    );

    /* DISPOSITIVOS */

    chartDispositivos = new Chart(
        document.getElementById("graficoDispositivos"),
        {
            type: "pie",
            data: {
                labels: Object.keys(dispositivosData),
                datasets: [{
                    data: Object.values(dispositivosData)
                }]
            }
        }
    );

    /* APPS */

    chartApps = new Chart(
        document.getElementById("graficoApps"),
        {
            type: "pie",
            data: {
                labels: Object.keys(appsData),
                datasets: [{
                    data: Object.values(appsData)
                }]
            }
        }
    );

    /* EDAD VS PUNTAJE */

    chartEdad = new Chart(
        document.getElementById("graficoEdad"),
        {
            type: "bar",
            data: {
                labels: Object.keys(edadPromedios),
                datasets: [{
                    label: "Puntaje promedio",
                    data: Object.values(edadPromedios)
                }]
            }
        }
    );

}

actualizarDashboard();