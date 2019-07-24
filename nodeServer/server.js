/**
*Jose Francisco Zeron Cabrera
*154678
*
*Server file.
*
*File that contents functions that supply the clock information requested by clients using the
*help of the Express framework.
*/

/**Load module from express folder/library*/
const express = require('express');
var app = express();

/**Enable to avoid cors error that ocurrs when client URL and server do not match*/
var cors = require('cors');
app.use(cors());

/*Module to read POST DATA*/
var bodyParser = require('body-parser');


//Module of files system that will allow to delete the files stored in disk
const fs = require('fs');

/*Add module to main app including the limit of files that can be upploaded*/
app.use(bodyParser.json());
app.use( bodyParser.urlencoded({extended:true}) );

/*Import module on file queriesLibrary.js*/
var session  = require('./queriesLibrary.js');
/*Adjust parameters of database of Tables ROL,USERS,PERMISSION*/
session.setDataDBUsersAndPermissions('192.168.1.77',5432,'supervision','admin','postgres');

//Indicar la carpeta de acceso publico donde se levant servidor web
app.use(express.static(__dirname + '/public'));  // making ./public as the static directory

/**
*CREATE TABLES INSIDE THE DB (Restart DB): 
*Handler of an HTTP get request that cases to create all the tables of the DB
*@param {string} URL - sever/createTables
*@param {function} function that is executed as a result of the request - Arrow function (=>) with 2 arguments
*/
app.get('/createTables' , (req,res) => {

	console.log("GET /createTables");

	//1)Generar archivo .sql con las relaciones y tablas que usa la BDS
	session.createDatabaseFile();
	//2)Ejecutar archiv .sql en la BDs
	session.uploadDatabaseFile('database.sql');

	/**Respond to request: sending actual time in miliseconds back on JSON format*/
	res.json({
		data: Date.now()
	});

});
/**End of HTTP get Handelr for serverTime */

/**
*RESET THE DB (Restart DB): 
*Handler of an HTTP get request that cases to create all the tables of the DB
*@param {string} URL - sever/createTables
*@param {function} function that is executed as a result of the request - Arrow function (=>) with 2 arguments
*/
app.post('/resetTables' , function (req,res) {

	console.log("GET /resetTables");

	//2)Ejecutar archiv .sql en la BDs
	session.uploadDatabaseFile('resetdatabase.sql');

	//Answer to the client by sending home.html file
	res.sendFile(__dirname + '/public/home.html');

});
/**End of HTTP get Handelr for serverTime */

/**
*Handler of an HTTP get request returning file home.html
*@param {string} URL - root directory
*@param {function} function that is executed as a result of the request - Arrow function (=>) with 2 arguments
*/
app.get('/' , (req,res) => {

	console.log("GET / (PRUEBA)");
	res.sendFile(__dirname + '/public/home.html');

});
/**End of HTTP get Handelr for root folder*/

/*
*
*/
app.post('/insert', async function (req,res)
{
	//------------
	console.log("POST INSERT!!");
	console.log("Body:");
	console.log(req.body);
	//------------

	//Get input from the post of the client
	var nombre = req.body.inpNombre;
	var categoria = req.body.inpCat;
	var desc = req.body.inpDescripcion;
	var unidades = req.body.inpUnidades;
	var marca = req.body.inpMarca;
	var modelo = req.body.inpModelo;
	var precio = req.body.inpPrecio;

	//Get promisse (Insertar datos de Doc en tabla DOCUMENTO EN BD )
	var idArt = await session.insertNewArt(nombre,categoria,desc,unidades,marca,modelo,precio);

	console.log('Id Articulo insertado:'+idArt);

	//Answer to the client by sending home.html file
	res.sendFile(__dirname + '/public/home.html');

});//End post insert

/*
*
*/
app.post('/modify', upload.single('myFile'), async function (req,res)
{
	//------------
	console.log("POST MODIFY");
	console.log("Body:");
	console.log(req.body);
	console.log("File:");
	console.log(req.file);
	//------------

	//Get input from the post of the client
	var id = req.body.inpId;
	var nombre = req.body.inpNombre;
	var categoria = req.body.inpCat;
	var desc = req.body.inpDescripcion;
	var unidades = req.body.inpUnidades;
	var marca = req.body.inpMarca;
	var modelo = req.body.inpModelo;
	var precio = req.body.inpPrecio;

	//1)Modificar todos los datos excepto id, idArchivo, nameArchivo para entrada existente en tabla DOCUMENTO!
	var actualIdDoc = await session.modifyArt(id,nombre,categoria,desc,unidades,marca,modelo,precio);

	//Verify stored data*/
	//--------
	console.log('Verificar datos modificados para articulo: '+id);
	console.log('nombre: '+nombre);
	console.log('categoria: '+categoria);
	console.log('descripcion: '+desc);
	console.log('unidades: '+unidades);
	console.log('marca: '+marca);
	console.log('modelo: '+modelo);
	console.log('precio: '+precio);
	//--------

	//Answer to the client by sending home.html file
	res.sendFile(__dirname + '/public/home.html');

});//End post modify

/**
 * Result set of all the docs and the users in charge of those docs
 */
app.get('/getAllArticles', async function (req, res) 
{
	var resultSetArts = [];
	resultSetArts = await session.getAllArticles();

	res.send(resultSetArts);

});//End get

/**
 * Delete rticle from tables in the DB
 */
app.post('/deleteArticle', async function(req, res) 
{

	//BORRADO DE TABLAS CON SQL
	var statusDelete = await session.deleteArticleAllTables(req.body.id);
	console.log("Eliminado doc de todas las tablas sql?: "+statusDelete);

	res.send('ok!');

});//End post

/**
 * Get actual config values from guiconfig.txt
 */
app.get('/getGuiConfig', async function (req, res) 
{
	var configValues = [];
	configValues = session.readGuiConfigFile();

	console.log(configValues);

	res.send(configValues);

});//End get

app.listen(80);
console.log('server listening in port 80');

/**
 * Override actual config values from guiconfig.txt
 */
app.post('/setGuiConfig', function(req, res) 
{
	console.log("Modificar guiconfig.txt");

	var tituloPrincipal = req.body.inpTitulo;
	var textoLateral = req.body.inpTextolat;
	var colorTitulo = req.body.selColorTit;
	var colorTextolat = req.body.selColorLatText;
	var colorLinea = req.body.selColorLinea;

	//-------------------------------
	console.log(req.body);
	console.log(tituloPrincipal);
	console.log(colorLinea);
	//----------------------------

	session.writeGuiConfigFile(tituloPrincipal,textoLateral,colorTitulo,colorTextolat,colorLinea);

	console.log('Parametros de archivo guiconfig.txt guardados exitosamente!')

	//Answer to the client by sending home.html file
	res.sendFile(__dirname + '/public/home.html');

});//End post