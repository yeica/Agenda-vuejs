var app = new Vue({
  el: "#app",
  data: {
    color: "#007bff",
    mensaje: "",
    foto: "",
    nombre: "",
    telefono: "",
    correo: "",
    direccion: "",
    sexo: "none",
    busqueda: "",
    contactos: [],
    busquedaArray: [],
    index: 0,
    modalTitulo: "",
    agregando: true,
    btnText: "Agregar",
  },
  methods: {
    //Abrir Modal
    openModal: function (opcion, index) {
      if (opcion == "agregar") {
        this.agregando = true;
        this.modalTitulo = "Agregar Contacto";
        this.btnText = "Agregar";
      } else if (opcion == "editar") {
        this.index = index;
        this.agregando = false;
        this.modalTitulo = "Editar Contacto";
        this.btnText = "Guardar Cambios";

        this.foto = this.contactos[index].foto;
        this.nombre = this.contactos[index].nombre;
        this.telefono = this.contactos[index].telefono;
        this.correo = this.contactos[index].correo;
        this.direccion = this.contactos[index].direccion;
        this.sexo = this.contactos[index].sexo;
      }
    },

    //Funciones de validación
    validarForm: function () {
      if (this.nombre == "" || this.telefono == "" || this.correo == "" || this.direccion == "" || this.sexo == "none") {
        this.mensaje = "Todos los campos son obligatorios."
      }
      else if (this.telefono.length < 12) {
        this.mensaje = "El teléfono debe tener una longitud de 12 digitos."
      }
      else if (this.validarCorreo(this.correo) == false) {
        this.mensaje = "Digite un correo válido."
      }
      else {
        if (this.agregando == true) {
          this.agregarContacto();
        }
        else {
          this.editarContacto();
        }

        this.closeModal();
      }
    },

    validarCorreo: function (correo) {
      if (/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(correo)) {
        return true;
      } else {
        return false;
      }
    },

    //Cerrar Modal
    closeModal: function () {
      $('#modal').modal('hide');
      this.nombre = "";
      this.telefono = "";
      this.correo = "";
      this.direccion = "";
      this.sexo = "none";
      this.mensaje = "";
    },

    agregarContacto: function () {
      this.foto = this.asignarFoto(this.sexo);

      this.contactos.push({
        foto: this.foto,
        nombre: this.nombre,
        telefono: this.telefono,
        correo: this.correo,
        direccion: this.direccion,
        sexo: this.sexo,
      });

      this.busquedaArray = this.contactos;
      this.actualizarLocalStorage();
    },

    eliminarContacto: function (index) {
      this.contactos.splice(index, 1);
      this.actualizarLocalStorage();
    },

    editarContacto: function () {
      if (this.contactos[this.index].sexo != this.sexo) {
        this.contactos[this.index].foto = this.asignarFoto(this.sexo);
      }
      this.contactos[this.index].nombre = this.nombre;
      this.contactos[this.index].telefono = this.telefono;
      this.contactos[this.index].correo = this.correo;
      this.contactos[this.index].direccion = this.direccion;
      this.contactos[this.index].sexo = this.sexo;

      this.actualizarLocalStorage();
    },

    buscarContacto: function () {
      this.busqueda = this.busqueda.toLowerCase();

      if (this.busqueda == "") {
        this.busquedaArray = this.contactos;
      } else {
        this.busquedaArray = [];

        for (let x = 0; x < this.contactos.length; x++) {
          if (this.contactos[x].nombre.toLowerCase().includes(this.busqueda)) {
            this.busquedaArray.push(this.contactos[x]);
          } else if (
            this.contactos[x].telefono.toLowerCase().includes(this.busqueda)
          ) {
            this.busquedaArray.push(this.contactos[x]);
          } else if (
            this.contactos[x].correo.toLowerCase().includes(this.busqueda)
          ) {
            this.busquedaArray.push(this.contactos[x]);
          } else if (
            this.contactos[x].direccion.toLowerCase().includes(this.busqueda)
          ) {
            this.busquedaArray.push(this.contactos[x]);
          } else if (
            this.contactos[x].sexo.toLowerCase().includes(this.busqueda)
          ) {
            this.busquedaArray.push(this.contactos[x]);
          }
        }
      }
    },

    asignarFoto: function (sexo) {
      let foto;

      if (sexo == "hombre") {
        foto =
          "boy (" + (Math.floor(Math.random() * 26) + 1).toString() + ").png";
      } else {
        foto =
          "girl (" + (Math.floor(Math.random() * 24) + 1).toString() + ").png";
      }

      return foto;
    },

    manejarLocalStorage: function (){
      let datosLS = JSON.parse(localStorage.getItem("agenda"));

      if (datosLS == null) {
        this.contactos = [];
      }
      else {
        this.contactos = datosLS;
        this.busquedaArray = this.contactos;
      }
    },

    actualizarLocalStorage: function () {
      localStorage.setItem("agenda", JSON.stringify(this.contactos));
    },

    establecerColor: function () {
      document.cookie = "color=" + this.color;
    },

    leerCookie: function () {

      let colorCookie = document.cookie.match('(^|;)\\s*' + 'color' + '\\s*=\\s*([^;]+)');

      if (colorCookie == null) {
        document.cookie = "color=" + this.color;
      }
      else {
        this.color = colorCookie[2];
      }
    }
  },
  //Antes de que inicie la aplicación...
  created: function () {
    this.leerCookie();
    this.manejarLocalStorage();
  },

  mounted(){
    $(this.$refs.vuemodal).on("hidden.bs.modal", this.closeModal)
  }
});
