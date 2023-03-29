




class Quiz
{
	constructor()
	{
		this.currentQuestion = 0;
		this.metrics = {};
		this.timer = null;
		this.mode = null;
	}

	init(skipUpdate, immediate)
	{
		clearTimeout(this.timer);
		app.fx.startAnimation();
		if(!immediate) app.ui.addAction('wait', null, 500);
		app.fx.changeMode();
		app.ui.hideScene();
		app.ui.showScene('intro',
			{
				title: window.quizData.attractor_title,
				subtitle: window.quizData.attractor_intro,
				button: window.quizData.attractor_button_label
			}
		);

		if(!skipUpdate) app.ui.update();
	}

	initSkip()
	{
		this.init(true, true);
	}

	preamble(immediate)
	{
		if(!immediate) app.ui.addAction('wait', null, 500);
		app.ui.hideScene();
		app.fx.changeMode();
		app.ui.showScene('preamble',
			{
				title: window.quizData.preamble_title,
				text: window.quizData.preamble_intro,
				button: window.quizData.preamble_button_label
			}
		);
		this.restartIdleTimer();
	}

	start()
	{
		clearTimeout(this.timer);
		this.currentQuestion = -1;
		this.resetMetrics();

		app.ui.addAction('wait', null, 500);
		app.ui.hideScene();
		app.fx.changeMode();
		app.ui.addAction('call', this.nextQuestion.bind(this), 20);
	}

	back()
	{
		if(this.currentQuestion > 0)
		{
			this.currentQuestion -= 2;
			app.ui.hideScene();
			app.fx.changeMode();
			app.ui.addAction('call', this.nextQuestion.bind(this), 20);
		} else {
			this.preamble(true);
		}
	}

	restartIdleTimer()
	{
		clearTimeout(this.timer);
		let delay = parseInt(window.quizData.timeout_period) * 1000;
		// delay = 3000;
		this.timer = setTimeout(this.showIdleWarning.bind(this), delay);
	}

	restartFinishTimer()
	{
		// final screen flips back to the title screen automatically after a while
		clearTimeout(this.timer);
		let delay = parseInt(window.quizData.timeout_period) * 1000;
		// delay = 3000;
		this.timer = setTimeout(this.finishTimeout.bind(this), delay);
	}

	finishTimeout()
	{
		clearTimeout(this.timer);
		this.init();
	}

	finish()
	{
		// clicked finish manually
		clearTimeout(this.timer);
		this.init(true);
	}

	showIdleWarning()
	{
		app.ui.addAction('sceneOn', { id:'timeout' }, 20);
		app.ui.addAction('fadeIn', { id:'timeout' }, 500);
		app.ui.update();

		let buttons = document.querySelectorAll('#timeout button');
		for (var i = 0; i < buttons.length; i++) { buttons[i].classList.remove('selected'); }

		clearTimeout(this.timer);
		this.timer = setTimeout(this.timeout.bind(this), 10000); // 10 seconds
	}

	hideIdleWarning()
	{
		app.ui.addAction('fadeOut', { id:'timeout' }, 500);
		app.ui.addAction('sceneOff', { id:'timeout' }, 20);
	}

	cancelIdleWarning()
	{
		this.hideIdleWarning();
		this.restartIdleTimer();
	}

	timeout()
	{
		clearTimeout(this.timer);
		this.sendMetrics();
		this.hideIdleWarning();
		app.ui.addAction('call', this.initSkip.bind(this), 20);
		app.ui.update();
	}

	clickTimeout()
	{
		clearTimeout(this.timer);
		this.sendMetrics();
		this.hideIdleWarning();
		app.ui.addAction('call', this.initSkip.bind(this), 20);
	}

	resetMetrics()
	{
		this.metrics = {};
		this.metrics['Session start'] = new Date().toISOString();
		this.metrics.scores = [];
	}

	nextQuestion()
	{
		this.currentQuestion++;

		if(this.currentQuestion < window.quizData.questions.length)
		{
			// next question
			let args = {};
			let q = window.quizData.questions[this.currentQuestion];
			let total = window.quizData.questions.length;
			args.num = (this.currentQuestion+1)+'/'+total;
			args.question = q.question;

			// reset/hide all answer buttons
			let answers = document.querySelectorAll('.answer');
			for (var i = 0; i < answers.length; i++)
			{
				answers[i].dataset.text = '';
				answers[i].classList.add('hidden');
			}

			// prepare args for question display
			// add answers to button data, show active buttons
			let count = 0;
			for(let i in q.answer)
			{
				args['answer'+count] = q.answer[i].answer;
				answers[count].dataset.text = q.answer[i].answer;
				answers[count].classList.remove('hidden');
				count++;
			}

			app.ui.showScene('question', args);
			this.restartIdleTimer();

		} else {
			// end of quiz
			this.showResults();
		}
	}

	receiveAnswer(a)
	{
		clearTimeout(this.timer);
		app.ui.disable();

		let answers = document.querySelectorAll('.answer');
		for (var i = 0; i < answers.length; i++)
		{
			answers[i].classList.add('rejected');
		}

		a.classList.remove('rejected');
		a.classList.add('selected');

		// write / overwrite metric for this question
		this.metrics['Question '+(this.currentQuestion+1)] = ''+parseInt(window.quizData.questions[this.currentQuestion].answer[parseInt(a.dataset.answer)].score);
		this.metrics.scores[this.currentQuestion] = parseInt(window.quizData.questions[this.currentQuestion].answer[parseInt(a.dataset.answer)].score);

		app.fx.changeMode();
		app.ui.addAction('wait', null, 500);
		app.ui.addAction('fadeOut', { id:'question' }, 500);
		app.ui.addAction('sceneOff', { id:'question' }, 20);
		app.ui.addAction('call', this.nextQuestion.bind(this), 20);
	}

	// (can also send partially complete data if the quiz is abandoned)
	sendMetrics()
	{
		this.metrics['Session end'] = new Date().toISOString();
		this.metrics['Session source'] = 'kiosk';

		delete this.metrics.scores; // remove temporary score log

		axios
		.post(
			window.quizData.data_airtable_url, { "fields" : this.metrics }
		)
		.then(
			function (response) { console.log(response); }
		)
		.catch(
			function (error) { console.log(error); }
		);
	}

	showResults()
	{
		// final score
		let score = 0;
		for (let i = 0; i < this.metrics.scores.length; i++)
		{
			score += this.metrics.scores[i];
		}

		// get rank
		let ranks = window.quizData.results_groups;
		let rankIndex = 0;
		for (let i = 0; i < ranks.length; i++)
		{
			let min = parseInt(ranks[i]['result_range_-_min']);
			let max = parseInt(ranks[i]['result_range_-_max']);
			if(score >= min && score <= max)
			{
				rankIndex = i;
			}
		}

		if(this.mode == 'quiz')
		{
			document.querySelector('#result_lark').classList.add('hidden');
			document.querySelector('#result_owl').classList.add('hidden');
			if(rankIndex == 0) document.querySelector('#result_lark').classList.remove('hidden');
			if(rankIndex == 2) document.querySelector('#result_owl').classList.remove('hidden');
		}

		app.ui.showScene('results',
			{
				title: window.quizData.results_groups[rankIndex]['score_title'],
				text: window.quizData.results_groups[rankIndex]['result_body']
			}
		);

		// send metrics...
		this.sendMetrics();

		// timeout
		this.restartFinishTimer();
	}
}




