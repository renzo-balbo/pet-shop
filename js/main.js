const pruebas = document.getElementById('pruebas')
const jugueteriaHTML = document.getElementById('jugueteriaHTML')
const farmaciaHTML = document.getElementById('farmaciaHTML')

const app = Vue.
createApp({
    data() {
      return {
        productos:[],
        juguetes: [],
        medicamentos: [],
        productosTotales: [],
        productosOrdenados: [],
        inputBusqueda: "",
        filtroSeleccionado: "",
        productosDestacados: [],
        productosDeInteres:[],
        carrito: [],
        carritoSinDuplicados: [],
        conuter: 0,
      };

    },
    created(){
        fetch("https://apipetshop.herokuapp.com/api/articulos")
        .then((respuesta) => respuesta.json())
        .then((json)=>{
            this.productos = json.response
            this.juguetes = this.productos.filter(producto =>producto.tipo == "Juguete")
            this.medicamentos = this.productos.filter(producto =>producto.tipo == "Medicamento")
            this.productosOrdenados = this.productos
            this.productosTotales = this.productos
            this.productosDestacados = this.juguetes.filter(producto =>producto.stock<5)
            if (pruebas){
              this.productosOrdenados = this.juguetes
              this.productosTotales = this.juguetes
            } else if (jugueteriaHTML) {        
              this.productosOrdenados = this.juguetes
              this.productosTotales = this.juguetes
              this.productosDeInteres = this.medicamentos.sort(() => Math.random() - 0.5)
            } else if (farmaciaHTML)  { 
              this.productosOrdenados = this.medicamentos
              this.productosTotales = this.medicamentos
              this.productosDeInteres = this.juguetes.sort(() => Math.random() - 0.5)
            }
            this.carrito = JSON.parse(localStorage.getItem("carrito"))
            this.carritoSinDuplicados = new Set(this.carrito)
            
            

        })
    },

    mounted() {},

    methods: {

      //------------------------------------------------- Funcionan
      ordenarAlfabeticamenteA(){
        this.productosOrdenados = this.productosTotales.sort((a,b) => { 
          if (a.nombre==b.nombre){ 
            return 0;
          }
          if (a.nombre < b.nombre) { 
            return -1; 
          }
          return 1;
        }) 
      },

        ordenarAlfabeticamenteZ(){                                  
          this.productosOrdenados = this.productosTotales.sort((a, b) =>{ 

          if (a.nombre==b.nombre){ 
            return 0;
          }
          if (a.nombre > b.nombre) { 
            return -1; 
          }
          return 1;
        });
      
      },

      ordenarPrecioMayor(){
        this.productosOrdenados = this.productosTotales.sort((a,b) => b.precio - a.precio)
      },

      ordenarPrecioMenor(){
        this.productosOrdenados = this.productosTotales.sort((a,b) => a.precio - b.precio)
      },

      filtroBusqueda(arrProd){
        this.productosOrdenados = arrProd.filter(prod => prod.nombre.toLowerCase().includes(this.inputBusqueda.toLowerCase()))
      },
      
      agregarAlCarrito(producto){
        this.carrito.push(producto)
        this.carritoSinDuplicados = new Set(this.carrito)
        localStorage.setItem("carrito", JSON.stringify(this.carrito))
      },
      
      eliminarDelCarrito(producto){
        let indice= this.carrito.indexOf(producto)
        this.carrito.splice(indice, 1)
        this.carritoSinDuplicados = new Set(this.carrito)
        localStorage.setItem("carrito", JSON.stringify(this.carrito))
      },
      //--------------------------------------------------

      costoTotal(){
        return this.carrito.reduce((total,item)=>{
          let prod = this.productos.filter((producto)=>{
            return producto._id == item._id;
          });
          return total + prod[0].precio;
        }, 0).toFixed(2);
      },

      
    },

    computed: {
      filtroDoble(){ 
        if(this.inputBusqueda != ""){
            this.filtroBusqueda(this.productosTotales)
        }else{
          this.productosOrdenados = this.productosTotales
        }
    }




    },
  }).mount('#app')


