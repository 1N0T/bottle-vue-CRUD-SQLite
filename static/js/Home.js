const Home = Vue.component('homeComponent', { 
  template: `
    <div class="w3-container">
      <h1 class="w3-display-middle">{{ title }}</h1>
    </div>`
  ,
  data: function() {
      return {
        title: 'Gestión de proyectos',
      }
  },
  methods: {
  },
  mounted() {
  }
        
})
