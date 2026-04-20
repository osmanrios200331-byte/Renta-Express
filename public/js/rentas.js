const API = "http://localhost:3000/api/rentas";
const API_CLIENTES = "http://localhost:3000/api/clientes";
const API_VEHICULOS = "http://localhost:3000/api/vehiculos";

let rentasGlobal = [];
let clientesGlobal = [];
let vehiculosGlobal = [];
let editandoId = null;

// ================= FECHA HOY =================
function obtenerFechaHoy() {
    return new Date().toISOString().split("T")[0];
}

// ================= OBTENER RENTAS =================
async function obtenerRentas() {
    try {
        const res = await fetch(API);
        const data = await res.json();

        rentasGlobal = data;

        renderRentas(rentasGlobal);
        actualizarContador();

    } catch (error) {
        console.error("Error:", error);
    }
}

// ================= RENDER =================
function renderRentas(lista) {
    const tabla = document.getElementById("tablaRentas");
    tabla.innerHTML = "";

    lista.forEach(r => {

        const cliente = obtenerNombreCliente(r.idCliente);
        const vehiculo = obtenerNombreVehiculo(r.idVehiculo);
        const placa = obtenerPlacaVehiculo(r.idVehiculo);

        const total = r.valorTotal || calcularTotalBackend(r);

        tabla.innerHTML += `
            <tr>
                <td>${r.id}</td>
                <td>${cliente}</td>
                <td>${vehiculo}</td>
                <td>${placa}</td>
                <td>${r.fechaInicio}</td>
                <td>${r.fechaFin}</td>
                <td>$${Number(total).toLocaleString()}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editar(${r.id})">✏️</button>
                    <button class="btn btn-sm btn-danger" onclick="eliminar(${r.id})">🗑️</button>
                </td>
            </tr>
        `;
    });
}

// ================= HELPERS =================
function obtenerNombreCliente(id) {
    const c = clientesGlobal.find(c => c.id == id);
    return c ? c.nombre : "N/A";
}

function obtenerNombreVehiculo(id) {
    const v = vehiculosGlobal.find(v => v.id == id);
    return v ? `${v.marca} ${v.modelo}` : "N/A";
}

function obtenerPlacaVehiculo(id) {
    const v = vehiculosGlobal.find(v => v.id == id);
    return v ? v.placa : "N/A";
}

function calcularTotalBackend(r) {
    if (!r.fechaInicio || !r.fechaFin || !r.tarifaAplicada) return 0;

    const inicio = new Date(r.fechaInicio);
    const fin = new Date(r.fechaFin);

    if (fin <= inicio) return 0;

    const dias = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
    return dias * parseFloat(r.tarifaAplicada);
}

// ================= CARGAR CLIENTES =================
async function cargarClientes() {
    const res = await fetch(API_CLIENTES);
    const data = await res.json();

    clientesGlobal = data;

    const select = document.getElementById("cliente");
    select.innerHTML = '<option value="">Seleccionar cliente</option>';

    data.forEach(c => {
        select.innerHTML += `<option value="${c.id}">${c.nombre}</option>`;
    });
}

// ================= CARGAR VEHICULOS =================
async function cargarVehiculos(seleccionadoId = null) {
    const res = await fetch(API_VEHICULOS);
    const data = await res.json();

    vehiculosGlobal = data;

    const select = document.getElementById("vehiculo");
    select.innerHTML = '<option value="">Seleccionar vehículo</option>';

    data
        .filter(v => v.estado === "Disponible" || v.id == seleccionadoId)
        .forEach(v => {
            select.innerHTML += `
                <option value="${v.id}" data-tarifa="${v.tarifaDiaria}">
                    ${v.marca} ${v.modelo} - ${v.placa}
                </option>
            `;
        });
}

// ================= EDITAR =================
async function editar(id) {
    const r = rentasGlobal.find(r => r.id == id);

    if (!r) {
        alert("Renta no encontrada");
        return;
    }

    editandoId = id;

    await cargarVehiculos(r.idVehiculo);

    document.getElementById("cliente").value = r.idCliente || "";
    document.getElementById("vehiculo").value = r.idVehiculo || "";
    document.getElementById("fechaInicio").value = r.fechaInicio || "";
    document.getElementById("fechaFin").value = r.fechaFin || "";
    document.getElementById("tarifa").value = r.tarifaAplicada || "";
    document.getElementById("total").value = r.valorTotal || calcularTotalBackend(r);

    new bootstrap.Modal(document.getElementById("modalNuevaRenta")).show();
}

// ================= ELIMINAR =================
async function eliminar(id) {
    if (!confirm("¿Eliminar renta?")) return;

    await fetch(`${API}/${id}`, { method: "DELETE" });

    obtenerRentas();
    cargarVehiculos();
}

// ================= LIMPIAR =================
function limpiarFormulario() {
    document.getElementById("cliente").value = "";
    document.getElementById("vehiculo").value = "";
    document.getElementById("fechaInicio").value = obtenerFechaHoy();
    document.getElementById("fechaFin").value = "";
    document.getElementById("tarifa").value = "";
    document.getElementById("total").value = "";

    editandoId = null;
}

// ================= CALCULAR TOTAL =================
function calcularTotal() {
    const inicio = new Date(document.getElementById("fechaInicio").value);
    const fin = new Date(document.getElementById("fechaFin").value);
    const tarifaVal = parseFloat(document.getElementById("tarifa").value) || 0;

    if (fin <= inicio) {
        document.getElementById("total").value = 0;
        return;
    }

    const dias = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
    document.getElementById("total").value = dias * tarifaVal;
}

// ================= BUSCADOR 🔥 =================
function activarBuscador() {
    const buscador = document.getElementById("buscadorRentas");

    buscador.addEventListener("input", function () {

        const valor = this.value.toLowerCase().trim();

        if (!valor) {
            renderRentas(rentasGlobal);
            return;
        }

        const filtradas = rentasGlobal.filter(r => {

            const cliente = obtenerNombreCliente(r.idCliente).toLowerCase();
            const vehiculo = obtenerNombreVehiculo(r.idVehiculo).toLowerCase();
            const placa = obtenerPlacaVehiculo(r.idVehiculo).toLowerCase();

            return (
                cliente.includes(valor) ||
                vehiculo.includes(valor) ||
                placa.includes(valor) ||
                String(r.id).includes(valor) ||
                (r.fechaInicio || "").toLowerCase().includes(valor) ||
                (r.fechaFin || "").toLowerCase().includes(valor)
            );
        });

        renderRentas(filtradas);
    });
}

// ================= CONTADOR =================
function actualizarContador() {
    document.getElementById("totalRentas").innerText = rentasGlobal.length;
    document.getElementById("infoTabla").innerText = `${rentasGlobal.length} registros`;
}

// ================= INICIO =================
document.addEventListener("DOMContentLoaded", async () => {

    await cargarClientes();
    await cargarVehiculos();
    await obtenerRentas();
    activarBuscador(); // 🔥 ACTIVADO

    document.getElementById("fechaInicio").value = obtenerFechaHoy();

    document.getElementById("vehiculo").addEventListener("change", function () {
        const selected = this.options[this.selectedIndex];
        const tarifaData = selected.getAttribute("data-tarifa");

        if (tarifaData) {
            document.getElementById("tarifa").value = tarifaData;
            calcularTotal();
        }
    });

    document.getElementById("fechaInicio").addEventListener("change", calcularTotal);
    document.getElementById("fechaFin").addEventListener("change", calcularTotal);
    document.getElementById("tarifa").addEventListener("input", calcularTotal);

    document.getElementById("btnGuardarRenta").addEventListener("click", async () => {

        const idCliente = document.getElementById("cliente").value;
        const idVehiculo = document.getElementById("vehiculo").value;
        const fechaInicio = document.getElementById("fechaInicio").value;
        const fechaFin = document.getElementById("fechaFin").value;
        const tarifa = document.getElementById("tarifa").value;

        if (!idCliente || !idVehiculo || !fechaInicio || !fechaFin) {
            alert("Completa todos los campos");
            return;
        }

        const dias = Math.ceil(
            (new Date(fechaFin) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24)
        );

        const valorTotal = dias * parseFloat(tarifa);

        const datos = {
            idCliente,
            idVehiculo,
            fechaInicio,
            fechaFin,
            tarifaAplicada: tarifa,
            valorTotal
        };

        try {
            if (editandoId) {
                await fetch(`${API}/${editandoId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(datos)
                });

                obtenerRentas();

            } else {
                const res = await fetch(API, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(datos)
                });

                const nuevaRenta = await res.json();

                window.location.href = `/pagos?renta=${nuevaRenta.id}`;
            }

            bootstrap.Modal.getInstance(
                document.getElementById("modalNuevaRenta")
            ).hide();

            limpiarFormulario();
            cargarVehiculos();

        } catch (error) {
            console.error("Error al guardar:", error);
        }
    });

    document.getElementById("modalNuevaRenta")
        .addEventListener("hidden.bs.modal", () => {
            limpiarFormulario();
            cargarVehiculos();
        });
});

// ================= GLOBAL =================
window.editar = editar;
window.eliminar = eliminar;