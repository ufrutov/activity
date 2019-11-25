import Util from '../js/Util.js'

export default class Home {
	constructor() {
		let editDelay = null;

		let content = document.createElement('div');
		content.id = 'home';
		content.classList = 'home content d-flex flex-column justify-content-between';

		let header = document.createElement('div');
		header.classList = 'header d-flex justify-content-between';

		let logo = document.createElement('div');
		logo.classList = 'logo';

		let settings = document.createElement('div');

		settings.classList = 'open-settings';

		settings.addEventListener('click', () => {
			Util.loadTemplate('settings');
		});

		let count = document.createElement('div');
		count.id = 'count';
		count.classList = 'count-block py-2 px-4';

		let reset = document.createElement('div');
		reset.classList = 'reset-count';
		reset.innerHTML = '0:0';

		reset.addEventListener('click', this.resetCount);

		let title = document.createElement('h2');
		title.classList = 'title mt-2 my-2';
		title.innerHTML = 'Счет игры';

		let footer = document.createElement('div');

		let start = document.createElement('div');
		start.id = 'play-start';
		start.classList = 'btn-start mb-4';
		start.innerHTML = 'Играть!';

		start.addEventListener('click', () => {
			Util.loadTemplate('start');
		});

		header.appendChild(logo);
		header.appendChild(settings);

		count.appendChild(reset);
		count.appendChild(title);
		count.appendChild(this.renderCommands());

		footer.appendChild(start);

		content.appendChild(header);
		content.appendChild(count);
		content.appendChild(footer);

		document.getElementById('main').appendChild(content);
	}

	renderCommands() {
		const commands = Util.getCookie('commands');

		let output = document.createElement('div');
		output.classList = 'row';

		Util.each(commands, (c, i) => {
			let item = document.createElement('div');
			item.classList = 'command col-6';

			item.addEventListener('click', this.editCount);

			let count = document.createElement('div');
			count.classList = 'count-item';

			let value = document.createElement('div');
			value.innerHTML = c.count;
			value.classList = 'count-value';

			let plus = document.createElement('div');
			plus.innerHTML = '+';
			plus.classList = 'plus';

			plus.addEventListener('click', e => { this.updateCount(e, i, 'plus', value) });

			let minus = document.createElement('div');
			minus.innerHTML = '-';
			minus.classList = 'minus';

			minus.addEventListener('click', e => { this.updateCount(e, i, 'minus', value) });

			let title = document.createElement('h4');
			title.classList = 'title mt-2 text-center';
			title.innerHTML = c.name;

			count.appendChild(value);
			count.appendChild(plus);
			count.appendChild(minus);

			item.appendChild(count);
			item.appendChild(title);

			output.appendChild(item);
		});

		return output;
	}

	updateCount(ev, index, op, element) {
		ev.stopPropagation();

		let cookie = Util.getCookie('commands');

		if( op === 'plus' ) {
			if( cookie[index].count < 100 ) {
				cookie[index].count++;
				element.innerHTML = cookie[index].count;
				Util.setCookie('commands', cookie);
			}
		}

		if( op === 'minus' ) {
			if( cookie[index].count > 1 ) {
				cookie[index].count--;
				element.innerHTML = cookie[index].count;
				Util.setCookie('commands', cookie);
			}
		}
	}

	editCount() {
		document.getElementById('count').classList.add('edit');

		if( !Util.isEmpty(this.editDelay) ) {
			try {
				window.clearTimeout(this.editDelay);
			} catch(e) {}

			this.editDelay = null;
		}

		this.editDelay = window.setTimeout(() => {
			document.getElementById('count').classList.remove('edit');
		}, 5000);
	}

	resetCount() {
		let cookie = Util.getCookie('commands');
		const values = document.getElementById('count').querySelectorAll('.count-value');

		Util.each(cookie, (c, i) => {
			c.count = 0;
			values[i].innerHTML = c.count;
		});

		Util.setCookie('commands', cookie);
		Util.setCookie('playedcards', []);
	}
}