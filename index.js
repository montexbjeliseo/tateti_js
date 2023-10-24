/*
*
* Author: @montexbjeliseo
*/

const datosDelJuego = {
    turno: null,
    puntos: {
        x: 0,
        o: 0
    },
    enJuego: false,
}

const sonidos = {
    x: new Audio('x.wav'),
    o: new Audio('o.wav'),
    win: new Audio('win.wav'),
    empate: new Audio('empate.wav'),
}

    ; (function () {
        document.addEventListener("DOMContentLoaded", () => {
            const app = document.getElementById('app');
            app.appendChild(crearPanelInfo());
            app.appendChild(crearTablero());
            app.appendChild(crearPanelCreditos());
            mostrarMensaje({ titulo: 'Bienvenido', mensaje: '¡Empieza el juego!', botones: [{ texto: 'Jugar', callback: iniciarJuego }] });
        });
    })();

const iniciarJuego = () => {
    reiniciarTablero();
    datosDelJuego.turno = 'x';
    datosDelJuego.enJuego = true;
    actualizarMarcador();
}

const crearPanelInfo = () => {
    const panelInfo = document.createElement('div');
    panelInfo.classList.add('panel-info');
    const infoTurno = document.createElement('div');
    infoTurno.classList.add('info-turno');
    infoTurno.textContent = `Turno: ${datosDelJuego.turno ?? '-'}`;
    panelInfo.appendChild(infoTurno);
    panelInfo.appendChild(crearMarcador());
    return panelInfo;
}

const crearMarcador = () => {
    const marcador = document.createElement('div');
    marcador.classList.add('marcador');
    marcador.innerText = "X: 0 | O: 0";
    return marcador;
}

const crearTablero = () => {
    const tablero = document.createElement('div');
    tablero.classList.add('tablero');
    for (let i = 0; i < 9; i++) {
        tablero.appendChild(crearCelda(i));
    }
    return tablero;
}

const crearCelda = (id) => {
    const celda = document.createElement('div');
    celda.id = 'celda-' + id;
    celda.addEventListener('click', clickCelda);
    celda.classList.add('celda');
    return celda;
}

const clickCelda = (e) => {
    if (!datosDelJuego.enJuego) {
        return;
    }
    const celda = e.target;
    if (celda.classList.contains('clickeada')) {
        mostrarMensaje({titulo: 'Celda ocupada', mensaje: 'La celda ya se encuentra ocupada'});
        return;
    }
    celda.classList.add('clickeada', datosDelJuego.turno);
    celda.innerText = datosDelJuego.turno;
    datosDelJuego.turno = datosDelJuego.turno === 'x' ? 'o' : 'x';
    sonidos[datosDelJuego.turno].play();
    comprobarGanador();
    actualizarTurno();
}

const crearPanelCreditos = () => {
    const botones = document.createElement('div');
    botones.classList.add('botones');
    const irAGithubBoton = document.createElement('a');
    irAGithubBoton.textContent = 'Creado por montexbjeliseo';
    irAGithubBoton.href = 'https://github.com/montexbjeliseo';
    irAGithubBoton.target = '_blank';
    irAGithubBoton.classList.add('boton-secundario');
    botones.appendChild(irAGithubBoton);
    return botones;
}

const comprobarGanador = () => {
    const celdas = document.querySelectorAll('.celda');
    const combinaciones = [
        [celdas[0], celdas[1], celdas[2]],
        [celdas[3], celdas[4], celdas[5]],
        [celdas[6], celdas[7], celdas[8]],
        [celdas[0], celdas[3], celdas[6]],
        [celdas[1], celdas[4], celdas[7]],
        [celdas[2], celdas[5], celdas[8]],
        [celdas[0], celdas[4], celdas[8]],
        [celdas[2], celdas[4], celdas[6]]
    ];

    for (let i = 0; i < combinaciones.length; i++) {
        const combinacion = combinaciones[i];
        if (esTateti(combinacion[0].innerText, combinacion[1].innerText, combinacion[2].innerText) && combinacion[0].innerText !== '') {
            combinacion.forEach(celda => {
                celda.classList.add('resaltado');
            });
            datosDelJuego.puntos[combinacion[0].innerText]++;
            datosDelJuego.enJuego = false;
            datosDelJuego.turno = null;
            actualizarMarcador();

            mostrarMensaje({ titulo: 'Juego terminado', mensaje: `¡Jugador ${combinacion[0].innerText.toUpperCase()} es el ganador!`, botones: [{ texto: 'Nuevo juego', callback: iniciarJuego }] });
            sonidos.win.play();
            break;
        }
    }

    if (datosDelJuego.enJuego) {
        let hayMovimientos = false;

        for (let celda of celdas) {
            if (!celda.classList.contains('clickeada')) {
                hayMovimientos = true;
            }
        }

        if (!hayMovimientos) {
            mostrarMensaje({ titulo: 'Juego terminado', mensaje: `¡Es un empate!`, botones: [{ texto: 'Nuevo juego', callback: iniciarJuego }] });
            sonidos.empate.play();
        }
    }

}

const actualizarMarcador = () => {
    const marcador = document.querySelector('.marcador');
    marcador.innerText = `X: ${datosDelJuego.puntos.x} | O: ${datosDelJuego.puntos.o}`;
    actualizarTurno();
}

const actualizarTurno = () => {
    const infoTurno = document.querySelector('.info-turno');
    infoTurno.textContent = `Turno: ${datosDelJuego.turno ?? '-'}`;
}

const esTateti = (a, b, c) => {
    return a === b && b === c;
}

const reiniciarTablero = () => {
    const celdas = document.querySelectorAll('.celda');
    celdas.forEach(celda => {
        celda.innerText = '';
        celda.classList.remove('clickeada', 'x', 'o', 'resaltado');
    })
}

const mostrarMensaje = ({ titulo, mensaje, botones }) => {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    const modalTitulo = document.createElement('b');
    modalTitulo.textContent = titulo;

    modal.appendChild(modalTitulo);

    const modalTexto = document.createElement("p");
    modalTexto.textContent = mensaje;

    modal.appendChild(modalTexto);

    const cerrarModal = () => modal.parentNode.removeChild(modal);

    if (botones) {
        for (let boton of botones) {
            const modalBoton = document.createElement('button');
            modalBoton.textContent = boton.texto;
            modalBoton.addEventListener('click', () => {
                boton.callback();
                cerrarModal();
            });
            modal.appendChild(modalBoton);
        }
    } else {
        const aceptarBoton = document.createElement('button');
        aceptarBoton.textContent = 'Ok';
        aceptarBoton.addEventListener('click', cerrarModal);
        modal.appendChild(aceptarBoton);
    }

    document.body.appendChild(modal);
}