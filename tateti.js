const datosDelJuego = {
    turno: 'x',
    puntos: {
        x: 0,
        o: 0
    },
    enJuego: true,
    movimientosHechos: 0,
    ultimoGanador: null
};

const sonidos = {
    drop: new Audio('drop.wav'),
    win: new Audio('win_2.mp3'),
}

const movimientos = [
    [0, 1],
    [0, 3],
    [1, 2],
    [1, 4],
    [2, 5],
    [3, 4],
    [3, 6],
    [4, 5],
    [5, 8],
    [4, 7],
    [6, 7],
    [7, 8],
    [0, 4],
    [2, 4],
    [6, 4],
    [4, 8]
];

const configurarEventos = () => {
    const fichas = document.querySelectorAll('.ficha');
    fichas.forEach(ficha => {
        desbloquearFichas();
        ficha.addEventListener('dragstart', arrastrar);
    });
    const celdas = document.querySelectorAll('.celda');
    celdas.forEach(celda => {
        celda.addEventListener('dragover', permitirSoltar);
        celda.addEventListener('drop', soltar);
    })

    const nuevoJuegoBoton = document.querySelector('#reiniciar-boton');
    nuevoJuegoBoton.addEventListener('click', () => {
        iniciarJuego();
    });
}



(function () {
    document.addEventListener('DOMContentLoaded', () => {
        configurarEventos();

    });
})();

const iniciarJuego = () => {
    datosDelJuego.enJuego = true;
    datosDelJuego.turno = datosDelJuego.ultimoGanador ?? 'x';
    datosDelJuego.movimientosHechos = 0;
    const fichasContainer = document.querySelector('.fichas');
    fichasContainer.append(...document.querySelectorAll('.ficha.x'));
    fichasContainer.append(...document.querySelectorAll('.ficha.o'));
    desbloquearFichas();
    mostrarMensaje(`Toca mover al jugador ${datosDelJuego.turno.toUpperCase()}`);

}

const cambiarTurno = () => {
    if (datosDelJuego.enJuego) {
        datosDelJuego.turno = datosDelJuego.turno === 'x' ? 'o' : 'x';
        mostrarMensaje(`Toca mover al jugador ${datosDelJuego.turno.toUpperCase()}`);
    }
}

const mostrarMensaje = (mensaje) => {
    const mensajeContainer = document.querySelector('#mensaje');
    mensajeContainer.textContent = mensaje;
}

const desbloquearFichas = () => {
    const fichas = document.querySelectorAll('.ficha');
    fichas.forEach(ficha => {
        ficha.setAttribute('draggable', false);
    });

    if (datosDelJuego.enJuego) {
        [...fichas].filter(ficha => ficha.classList.contains(datosDelJuego.turno)).forEach(ficha => {
            ficha.setAttribute('draggable', true);
        });
    }
}


const arrastrar = (event) => {
    sonidos.drop.play();
    if (event.target.parentNode.classList.contains('celda')) {
        event.dataTransfer.setData("text", 'tablero ' + event.target.id);
    } else {
        event.dataTransfer.setData("text", 'fuera ' + event.target.id);
    }
}

const permitirSoltar = (event) => {
    if (event.target.textContent === '') {
        event.preventDefault();
    }
}

const soltar = (event) => {
    event.preventDefault();
    const data = event.dataTransfer.getData("text").split(' ');
    if (!event.target.classList.contains('ficha')) {
        if (data[0] === 'fuera') {
            event.target.appendChild(document.getElementById(data[1]));
            sonidos.drop.play();
            datosDelJuego.movimientosHechos++;
            comprobarGanador();
            cambiarTurno();
            desbloquearFichas();

        } else if (datosDelJuego.movimientosHechos >= 6) {
            const desdeCelda = document.getElementById(data[1]).parentNode.id.split('-')[1];
            if (puedeMover(event.target.id.split('-')[1], desdeCelda)) {
                event.target.appendChild(document.getElementById(data[1]));
                sonidos.drop.play();
                datosDelJuego.movimientosHechos++;
                comprobarGanador();
                cambiarTurno();
                desbloquearFichas();
            }
        }
    }
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
    ]

    let ganador = null;

    for (let combinacion of combinaciones) {
        if (combinacion[0].innerText === combinacion[1].innerText && combinacion[1].innerText === combinacion[2].innerText && combinacion[0].innerText !== '') {
            ganador = combinacion[0].innerText;
        }
    }

    if (ganador) {
        if (datosDelJuego.movimientosHechos <= 6) {
            ganador = ganador === 'x' ? 'o' : 'x';
            mostrarMensaje('Movimiento ilegal, gana el jugador ' + ganador.toUpperCase());
        } else {
            mostrarMensaje(`Jugador ${ganador.toUpperCase()} es el ganador`);
        }
        datosDelJuego.enJuego = false;
        datosDelJuego.puntos[ganador]++;
        datosDelJuego.ultimoGanador = ganador;
        actualizarMarcador();
        sonidos.win.play();
    }

}

const puedeMover = (desde, hasta) => {
    return movimientos.some(movimiento => movimiento[0] == desde && movimiento[1] == hasta || movimiento[0] == hasta && movimiento[1] == desde);
}

const actualizarMarcador = () => {
    const puntosX = document.getElementById('puntosX');
    puntosX.textContent = datosDelJuego.puntos.x;
    const puntosO = document.getElementById('puntosO');
    puntosO.textContent = datosDelJuego.puntos.o;
}