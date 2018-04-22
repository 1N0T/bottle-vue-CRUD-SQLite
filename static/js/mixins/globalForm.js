var globalForm = {
  data: function() {
    return {
      windowWidth: 0,
      windowHeight: 0,
      
      botones: {
        nuevo:   true,
        guardar: false,
        borrar:  false,
        lista:   true,
        buscar:  true
      },

      url: {
        clave:     '',
        datos:     {},
        qry:       {},
        registros: [],
        base:      'http://localhost:6789/api/',
        entidad:   '',
        status:    '',
      },
      
      lista: [],
      mensajes: [],

      ordenLista: {
        columna: '',
        orden: ''
      },
    
      mensajesAbierto: false,
      listaAbierta: false,
      filtroAbierto: false,
      anchoLista: 350
    }
  },
   
  methods: {
    getWindowWidth(event) {
      this.windowWidth = document.documentElement.clientWidth;
    },

    getWindowHeight(event) {
      this.windowHeight = document.documentElement.clientHeight;
    },

    listOpenClose() {
      this.listaAbierta = !this.listaAbierta
    },

    filterOpenClose() {
      this.filtroAbierto = !this.filtroAbierto
    },

    postCargarFicha() {
      Object.keys(this.ficha).forEach((key,index) => {
        if ((key.substring(0, 5) == 'fecha') && (this.url.registros[0][key])) {
          this.url.registros[0][key] = this.url.registros[0][key].substring(0, 10);
        }
        this.ficha[key] = this.url.registros[0][key]
      })
      this.botones.guardar = true
      this.botones.borrar  = true
      this.registroNuevo   = false
    },

    postFiltrar() {
      this.lista = this.url.registros.slice()
      this.ordenLista.columna = ''
      this.ordenLista.orden = ''
  },

    postGrabar() {
      if (this.url.status == 'OK') {
        this.onFichaNuevo()
        this.cargarTodo()
        this.ordenLista.columna = ''
        this.ordenLista.orden = ''
      }      
    },

    postBorrar() {
      if (this.url.status == 'OK') {
        this.onFichaNuevo()
        this.cargarTodo()
      }      
    },

    urlDatos() {
      this.url.datos = {}
      Object.keys(this.ficha).forEach((key,index) => {
        this.url.datos[key] = this.ficha[key]
      })
    },

    urlQry() {
      this.url.qry = {}
      Object.keys(this.filtro).forEach((key,index) => {
        // Sólo añadimos al filtro los valores que se hayan definido (sean <> '')
        if (this.filtro[key].toString().length) {
          this.url.qry[key] = this.filtro[key]
        }
      })
    },

    peticionAJAX(metodo, url, datos, callback) {
      this.trabajando    = true
      this.mensajes      = []
      this.url.registros = []
      this.url.status    = ''

      switch(metodo) {
        case 'GET':
          peticion = axios.get
          break;
        case 'POST':
          peticion = axios.post
          break;
        case 'PUT':
          peticion = axios.put
          break;
        case 'DELETE':
          peticion = axios.delete
          break;
      } 
      peticion(url, datos)
      .then((response) => {
        this.url.status    = response.data.status
        this.mensajes      = response.data.mensajes
        this.url.registros = response.data.datos
        if (callback) {
          callback()
        }
        this.$nextTick(() => {
          if (this.url.status == 'KO') {
            this.mensajesAbierto = true
          }
          this.trabajando = false
        })
      })
      .catch((err) => {
        console.log(err)
        this.mensajes.push(err)
        this.$nextTick(() => {
          this.mensajesAbierto = true
          this.trabajando      = false
        })
      })
    },

    ordenarLista(columna) {
      // Si la lista ya ha sido clasificada por la columna actual cambiamos el orden
      if (this.ordenLista.columna == columna) {
        if (this.ordenLista.orden == 'asc') {
          this.ordenLista.orden = 'desc'
        } else {
          this.ordenLista.orden = 'asc'          
        }
      } else {
        this.ordenLista.columna = columna
        this.ordenLista.orden   = 'asc'
      }
      sortObjectArrayByKey(this.lista, this.ordenLista.columna, this.ordenLista.orden)
    }
  
  },

  mounted() {
    // this.onLoadData()
    this.$nextTick(function() {
      window.addEventListener('resize', this.getWindowWidth);
      window.addEventListener('resize', this.getWindowHeight);
        
      this.getWindowWidth()
      this.getWindowHeight()
    })    
  },
  
  beforeDestroy() {
    window.removeEventListener('resize', this.getWindowWidth);
    window.removeEventListener('resize', this.getWindowHeight);
  }   
}
