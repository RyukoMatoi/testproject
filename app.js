const fastify = require('fastify')();
const pointOfView = require('point-of-view');
const handlebars = require('handlebars');
const { PythonShell } = require('python-shell');




// Регистрация шаблонизатора Handlebars
fastify.register(pointOfView, {
	engine: { handlebars },
	root: __dirname
});

fastify.register(require('@fastify/formbody'))

// Определение маршрута для отображения HTML страницы
fastify.get('/', function (request, reply) {
	reply.view('/index.html', {});
});

// Определение маршрута для обработки данных формы
fastify.post('/', function (request, reply) {
	const num1 = Number(request.body.num1);
	const num2 = Number(request.body.num2);
	const num3 = Number(request.body.num3);

	let options = {
		args: [num1, num2, num3]
	};

	// Выполнение Python-скрипта для расчета

	// exec(command, (error, stdout, stderr) => {
	// 	if (error) {
	// 		console.error(`Ошибка при выполнении Python-скрипта: ${error}`);
	// 		return;
	// 	}
	// 	const result = parseFloat(stdout);

	// 	reply.view('/result.html', { num1, num2, num3, result });
	// });
	PythonShell.run('calculation_module.py', options).then(messages => {
		console.log(messages)
		console.log('finished');
		const result = parseFloat(messages);


		reply.view('/index.html', { num1: num1, num2: num2, num3: num3, myValue: result });
	});


	// PythonShell.run('calculation_module.py', options, (err, results) => {
	// 	console.log("IM IN");
	// 	if (err) {
	// 		console.error(`Ошибка при выполнении Python-скрипта: ${err}`);
	// 		return
	// 	}

	// 	console.log(results);
	// 	const result = parseFloat(results);
	// 	reply.view('/result.html', { num1, num2, num3, result });
	// 	console.log("IM OUT");
	// });
});


// Слушаем порт 3000
fastify.listen(3000, (err, address) => {
	if (err) throw err;
	console.log(`Сервер запущен на ${address}`);
});
