function abrirModalPago(){
    const modal = new bootstrap.Modal(document.getElementById('modalPago'));
    modal.show();
}

const form = document.getElementById("formPago");
const tabla = document.getElementById("tablaPagos");
const totalSpan = document.getElementById("totalRecaudo");

let total = 0;

form.addEventListener("submit", function(e){
    e.preventDefault();

    const datos = new FormData(form);

    const cliente = datos.get("cliente");
    const monto = parseInt(datos.get("monto"));
    const metodo = datos.get("metodo");
    const referencia = datos.get("referencia") || "NULL";
    const fecha = datos.get("fecha");

    total += monto;
    totalSpan.textContent = total.toLocaleString();

    tabla.innerHTML += `
        <tr>
            <td>--</td>
            <td>${cliente}</td>
            <td>$ ${monto.toLocaleString()}</td>
            <td>${metodo}</td>
            <td>${referencia}</td>
            <td>${fecha}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="eliminar(this, ${monto})">Eliminar</button>
            </td>
        </tr>
    `;

    form.reset();

    const modal = bootstrap.Modal.getInstance(document.getElementById('modalPago'));
    modal.hide();
});

function eliminar(btn, monto){
    btn.closest("tr").remove();
    total -= monto;
    totalSpan.textContent = total.toLocaleString();
}