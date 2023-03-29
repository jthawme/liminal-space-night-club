




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



