// ============================================================
//   MÁQUINA EXPENDEDORA - Lógica en JavaScript
//
//   Es la MISMA lógica del programa en Python, pero en JavaScript,
//   porque el navegador no puede ejecutar Python.
//
//   Equivalencias con Python:
//     if / else if / else  ->  if / elif / else
//     switch / case        ->  match / case
//     while                ->  while
//     for ... of           ->  for ... in
//     break                ->  break
// ============================================================


// ------------------------------------------------------------
// 1) PRODUCTOS
//    Cada producto tiene su precio y sus existencias,
//    igual que las variables del programa en Python.
// ------------------------------------------------------------
const productos = [
    { id: "1", nombre: "Papas",     icono: "🥔", precio: 18, existencias: 5 },
    { id: "2", nombre: "Refresco",  icono: "🥤", precio: 22, existencias: 15 },
    { id: "3", nombre: "Galletas",  icono: "🍪", precio: 15, existencias: 10 },
    { id: "4", nombre: "Chocolate", icono: "🍫", precio: 20, existencias: 4 },
];

let totalVentas = 0;               // dinero total vendido por la máquina
let productoSeleccionado = null;   // null = todavía no elige nada


// ------------------------------------------------------------
// Atajos a los elementos del HTML (los buscamos por su id)
// ------------------------------------------------------------
const contenedorProductos = document.getElementById("productos");
const inputCantidad = document.getElementById("cantidad");
const inputDinero = document.getElementById("dinero");
const textoImporte = document.getElementById("importe");
const pantalla = document.getElementById("mensaje");
const tablaInventario = document.getElementById("tabla-inventario");
const textoTotalVentas = document.getElementById("total-ventas");


// Muestra un texto en la pantalla negra de mensajes.
// esError = true lo pinta en rojo.
function mostrarMensaje(texto, esError = false) {
    pantalla.textContent = texto;
    pantalla.classList.toggle("error", esError);
}


// ------------------------------------------------------------
// 2) DIBUJAR LAS TARJETAS DE PRODUCTOS -> ciclo for
//
//    ¿PARA QUÉ SE USA AQUÍ?
//    Para crear una tarjeta por cada producto sin escribir
//    el HTML 4 veces. Recorre la lista uno por uno.
// ------------------------------------------------------------
function dibujarProductos() {
    contenedorProductos.innerHTML = ""; // limpiamos antes de dibujar

    for (const producto of productos) {
        const tarjeta = document.createElement("button");
        tarjeta.className = "producto";

        // if: marcamos la tarjeta si es el producto elegido
        if (productoSeleccionado === producto.id) {
            tarjeta.classList.add("seleccionado");
        }

        tarjeta.innerHTML = `
            <div class="producto__icono">${producto.icono}</div>
            <div class="producto__nombre">${producto.nombre}</div>
            <div class="producto__precio">$${producto.precio}</div>
            <div class="producto__stock">Quedan: ${producto.existencias}</div>
        `;

        // Al hacer clic, se elige este producto
        tarjeta.addEventListener("click", () => elegirProducto(producto.id));
        contenedorProductos.appendChild(tarjeta);
    }
}


// ------------------------------------------------------------
// 3) BUSCAR UN PRODUCTO POR SU NÚMERO -> for + break
//
//    Recorremos la lista hasta encontrar el producto.
//    En cuanto lo encontramos, break detiene el ciclo:
//    no tiene caso seguir revisando los demás.
// ------------------------------------------------------------
function buscarProducto(id) {
    let encontrado = null;

    for (const producto of productos) {
        if (producto.id === id) {
            encontrado = producto;
            break; // ¡ya lo encontramos! salimos del for
        }
    }

    return encontrado;
}


// ------------------------------------------------------------
// 4) ELEGIR PRODUCTO -> switch / case  (equivale a match case)
//
//    Según el número del producto, mostramos un mensaje.
//    "default" es como el "case _" de Python: cualquier otro valor.
// ------------------------------------------------------------
function elegirProducto(id) {
    switch (id) {
        case "1":
            mostrarMensaje("Elegiste Papas 🥔");
            break; // en switch, break evita que se ejecute el siguiente case
        case "2":
            mostrarMensaje("Elegiste Refresco 🥤");
            break;
        case "3":
            mostrarMensaje("Elegiste Galletas 🍪");
            break;
        case "4":
            mostrarMensaje("Elegiste Chocolate 🍫");
            break;
        default:
            mostrarMensaje("❌ Opción inválida.", true);
            return;
    }

    productoSeleccionado = id;
    dibujarProductos();
    actualizarImporte();
}


// Calcula y muestra el total a pagar mientras el usuario escribe
function actualizarImporte() {
    const producto = buscarProducto(productoSeleccionado);
    const cantidad = Number(inputCantidad.value);

    if (producto && cantidad > 0) {
        textoImporte.textContent = `$${producto.precio * cantidad}`;
    } else {
        textoImporte.textContent = "$0";
    }
}


// ------------------------------------------------------------
// 5) DESGLOSE DEL CAMBIO -> ciclo while
//
//    ¿PARA QUÉ SE USA AQUÍ?
//    Para saber con qué billetes y monedas dar el cambio.
//    MIENTRAS el cambio sea mayor o igual a una moneda,
//    la seguimos entregando. No sabemos de antemano cuántas
//    veces se repetirá, por eso usamos while.
// ------------------------------------------------------------
function desglosarCambio(cambio) {
    const denominaciones = [100, 50, 20, 10, 5, 2, 1, 0.5];
    const partes = [];

    for (const valor of denominaciones) {
        let piezas = 0;

        while (cambio >= valor) {
            cambio = Math.round((cambio - valor) * 100) / 100; // evita errores de decimales
            piezas++;
        }

        if (piezas > 0) {
            partes.push(`${piezas} x $${valor}`);
        }
    }

    return partes.join(", ");
}


// ------------------------------------------------------------
// 6) COMPRAR -> validaciones con if / else if / else
//    Son las mismas reglas del programa en Python.
// ------------------------------------------------------------
function comprar() {
    const producto = buscarProducto(productoSeleccionado);

    if (producto === null) {
        mostrarMensaje("❌ Primero selecciona un producto.", true);
        return; // return termina la función (como continue en el menú de Python)
    }

    const cantidad = Number(inputCantidad.value);

    // Regla 1: la cantidad debe ser un entero mayor a cero
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
        mostrarMensaje("❌ La cantidad debe ser un número entero mayor a cero. Compra rechazada.", true);
        return;
    }

    // Regla 2: no se puede comprar más de lo que hay
    if (cantidad > producto.existencias) {
        mostrarMensaje(`❌ No hay suficientes unidades. Solo quedan ${producto.existencias}. Operación cancelada.`, true);
        return;
    }

    // ---- PROCESO DE PAGO ----
    const importe = producto.precio * cantidad;
    const dinero = Number(inputDinero.value);

    // if / else if / else: los tres caminos del pago
    if (inputDinero.value === "" || dinero < importe) {
        mostrarMensaje(`❌ Dinero insuficiente. El total es $${importe}. Compra cancelada.`, true);
        return;
    } else if (dinero === importe) {
        mostrarMensaje(`✅ Pago exacto. ¡Compra confirmada!\nDisfruta tus ${producto.nombre} 😄`);
    } else {
        const cambio = dinero - importe;
        mostrarMensaje(
            `✅ ¡Compra confirmada! Tu cambio es: $${cambio.toFixed(2)}\n` +
            `Se entrega en: ${desglosarCambio(cambio)}\n` +
            `Disfruta tus ${producto.nombre} 😄`
        );
    }

    // La compra fue exitosa: restamos existencias y sumamos la venta
    producto.existencias -= cantidad;
    totalVentas += importe;

    // Animación: el producto "cae" en la bandeja.
    // Quitamos y volvemos a poner la clase para que se repita cada vez.
    const bandeja = document.getElementById("bandeja-producto");
    bandeja.textContent = producto.icono;
    bandeja.classList.remove("cae");
    void bandeja.offsetWidth; // truco para reiniciar la animación
    bandeja.classList.add("cae");

    // Limpiamos el formulario y redibujamos
    inputCantidad.value = "";
    inputDinero.value = "";
    actualizarImporte();
    dibujarProductos();
}


// ------------------------------------------------------------
// 7) INVENTARIO -> ciclo for + if
//    Una fila por producto. Si hay 5 o menos: EXISTENCIAS BAJAS.
// ------------------------------------------------------------
function dibujarInventario() {
    tablaInventario.innerHTML = "";

    for (const producto of productos) {
        let estado;
        let clase;

        if (producto.existencias <= 5) {
            estado = "EXISTENCIAS BAJAS";
            clase = "estado-bajo";
        } else {
            estado = "CON EXISTENCIAS";
            clase = "estado-ok";
        }

        tablaInventario.innerHTML += `
            <tr>
                <td>${producto.icono} ${producto.nombre}</td>
                <td>$${producto.precio}</td>
                <td>${producto.existencias}</td>
                <td class="${clase}">${estado}</td>
            </tr>
        `;
    }

    textoTotalVentas.textContent = `$${totalVentas.toFixed(2)}`;
}


// ------------------------------------------------------------
// 8) MENÚ PRINCIPAL -> switch / case
//    Muestra solo la sección de la opción elegida.
// ------------------------------------------------------------
function cambiarSeccion(opcion) {
    // Primero ocultamos todas las secciones...
    document.querySelectorAll(".seccion").forEach(s => s.classList.add("oculto"));
    // ...y marcamos el botón activo del menú
    document.querySelectorAll(".menu__btn").forEach(b => {
        b.classList.toggle("activo", b.dataset.opcion === opcion);
    });

    // ...luego mostramos solo la que corresponde
    switch (opcion) {
        case "1":
            document.getElementById("seccion-comprar").classList.remove("oculto");
            dibujarProductos();
            break;
        case "2":
            dibujarInventario();
            document.getElementById("seccion-inventario").classList.remove("oculto");
            break;
        case "3":
            document.getElementById("seccion-salir").classList.remove("oculto");
            break;
        default:
            mostrarMensaje("❌ Opción inválida. Intenta de nuevo.", true);
    }
}


// ------------------------------------------------------------
// 9) CONECTAR LOS BOTONES (eventos)
//    En Python el while True esperaba lo que escribía el usuario.
//    En una página web no hace falta: el navegador se queda
//    "escuchando" los clics y ejecuta la función correspondiente.
// ------------------------------------------------------------
document.querySelectorAll(".menu__btn").forEach(boton => {
    boton.addEventListener("click", () => cambiarSeccion(boton.dataset.opcion));
});

document.getElementById("btn-comprar").addEventListener("click", comprar);
document.getElementById("btn-reiniciar").addEventListener("click", () => cambiarSeccion("1"));
inputCantidad.addEventListener("input", actualizarImporte);

// Al abrir la página, dibujamos los productos por primera vez
dibujarProductos();