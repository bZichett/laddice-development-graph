var http = require('http');
var env = require('../env/dev')

http.createServer((req, res) => {

	res.writeHead(200, {"Content-Type": "text/html"});

	res.write("<!DOCTYPE 'html'>");
	res.write("<html>");
	res.write("<head>");
	res.write("<title>Dependency Tree</title>");
	res.write("</head>");
	res.write("<body>");
	res.write("<div id='app'></div>");
	res.write("</body>");

	if(env.DEV){
		res.write("<script>var PROD = false; var DEV = true</script>")
		res.write("<script src='http://localhost:8080/js/vendor.js'></script>");
		res.write("<script src='http://localhost:8080/js/web.js'></script>");
		res.write("<link rel='stylesheet' type='text/css' href='http://localhost:8080/css/web.css'/>");
	} else {
		res.write("<script>var PROD = true; var DEV = false</script>")
		res.write("<script src='http://localhost:8000/static/build/js/vendor.js'></script>");
		res.write("<script src='http://localhost:8000/static/build/js/web.js'></script>");
		res.write("<link rel='stylesheet' type='text/css' href='http://localhost:8000/static/build/css/web.css'/>");
	}

	res.write("</html>");
	res.end()
}).listen(8000, '127.0.0.1');
