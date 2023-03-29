





class App
{
	constructor()
	{
		this.fx = new FX();
		this.ui = new UI();
		this.quiz = new Quiz();
	}

	static init(mode)
	{
		window.app = new App();
		app.setup(mode);
	}

	setup(mode)
	{
		switch(mode)
		{
			case 'quiz' :
				this.initQuiz();
				break;

			case 'feedback' :
				this.initFeedback();
				break;

			case 'logo' :
				this.initLogo();
				break;
		}
	}

	initQuiz()
	{
		document.querySelector('body').classList.add('bg-yellow');
		this.quiz.mode = 'quiz';
		this.quiz.init();
	}

	initFeedback()
	{
		document.querySelector('body').classList.add('bg-pink');
		this.quiz.mode = 'feedback';
		this.quiz.init();
	}

	initLogo()
	{
		document.querySelector('body').classList.add('bg-orange');
		this.fx.startAnimation();
		window.setTimeout(this.logoUpdate.bind(this), 7000);
	}
	logoUpdate()
	{
		this.fx.changeMode();
		window.setTimeout(this.logoUpdate.bind(this), 7000);
	}

	abandonQuiz()
	{
		this.quiz.sendMetrics();
		this.setup(this.quiz.mode);
	}

	showPreamble()
	{
		this.quiz.preamble();
	}

	startQuiz()
	{
		this.quiz.start();
	}

	quizBack()
	{
		this.quiz.back();
	}

	stillHere()
	{
		this.quiz.cancelIdleWarning();
	}

	timeoutNow()
	{
		this.quiz.clickTimeout();
	}

	answer(elem)
	{
		this.quiz.receiveAnswer(elem);
	}

	finishQuiz()
	{
		this.quiz.finish();
	}

}






