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

const nuevaNota = document.getElementById('nueva-nota-abierta');
const tituloNota = document.getElementById('titulo-nota');
const contenidoNota = document.getElementById('contenido-nota')


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

        const diasString = `${i - espacioParaDias}/${mes + 1}/${año}`;
        const notaParaDia = notas.find(n => n.date === diasString);

        if(i > espacioParaDias){
            cuadradoParaDia.innerText = i - espacioParaDias;

            const eventoParaDia = eventos.find(e => e.date === diasString);
            
               if(eventoParaDia){
                    const burbujaEventoMes = document.createElement('p');
                    burbujaEventoMes.classList.add('burbuja-evento-mes');
                    burbujaEventoMes.innerText = eventoParaDia.title;
                    cuadradoParaDia.appendChild(burbujaEventoMes);
                }
                if(notaParaDia){
                    const burbujaNota = document.createElement('p');
                    burbujaNota.classList.add('burbuja-nota');
                    burbujaNota.innerText = notaParaDia.title;
                    cuadradoParaDia.appendChild(burbujaNota);
                }
            
            cuadradoParaDia.addEventListener('click', () => abrirVentana(diasString));
        }else{
            cuadradoParaDia.classList.add('espacio');
        }

        visualizarMes.appendChild(cuadradoParaDia);
    }

    document.getElementById('add-event').addEventListener('click', () => abrirVentana(diasString));
    cargarNotas();
}
function cerrarVentana(){

    entradaDeTituloEvento.classList.remove('error');
    nuevoEventoAbierto.style.display = 'none';
    eliminarEventoAbierto.style.display = 'none';
    oscurecer.style.display = 'none';
    entradaDeTituloEvento.value = ''; 
    horaInicio.value = '';
    horaFinal.value = '';

    nuevaNota.style.display = 'none';

    click = null;
    cargar();
}
document.getElementById('oscurecer-fondo').addEventListener('click', () => cerrarVentana())


function guardarEvento(){
    if (entradaDeTituloEvento.value){
       entradaDeTituloEvento.classList.remove('error')

       eventos.push({
            date: click,
            title: entradaDeTituloEvento.value,
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


function crearNota(id) {
    const nota = notas.find(n => n.id === id);

    if (nota) {
        tituloNota.value = nota.title;
        contenidoNota.value = nota.content;
    } else {
        tituloNota.value = '';
        contenidoNota.value = '';
    }
    oscurecer.style.display = 'block';
    nuevaNota.style.display = 'flex';
}

function guardarNota() {
    const titulo = tituloNota.value;
    const contenido = contenidoNota.value;

    if (titulo && contenido) {
        notas.push({
            id: `nota-${Date.now()}`,
            title: titulo,
            content: contenido,
        });

        localStorage.setItem('notas', JSON.stringify(notas));
        cerrarVentana();
    } else {
        nuevaNota.classList.add('error');
    }
}

function guardarCambiosNota(id) {
    const tituloInput = document.getElementById('editar-titulo-nota');
    const contenidoTextarea = document.getElementById('editar-contenido-nota');

    const titulo = tituloInput.value;
    const contenido = contenidoTextarea.value;

    if (titulo && contenido) {
        const notaParaEditar = notas.find(n => n.id === id);

        if (notaParaEditar) {
            notaParaEditar.title = titulo;
            notaParaEditar.content = contenido;
            localStorage.setItem('notas', JSON.stringify(notas));
        }
        cargarNotas(); 
    } else {
        alert('Por favor, completa tanto el título como el contenido.');
    }
}

function eliminarNota(id) {
    notas = notas.filter(n => n.id !== id);
    localStorage.setItem('notas', JSON.stringify(notas));
    cargarNotas();
}

function cargarNotas() {
    const listaNotas = document.getElementById('lista-notas');
    listaNotas.innerHTML = ''; 

    notas.forEach(nota => {
        const divNota = document.createElement('div');
        divNota.classList.add('nota');
        divNota.setAttribute('id', nota.id);

        divNota.innerHTML = `
            <p class="titulo-nota">${nota.title}</p>
            <p class="contenido">${nota.content}</p>
        `;

        divNota.addEventListener('click', () => editar(nota.id));
        listaNotas.appendChild(divNota);
    });
}

function editar(id) {
    const notaParaEditar = notas.find(n => n.id === id);

    if (notaParaEditar) {
        const divNota = document.getElementById(id);

        divNota.innerHTML = `
            <input id="editar-titulo-nota" class="titulo-nota" type="text" autocomplete="off" value="${notaParaEditar.title}" required></input>
            <textarea id="editar-contenido-nota" name="area-texto" spellcheck="true" required>${notaParaEditar.content}</textarea>
            <div class="caja-botones" id="caja-botones-${divNota.id}">
                <button class="boton-cartas-nuevo" id="editar-boton-guardar-nota">Guardar</button>
                <button class="boton-cartas-nuevo" id="editar-boton-cancelar-nota">Cancelar</button>
                <button class="boton-cartas-nuevo" id="editar-boton-eliminar-nota">Eliminar</button>
            </div>
        `;

        document.getElementById('editar-titulo-nota').addEventListener('click', (e) => e.stopPropagation());
        document.getElementById('editar-contenido-nota').addEventListener('click', (e) => e.stopPropagation());

        document.getElementById('editar-boton-guardar-nota').addEventListener('click', (e) => {
            e.stopPropagation();
            guardarCambiosNota(id);
        });

        document.getElementById('editar-boton-cancelar-nota').addEventListener('click', (e) => {
            e.stopPropagation();
            cargarNotas();
        });

        document.getElementById('editar-boton-eliminar-nota').addEventListener('click', (e) => {
            e.stopPropagation();
            eliminarNota(id);
        });
    }
}

function botones() {
    document.getElementById('avanzar').addEventListener('click',() => {
        numMes++;
        cargar();
    });

    document.getElementById('retroceder').addEventListener('click',() => {
        numMes--;
        cargar();
    });

    document.getElementById('add-note').addEventListener('click', () => {crearNota()});
    document.getElementById('boton-guardar-nota').addEventListener('click',() => {guardarNota()});
    document.getElementById('boton-cancelar-nota').addEventListener('click',() => {cerrarVentana()});   

    document.getElementById('boton-guardar').addEventListener('click',guardarEvento);
    document.getElementById('boton-cancelar').addEventListener('click', cerrarVentana);
    document.getElementById('boton-eliminar').addEventListener('click',eliminarEvento);
    document.getElementById('boton-cerrar').addEventListener('click', cerrarVentana);
};

botones();
cargar();