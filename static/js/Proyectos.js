const Proyectos = Vue.component('proyectosComponent', { 
  template: `
    <div>
      <div class="botonera">
        <center>
        <div>
          <i v-if="botones.nuevo"   class="fa fa-file-o   w3-xlarge" @click="onFichaNuevo"></i>
          <i v-if="botones.guardar" class="fa fa-floppy-o w3-xlarge" @click="onFichaGuardar"></i>
          <i v-if="botones.borrar"  class="fa fa-trash-o  w3-xlarge" @click="onFichaBorrar"></i>
          <i v-if="botones.lista"   class="fa fa-list     w3-xlarge" @click="listOpenClose"></i>
          <i v-if="botones.buscar"  class="fa fa-search   w3-xlarge" @click="filterOpenClose"></i>
        </div>
        </center>
      </div>
      <i class="fa fa-refresh fa-spin fa-3x fa-fw w3-xlarge trabajando" v-if="trabajando"></i>


      <div v-if="filtroAbierto" class="w3-modal" style="display: block">
        <div class="w3-modal-content w3-card-4">
          <div class="w3-container w3-text-white gradiente">
            <h5>{{ filtroPlantilla.titulo }}</h5>
          </div>

          <div class="w3-container">
            <img src="static/images/flor.svg" class="w3-display-topright puntero" @click="filterOpenClose"/>

            <form class="w3-text-teal w3-section">
              <div class="w3-row">
                <div class="w3-col w3-right-align w3-margin-right s12 m3">
                  Código igual
                </div>
                <div class="w3-col s12 m8">
                  <input class="w3-input w3-border" type="text" v-model="filtro.idEQ" placeholder="Igual a">
                </div>
              </div>
              <div class="w3-row">
                <div class="w3-col w3-right-align w3-margin-right s12 m3">
                  Código contiene
                </div>
                <div class="w3-col s12 m8">
                  <input class="w3-input w3-border" type="text" v-model="filtro.idLIKE" placeholder="Contiene a">
                </div>
              </div>
              <div class="w3-row">
                <div class="w3-col w3-right-align w3-margin-right s12 m3">
                  Rango códigos
                </div>
                <div class="w3-col s12 m4">
                  <input class="w3-input w3-border" type="text" v-model="filtro.idGE" placeholder="Mayor o igual a">
                </div>
                <div class="w3-col  s12 m4">
                  <input class="w3-input w3-border" type="text" v-model="filtro.idLE" placeholder="Menor o igual a">
                </div>
              </div>
              <div class="w3-row">
                <div class="w3-col w3-right-align w3-margin-right s12 m3">
                  Descripción contiene
                </div>
                <div class="w3-col s12 m8">
                  <input class="w3-input w3-border" type="text" v-model="filtro.descripcionLIKE" placeholder="Parecida a">
                </div>
              </div>
              <div class="w3-section w3-center">
                <button class="w3-btn w3-orange" @click="onFiltroFiltrar" >Filtrar</button>
              </div> 
            </form>
          </div>
        </div>
      </div>

      
      <div v-if="mensajesAbierto" class="w3-modal" style="display: block">
        <div class="w3-modal-content w3-card-4">
          <div class="w3-container w3-text-white gradiente">
            <h5>Mensajes</h5>
          </div>

          <div class="w3-container">
            <img src="static/images/flor.svg" class="w3-display-topright puntero" @click="mensajesAbierto=false"/>

            <form class="w3-text-teal w3-section">
              <ul>
                <li v-for="mensaje in mensajes">{{ mensaje }}</li>
              </ul>
              <div class="w3-section w3-center">
                <button class="w3-btn w3-orange" @click="mensajesAbierto=false">Aceptar</button>
              </div> 
            </form>
          </div>
        </div>
      </div>



      <div class="w3-row w3-text-teal">
        <div class="w3-col lista" v-if="listaAbierta" :style="{height: windowHeight - 38 +'px', width: anchoLista + 'px'}">
          <div class=w3-row>
            <div class="w3-col m12 cf">
              <input class="w3-input w3-border" type="text" v-model="filtroLista" placeholder="Filtrar lista por ...">
            </div>
          </div>
          <div class=w3-row>
            <div class="w3-col m3 cf"><b>Id.</b></div>
            <div class="w3-col m9 cf"><b>Descripción</b></div>
          </div>
          <div class="listacontent" :style="{height: windowHeight - 150 +'px', width: anchoLista + 'px'}">
          <div class="w3-row w3-hover-orange" v-for="item in listaFiltrada" @click="cargarRegistro(item.id)">
            <div class="w3-col m3 cf">{{ item.id }}</div>
            <div class="w3-col m9 cf">{{ item.descripcion }}</div>
          </div>
          </div>
        </div>


        <div class="w3-container w3-rest ficha" :style="{height: windowHeight - 38 +'px'}">
          <form class="w3-text-teal w3-section w3-padding" @change="onFichaChange" @submit.prevent="onSubmit">
            <div class="w3-row">
              <div class="w3-col w3-right-align w3-margin-right s12 m2">
                <b>Código</b>
              </div>
              <div class="w3-col s12 m4">
                <input class="w3-input w3-border" type="text" v-model="ficha.id" placeholder="Código del proyecto" :readonly="!registroNuevo">
              </div>
            </div>
            <div class="w3-row">
              <div class="w3-col w3-right-align w3-margin-right s12 m2">
              <b>Descripción</b>
              </div>
              <div class="w3-col s12 m8">
                <input class="w3-input w3-border" type="text" v-model="ficha.descripcion" placeholder="Descripción del proyecto">
              </div>
            </div>
            <div class="w3-row">
              <div class="w3-col w3-right-align w3-margin-right s12 m2">
                Estado
              </div>
              <div class="w3-col s12 m8">
                <select class="w3-select" v-model="ficha.estado">
                  <option v-for="estado in estados" :value="estado.id">{{estado.descripcion}}</option>
                </select>              
              </div>
            </div>
            <div class="w3-row">
              <div class="w3-col w3-right-align w3-margin-right s12 m2">
                Responsable
              </div>
              <div class="w3-col s12 m8">
                <select class="w3-select" v-model="ficha.responsable" >
                <option value="" disabled>Selecciona un responsable</option>
                <option v-for="responsable in responsables" :value="responsable.id">{{responsable.nombre}}</option>
                </select>              
              </div>
            </div>
            <div class="w3-row">
              <div class="w3-col w3-right-align w3-margin-right s12 m2">
                Fecha de petición
              </div>
              <div class="w3-col s12 m4">
                <input class="w3-input w3-border" type="date" v-model="ficha.fecha_peticion" placeholder="Descripción del proyecto">
              </div>
            </div>
            <div class="w3-row">
              <div class="w3-col w3-right-align w3-margin-right s12 m2">
                Fecha de inicio
              </div>
              <div class="w3-col s12 m4">
                <input class="w3-input w3-border" type="date" v-model="ficha.fecha_inicio" placeholder="Descripción del proyecto">
              </div>
            </div>
            <div class="w3-row">
              <div class="w3-col w3-right-align w3-margin-right s12 m2">
                Fecha de fin
              </div>
              <div class="w3-col s12 m4">
                <input class="w3-input w3-border" type="date" v-model="ficha.fecha_fin" placeholder="Descripción del proyecto">
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>`    
    ,

    mixins: [
      globalForm
    ],

    data: function() {
      return {
        titulo: 'Mantenimiento de proyectos',
        filtroPlantilla: {
          titulo: 'Filtro de proyectos',
        },
        filtro: {
          idEQ: '',
          idLIKE: '',
          idGE: '',
          idLE: '',
          descripcionLIKE: ''
        },
        ficha: {
          id: '',
          descripcion: '',
          estado: '',
          responsable: '',
          fecha_peticion: new Date().toISOString().slice(0, 10),
          fecha_inicio: new Date().toISOString().slice(0, 10),
          fecha_fin: new Date().toISOString().slice(0, 10)
        },
        estados: [
          {id: 1, descripcion: 'Pendiente'},
          {id: 2, descripcion: 'En estudio'},
          {id: 3, descripcion: 'Aceptado'},
          {id: 4, descripcion: 'En curso'},
          {id: 5, descripcion: 'Finalizado'},
        ],
        responsables: [
          {id: 1, nombre: 'Pedro'},
          {id: 2, nombre: 'Alberto'},
          {id: 3, nombre: 'María'},
          {id: 4, nombre: 'Juana'},
          {id: 5, nombre: 'Laura'},
        ],
        listaAbierta: true,
        filtroLista: '',
        trabajando: false,
        registroNuevo: true,
      }
    },

    methods: {
      onFichaChange() {
        this.botones.guardar = true
      },
      onFichaNuevo() {
        Object.keys(this.ficha).forEach((key,index) => {
          this.ficha[key] = ''
          if (key.startsWith("fecha")) {
            this.ficha[key] = new Date().toISOString().slice(0, 10)
          }
        })
        this.botones.guardar = false
        this.botones.borrar  = false
        this.registroNuevo   = true
      },
      onFiltroFiltrar() {
        this.urlQry()
        this.filtroAbierto = false
        this.cargarTodo()
      },
      urlClave() {
        this.url.clave = this.ficha.id
      },
      cargarRegistro(id) {
        this.peticionAJAX('GET', this.url.base + this.url.entidad + '/' + id, '', this.postCargarFicha)
      },
      cargarTodo() {
        this.url.entidad = 'proyectos'
        this.url.qry     = {}
        this.urlQry()
        this.peticionAJAX('GET', this.url.base + this.url.entidad + '/qry/' + JSON.stringify(this.url.qry), '', this.postFiltrar)
      },
      onFichaGuardar() {
        // Validamos el formulario y si todo es correcto guardamos los datos
        this.urlDatos()  
        if ( this.registroNuevo ) {
          // Se trata de un registro nuevo. Lo añadimos
          this.peticionAJAX('POST', this.url.base + this.url.entidad + '/', this.url.datos, this.postGrabar)
        } else {
          // Se trata de un registro existente. Lo modificamos.
          this.peticionAJAX('PUT', this.url.base + this.url.entidad + '/', this.url.datos, this.postGrabar)
        }
      },        
      onFichaBorrar() {
        this.urlClave()  
        this.peticionAJAX('DELETE', this.url.base + this.url.entidad + '/' + this.url.clave, '', this.postBorrar)
      },        
    },

    computed: {
      listaFiltrada() {
        return this.lista.filter(( objeto ) => {
          let cadena = objeto['id'].toString() + objeto['descripcion'].toString()        
          let aBuscar = this.filtroLista
          return searchIgnoringAccents(cadena, aBuscar)
        })
      }    
    },
  
    mounted() {
      this.cargarTodo()
    }
        
})
