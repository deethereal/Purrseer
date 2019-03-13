const http = require('http');
const qs = require('querystring');
const server = http.createServer(function (req, res) {
  res.end();
}).listen(8000);


var tasks=[],
	givenTasks=[],
	treasureBox={};

server.on('request', function (req, res){
	if (req.method == 'GET'){
	res.writeHead(200)
	var newTask=tasks.shift();
	var id = Date.now+randInt(1,1234567);
	givenTasks[id]=newTask;
	res.write(id);
	res.write(newTask);
	res.end;

	} else {
		if (req.method == 'POST'){
			var body = '';

			req.on('data', function (data) {
            	body += data;
			});

			req.on('end', function(){
				var post = qs.parse(body);
				if (givenTasks[post.id]){

					tasks=tasks.concat(post.postcards);

					if (treasureBox[givenTasks[post.id]]){
                    	
					} else{ treasureBox[givenTasks[post.id]]=''};

					for (item in post.treasures){
						treasureBox[givenTasks[post.id]]+=post.treasures[item]
					};
					givenTasks.delete(post.id);
					res.writeHead(200);
					res.write("OK");
					res.end();
				} else{
					tasks.push(givenTasks[post.id]);
					givenTasks.delete(post.id);
					res.writeHead(423);
					res.write("MUDA");
					res.end();
				}


			});
		};

	};
});

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}