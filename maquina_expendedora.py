# ============================================================
#   MÁQUINA EXPENDEDORA - Programa básico en Python
#   Conceptos usados: if, match case, while, for y break
#
#   RESUMEN RÁPIDO DE CADA ESTRUCTURA:
#   - while : REPITE un bloque mientras una condición sea verdadera.
#             Se usa cuando NO sabemos cuántas veces se repetirá
#             (por ejemplo, un menú que se muestra hasta que el
#             usuario decide salir).
#   - for   : RECORRE uno por uno los elementos de una lista.
#             Se usa cuando SÍ sabemos cuántos elementos hay
#             (por ejemplo, los 4 productos del inventario).
#   - if    : DECIDE qué hacer según una condición
#             (mayor que, menor que, igual a, etc.).
#   - match : ELIGE un camino según el valor exacto de una variable
#             (como un menú de opciones "1", "2", "3"...).
#   - break : ROMPE (termina) un ciclo inmediatamente.
#
# ============================================================

# ------------------------------------------------------------
# 1) VARIABLES DE LOS PRODUCTOS
#    Cada producto tiene una variable para su PRECIO
#    y otra para sus EXISTENCIAS (unidades disponibles).
#    Las existencias irán bajando cada vez que se compre algo.
# ------------------------------------------------------------
precio_papas = 18
existencias_papas = 5

precio_refresco = 22
existencias_refresco = 15

precio_galletas = 15
existencias_galletas = 10

precio_chocolate = 20
existencias_chocolate = 4

# Aquí guardamos cuánto dinero ha vendido la máquina en total.
# Empieza en 0 y se le suma el importe de cada compra exitosa.
total_ventas = 0


# ------------------------------------------------------------
# 2) CICLO PRINCIPAL -> while
#
#    ¿PARA QUÉ SE USA AQUÍ?
#    Para que el menú se muestre UNA Y OTRA VEZ. Después de comprar
#    o consultar el inventario, el programa regresa aquí arriba
#    y vuelve a mostrar el menú.
#
#    ¿POR QUÉ "while True"?
#    "True" siempre es verdadero, así que el ciclo nunca terminaría
#    por sí solo. La única forma de salir es con "break"
#    (lo usamos en la opción 3 "Salir").
#
#    Usamos while (y no for) porque NO sabemos cuántas veces
#    el usuario va a usar la máquina antes de salir.
# ------------------------------------------------------------
while True:
    print("\n========== MÁQUINA EXPENDEDORA ==========")
    print("1. Comprar productos")
    print("2. Consultar inventario")
    print("3. Salir")

    # input() siempre devuelve TEXTO, por eso en los case
    # comparamos con "1", "2", "3" entre comillas.
    opcion = input("Elige una opción: ")

    
    # --------------------------------------------------------
    # match case -> ELEGIR QUÉ OPCIÓN DEL MENÚ EJECUTAR
    #
    # match revisa el valor de "opcion" y salta directamente
    # al "case" que coincide. Es más ordenado que escribir
    # muchos if / elif cuando comparamos una sola variable
    # contra varios valores fijos.
    # --------------------------------------------------------
    match opcion:

        # ====================================================
        # OPCIÓN 1: COMPRAR PRODUCTOS
        # ====================================================
        case "1":
            print("\n--- PRODUCTOS ---")
            print(f"1. Papas      ${precio_papas}")
            print(f"2. Refresco   ${precio_refresco}")
            print(f"3. Galletas   ${precio_galletas}")
            print(f"4. Chocolate  ${precio_chocolate}")
            producto = input("¿Qué producto deseas? ")

            # ------------------------------------------------
            # match case -> IDENTIFICAR EL PRODUCTO ELEGIDO
            #
            # Según el número que escribió el usuario, copiamos
            # el nombre, precio y existencias de ese producto en
            # variables "temporales" (nombre, precio, existencias).
            # Así el resto del código funciona igual para
            # cualquier producto, sin repetirlo 4 veces.
            # ------------------------------------------------
            match producto:
                case "1":
                    nombre = "Papas"
                    precio = precio_papas
                    existencias = existencias_papas
                case "2":
                    nombre = "Refresco"
                    precio = precio_refresco
                    existencias = existencias_refresco
                case "3":
                    nombre = "Galletas"
                    precio = precio_galletas
                    existencias = existencias_galletas
                case "4":
                    nombre = "Chocolate"
                    precio = precio_chocolate
                    existencias = existencias_chocolate
                case _:
                    # "case _" significa "cualquier otro valor".
                    # Atrapa todo lo que no sea 1, 2, 3 o 4.
                    print("❌ Opción inválida.")
                    # continue: NO termina el ciclo (eso sería break),
                    # solo SALTA lo que falta y regresa al inicio
                    # del while para mostrar el menú otra vez.
                    continue

            # Pedimos la cantidad.
            # int() convierte el texto a número entero.
            # try/except evita que el programa se detenga con error
            # si el usuario escribe letras en lugar de números.
            try:
                cantidad = int(input(f"¿Cuántas unidades de {nombre} quieres? "))
            except ValueError:
                print("❌ Debes escribir un número entero.")
                continue

            # ------------------------------------------------
            # if -> VALIDAR LA COMPRA
            #
            # Usamos if porque aquí necesitamos revisar
            # CONDICIONES (menor o igual, mayor que), no
            # valores exactos como en match.
            # Si alguna condición se cumple, la compra se cancela
            # y "continue" nos regresa al menú principal.
            # ------------------------------------------------

            # Regla 1: no se puede comprar 0 o una cantidad negativa
            if cantidad <= 0:
                print("❌ La cantidad debe ser mayor a cero. Compra rechazada.")
                continue

            # Regla 2: no se puede comprar más de lo que hay
            if cantidad > existencias:
                print(f"❌ No hay suficientes unidades. Solo quedan {existencias}. Operación cancelada.")
                continue

            # ---- PROCESO DE PAGO ----
            # Si llegamos hasta aquí, la compra pasó las validaciones.
            importe = precio * cantidad
            print(f"\nTotal a pagar: ${importe}")

            # float() permite aceptar decimales (ej. 50.5)
            try:
                dinero = float(input("Introduce tu dinero: $"))
            except ValueError:
                print("❌ Cantidad de dinero inválida.")
                continue

            # ------------------------------------------------
            # if / elif / else -> TRES CAMINOS POSIBLES DEL PAGO
            #
            # Python revisa en orden y entra SOLO al primero
            # que sea verdadero:
            #   if   -> el dinero NO alcanza
            #   elif -> el dinero es EXACTO
            #   else -> en cualquier otro caso (sobra dinero)
            # ------------------------------------------------
            if dinero < importe:
                print("❌ Dinero insuficiente. Compra cancelada.")
                continue
            elif dinero == importe:
                print("✅ Pago exacto. ¡Compra confirmada!")
            else:
                cambio = dinero - importe
                # :.2f muestra el número con 2 decimales
                print(f"✅ ¡Compra confirmada! Tu cambio es: ${cambio:.2f}")

            # ------------------------------------------------
            # match case -> ACTUALIZAR LAS EXISTENCIAS
            #
            # La compra fue exitosa, así que restamos las unidades
            # vendidas a la variable REAL del producto.
            # (Las variables temporales no cambian las originales,
            # por eso hay que hacerlo aquí.)
            # "-=" significa: existencias = existencias - cantidad
            # ------------------------------------------------
            match producto:
                case "1":
                    existencias_papas -= cantidad
                case "2":
                    existencias_refresco -= cantidad
                case "3":
                    existencias_galletas -= cantidad
                case "4":
                    existencias_chocolate -= cantidad

            # Sumamos la venta al total de la máquina.
            # "+=" significa: total_ventas = total_ventas + importe
            total_ventas += importe
            print(f"Disfruta tus {nombre} 😄")

        # ====================================================
        # OPCIÓN 2: CONSULTAR INVENTARIO
        # ====================================================
        case "2":
            # Creamos una LISTA con los datos actuales de cada producto.
            # Cada elemento de la lista es: (nombre, precio, existencias)
            inventario = [
                ("Papas", precio_papas, existencias_papas),
                ("Refresco", precio_refresco, existencias_refresco),
                ("Galletas", precio_galletas, existencias_galletas),
                ("Chocolate", precio_chocolate, existencias_chocolate),
            ]

            print("\n--------------- INVENTARIO ---------------")

            # ------------------------------------------------
            # for -> RECORRER TODOS LOS PRODUCTOS
            #
            # ¿PARA QUÉ SE USA AQUÍ?
            # Para no escribir 4 veces el mismo print.
            # El for toma el primer producto de la lista, ejecuta
            # el bloque, luego toma el segundo, y así hasta el último.
            # Da exactamente 4 vueltas (una por producto) y termina
            # solo, sin necesidad de break.
            #
            # En cada vuelta, los 3 datos del producto se guardan en
            # las variables nombre, precio y existencias.
            # ------------------------------------------------
            for nombre, precio, existencias in inventario:

                # if / else DENTRO del for:
                # se revisa la condición para CADA producto.
                if existencias <= 5:
                    estado = "EXISTENCIAS BAJAS"
                else:
                    estado = "CON EXISTENCIAS"

                # :<10 alinea el texto a la izquierda en 10 espacios
                # para que la tabla se vea ordenada.
                print(f"{nombre:<10} Precio: ${precio:<4} Existencias: {existencias:<4} {estado}")

            # Esta línea ya está FUERA del for (menos sangría),
            # por eso se imprime una sola vez al final.
            print("------------------------------------------")
            print(f"Total de ventas realizadas por la máquina: ${total_ventas:.2f}")

        # ====================================================
        # OPCIÓN 3: SALIR
        # ====================================================
        case "3":
            print("👋 Gracias por usar la máquina expendedora. ¡Hasta luego!")
            # ------------------------------------------------
            # break -> TERMINAR EL CICLO while
            #
            # break "rompe" el ciclo en el que está, en este caso
            # el while True. Python salta a la primera línea
            # DESPUÉS del ciclo; como no hay nada más,
            # el programa termina.
            #
            # Diferencia importante:
            #   break    -> sale del ciclo para siempre
            #   continue -> solo salta a la siguiente vuelta
            # ------------------------------------------------
            break

        # ----------------------------------------------------
        # case _ -> cualquier opción que no sea 1, 2 o 3.
        # No usamos break, así que el while sigue y el menú
        # se vuelve a mostrar.
        # ----------------------------------------------------
        case _:
            print("❌ Opción inválida. Intenta de nuevo.")

# Aquí termina el programa (llegamos aquí solo gracias al break).
