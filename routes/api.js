const express = require('express');
const router = express.Router();

// --- 1. BASE DE DATOS EN MEMORIA ---
let clientes = [];
let vehiculos = [];
let rentas = [];
let pagos = [];

// --- FUNCIÓN PARA GENERAR IDS ÚNICOS ---
const generarId = (arreglo) => {
    if (arreglo.length === 0) return 1;
    const ids = arreglo.map(item => item.id);
    return Math.max(...ids) + 1;
};

// ==========================================
// 2. CRUD: CLIENTES
// ==========================================

// 🔥 OBTENER TODOS
router.get('/clientes', (req, res) => {
    res.json(clientes);
});

// 🔥 OBTENER POR ID (CLAVE PARA EDITAR)
router.get('/clientes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const cliente = clientes.find(c => c.id === id);

    if (!cliente) {
        return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json(cliente);
});

// 🔥 CREAR
router.post('/clientes', (req, res) => {
    const nuevo = {
        id: generarId(clientes),
        ...req.body,
        fechaRegistro: new Date().toLocaleString()
    };

    clientes.push(nuevo);
    res.status(201).json(nuevo);
});

// 🔥 ACTUALIZAR
router.put('/clientes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = clientes.findIndex(c => c.id === id);

    if (index !== -1) {
        clientes[index] = {
            ...clientes[index],
            ...req.body
        };
        return res.json(clientes[index]);
    }

    res.status(404).json({ error: "Cliente no encontrado" });
});

// 🔥 ELIMINAR
router.delete('/clientes/:id', (req, res) => {
    clientes = clientes.filter(c => c.id !== parseInt(req.params.id));
    res.json({ mensaje: "Cliente eliminado" });
});


// ==========================================
// 3. CRUD: VEHICULOS
// ==========================================

// ==========================================
// 3. CRUD: VEHICULOS
// ==========================================

// 🔥 OBTENER TODOS
router.get('/vehiculos', (req, res) => {
    res.json(vehiculos);
});

// 🔥 OBTENER POR ID (PARA EDITAR)
router.get('/vehiculos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const vehiculo = vehiculos.find(v => v.id === id);

    if (!vehiculo) {
        return res.status(404).json({ error: "Vehículo no encontrado" });
    }

    res.json(vehiculo);
});

// 🔥 CREAR
router.post('/vehiculos', (req, res) => {
    const nuevo = {
        id: generarId(vehiculos),
        ...req.body,
        fechaRegistro: new Date().toLocaleString()
    };

    vehiculos.push(nuevo);
    res.status(201).json(nuevo);
});

// 🔥 ACTUALIZAR
router.put('/vehiculos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = vehiculos.findIndex(v => v.id === id);

    if (index !== -1) {
        vehiculos[index] = {
            ...vehiculos[index],
            ...req.body
        };
        return res.json(vehiculos[index]);
    }

    res.status(404).json({ error: "Vehículo no encontrado" });
});

// 🔥 ELIMINAR
router.delete('/vehiculos/:id', (req, res) => {
    vehiculos = vehiculos.filter(v => v.id !== parseInt(req.params.id));
    res.json({ mensaje: "Vehículo eliminado" });
});


// ==========================================
// 4. CRUD: RENTAS
// ==========================================

router.get('/rentas', (req, res) => res.json(rentas));

router.post('/rentas', (req, res) => {
    const { idCliente, idVehiculo, tarifaAplicada, dias } = req.body;

    const vIndex = vehiculos.findIndex(v => v.id === parseInt(idVehiculo));
    if (vIndex === -1) {
        return res.status(404).json({ error: "Vehículo no existe" });
    }

    const nuevo = {
        id: generarId(rentas),
        idCliente: parseInt(idCliente),
        idVehiculo: parseInt(idVehiculo),
        valorTotal: tarifaAplicada * dias,
        ...req.body
    };

    rentas.push(nuevo);

    // Cambiar estado del vehículo
    vehiculos[vIndex].estado = 'Rentado';

    res.status(201).json(nuevo);
});

router.put('/rentas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = rentas.findIndex(r => r.id === id);

    if (index !== -1) {
        rentas[index] = { ...rentas[index], ...req.body };
        return res.json(rentas[index]);
    }

    res.status(404).json({ error: "Renta no encontrada" });
});

router.delete('/rentas/:id', (req, res) => {
    rentas = rentas.filter(r => r.id !== parseInt(req.params.id));
    res.json({ mensaje: "Renta cancelada/eliminada" });
});


// ==========================================
// 5. CRUD: PAGOS
// ==========================================

router.get('/pagos', (req, res) => res.json(pagos));

router.post('/pagos', (req, res) => {
    const nuevo = {
        id: generarId(pagos),
        fechaPago: new Date().toLocaleString(),
        ...req.body
    };

    pagos.push(nuevo);
    res.status(201).json(nuevo);
});

router.put('/pagos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = pagos.findIndex(p => p.id === id);

    if (index !== -1) {
        pagos[index] = { ...pagos[index], ...req.body };
        return res.json(pagos[index]);
    }

    res.status(404).json({ error: "Pago no encontrado" });
});

router.delete('/pagos/:id', (req, res) => {
    pagos = pagos.filter(p => p.id !== parseInt(req.params.id));
    res.json({ mensaje: "Registro de pago eliminado" });
});

module.exports = router;