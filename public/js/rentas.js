
    // Cerrar sesión
    document.getElementById('logoutBtn').addEventListener('click', () => {
        fetch('/logout', { method: 'POST' })
            .then(() => window.location.href = '/');
    });

    // Calcular valor total automáticamente
    function calcularTotal() {
        const inicio = new Date(document.getElementById('fechaInicio').value);
        const fin = new Date(document.getElementById('fechaFin').value);
        const tarifa = parseFloat(document.getElementById('tarifaAplicada').value) || 0;

        if (inicio && fin && fin > inicio) {
            const dias = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
            document.getElementById('valorTotal').value = dias * tarifa;
        }
    }

    document.getElementById('fechaInicio').addEventListener('change', calcularTotal);
    document.getElementById('fechaFin').addEventListener('change', calcularTotal);
    document.getElementById('tarifaAplicada').addEventListener('input', calcularTotal);
