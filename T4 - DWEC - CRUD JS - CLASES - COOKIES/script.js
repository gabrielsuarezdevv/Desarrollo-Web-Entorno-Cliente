class Tarea {
    constructor(id, descripcion) {
        this._id = id;
        this._descripcion = descripcion;
    }

    // Getters
    get id() { return this._id; }
    get descripcion() { return this._descripcion; }

    // Setters
    set descripcion(nuevaDescripcion) {
        this._descripcion = nuevaDescripcion;
    }
}