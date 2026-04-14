// 🔥 URL correcta de la API
const API = "http://localhost:3000/api/clientes";

let editandoId = null;
let clientesGlobal = [];

// ================= OBTENER CLIENTES =================
async function obtenerClientes() {
    try {
        const res = await fetch(API);
        const data = await res.json();

        clientesGlobal = data;
        renderClientes(clientesGlobal);

    } catch (error) {
        console.error("Error al obtener clientes:", error);
    }
}

// ================= RENDERIZAR =================
function renderClientes(lista) {
    const tabla = document.getElementById("tablaClientes");
    tabla.innerHTML = "";

    lista.forEach(c => {
        tabla.innerHTML += `
            <tr>
                <td>${c.tipo_doc || ''}</td>
                <td>${c.documento || ''}</td>
                <td>${c.nombre || ''}</td>
                <td>${c.telefono || ''}</td>
                <td>${c.email || ''}</td>
                <td>${c.licencia || ''}</td>
                <td>${c.fechaRegistro || ''}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editar(${c.id})">✏️</button>
                    <button class="btn btn-sm btn-danger" onclick="eliminar(${c.id})">🗑️</button>
                </td>
            </tr>
        `;
    });
}

// ================= ABRIR MODAL =================
function abrirModal() {
    editandoId = null;
    document.getElementById("formCliente").reset();

    const modal = new bootstrap.Modal(document.getElementById("modalCliente"));
    modal.show();
}

// ================= EDITAR =================
async function editar(id) {
    try {
        const res = await fetch(`${API}/${id}`);
        const c = await res.json();

        editandoId = id;

        const form = document.getElementById("formCliente");

        form.tipo_doc.value = c.tipo_doc || '';
        form.documento.value = c.documento || '';
        form.nombre.value = c.nombre || '';
        form.telefono.value = c.telefono || '';
        form.email.value = c.email || '';
        form.licencia.value = c.licencia || '';
        form.fecha.value = c.fechaRegistro ? c.fechaRegistro.split(',')[0] : '';

        const modal = new bootstrap.Modal(document.getElementById("modalCliente"));
        modal.show();

    } catch (error) {
        console.error("Error al editar:", error);
    }
}

// ================= GUARDAR =================
document.addEventListener("submit", async function (e) {
    if (e.target.id === "formCliente") {
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

            const modal = bootstrap.Modal.getInstance(document.getElementById("modalCliente"));
            modal.hide();

            e.target.reset();
            obtenerClientes();

        } catch (error) {
            console.error("Error al guardar:", error);
        }
    }
});

// ================= ELIMINAR =================
async function eliminar(id) {
    try {
        const confirmar = confirm("¿Eliminar cliente?");
        if (!confirmar) return;

        await fetch(`${API}/${id}`, {
            method: "DELETE"
        });

        obtenerClientes();

    } catch (error) {
        console.error("Error al eliminar:", error);
    }
}

// ================= BUSCADOR =================
function activarBuscador() {
    const buscador = document.getElementById("buscador");

    buscador.addEventListener("input", function () {
        const valor = this.value.toLowerCase();

        const filtrados = clientesGlobal.filter(c =>
            (c.nombre || '').toLowerCase().includes(valor) ||
            (c.documento || '').toLowerCase().includes(valor)
        );

        renderClientes(filtrados);
    });
}

// ================= INICIAR =================
document.addEventListener("DOMContentLoaded", () => {
    obtenerClientes();
    activarBuscador();
});