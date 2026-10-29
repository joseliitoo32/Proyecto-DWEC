

  // ==========================================
  // ESTADO GLOBAL DE LA APLICACIÓN (EN MEMORIA)
  // ==========================================
  let equipos = [];
  // Estructura de cada equipo: { id: number, nombre: string }


  let partidos = [];
  // Estructura de cada partido:
  // { id: number, equipo1Id: number, equipo2Id: number, goles1: number|null, goles2: number|null, jugado: boolean }


  // ==========================================
  // ALUMNO 1: REGISTRO Y GENERACIÓN DE CALENDARIO (OSCAR AMAYA)
  // ==========================================

  /**
  * Añade un equipo al array global 'equipos' previa validación.
  * @param {string} nombre
  * @returns {boolean} true si se añadió con éxito, false si hubo error.
  */

  // TODO (Alumno 1):
  // 1. Validar que el nombre no esté vacío o compuesto solo por espacios.
  // 2. Validar que el equipo no exista ya en el array 'equipos'.
  // 3. Crear el objeto { id: Date.now(), nombre: nombre.trim() } y hacer push a 'equipos'.
  // 4. Retornar true si todo salió bien.
  function agregarEquipo(nombre) { //Comprobamos de esta manera que el nombre no este vacio
    if (!nombre || !nombre.trim()) {
      return false;
    }

    if (equipos.some(equipo => equipo.nombre.toLowerCase() === nombre.trim().toLowerCase)) {
      return false;
    }
    
    equipos.push({
      id: Date.now(), nombre: nombre.trim()
    });
    return true;

}

  /**
  * Genera los enfrentamientos (todos contra todos) y llena el array global 'partidos'.
  */
  // TODO (Alumno 1):
  // 1. Limpiar el array 'partidos' previo.
  // 2. Comprobar que hay al menos 2 equipos.
  // 3. Crear un bucle anidado para cruzar cada equipo con los demás (sin repetirse contra sí mismo).
  // 4. Guardar cada partido con la estructura:
  //    { id: i, equipo1Id: e1.id, equipo2Id: e2.id, goles1: null, goles2: null, jugado: false }
    function generarEnfrentamientos() {
    partidos.length = 0;
    
    if (equipo.length < 2) {
      return;
    }

    for (let i = 0; i < equipos.length; i++) {
      for (let j = i + 1; j < equipos.length; j++) {
          let e1 = equipos[i];
          let e2 = equipos[j];

        partidos.push({
          id: partidos.lenght + 1,
          equipo1Id: e1.id,
          equipo2Id: e2.id,
          goles1: null,
          goles2: null,
          jugado: false
        })
      }

    }
}

console.log(agregarEquipo("Polixe"));
console.log(agregarEquipo("Culiblanco"));
console.log(agregarEquipo("Algonales"));
console.log(agregarEquipo("Prado del gey"));


console.log(agregarEquipo("Poblaore")); //Este nos va a dar falso porque ya hay un equipo de poblaores
console.log(agregarEquipo("  ")); //Y aqui igual porque esta vacio

generarEnfrentamientos();

console.log(equipos);
console.log(partidos);


  // ==========================================
  // ALUMNO 2: LÓGICA DE NEGOCIO Y CLASIFICACIÓN (JOSE ANTONIO MARCHANTE)
  // ==========================================

  /**
  * Actualiza el marcador de un partido específico en el array 'partidos'.
  * @param {number} partidoId
  * @param {number} goles1
  * @param {number} goles2
  */

    // TODO (Alumno 2):
  
    function registrarResultado(partidoId, goles1, goles2) {
    
    // 1. Buscar el partido por partidoId en el array 'partidos'.
    const partido = partidos.find(p => p.id === partidoId);
    
    if (!partido) {
        return false;
    }

    // 2. Validar que los goles sean números enteros >= 0.
    if (!Number.isInteger(goles1) || goles1 < 0) {
        return false;
    }
    
    if (!Number.isInteger(goles2) || goles2 < 0) {
        return false;
    }

    // 3. Asignar goles1, goles2 y cambiar 'jugado' a true.
    partido.goles1=goles1;
    partido.goles2=goles2;
    partido.jugado=true;
    return true;
    
}

  /**
  * Recorre 'equipos' y 'partidos' para calcular la tabla de posiciones.
  * @returns {Array} Array de objetos ordenado por Puntos (descendente) y Diferencia de Goles.
  */
  function calcularTablaPosiciones() {


// 1. Mapear el array 'equipos' para inicializar estadísticas por equipo:
//    { id, nombre, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, puntos: 0 }
    const tabla = equipos.map(e => ({
        id: e.id,
        nombre: e.nombre,
        pj: 0,
        pg: 0,
        pe: 0,
        pp: 0,
        gf: 0,
        gc: 0,
        puntos: 0
    }));

// 2. Recorrer el array 'partidos' que estén 'jugados'.  
    const jugados = partidos.filter(p => p.jugado === true);

// 3. Sumar PJ, GF, GC, PG/PE/PP y Puntos (3 ptos victoria, 1 pto empate).
    jugados.forEach(p => {
    const t1 = tabla.find(t => t.id === p.equipo1Id);
    const t2 = tabla.find(t => t.id === p.equipo2Id);
    t1.pj++;
    t2.pj++;

    t1.gf += p.goles1;
    t1.gc += p.goles2;

    t2.gf += p.goles2;
    t2.gc += p.goles1;

    if (p.goles1 > p.goles2) {
        t1.pg++;
        t1.puntos += 3;
        t2.pp++;
    } else if (p.goles1 < p.goles2) {
        t2.pg++;
        t2.puntos += 3;
        t1.pp++;
    } else {
        t1.pe++;
        t2.pe++;
        t1.puntos += 1;
        t2.puntos += 1;
    }

    });

// 4. Ordenar el array resultante por puntos (y secundariamente por GF - GC).
tabla.sort((a, b) => (b.puntos - a.puntos) || ( a.puntos - b.puntos ));

// Terminar 

// 5. Retornar la lista calculada.

  return [];
}


  // ==========================================
  // ALUMNO 3: RENDERIZADO E INTERFAZ (DOM)
  // ==========================================

  /**
  * Renderiza el listado simple de equipos registrados.
  */
  function pintarListaEquipos() {
  // TODO (Alumno 3):
  // 1. Obtener el elemento HTML #listaEquipos.
  // 2. Limpiar su contenido.
  // 3. Recorrer 'equipos' y renderizar un <li> por cada equipo.
}

  /**
  * Renderiza los partidos programados con sus inputs de goles y botón de guardar.
  */
  function pintarPartidos() {
  // TODO (Alumno 3):
  // 1. Obtener el contenedor #contenedorPartidos.
  // 2. Limpiar su contenido.
  // 3. Recorrer 'partidos' generando controles para ingresar resultado y guardar.
}

  /**
  * Renderiza las filas <tr> de la tabla de clasificación.
  */
  function pintarTablaClasificacion() {
    // TODO (Alumno 3):
    // 1. Llamar a calcularTablaPosiciones() (Función del Alumno 2).
    // 2. Obtener #tablaClasificacion y construir los <tr> y <td> con los datos.
  }


  // ==========================================
  // ALUMNO 4: ESTADÍSTICAS Y CONTROL GENERAL
  // ==========================================

  /**
  * Calcula el total de goles anotados y busca el equipo con más goles a favor.
  * @returns {Object} { totalGoles: number, maxGoleador: string }
  */
  function obtenerEstadisticas() {
    // TODO (Alumno 4):
    // 1. Recorrer 'partidos' para sumar los goles totales del torneo.
    // 2. Usar la tabla de posiciones de Alumno 2 para buscar el equipo con mayor GF (Goles a Favor).
    // 3. Retornar el objeto con los datos.
    return { totalGoles: 0, maxGoleador: "-" };
  }

  /**
  * Limpia las variables globales y refresca toda la interfaz a su estado inicial.
  */
  function reiniciarTorneo() {
    // TODO (Alumno 4):
    // 1. Vaciar arrays: equipos = []; partidos = [];
    // 2. Volver a pintar todas las secciones (usando funciones de Alumno 3).
    // 3. Actualizar panel de estadísticas a 0.
  }


  // ==========================================
  // MANEJADORES DE EVENTOS (HANDLERS HTML)
  // ==========================================
  function handlerAgregarEquipo() {
    const input = document.getElementById("inputEquipo");
    if (agregarEquipo(input.value)) {
      input.value = "";
      pintarListaEquipos();
    } else {
      alert("Nombre de equipo inválido o duplicado.");
    }
  }

  function handlerGenerarTorneo() {
    generarEnfrentamientos();
    pintarPartidos();
    pintarTablaClasificacion();
  }

  function handlerGuardarResultado(partidoId, inputId1, inputId2) {
    const g1 = parseInt(document.getElementById(inputId1).value);
    const g2 = parseInt(document.getElementById(inputId2).value);

    registrarResultado(partidoId, g1, g2);
    pintarTablaClasificacion();

    // Actualizar estadísticas (Alumno 4)
    const stats = obtenerEstadisticas();
    document.getElementById("txtTotalGoles").innerText = stats.totalGoles;
    document.getElementById("txtMaxGoleador").innerText = stats.maxGoleador;
  }

  function handlerReiniciarTorneo() {
    if (confirm("¿Seguro que deseas reiniciar todo el torneo?")) {
      reiniciarTorneo();
    }
  }
