const API = "http://localhost:3000/api/vehiculos";

let editandoId = null;
let vehiculosGlobal = [];

// ================= OBTENER =================
async function obtenerVehiculos() {
    try {
        const res = await fetch(API);
        const data = await res.json();

        vehiculosGlobal = data;

        renderVehiculos(vehiculosGlobal);
        actualizarContadores();

    } catch (error) {
        console.error("Error:", error);
    }
}

// ================= RENDER =================
function renderVehiculos(lista) {
    const tabla = document.getElementById("tablaVehiculos");
    tabla.innerHTML = "";

    lista.forEach(v => {
        tabla.innerHTML += `
            <tr>
                <td>${v.placa || ''}</td>
                <td>${v.marca || ''}</td>
                <td>${v.modelo || ''}</td>
                <td>${v.anio || ''}</td>
                <td>${v.color || ''}</td>
                <td>${v.tipoVehiculo || ''}</td>
                <td>${v.transmision || ''}</td>
                <td>${v.tarifaDiaria || ''}</td>
                <td>${v.estado || ''}</td>
                <td>
                    <button class="btn btn-sm btn-primary"
                        onclick="editar('${v.id}')">✏️</button>

                    <button class="btn btn-sm btn-danger"
                        onclick="eliminar('${v.id}')">🗑️</button>
                </td>
            </tr>
        `;
    });
}

// ================= EDITAR =================
async function editar(id) {
    try {
        console.log("Editando ID:", id);

        const res = await fetch(`${API}/${id}`);
        if (!res.ok) throw new Error("Vehículo no encontrado");

        const v = await res.json();

        editandoId = id;

        const form = document.getElementById("formVehiculo");

        form.placa.value = v.placa || '';
        form.marca.value = v.marca || '';
        form.modelo.value = v.modelo || '';
        form.anio.value = v.anio || '';
        form.color.value = v.color || '';
        form.tipoVehiculo.value = v.tipoVehiculo || '';
        form.transmision.value = v.transmision || '';
        form.combustible.value = v.combustible || '';
        form.tarifaDiaria.value = v.tarifaDiaria || '';
        form.estado.value = v.estado || '';

        // FIX input date
        form.fechaRegistro.value = v.fechaRegistro
            ? v.fechaRegistro.split("T")[0]
            : '';

        bootstrap.Modal.getOrCreateInstance(
            document.getElementById("modalNuevoVehiculo")
        ).show();

    } catch (error) {
        console.error("ERROR EDITAR:", error);
    }
}

// ================= LIMPIAR MODAL =================
document.getElementById("modalNuevoVehiculo").addEventListener("hidden.bs.modal", function () {
    document.getElementById("formVehiculo").reset();
    editandoId = null;
});

// ================= GUARDAR (CREAR / EDITAR) =================
document.getElementById("formVehiculo").addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = new FormData(e.target);
    const datos = Object.fromEntries(form.entries());

    try {
        if (editandoId) {
            await fetch(`${API}/${editandoId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
        } else {
            await fetch(API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
        }

        bootstrap.Modal.getInstance(
            document.getElementById("modalNuevoVehiculo")
        )?.hide();

        obtenerVehiculos();

    } catch (error) {
        console.error("Error al guardar:", error);
    }
});

// ================= ELIMINAR =================
async function eliminar(id) {
    if (!confirm("¿Eliminar vehículo?")) return;

    await fetch(`${API}/${id}`, {
        method: "DELETE"
    });

    obtenerVehiculos();
}

// ================= BUSCADOR =================
function activarBuscador() {
    const buscador = document.getElementById("buscadorVehiculos");

    buscador.addEventListener("input", function () {
        const valor = this.value.toLowerCase();

        const filtrados = vehiculosGlobal.filter(v =>
            (v.marca || '').toLowerCase().includes(valor) ||
            (v.modelo || '').toLowerCase().includes(valor) ||
            (v.placa || '').toLowerCase().includes(valor)
        );

        renderVehiculos(filtrados);
    });
}

// ================= CONTADORES =================
function actualizarContadores() {
    const total = vehiculosGlobal.length;

    const disponibles = vehiculosGlobal.filter(v => v.estado === "Disponible").length;
    const rentados = vehiculosGlobal.filter(v => v.estado === "Rentado").length;
    const mantenimiento = vehiculosGlobal.filter(v => v.estado === "Mantenimiento").length;
    const inactivos = vehiculosGlobal.filter(v => v.estado === "Inactivo").length;

    document.getElementById("totalVehiculos").innerText = total;
    document.getElementById("vehiculosDisponibles").innerText = disponibles;
    document.getElementById("vehiculosRentados").innerText = rentados;
    document.getElementById("vehiculosMantenimiento").innerText = mantenimiento;
    document.getElementById("vehiculosInactivos").innerText = inactivos;
}

// ================= INICIO =================
document.addEventListener("DOMContentLoaded", () => {
    obtenerVehiculos();
    activarBuscador();
});

// EXPOSE GLOBAL

window.editar = editar;
window.eliminar = eliminar;