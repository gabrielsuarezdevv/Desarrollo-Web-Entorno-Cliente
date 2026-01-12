class Tarea {
    constructor(id, descripcion) {
        this._id = id;
        this._descripcion = descripcion;
    }

    get id() { return this._id; }
    get descripcion() { return this._descripcion; }

    set descripcion(nuevaDesc) {
        this._descripcion = nuevaDesc;
    }
}

class GestorTareas {
    constructor() {
        this.tareas = [];
        this.cargarDesdeCookies();
        this.renderizarTareas();
    }

    agregarTarea(descripcion) {
        // Cálculo de ID incremental
        const id = this.tareas.length > 0 ? this.tareas[this.tareas.length - 1].id + 1 : 1;
        const nuevaTarea = new Tarea(id, descripcion);
        this.tareas.push(nuevaTarea);
        this.guardarEnCookies();
        this.renderizarTareas();
    }

    eliminarTarea(id) {
        this.tareas = this.tareas.filter(t => t.id !== id);
        this.guardarEnCookies();
        this.renderizarTareas();
    }

    editarTarea(id, nuevaDescripcion) {
        const tarea = this.tareas.find(t => t.id === id);
        if (tarea) {
            tarea.descripcion = nuevaDescripcion;
            this.guardarEnCookies();
            this.renderizarTareas();
        }
    }

    guardarEnCookies() {
        // Guardamos el array como JSON. Usamos encodeURIComponent para evitar errores con caracteres raros.
        const datos = encodeURIComponent(JSON.stringify(this.tareas));
        document.cookie = `tareas=${datos}; path=/; max-age=864000`; // Expira en 10 días
    }

    cargarDesdeCookies() {
        const cookies = document.cookie.split('; ');
        const tareaCookie = cookies.find(row => row.startsWith('tareas='));
        
        if (tareaCookie) {
            try {
                const valorCookie = decodeURIComponent(tareaCookie.split('=')[1]);
                const tareasArray = JSON.parse(valorCookie);
                
                // CORRECCIÓN: Al reconstruir, usamos t._id porque así se guarda en el JSON
                this.tareas = tareasArray.map(t => new Tarea(t._id, t._descripcion));
            } catch (e) {
                console.error("Error cargando cookies", e);
                this.tareas = [];
            }
        }
    }

    renderizarTareas() {
        const tabla = document.getElementById('tablaTareas');
        tabla.innerHTML = '';

        this.tareas.forEach(tarea => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${tarea.id}</td>
                <td>${tarea.descripcion}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="abrirModalEditar(${tarea.id})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="abrirModalEliminar(${tarea.id})">Eliminar</button>
                </td>
            `;
            tabla.appendChild(fila);
        });
    }
}

// --- CONEXIÓN CON LA INTERFAZ ---

const gestor = new GestorTareas();
const formModal = new bootstrap.Modal(document.getElementById('formModal'));
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

function abrirModalCrear() {
    document.getElementById('taskId').value = "";
    document.getElementById('taskDesc').value = "";
    document.getElementById('errorMsg').style.display = "none";
    document.getElementById('formModalLabel').innerText = "Nueva Tarea";
    formModal.show();
}

function abrirModalEditar(id) {
    const tarea = gestor.tareas.find(t => t.id === id);
    if (tarea) {
        document.getElementById('taskId').value = tarea.id;
        document.getElementById('taskDesc').value = tarea.descripcion;
        document.getElementById('errorMsg').style.display = "none";
        document.getElementById('formModalLabel').innerText = "Editar Tarea";
        formModal.show();
    }
}

function guardarTarea() {
    const idStr = document.getElementById('taskId').value;
    const desc = document.getElementById('taskDesc').value.trim();
    
    if (desc === "") {
        document.getElementById('errorMsg').style.display = "block";
        return;
    }

    if (idStr) {
        gestor.editarTarea(parseInt(idStr), desc);
    } else {
        gestor.agregarTarea(desc);
    }
    formModal.hide();
}

function abrirModalEliminar(id) {
    document.getElementById('deleteTaskId').value = id;
    deleteModal.show();
}

function confirmarEliminar() {
    const id = parseInt(document.getElementById('deleteTaskId').value);
    gestor.eliminarTarea(id);
    deleteModal.hide();
}