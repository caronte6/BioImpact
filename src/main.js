// SearchBar

const proyectos = [
    { titulo: "EcoEscuelas", url: "./ecoEscuelas.html", palabrasClave: ["ecoescuelas", "eco escuelas", "escuelas", "educacion ambiental"] },
    { titulo: "Escuela Un Futuro Mejor", url: "./ecoEscuelas.html#futuroMejor", palabrasClave: ["futuro mejor", "escuela un futuro mejor"] },
    { titulo: "Centro Educativo Aquende", url: "./ecoEscuelas.html#sanMartin", palabrasClave: ["aquende", "centro educativo aquende", "san martin"] },
    { titulo: "Instituto Delta", url: "./ecoEscuelas.html#delta", palabrasClave: ["delta", "instituto delta"] },
    { titulo: "Guardianes del Agua", url: "./guardianesDelAgua.html", palabrasClave: ["guardianes", "guardianes del agua", "agua"] },
    { titulo: "Cosecha de Lluvia Automatizada", url: "./guardianesDelAgua.html#cosecha", palabrasClave: ["cosecha", "lluvia", "cosecha de lluvia", "cosecha de lluvia automatizada"] },
    { titulo: "Humedales Artificiales", url: "./guardianesDelAgua.html#humedales", palabrasClave: ["humedales", "biofiltros", "humedales artificiales"] },
    { titulo: "Monitoreo Comunitario de Napas", url: "./guardianesDelAgua.html#monitoreo", palabrasClave: ["monitoreo", "napas", "monitoreo comunitario", "monitoreo comunitario de napas"] },
    { titulo: "PlantAr", url: "./plantAr.html", palabrasClave: ["plantar", "plant ar", "reforestacion", "arboles"] },
    { titulo: "Por que PlantAr", url: "./plantAr.html#impacto-title", palabrasClave: ["por que plantar", "impacto plantar", "impacto"] },
    { titulo: "Pilares de PlantAr", url: "./plantAr.html#pilares-title", palabrasClave: ["pilares", "pilares de accion", "pilares de plantar"] },
    { titulo: "Tu impacto cuenta", url: "./plantAr.html#adoptar", palabrasClave: ["tu impacto cuenta", "adoptar", "donar arbol", "voluntario plantar"] },
    { titulo: "Cero Residuos", url: "./ceroResiduos.html", palabrasClave: ["cero residuos", "ceroreciduos", "residuos", "economia circular"] },
    { titulo: "Compostaje Organico", url: "./ceroResiduos.html#lineaDeAccion", palabrasClave: ["linea de accion", "lineadeaccion", "compostaje", "compostaje organico"] },
    { titulo: "Puntos de Reciclaje", url: "./ceroResiduos.html#puntosReciclaje", palabrasClave: ["puntos reciclaje", "puntos de reciclaje", "ecopuntos", "reciclaje"] },
    { titulo: "Talleres de Upcycling", url: "./ceroResiduos.html#talleres", palabrasClave: ["talleres", "supra reciclaje", "supra-reciclaje", "upcycling"] },
    { titulo: "Donaciones", url: "./donaciones.html", palabrasClave: ["donar", "donaciones", "aporte", "donation", "colaboracion", "ayuda"]},
    { titulo: "Voluntariado", url: "./voluntario.html", palabrasClave: ["voluntariado", "voluntario", "unirse", "colaborar", "ayuda", "se parte"]},
    { titulo: "Nosotros", url: "./nosotros.html", palabrasClave: ["conocenos", "nosotros", "mision", "quienes somos", "equipo", "historia"]},
    { titulo: "Login", url: "./login.html", palabrasClave: ["login", "iniciar sesion", "acceder"]},   
];

// Función para normalizar el texto eliminando acentos y caracteres especiales

const normalizarTexto = (texto) => {
    return texto
        .toLowerCase()  // Convierte todo a minusculas
        .normalize("NFD") // Separa las letras de sus tildes.
        .replace(/[\u0300-\u036f]/g, "") // Elimina las tildes separadas
        .replace(/[^a-z0-9\s]/g, " ") // Reemplaza simbolos y signos por espacios, dejando solo letras, numeros y espacios.
        .replace(/\s+/g, " ")  // Si hay varios espacios seguidos, los convierte en uno solo.
        .trim(); // Quita espacios al principio y al final del texto.
};

// Un proyecto coincide con el texto escrito por el usuario. Devuelve True o False.

const coincideConBusqueda = (proyecto, textoBuscado) => {
    const titulo = normalizarTexto(proyecto.titulo);
    const palabrasClave = proyecto.palabrasClave.map(normalizarTexto);

    return titulo.includes(textoBuscado) // El titulo del proyecto contiene con lo que busco el usuario. Retorna True o False.
        || textoBuscado.includes(titulo) // Lo que escribio el usuario contiene el titulo completo. Retorna True o False.
        || palabrasClave.some((palabra) => // Si alguna palabra clave coincide, ya devuelve True. False de lo contrario.
            palabra.includes(textoBuscado) ||
            textoBuscado.includes(palabra)
            );  
}

// Buscar en el array "proyectos" y devolver los resultados que coincidan con la búsqueda

const buscarProyectos = (busqueda) =>{
    const textoBuscado = normalizarTexto(busqueda);

    return proyectos.filter(proyecto => coincideConBusqueda(proyecto, textoBuscado));
}

//Error en la busqueda.

const mostrarErrorBusqueda = (input, mensaje) => {
    input.setCustomValidity(mensaje);
    input.reportValidity();
    input.addEventListener("input", () => input.setCustomValidity(""), { once: true });
};

// Conecta el buscador del HTML con el JS. 

document.querySelectorAll(".search-container, .search-container-mobile").forEach((formulario) => { //busca los formularios que contengan la clase "search-container" o el id "mobileSearch" y los recorre uno por uno.

        const input = formulario.querySelector("input");
        const sugerencias = formulario.querySelector(".search-suggestions");
        
        input.addEventListener("input", () => {
            const busqueda = input.value.trim();
            sugerencias.innerHTML = "";

            if (!busqueda) {
                return;
            }

        const resultados = buscarProyectos(busqueda);

        resultados.forEach((proyecto) => {
            const opcion = document.createElement("button");
            opcion.type = "button";
            opcion.classList.add("search-suggestion");
            opcion.textContent = proyecto.titulo;

            opcion.addEventListener("click", () => {
                window.location.href = proyecto.url;
            });

            sugerencias.appendChild(opcion);
        });
    }); 

     formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const busqueda = input.value.trim();

        if (!busqueda) {
            mostrarErrorBusqueda(input, "Escribi el nombre de un proyecto o articulo.");
            return;
        }

        const resultados = buscarProyectos(busqueda);
        const primerResultado = resultados[0];

        if (!primerResultado) {
            mostrarErrorBusqueda(input, "No encontramos ese proyecto. Proba con EcoEscuelas, PlantAr, Cero Residuos o Guardianes del Agua.");
            return;
        }

        window.location.href = primerResultado.url;
    });
});




