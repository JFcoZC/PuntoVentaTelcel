//Controller
var articulosActuales = [];
var ipServer = '192.168.1.77';

$(document).ready()
{
    var urlDocs = window.location;
    cargarBarraBusqueda();
    cargarBarraVentas();
    updateHtmlValues();
    //-------------
    getAllArticles()
    buscarArticulos();
    //--------------
}//Fin document Ready

//+++++++ INICIO CLASES ++++++++++

var ARTICULO = function()
{
    //Propiedades privadas
    var id;
    var nombre;
    var categoria;
    var descripcion;
    var unidades;
    var precio;
    var marca;
    var modelo;

    return {
        getId: function() {return id;},
        getNombre: function() {return nombre;},
        getCategoria: function() {return categoria;},
        getDescripcion: function() {return descripcion;},
        getUnidades: function() {return unidades;},
        getPrecio: function() {return precio;},
        getMarca: function() {return marca;},
        getModelo: function() {return modelo;},
        //setters
        setId: function(i) {id = i;},
        setNombre: function(name) {nombre = name;},
        setDescripcion: function(des) {descripcion = des;},
        setCategoria: function(c) { categoria = c; },
        setUnidades: function(u) {unidades = u;},
        setPrecio: function(p) {precio = p;},
        setMarca: function(m) {marca = m;},
        setModelo: function(m) {modelo = m;}
    }

}//Fin clase ARTICULO

//+++++++ FIN CLASES +++++++++++++

//+++++++ INICIO FUNCIONES +++++++

/*
*Dado el arreglo de Articulos modifica la tabla de la pantalla de home.
*/ 
function actualizarTablaArticulos(articulos)
{
    var tabla = "<div id='containerTable'>"+
                    "<table class = 'tableDocumentos'><tr class = 'headersTableDocumentos' ><th>Id</th>"+
                    "<th>Nombre</th><th>Descripción</th><th>Categoria</th><th>Unidades</th><th>Precio</th>"+
                    "<th>Marca</th><th>Modelo</th></tr>";
    var numeroArticulos = 0;

    if(articulos != null)
    {
        numeroArticulos = articulos.length;
    }//Fin if 1

    for(var  i = 0; i < numeroArticulos; i++)
    {
        //Set priority background color
        var priorColor = '#0000FF';

        if(articulos[i].getUnidades() >= 4)
        {
            priorColor = '#00FF00';
        }//End if
        else if(articulos[i].getUnidades() >= 1)
        {
            priorColor = '#FFFF00';
        }//End else if
        else if(articulos[i].getUnidades() <= 0)
        {
            priorColor = '#FF0000';
        }//End else if 2

        tabla = tabla+"<tr class ='celTableDocumentos'><td class='id'> <p>"+documentos[i].getId()+"</p> </td><td class='nombre'> <a href='#' onclick='cargarPantallaFormActualArt("+documentos[i].getId()+")'>"+documentos[i].getNombre()+"</a> </td>"+
                      "<td class='descripcion'> <p>"+documentos[i].getDescripcion()+"</p> </td> <td bgcolor='"+priorColor+"' class='unidades'> <p>"+documentos[i].getUnidades()+"</p> </td> <td class='categoria'> <p>"+documentos[i].getCategoria()+"</p> </td>"+
                              "<td class='precio'> <p>"+documentos[i].getPrecio()+"</p> </td> <td class='marca'> <p>"+documentos[i].getMarca()+"</p> </td>"+
                              "<td class='modelo'> <p>"+documentos[i].getModelo()+"</p> </td> </tr>";
        
    }//End for 1

    tabla = tabla+"</table></div>";

    //----------
    console.log('actualizarTabalaArticulos');
    console.log('# de docs actuales: '+articulosActuales.length);
    //-----------

    //Replace div
    $("#containerTable").replaceWith(tabla);


}//Fin funcion actualizarTablaArticulos
//------------------------------------------------------------------------------------------------------------------
/*
 *Función que carga el contenido de la barra de busqueda y botones de Agregar y configuraciones en pantalla de home 
 * 
*/
function cargarBarraBusqueda()
{
    var searchBar = "<div id='containerSearchBar'><div class='buscador'><input type='text' id ='textToSearch'><p class='searchBar'>"+
                    " Buscar por: </p><select id='selectCampo'><option value = 'Id'>Id</option><option value = 'Nombre'>Nombre</option>"+
                    "<option value = 'Descripcion'>Descripción</option><option value = 'Categoria'>Categoria</option><option value = 'Unidades'>Unidades</option>"+
                    "<option value = 'Precio'>Precio</option><option value = 'Marca'>Marca</option>"+
                    "<option value = 'Modelo'>Modelo</option></select></div>";

    searchBar = searchBar+"<div class='botonesSearchBar'><button id='btnAgregar' type='button' onclick='cargarPantallaFormNewArt()'> Agregar </button>"+
                          "<button id='btnGenerarPDF' type='button' onclick='generarPDF()'> Generar reporte </button><button id='btnAjustes' type='button' onclick='cargarPantallaFormAjustes()'> Ajustes </button></div></div>";
    
    $("#containerSearchBar").replaceWith(searchBar);   
    
}//Fin funcion cargarBarraBusqueda
//------------------------------------------------------------------------------------------------------------------
/*
 *Función que carga el contenido de la barra de ventas
 * 
*/
function cargarBarraVentas()
{
    var searchBar = "<div id='containerVentaBar'><div class='buscador'><p class='searchBar'>Id articulo: </p><input type='text' id ='idToSell'>"+
                    "<p class='searchBar'>unidades: </p><input type='text' id ='idUnits'>"+
                    "<p class='searchBar'>Total $ </p> <p class='searchBar' id='totalActual'>0.0 </p>";

    searchBar = searchBar+"<div class='botonesSearchBar'><button id='btnVender' type='button' onclick='venderArt()'> Vender </button>"+
                          "</div></div>";
    
    $("#containerVentaBar").replaceWith(searchBar);   
    
}//Fin funcion cargarBarraVentas
//------------------------------------------------------------------------------------------------------------------
/*
 *Función que carga el formulario que contiene parametros para hacer un registro de una neuva entrada de documentos
 *en la BDs 
 * 
*/
function cargarFormularioNewArt()
{
    var formulario = "<div id='containerTable'><form class='formulario' action='/insert' method='POST'><h2>Agregar nuevo articulo<h2/>"+
                     "<div class='lineFormulario'><label id='lblNombre'>Nombre</label><input type='text' name='inpNombre'></div>"+
                     "<div class='lineFormulario'><label id='lblCategoria'>Categoria/label><input type='text' name ='inpCat'></div>"+
                     "<div class='lineFormulario'><label id='lblDescripcion'>Descripción</label><input type='text' name ='inpDescripcion'></div>"+
                     "<div class='lineFormulario'><label id='lblMarca'>Marca</label><input type='text' name ='inpMarca'></div>"+
                     "<div class='lineFormulario'><label id='lblModelo'>Modelo</label><input type='tect' name ='inpModelo'></div>"+
                     "<div class='lineFormulario'><label id='lblUnidades'>Unidades</label><input type='text' name='inpUnidades'></div>"+
                     "<div class='lineFormulario'><label id='lblPrecio'>Precio $</label><input type='text' name='inpPrecio'></div>"+
                     //----
                     "<input type= 'submit' id='btnAddfile' value='Agregar Articulo'><button type='button' onclick='prueEliminar</button></form></div>";

    $("#containerTable").replaceWith(formulario);

}//Fin funcion caragarFormularioNewDoc
//------------------------------------------------------------------------------------------------------------------
/*
 *Función que carga el formulario con parametros actuales del documento con el id especificado.
 *A partir de este formulario se pueden hacer cambios en el articulo actual o eliminarlo
 * 
*/
function cargarFormularioArtActual(id)
{
    var artActual;

    for(var i = 0; i < articulosActuales.length; i++)
    {
        if(articulosActuales[i].getId() == id)
        {
            //Encontrar archivo asociado para doc actual
            artActual = articulosActuales[i];
            //Forzar salida for
            i = articulosActuales.length;
        }//End if

    }//End for

    var formulario = "<div id='containerTable'><form class='formulario' action='/modify' method='POST'><h2>Editar articulo<h2/>"+
                    "<div class='lineFormulario'><label id='lblNombre'>Nombre</label><input type='text' name='inpNombre' value='"+artActual.getNombre()+"'><input type='hidden' name='inpId' value='"+id+"'></div>"+
                    "<div class='lineFormulario'><label id='lblCategoria'>Categoria/label><input type='text' name ='inpCat' value='"+artActual.getCategoria()+"'></div>"+
                    "<div class='lineFormulario'><label id='lblDescripcion'>Descripción</label><input type='text' name ='inpDescripcion' value='"+artActual.getDescripcion()+"'></div>"+
                    "<div class='lineFormulario'><label id='lblMarca'>Marca</label><input type='text' name ='inpMarca' value='"+artActual.getMarca()+"'></div>"+
                    "<div class='lineFormulario'><label id='lblModelo'>Modelo</label><input type='tect' name ='inpModelo' value='"+artActual.getModelo()+"'></div>"+
                    "<div class='lineFormulario'><label id='lblUnidades'>Unidades</label><input type='text' name='inpUnidades' value='"+artActual.getUnidades()+"'></div>"+
                    "<div class='lineFormulario'><label id='lblPrecio'>Precio $</label><input type='text' name='inpPrecio' value='"+artActual.getPrecio()+"'></div>"+
                     //----
                     "</div><input type= 'submit' id='btnSavechanges' value='Guardar cambios'><button type='button' id='btnDelete' onclick=removeAllDataArt("+artActual.getId()+")>Eliminar</button></form></div>";

    $("#containerTable").replaceWith(formulario);

    
}//Fin funcion caragarFormularioArtActual
//-----------------------------------------------------------------------------------------------------------------------
/*
*Funcion que obtiene del input field de Encargados (inpEncargados) el valor que haya sido colocado al hacer click en el boton "+" 
*y que añade al arreglo global encargados yposteriorment actualiza el div encargadosTagBox
*/
function addEncargado()
{
	var htmlC = "<ul class='tagit-content'>";
	
	//Obtener de field
	var encargado = document.getElementsByName("inpEncargados")[0].value;
	//Agregar
	encargados.push(encargado);
	//Limpiar field
	document.getElementsByName("inpEncargados")[0].value = "";
	
	//Mostrar en pagina los encargados que hasta ahorita se han agregado
	for(var i = 0; i < encargados.length; i++)
	{

		htmlC = htmlC + "<li class='tagit'><span class='tagit-label'>"+encargados[i]+"</span><a class='tagit-close' onclick='removeEncargado("+i+")'><span class='text-icon'>×</span></a></li>";

    }//Fin for 
    
    //Actualizar lista de encargados para mandar en post
    document.getElementsByName("listaEncargados")[0].value = encargados;
    //Actualizar numero de encargados en lista de encargados para mandar en post
	document.getElementsByName("numEncargados")[0].value = encargados.length;
		
	htmlC = htmlC+"</ul>"
	document.getElementById("encargadosTagBox").innerHTML = htmlC;

}//Fin funcion addEncargado
//-----------------------------------------------------------------------------------------------------------------------
/*
*Al hacer click sobre alguno de los elementos tagit-close, indicar que ese elemento se debe remover del div encargadosTagBox
*y tambien del array global encargados
*/
function removeEncargado(indx)
{
	var htmlC = "<ul class='tagit-content'>";

	//Remover elementos del arreglo
	encargados.splice(indx,1);

	//Mostrar en pagina los encargados restantes
	for(var i = 0; i < encargados.length; i++)
	{

		htmlC = htmlC + "<li class='tagit'><span class='tagit-label'>"+encargados[i]+"</span><a class='tagit-close' onclick='removeEncargado("+i+")'><span class='text-icon'>×</span></a></li>";

	}//Fin for 
		
	htmlC = htmlC+"</ul>"
	document.getElementById("encargadosTagBox").innerHTML = htmlC;

}//Fin funcion removeEncargado
//------------------------------------------------------------------------------------------------------------------
/*
*Función que carga el contenido de la barra con boton de regresar a pagina principal que despliega la tabla de documetos
*y el buscador
 * 
*/
function cargarBarraReturn()
{
    var returnBar = "<div id='containerSearchBar'><button type='button' id='btnRegresar' onclick='cargarPantallaPrincipal()' > Regresar </button></div>";

    
    $("#containerSearchBar").replaceWith(returnBar);    

}//Fin funcion cargarBarraBusqueda
//------------------------------------------------------------------------------------------------------------------
/*
*Funcion que invoca todas las fucniones necesarias para mostrar la tabla de documentos con los docs actuales
*y la barra de busqueda para poder filtrar los socumentos.
*/
function cargarPantallaPrincipal()
{
    cargarBarraBusqueda();
    cargarBarraVentas();
    actualizarTablaArticulos(articulosActuales);

}//End function cargarPantallaPrincipal
//------------------------------------------------------------------------------------------------------------------
/*
*Funcion que invoca todas las fucniones necesarias para mostrar el formulario para insertar un nuevo articulo
*y el boton que permite regresar a la pantalla principal.
*/
function cargarPantallaFormNewArt()
{
    cargarBarraReturn();
    cargarFormularioNewArt();

}//End function cargarPantallaFormNewArt
//------------------------------------------------------------------------------------------------------------------
/*
*Funcion que invoca todas las fucniones necesarias para mostrar el formulario con los valores del articulo actual
*y el boton que permite regresar a la pantalla principal.
*/
function cargarPantallaFormActualArt(idnum)
{
    cargarBarraReturn();
    cargarFormularioArtActual(idnum);

}//End function cargarPantallaFormActualDoc
//------------------------------------------------------------------------------------------------------------------
/**
 * Obtiene los articulos/objetos que se encuentran actualmente en el arreglo articulosActuales
 * para que la información aparezca dentro de la tabla principal de la aplicación.
 */
function getAllArticles()
{
    //Inicio de GET
    $.ajax({
        url:'http://'+ipServer+':80/getAllArticles',
        type: "GET",
        success: (data) => {
            //------------------------------------------
            console.log("SUCCESS GETTING ALL Articles!");
            //-----------------------------------------
            $.each(data, (index, art) => {

                var newArt = ARTICULO();
                
                newArt.setId(art.id);
                newArt.setNombre(art.nombre);
                newArt.setCategoria(art.categoria);
                newArt.setDescripcion(art.descripcion);
                newArt.setMarca(art.marca);
                newArt.setModelo(art.modelo);
                newArt.setPrecio(art.precio);
                newArt.setUnidades(art.unidades);

                articulosActuales.push(newArt);

            });//Fin for each data

            //Update Table
            console.log("update table articles actuales!");
            actualizarTablaArticulos(articulosActuales);

        },
        error: (err) =>{

            $("#containerTable").html(err.responseText);

        }//En error
    });//End ajax function

}//End function getAllArticles()
//-------------------------

/** 
 * Function that filters all the docs that had been curently loaded by the client
 * and shows only in the table the information of the docs that mathc according
 * to the current string at the search field and the value selected for the 'Campo'
 * 
*/
function buscarArticulos()
{
    var keyWord = "";
    var campo = "";
    var articulosFiltrados = [];
    //selectCampo

    //Al presionar una tecla en la barra de busqueda se va ejecutar
	//la busqueda con el contenido actual:
	$('#textToSearch').keyup(function(){
		keyWord = $('#textToSearch').val();
		campo = $('#selectCampo').val();
        articulosFiltrados = [];

        //-----
        //console.log("Keyword: "+keyWord);
        //console.log("Atributo: "+campo);
        //------

		//Verificar si esta vacio
		if(keyWord == '')
		{
            actualizarTablaArticulos(articulosActuales);

        }//End if 1
        else
        {
            if(campo.localeCompare('Nombre') == 0)
            {
                for(var i = 0; i < articulosActuales.length; i++)
                {
                    //Ver si keyWord esta contenida dentro del campo Nombre
                    //-------
                    //console.log( new String( articulosActuales[i].getSentido() ).indexOf(keyWord) +"!==-1?");
                    //-------
                    if( new String( articulosActuales[i].getNombre() ).toLowerCase().indexOf(keyWord.toLowerCase()) !== -1 )
                    {
                        //KeyWord si es substring .:. agreegar a lista de docs filtrados
                        articulosFiltrados.push( articulosActuales[i] );
                    }//End if

                }//End for

            }//End if 2
            else if(campo.localeCompare('Categoria') == 0)
            {
                for(var i = 0; i < articulosActuales.length; i++)
                {
                    //Ver si keyWord esta contenida dentro del campo Categoria
                    if( new String( articulosActuales[i].getCategoria() ).toLowerCase().indexOf(keyWord.toLowerCase()) !== -1 )
                    {
                        //KeyWord si es substring .:. agreegar a lista de docs filtrados
                        articulosFiltrados.push( articulosActuales[i] );
                    }//End if

                }//End for

            }//End else if 1
            else if(campo.localeCompare('Descripcion') == 0)
            {
                for(var i = 0; i < articulosActuales.length; i++)
                {
                    //Ver si keyWord esta contenida dentro del campo Descripcion 
                    if( new String( articulosActuales[i].getDescripcion() ).toLowerCase().indexOf(keyWord.toLowerCase()) !== -1 )
                    {
                        //KeyWord si es substring .:. agreegar a lista de docs filtrados
                        articulosFiltrados.push( articulosActuales[i] );
                    }//End if

                }//End for

            }//End else if 2
            else if(campo.localeCompare('Modelo') == 0)
            {
                for(var i = 0; i < articulosActuales.length; i++)
                {
                    //Ver si keyWord esta contenida dentro del campo Mdelo
                    if( new String( articulosActuales[i].getModelo() ).toLowerCase().indexOf(keyWord.toLowerCase()) !== -1 )
                    {
                        //KeyWord si es substring .:. agreegar a lista de docs filtrados
                        articulosFiltrados.push( articulosActuales[i] );
                    }//End if

                }//End for

            }//End else if 3
            else if(campo.localeCompare('Marca') == 0)
            {
                for(var i = 0; i < articulosActuales.length; i++)
                {
                    //Ver si keyWord esta contenida dentro del campo Marca
                    if( new String( articulosActuales[i].getMarca() ).toLowerCase().indexOf(keyWord.toLowerCase()) !== -1 )
                    {
                        //KeyWord si es substring .:. agreegar a lista de docs filtrados
                        articulosFiltrados.push( articulosActuales[i] );
                    }//End if

                }//End for

            }//End else if 4
            else if(campo.localeCompare('Id') == 0)
            {
                for(var i = 0; i < articulosActuales.length; i++)
                {
                    //Ver si keyWord esta contenida dentro del campo Id
                    if( articulosActuales[i].getId()  == keyWord )
                    {
                        //KeyWord si es substring .:. agreegar a lista de docs filtrados
                        articulosFiltrados.push( articulosActuales[i] );
                    }//End if

                }//End for

            }//End else if 5
            else if(campo.localeCompare('Unidades') == 0)
            {
                for(var i = 0; i < articulosActuales.length; i++)
                {
                    //Ver si keyWord esta contenida dentro del campo Unidades
                    if( articulosActuales[i].getUnidades() == keyWord )
                    {
                        //KeyWord si es substring .:. agreegar a lista de docs filtrados
                        articulosFiltrados.push( articulosActuales[i] );
                    }//End if

                }//End for

            }//End else if 6
            else if(campo.localeCompare('Precio') == 0)
            {
                for(var i = 0; i < articulosActuales.length; i++)
                {
                    //Ver si keyWord esta contenida dentro del campo Archivo
                    if( new String( articulosActuales[i].getPrecio() ).indexOf(keyWord) !== kewyword )
                    {
                        //KeyWord si es substring .:. agreegar a lista de docs filtrados
                        articulosFiltrados.push( articulosActuales[i] );
                    }//End if

                }//End for

            }//End else if 7
            
            actualizarTablaArticulos(articulosFiltrados);

        }//End else if 2

    });//End JQUERY keyup function

}//End function buscarArticulos
//-----------------------------------------------------------------------------
/**
 *  Function that removes ARTICLE from the DB
 */
function removeAllDataArt(num)
{
    console.log("Eliminar articulo!");

    //INICIO DE POST
    $.ajax({
        url:'http://'+ipServer+':80/deleteArticle',
        type: 'POST',
        /*Send al the data in json format*/
        data: {id:num},    
        /*Format of the data that will be recieved*/
        dataType :'text',
        success: function(response){
            
            alert("Articulo eliminado exitosamente: "+response);
            //Delete all actual content of arrays in order to 
            //avoid that the info of the table remains equal
            refreshArrays();
            //-----
            cargarBarraBusqueda();
            cargarBarraVentas();
            //-------------
            getAllArticles()
            buscarArticulos()
            //-----

        },
        error: function(xhr,status,error){
            console.log("Error en Post de deleteFile");
            console.log(error.Message);
            console.log("----");
            console.log(status);
            console.log(xhr.responseText);
        }
    });//End ajax function
}//End function removeAllDataArt
//-----------------------------------------------------------------------------
/**
 * Delete all the actual content for the 2 global arrays
 */
function refreshArrays()
{
    articulosActuales = [];

}//End function refreshArrays
/**
 * Generate a PDF document with the actual values containede in the arrays:
 * articulosActuales and encargados
 */
function generarPDF()
{
    var doc = new jsPDF();
    var currentTime = new Date();
    var actualDate = currentTime.toJSON().slice(0,10);
    
    
    //Texto documento
    var text = []

    //Titulo documento pdf
    text.push("Inventario de Articulos Tienda Pepecel generado el "+actualDate);
    text.push(" ");

    for(var i = 0 ; i < articulosActuales.length; i++)
    {
        //Reiniciar actual row
        actualRowOfData = [];
        //Guardar datos actuales para row
        text.push('Id: '+articulosActuales[i].getId());
        text.push('Nombre: '+articulosActuales[i].getNombre());
        text.push('Categoria: '+articulosActuales[i].getCategoria());
        text.push('Descripción: '+articulosActuales[i].getDescripcion());
        text.push('Marca: '+articulosActuales[i].getMarca());
        text.push('Modelo: '+articulosActuales[i].getModelo());
        text.push('Unidades: '+articulosActuales[i].getUnidades());
        text.push('Precio: '+articulosActuales[i].getPrecio());
        text.push('----------------------------');

    }//End for

    doc.text(text,10,10);
    doc.save('Inventario.pdf');

}//End function generarPDF
//--------------------------------------------------------------------------------
/**
 * Uploads form for the actual configuration of the  
 */
function formularioAjustes()
{
    //Inicio de GET
    $.ajax({
        url:'http://'+ipServer+':80/getGuiConfig',
        type: "GET",
        success: (data) => {
            //------------------------------------------
            console.log("SUCCESS GETTING GUI CONFIG!");
            //-----------------------------------------
            var valoresConfig = data;

            //---------
            console.log(data);
            //---------

            var formulario = "<div id='containerTable'><button type='button' id='btnDeleteDB' onclick=removeAllDB()>Eliminar todos los documentos</button><form class='formulario' action='/setGuiConfig' method='POST'><h2>Configuración<h2/>"+
                     "<div class='lineFormulario'><label id='lblTitulo'>Titulo principal</label><input type='text' name ='inpTitulo' value='"+valoresConfig[0]+"'></div>"+
                     "<div class='lineFormulario'><label id='lblTextolat'>Texto lateral</label><input type='text' name ='inpTextolat' value='"+valoresConfig[1]+"'></div>"+
                     "<div class='lineFormulario'><label id='lblTituloColor'>Color titulo</label><select name='selColorTit'><option value='orange'>naranja</option><option value='blue'>azul</option><option value='red'>rojo</option><option value='green'>verde</option><option value='yellow'>amarillo</option><option value='black'>negro</option></select></div>"+
                     "<div class='lineFormulario'><label id='lblTextolatColor'>Color texto lateral</label><select name='selColorLatText'><option value='orange'>naranja</option><option value='blue'>azul</option><option value='red'>rojo</option><option value='green'>verde</option><option value='yellow'>amarillo</option><option value='black'>negro</option></select></div>"+
                     "<div class='lineFormulario'><label id='lblLineaColor'>Color linea encabezado</label><select name='selColorLinea'><option value='orange'>naranja</option><option value='blue'>azul</option><option value='red'>rojo</option><option value='green'>verde</option><option value='yellow'>amarillo</option><option value='black'>negro</option></select></div>"+
                     "<input type= 'submit' id='btnSaveConfig' value='Guardar'></form></div>";

            $("#containerTable").replaceWith(formulario);

            $('[name=selColorTit]').val(valoresConfig[2]);
            $('[name=selColorLatText]').val(valoresConfig[3]);
            $('[name=selColorLinea]').val(valoresConfig[4]);

        },
        error: (err) =>{

            $("#containerTable").html(err.responseText);

        }//En error
    });//End ajax function


    

}//End function formularioAjustes
//--------------------------------------------------------------------------------
