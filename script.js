let numMes = 0;
let click = null;
let eventos = localStorage.getItem('eventos') ? JSON.parse(localStorage.getItem('eventos')) : [];
let notas = localStorage.getItem('notas') ? JSON.parse(localStorage.getItem('notas')) : [];

const visualizarMes = document.getElementById('visualizar-mes');
const diasEntreSemana = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const entradaDeTituloEvento = document.getElementById('c-input-nombre-evento');
const horaInicio = document.getElementById('c-hora-inicio');
const horaFinal = document.getElementById('c-hora-final');
const duracion = document.getElementById('c-duracion');
const descripcion = document.getElementById('c-descripcion');

const nuevoEventoAbierto = document.getElementById('nuevo-evento-abierto');
const eliminarEventoAbierto = document.getElementById('eliminar-evento-abierto');

const nuevaNota = document.getElementById('add-note');

const oscurecer = document.getElementById('oscurecer-fondo');

function abrirVentana(date){
    click = date;

    const eventoParaDia = eventos.find(e => e.date === click);

    if (eventoParaDia) {
        document.getElementById('texto-evento').innerText = eventoParaDia.title;
        document.getElementById('e-hora-final').value = eventoParaDia.horaInicio;
        document.getElementById('e-hora-final').value = eventoParaDia.horaFinal;
        document.getElementById('e-descripcion').textContent = eventoParaDia.descripcion;

        eliminarEventoAbierto.style.display = 'flex'
        nuevoEventoAbierto.style.display = 'none';
    }else{
        nuevoEventoAbierto.style.display = 'flex';
        eliminarEventoAbierto.style.display = 'none';
    }
    oscurecer.style.display = 'block';
}

function cargar(){
    const fecha = new Date();

    if (numMes !== 0) {
        fecha.setMonth(new Date().getMonth() + numMes);
    };
    
    const dia = fecha.getDate();
    const mes = fecha.getMonth();
    const año = fecha.getFullYear();

    const primerDiaDelMes = new Date(año, mes, 1);
    const diasDelMes = new Date(año, mes + 1 , 0).getDate();

    const fechaString = primerDiaDelMes.toLocaleDateString('en-us',{
        weekday:'long',
        year: 'numeric',
        month:'numeric',
        day:'numeric',
    });

    const espacioParaDias = diasEntreSemana.indexOf(fechaString.split(', ')[0]);

//Mes    
    document.getElementById('fecha').innerText =`  
        ${fecha.toLocaleDateString('es-CR', { month: 'long' }).charAt(0).toUpperCase() + fecha.toLocaleDateString('es-CR', { month: 'long' }).slice(1)} ${año}`;

//Día
//    document.getElementById('fecha').innerText =`
//        ${fecha.toLocaleDateString('es-CR', { weekday: 'long' }).charAt(0).toUpperCase() + fecha.toLocaleDateString('es-CR', { weekday: 'long' }).slice(1)}  ${dia} ${fecha.toLocaleDateString('es-CR', { month: 'long' }).charAt(0).toUpperCase() + fecha.toLocaleDateString('es-CR', { month: 'long' }).slice(1)} ${año}`;

    visualizarMes.innerHTML = '';   

    for (let i = 1; i <= espacioParaDias + diasDelMes; i++){
        const cuadradoParaDia = document.createElement('div');
        cuadradoParaDia.classList.add('cuadrado-para-dia');

        const diastring = `${i - espacioParaDias}/${mes + 1}/${año}`;

        if(i > espacioParaDias){
            cuadradoParaDia.innerText = i - espacioParaDias;

            const eventoParaDia = eventos.find(e => e.date === diastring);
            
               if(eventoParaDia){
                    const burbujaEventoMes = document.createElement('p');
                    burbujaEventoMes.classList.add('burbuja-evento-mes');
                    burbujaEventoMes.innerText = eventoParaDia.title;
                    cuadradoParaDia.appendChild(burbujaEventoMes);
                }
            
            cuadradoParaDia.addEventListener('click', () => abrirVentana(diastring));
        }else{
            cuadradoParaDia.classList.add('espacio');
        }

        visualizarMes.appendChild(cuadradoParaDia);
    }
}
function cerrarVentana(){

    entradaDeTituloEvento.classList.remove('error')
    nuevoEventoAbierto.style.display = 'none';
    eliminarEventoAbierto.style.display = 'none'
    oscurecer.style.display = 'none';
    entradaDeTituloEvento.value = ''; 
    horaInicio.value = '';
    horaFinal.value = '';

    click = null;
    cargar();
}
document.getElementById('oscurecer-fondo').addEventListener('click', () => cerrarVentana())

function guardarEvento(){
    if (entradaDeTituloEvento.value){
       entradaDeTituloEvento.classList.remove('error')

       eventos.push({
            date: click,
            title: entradaDeTituloEvento.title,
            horaInicio: horaInicio.value,
            horaFinal: horaFinal.value,
            duracion: duracion.value,
            descripcion: descripcion.value,
        });

        localStorage.setItem('eventos', JSON.stringify(eventos));
        cerrarVentana();
    } else {
        entradaDeTituloEvento.classList.add('error');
    }
}
function eliminarEvento(){
    eventos = eventos.filter(e => e.date !== click);
    localStorage.setItem('eventos', JSON.stringify(eventos));
    cerrarVentana();
}

function calculoDuracion(){
    
    let inicio = horaInicio.value;
    let final = horaFinal.value;

    
    if (!inicio || !final) return;

    let valorHoraInicio = new Date(`1970-01-01T${inicio}:00`);
    let valorHoraFinal = new Date(`1970-01-01T${final}:00`);
    
    if (valorHoraFinal < valorHoraInicio) {
        valorHoraFinal.setHours(valorHoraFinal.getHours() + 24);
    }

    const resultado = valorHoraFinal - valorHoraInicio; 

    if (resultado < 0){
        resultado += 24 * 60 * 60 * 1000;
    }

    let horas = Math.floor(resultado/ (1000 * 60 * 60));
    let minutos = Math.floor((resultado % (1000 * 60 * 60)) / (1000 * 60));

    duracion.textContent = `${horas} h ${minutos} min`;
}

horaInicio.addEventListener('input', calculoDuracion);
horaFinal.addEventListener('input', calculoDuracion);

function botones() {
    document.getElementById('avanzar').addEventListener('click',() => {
        numMes++;
        cargar();
    });

    document.getElementById('retroceder').addEventListener('click',() => {
        numMes--;
        cargar();
    });

    document.getElementById('add-event').addEventListener('click',abrirVentana);


    document.getElementById('boton-guardar').addEventListener('click',guardarEvento);
    document.getElementById('boton-cancelar').addEventListener('click', cerrarVentana);
    document.getElementById('boton-eliminar').addEventListener('click',eliminarEvento);
    document.getElementById('boton-cerrar').addEventListener('click', cerrarVentana);
}


botones();
cargar();