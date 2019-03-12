//Повар спрашивает повара: "Повар, какова твоя профессия, ты милиционер? "
//"Нет" - отвечает повар - "Моя главная профессия повар, ААХАХ ХАХАХА ХАХАХХААХХ"

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
	res.writeHead(200)//говорим, что все ок
	var newTask=tasks.shift(); //Берем новую ссылку из массива заданий
	var id = Date.now+randInt(1,1234567); //Создаем заданию id
	givenTasks[id]=newTask;//переносим заданиев массив с выданными заданиями

	res.write(id);
	res.write(newTask);//отправляем id задания и ссылку, на которой надо искать
	res.end;

	} else {
		if (req.method == 'POST'){
			var body = '';

			req.on('data', function (data) {
            	body += data;
			});

			req.on('end', function(){
				var post = qs.parse(body);

				if (givenTasks[post.id]){ //проверяем, не левый ли это запрос

					tasks=tasks.concat(post.postcards); //добавляем найденный ссылки в массив с заданиями

					if (treasureBox[givenTasks[post.id]]){} 
						else{ treasureBox[givenTasks[post.id]]=''};
					for (item in post.treasures){
						treasureBox[givenTasks[post.id]]+=post.treasures[item]
					}; //Кладем найденные по ссылке слова в объект с полем <ссылка>


					givenTasks.delete(post.id);
					res.writeHead(200);
					res.write("OK");
					res.end(); //удаляем задание из ожидаемых и говорим, что все хорошо
				} else{
					tasks.push(givenTasks[post.id]);
					givenTasks.delete(post.id); //Если запрос левый, то возвращаем задание из ожидаемых в массив заданий
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
