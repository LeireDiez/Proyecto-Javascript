//Lee fichero
var fs = require('fs');
var file = fs.readFileSync('./file.txt', 'utf8');
 
//Carga los datos del fichero JSON
var datos=JSON.parse(file);

var fs = require('fs');
var express=require('express');
var app = express();
var contadores = new Array;
var portada = fs.readFileSync('Agenda.html','utf8');

//Necesario para obtener el body del put
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function (req, res) { 
    res.send(portada);
});

app.get('/js/:page', function (req, res) { 
    var js = fs.readFileSync(req.params.page);
    res.contentType('text/javascript');
    res.send(js);
});


app.get('/agenda/:nombre', function (req, res) {
	var telefono = '';
	//Busca el teléfono del nombre		
	for (var i = 0; i < datos.length; i++) {
		if (datos[i].nombre == req.params.nombre){
			telefono = datos[i].telefono;
			break;
		}
	}
	if (telefono == ''){
		telefono = 'No existe ese nombre en la agenda';
	}
	//Envía el nombre y el teléfono
	res.send( "{ \"resultado\": \""+ telefono + "\"}" );
});

app.put('/agenda/:nombre', function( req,res ) {
	var telefono = '';
	//Busca el teléfono del nombre		
	for (var i = 0; i < datos.length; i++) {
		if (datos[i].nombre == req.params.nombre){
			datos[i].telefono = req.body.telefono;
			break;
		}
	}
	var contentFile = JSON.stringify(datos);
	fs.writeFileSync('./file.txt', contentFile, 'utf8');
	res.end('{"success" : "Updated Successfully", "status" : 200}" }');
});

app.post('/agenda/:nombre', function (req, res) {   
	datos.push({"nombre": req.params.nombre, "telefono": req.body.telefono});
	var contentFile = JSON.stringify(datos);
	fs.writeFileSync('./file.txt', contentFile, 'utf8');
	res.send( "{ \"resultado\": \"guardadoPost\"}" );
});



app.listen(8080);
console.log('Server running at http://127.0.0.1:8080/');