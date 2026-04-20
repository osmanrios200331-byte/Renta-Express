const API_PAGOS = "http://localhost:3000/api/pagos";
const API_RENTAS = "http://localhost:3000/api/rentas";
const API_CLIENTES = "http://localhost:3000/api/clientes";

let pagosGlobal = [];
let rentasGlobal = [];
let clientesGlobal = [];
let editandoId = null;

// ================= OBTENER PAGOS =================
async function obtenerPagos() {
    const res = await fetch(API_PAGOS);
    const data = await res.json();

    pagosGlobal = data;

    renderPagos(pagosGlobal);
    calcularRecaudo();
}

// ================= OBTENER RENTAS =================
async function obtenerRentas() {
    const res = await fetch(API_RENTAS);
    const data = await res.json();

    rentasGlobal = data;
    cargarRentas();
}

// ================= OBTENER CLIENTES =================
async function obtenerClientes() {
    const res = await fetch(API_CLIENTES);
    clientesGlobal = await res.json();
}

// ================= HELPERS =================
function obtenerNombreCliente(id) {
    const c = clientesGlobal.find(c => c.id == id);
    return c ? c.nombre : "N/A";
}

function calcularTotalRenta(r) {
    if (!r.fechaInicio || !r.fechaFin || !r.tarifaAplicada) return 0;

    const inicio = new Date(r.fechaInicio);
    const fin = new Date(r.fechaFin);

    const dias = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
    return dias * r.tarifaAplicada;
}

// ================= CARGAR RENTAS =================
function cargarRentas() {
    const select = document.getElementById("renta");

    select.innerHTML = `<option value="">Seleccionar renta</option>`;

    rentasGlobal.forEach(r => {
        const total = r.total || calcularTotalRenta(r);

        select.innerHTML += `
            <option value="${r.id}">
                Renta #${r.id} - $${total}
            </option>
        `;
    });
}

// ================= RENDER =================
function renderPagos(lista) {
    const tabla = document.getElementById("tablaPagos");
    tabla.innerHTML = "";

    lista.forEach(p => {
        tabla.innerHTML += `
            <tr>
                <td>${p.idRenta}</td>
                <td>${p.cliente}</td>
                <td>$${Number(p.monto).toLocaleString()}</td>
                <td>${p.metodo}</td>
                <td>${p.referencia || "-"}</td>
                <td>${p.fecha}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editar(${p.id})">✏️</button>
                    <button class="btn btn-sm btn-danger" onclick="eliminar(${p.id})">🗑️</button>
                </td>
            </tr>
        `;
    });
}

// ================= EDITAR (🔥 FIX) =================
function editar(id) {

    const p = pagosGlobal.find(p => p.id == id);

    if (!p) {
        alert("Pago no encontrado");
        return;
    }

    editandoId = id;

    document.getElementById("renta").value = p.idRenta || "";
    document.getElementById("cliente").value = p.cliente || "";
    document.getElementById("monto").value = p.monto || "";
    document.getElementById("metodo").value = p.metodo || "";
    document.getElementById("referencia").value = p.referencia || "";
    document.getElementById("fecha").value = p.fecha || "";

    abrirModalPago();
}

// ================= ELIMINAR =================
async function eliminar(id) {
    if (!confirm("¿Eliminar pago?")) return;

    await fetch(`${API_PAGOS}/${id}`, { method: "DELETE" });
    obtenerPagos();
}

// ================= TOTAL =================
function calcularRecaudo() {
    const total = pagosGlobal.reduce((acc, p) => acc + Number(p.monto), 0);

    document.getElementById("totalRecaudo").innerText = total.toLocaleString();
}

// ================= MODAL =================
function abrirModalPago() {
    const modal = bootstrap.Modal.getOrCreateInstance(
        document.getElementById("modalPago")
    );

    modal.show();

    const hoy = new Date().toISOString().split("T")[0];
    document.getElementById("fecha").value = hoy;
}

function cerrarModal() {
    bootstrap.Modal.getOrCreateInstance(
        document.getElementById("modalPago")
    ).hide();

    document.getElementById("formPago").reset();
    editandoId = null;
}

// ================= INICIO =================
document.addEventListener("DOMContentLoaded", async () => {

    await obtenerClientes();
    await obtenerRentas();
    await obtenerPagos();

    // 🔥 CAMBIO DE RENTA
    document.getElementById("renta").addEventListener("change", function () {

        const r = rentasGlobal.find(x => x.id == this.value);

        if (r) {
            const total = r.total || calcularTotalRenta(r);

            document.getElementById("cliente").value =
                r.cliente || obtenerNombreCliente(r.idCliente);

            document.getElementById("monto").value = total;
        }
    });

    // 🔍 BUSCADOR
    document.getElementById("buscadorPagos").addEventListener("input", function () {

        const valor = this.value.toLowerCase();

        const filtrados = pagosGlobal.filter(p =>
            (p.cliente || "").toLowerCase().includes(valor) ||
            (p.referencia || "").toLowerCase().includes(valor)
        );

        renderPagos(filtrados);
    });

    // 💾 GUARDAR
    document.getElementById("formPago").addEventListener("submit", async (e) => {

        e.preventDefault();

        const renta = document.getElementById("renta").value;
        const cliente = document.getElementById("cliente").value;
        const monto = document.getElementById("monto").value;
        const metodo = document.getElementById("metodo").value;
        const referencia = document.getElementById("referencia").value;
        const fecha = document.getElementById("fecha").value;

        if (!renta) {
            alert("Selecciona una renta");
            return;
        }

        const payload = {
            idRenta: renta,
            cliente,
            monto: Number(monto),
            metodo,
            referencia,
            fecha
        };

        try {
            if (editandoId) {
                await fetch(`${API_PAGOS}/${editandoId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            } else {
                await fetch(API_PAGOS, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            }

            cerrarModal();
            obtenerPagos();

        } catch (error) {
            console.error("Error:", error);
        }
    });

});

// ================= GLOBAL =================
window.editar = editar;
window.eliminar = eliminar;
window.abrirModalPago = abrirModalPago;