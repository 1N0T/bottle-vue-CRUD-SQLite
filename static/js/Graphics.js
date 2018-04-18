const Graphicss = Vue.component('graficX', { 
   template: `
	<div>
		<h4>{{ title }}</h4>

	</div>`
   ,
   data: function() {
      return {
        title: 'Gráficos',
        result: ''
      }
   },
   methods: {
      getAll: function () {
        axios.get('/DIALOGS/')
          .then(response => {
            this.result = response.data
          })
          .catch(error => {
            console.log(error)
          });
      }
    },
    mounted() {
        this.getAll()
    }
        
})
