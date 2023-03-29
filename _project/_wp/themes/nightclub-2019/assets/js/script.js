





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













class FX
{
	constructor()
	{
		this.doc = document.documentElement;
		this.canvas = document.querySelector('#fx');
		this.ctx = this.canvas.getContext('2d');
		this.ctx.lineWidth = 0;
		this.ctx.fillStyle = '#202020';

		this.circle = new Path2D();
		this.pi2 = Math.PI * 2;
		this.scanRate = 0.05;

		this.phaseAOffset = 0.016;
		this.phaseA = 0;

		this.phaseBOffset = 0.020;
		this.phaseB = 0;

		this.currentMode = 0;
		this.modes = ['drawVertLines', 'drawHalftone', 'drawScanLines', 'drawHalftone'];

		this.animating = false;

		this.framedropCount = 0;
		this.framedrop = 2;

		this.scaleDelta = this.scaleRate;
		this.scaleRate = 0.1;
		this.scale = 0;

		this.dpiScale = 1;
	}

	maximizeCanvas()
	{
		this.canvas.width = this.dpiScale * this.doc.clientWidth * 1.5;
		this.canvas.height = this.dpiScale * this.doc.clientHeight * 1.5;
		this.clearCanvas();
	}

	clearCanvas()
	{
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	startAnimation()
	{
		if(!this.animating)
		{
			this.maximizeCanvas();
			this.animating = true;
			this.frameUpdate();
		}
	}

	stopAnimation()
	{
		this.animating = false;
	}

	frameUpdate()
	{
		this.framedropCount++;

		if(this.framedropCount > this.framedrop)
		{
			this.framedropCount = 0;

			this.scale += this.scaleDelta;

			if(this.scale > 1.0)
			{
				this.scale = 1;
				this.scaleDelta = 0;
			}

			if(this.scale <= 0)
			{
				this.scale = 0;
				this.currentMode++; // change drawing mode
				this.scaleDelta = this.scaleRate;
			}

			// draw stuff
			this.clearCanvas();
			this[this.modes[this.currentMode % this.modes.length]]();
		}

		if(this.animating) requestAnimationFrame(this.frameUpdate.bind(this));
	}

	changeMode()
	{
		// start scaling down to change drawing mode
		this.scaleDelta = 0 - this.scaleRate;
	}

	drawScanLines()
	{
		this.phaseA += this.phaseAOffset;
		let p = this.phaseA;
		let y = 0;
		let lineHeight = Math.round((this.dpiScale * this.doc.clientWidth) / 55);

		while(y < this.dpiScale * this.doc.clientHeight * 1.5)
		{
			let h = ((Math.sin(p) + 1) * 0.5) * lineHeight;
			this.fillRect(0, y, (this.dpiScale * this.doc.clientWidth * 1.5), h * this.scale);
			y += lineHeight;
			p += this.scanRate;
		}
	}

	drawVertLines()
	{
		this.phaseA -= this.phaseAOffset;
		let p = this.phaseA;
		let x = 0;
		let lineWidth = Math.round((this.dpiScale * this.doc.clientWidth) / 55);

		while(x < this.dpiScale * this.doc.clientWidth * 1.5)
		{
			let w = ((Math.sin(p) + 1) * 0.5) * lineWidth;
			this.fillRect(x, 0, w * this.scale, (this.dpiScale * this.doc.clientHeight * 1.5));
			x += lineWidth;
			p += this.scanRate;
		}
	}

	drawHalftone()
	{
		this.phaseA += this.phaseBOffset;
		this.phaseB += this.phaseAOffset;

		let dotSize = Math.round((this.dpiScale * this.doc.clientWidth) / 48);

		let x = -dotSize;
		let y = -dotSize;

		this.ctx.beginPath();

		while(y < (this.dpiScale * this.doc.clientHeight * 1.5)+dotSize)
		{
			x = -dotSize;
			while(x < (this.dpiScale * this.doc.clientWidth * 1.5)+dotSize)
			{
				let rad = (2 + Math.sin(this.phaseA + (x/this.dpiScale * 0.004)) + Math.sin(this.phaseB + (y/this.dpiScale * 0.004))) * 0.25;
				this.ctx.moveTo(x, y);
				this.ctx.arc(x + (Math.sin(this.phaseB + (x*0.01)) * 8), y + (Math.sin(this.phaseB + (y*0.01)) * 8), (0.6 + (dotSize * rad)) * this.scale, 0, this.pi2);
				x += dotSize;
			}
			y += dotSize;
		}
		this.ctx.fillStyle = '#000000';
		this.ctx.fill();
	}

	fillRect(x, y, w, h)
	{
		this.ctx.fillStyle = '#000000';
		this.ctx.fillRect(x, y, w, h);
	}
}






class Quiz {
  constructor() {
    this.currentQuestion = 0;
    this.metrics = {};
    this.timer = null;
    this.mode = null;
  }

  init(skipUpdate, immediate) {
    clearTimeout(this.timer);
    app.fx.startAnimation();
    if (!immediate) app.ui.addAction("wait", null, 500);
    app.fx.changeMode();
    app.ui.hideScene();
    app.ui.showScene("intro", {
      title: window.quizData.attractor_title,
      subtitle: window.quizData.attractor_intro,
      button: window.quizData.attractor_button_label,
    });

    if (!skipUpdate) app.ui.update();
  }

  initSkip() {
    this.init(true, true);
  }

  preamble(immediate) {
    if (!immediate) app.ui.addAction("wait", null, 500);
    app.ui.hideScene();
    app.fx.changeMode();
    app.ui.showScene("preamble", {
      title: window.quizData.preamble_title,
      text: window.quizData.preamble_intro,
      button: window.quizData.preamble_button_label,
    });
    this.restartIdleTimer();
  }

  start() {
    clearTimeout(this.timer);
    this.currentQuestion = -1;
    this.resetMetrics();

    app.ui.addAction("wait", null, 500);
    app.ui.hideScene();
    app.fx.changeMode();
    app.ui.addAction("call", this.nextQuestion.bind(this), 20);
  }

  back() {
    if (this.currentQuestion > 0) {
      this.currentQuestion -= 2;
      app.ui.hideScene();
      app.fx.changeMode();
      app.ui.addAction("call", this.nextQuestion.bind(this), 20);
    } else {
      this.preamble(true);
    }
  }

  restartIdleTimer() {
    clearTimeout(this.timer);
    let delay = parseInt(window.quizData.timeout_period) * 1000;
    // delay = 3000;
    this.timer = setTimeout(this.showIdleWarning.bind(this), delay);
  }

  restartFinishTimer() {
    // final screen flips back to the title screen automatically after a while
    clearTimeout(this.timer);
    let delay = parseInt(window.quizData.timeout_period) * 1000;
    // delay = 3000;
    this.timer = setTimeout(this.finishTimeout.bind(this), delay);
  }

  finishTimeout() {
    clearTimeout(this.timer);
    this.init();
  }

  finish() {
    // clicked finish manually
    clearTimeout(this.timer);
    this.init(true);
  }

  showIdleWarning() {
    app.ui.addAction("sceneOn", { id: "timeout" }, 20);
    app.ui.addAction("fadeIn", { id: "timeout" }, 500);
    app.ui.update();

    let buttons = document.querySelectorAll("#timeout button");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove("selected");
    }

    clearTimeout(this.timer);
    this.timer = setTimeout(this.timeout.bind(this), 10000); // 10 seconds
  }

  hideIdleWarning() {
    app.ui.addAction("fadeOut", { id: "timeout" }, 500);
    app.ui.addAction("sceneOff", { id: "timeout" }, 20);
  }

  cancelIdleWarning() {
    this.hideIdleWarning();
    this.restartIdleTimer();
  }

  timeout() {
    clearTimeout(this.timer);
    this.sendMetrics();
    this.hideIdleWarning();
    app.ui.addAction("call", this.initSkip.bind(this), 20);
    app.ui.update();
  }

  clickTimeout() {
    clearTimeout(this.timer);
    this.sendMetrics();
    this.hideIdleWarning();
    app.ui.addAction("call", this.initSkip.bind(this), 20);
  }

  resetMetrics() {
    this.metrics = {};
    this.metrics["Session start"] = new Date().toISOString();
    this.metrics.scores = [];
  }

  nextQuestion() {
    this.currentQuestion++;

    if (this.currentQuestion < window.quizData.questions.length) {
      // next question
      let args = {};
      let q = window.quizData.questions[this.currentQuestion];
      let total = window.quizData.questions.length;
      args.num = this.currentQuestion + 1 + "/" + total;
      args.question = q.question;

      // reset/hide all answer buttons
      let answers = document.querySelectorAll(".answer");
      for (var i = 0; i < answers.length; i++) {
        answers[i].dataset.text = "";
        answers[i].classList.add("hidden");
      }

      // prepare args for question display
      // add answers to button data, show active buttons
      let count = 0;
      for (let i in q.answer) {
        args["answer" + count] = q.answer[i].answer;
        answers[count].dataset.text = q.answer[i].answer;
        answers[count].classList.remove("hidden");
        count++;
      }

      app.ui.showScene("question", args);
      this.restartIdleTimer();
    } else {
      // end of quiz
      this.showResults();
    }
  }

  receiveAnswer(a) {
    clearTimeout(this.timer);
    app.ui.disable();

    let answers = document.querySelectorAll(".answer");
    for (var i = 0; i < answers.length; i++) {
      answers[i].classList.add("rejected");
    }

    a.classList.remove("rejected");
    a.classList.add("selected");

    // write / overwrite metric for this question
    this.metrics["Question " + (this.currentQuestion + 1)] =
      "" +
      parseInt(
        window.quizData.questions[this.currentQuestion].answer[
          parseInt(a.dataset.answer)
        ].score
      );
    this.metrics.scores[this.currentQuestion] = parseInt(
      window.quizData.questions[this.currentQuestion].answer[
        parseInt(a.dataset.answer)
      ].score
    );

    app.fx.changeMode();
    app.ui.addAction("wait", null, 500);
    app.ui.addAction("fadeOut", { id: "question" }, 500);
    app.ui.addAction("sceneOff", { id: "question" }, 20);
    app.ui.addAction("call", this.nextQuestion.bind(this), 20);
  }

  // (can also send partially complete data if the quiz is abandoned)
  sendMetrics() {
    this.metrics["Session end"] = new Date().toISOString();
    this.metrics["Session source"] = "kiosk";

    delete this.metrics.scores; // remove temporary score log

    // doesn't need to post the results anywhere anymore

    // axios
    // .post(
    // 	window.quizData.data_airtable_url, { "fields" : this.metrics }
    // )
    // .then(
    // 	function (response) { console.log(response); }
    // )
    // .catch(
    // 	function (error) { console.log(error); }
    // );
  }

  showResults() {
    // final score
    let score = 0;
    for (let i = 0; i < this.metrics.scores.length; i++) {
      score += this.metrics.scores[i];
    }

    // get rank
    let ranks = window.quizData.results_groups;
    let rankIndex = 0;
    for (let i = 0; i < ranks.length; i++) {
      let min = parseInt(ranks[i]["result_range_-_min"]);
      let max = parseInt(ranks[i]["result_range_-_max"]);
      if (score >= min && score <= max) {
        rankIndex = i;
      }
    }

    if (this.mode == "quiz") {
      document.querySelector("#result_lark").classList.add("hidden");
      document.querySelector("#result_owl").classList.add("hidden");
      if (rankIndex == 0)
        document.querySelector("#result_lark").classList.remove("hidden");
      if (rankIndex == 2)
        document.querySelector("#result_owl").classList.remove("hidden");
    }

    app.ui.showScene("results", {
      title: window.quizData.results_groups[rankIndex]["score_title"],
      text: window.quizData.results_groups[rankIndex]["result_body"],
    });

    // send metrics...
    this.sendMetrics();

    // timeout
    this.restartFinishTimer();
  }
}






class UI
{
	constructor()
	{
		this.currentSceneId = null;
		this.actions = [];
		this.clickEnabled = false;
		window.addEventListener('click', this.handleClick.bind(this));
	}

	disable()
	{
		this.clickEnabled = false;
	}

	enable()
	{
		this.clickEnabled = true;
	}

	addAction(type, args, delay)
	{
		this.actions.push(new Action(type, args, delay));
	}

	update()
	{
		if(this.actions.length > 0)
		{
			this.disable();
			let a = this.actions[0];
			let delay = a.delay;
			this.executeAction(a);
			this.actions.shift();
			window.setTimeout(this.update.bind(this), delay);
		} else {
			this.enable();
		}
	}

	executeAction(action)
	{
		switch(action.type)
		{
			case 'wait' :
				//
				break;

			case 'call' :
				action.args();
				break;

			case 'fadeOut' :
				document.querySelector('#'+action.args.id).classList.remove('visible');
				break;

			case 'sceneOff' :
				document.querySelector('#'+action.args.id).classList.remove('on');
				break;

			case 'populateFields' :
				for (let f in action.args.fields)
				{
					let field = document.querySelector('#'+action.args.id+' [data-field="'+f+'"]');
					field.innerHTML = action.args.fields[f];
				}
				break;

			case 'sceneOn' :
				document.querySelector('#'+action.args.id).classList.add('on');
				break;

			case 'fadeIn' :
				document.querySelector('#'+action.args.id).classList.add('visible');
				break;
		}
	}

	showScene(id, fields)
	{
		this.currentSceneId = id;

		let args = {};
		args.id = id;
		args.fields = {};
		for (let f in fields) { args.fields[f] = fields[f]; }

		this.addAction('populateFields', args, 0);
		this.addAction('sceneOn', { id: id }, 20);
		this.addAction('fadeIn', { id: id }, 500);

		let buttons = document.querySelectorAll('#'+id+' button');
		for (var i = 0; i < buttons.length; i++)
		{
			buttons[i].classList.remove('rejected');
			buttons[i].classList.remove('selected');
		}
	}

	hideScene()
	{
		if(this.currentSceneId != null)
		{
			this.addAction('fadeOut', { id: this.currentSceneId }, 500);
			this.addAction('sceneOff', { id: this.currentSceneId }, 20);
		}
	}

	handleClick(e)
	{
		if(!this.clickEnabled) return;

		let elem = document.elementFromPoint(e.clientX, e.clientY);
		if(elem.dataset.action)
		{
			app[elem.dataset.action](elem);
			elem.classList.add('selected');
		}

		this.update();
	}

}




class Action
{
	constructor(type, args, delay)
	{
		this.type = type;
		this.args = args;
		this.delay = delay;
	}
}










class Utils
{

	static randomInt(min, max)
	{
		return Math.round(min + (Math.random() * (max-min)));
	}

	static randomFloat(min, max)
	{
		return min + (Math.random() * (max-min));
	}

	static randomElement(array)
	{
		return array[Utils.randomInt(0, array.length-1)];
	}

	static difference(a, b)
	{
		return b - a;
	}

	static leadingZeros(int, chars)
	{
		// return a string of [int] with total length [chars] with leading zeros if necessary
		let string = int+'';
		let output = string;
		if(string.length < chars)
		{
			let c = chars - string.length;
			while(c > 0)
			{
				output = '0'+output;
				c--;
			}
		}
		return output;
	}

	static isEmpty(obj)
	{
		return Object.keys(obj).length === 0 && obj.constructor === Object;
	}

	static stripCRs(string)
	{
		// remove evil new line chars
		return string.replace(/(\r\n|\n|\r)/gm, "");
	}

	static setCharAt(str, index, chr)
	{
		if(index > str.length-1) return str;
		return str.substr(0,index) + chr + str.substr(index+1);
	}

}






