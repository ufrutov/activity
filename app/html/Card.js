import Util from '../js/Util.js'

export default class Card {
	constructor() {
		this.card = null;
		this.play = false;
		this.interval = null;
		this.timer = 30;
		this.common = false;

		this.settings = Util.getCookie('settings');

		let view = document.createElement('div');
		view.classList = 'play-view d-flex align-items-stretch';

		let content = document.createElement('div');
		content.classList = 'card-view p-3 flex-fill';

		let close = document.createElement('div');
		close.classList = 'close-play';

		close.addEventListener('click', e => {
			Util.loadTemplate('main');
		});

		let inner = document.createElement('div');
		inner.classList = 'card-inner flex-fill p-2 d-flex flex-column justify-content-between';

		let header = document.createElement('div');

		let title = document.createElement('h4');
		title.classList = 'card-title';
		title.innerHTML = 'Карточка № ';

		let number = document.createElement('span');
		number.id = 'card-number';

		let mode = document.createElement('div');
		mode.classList = 'd-flex justify-content-center align-items-center';

		let modeImg = document.createElement('img');
		modeImg.id = 'mode-image';
		modeImg.src = './app/img/show.png';

		let modeText = document.createElement('div');
		modeText.classList = 'mx-3 text-center';

		let modeTitle = document.createElement('div');
		modeTitle.id = 'mode-title';
		modeTitle.classList = 'font-weight-bold';

		let commonTitle = document.createElement('div');
		commonTitle.id = 'common-title';
		commonTitle.classList = 'text-small';
		commonTitle.innerHTML = 'Общая карточка';

		let commonImage = document.createElement('img');
		commonImage.id = 'common-image';
		commonImage.src = './app/img/m.png';

		let word = document.createElement('div');
		word.id = 'card-word';
		word.classList = 'card-word';

		word.addEventListener('click', e => {
			this.togglePlay();
			this.toggleWord();
		});

		let footer = document.createElement('div');
		footer.id = 'card-actions';
		footer.classList = 'text-center';

		title.appendChild(number);
		modeText.appendChild(modeTitle);
		modeText.appendChild(commonTitle);

		mode.appendChild(modeImg);
		mode.appendChild(modeText);
		mode.appendChild(commonImage);

		header.appendChild(title);
		header.appendChild(mode);

		inner.appendChild(header);
		inner.appendChild(word);
		inner.appendChild(footer);

		content.appendChild(close);
		content.appendChild(inner);

		view.appendChild(content);

		document.getElementById('main').appendChild(view);

		this.getNewCard();
	}

	startPlay() {
		this.play = true;
		this.toggleWord();
		this.completeButtons('start');

		if( !this.common ) {
			if( !Util.isEmpty( this.interval ) ) {
				try {
					clearInterval(this.interval);
				} catch(e) {}
				this.interval = null;
			}

			this.interval = setInterval(() => { this.updateProgress() }, 300);
		}
	}

	stopProgress() {
		if( !Util.isEmpty( this.interval ) ) {
			try {
				clearInterval(this.interval);
			} catch(e) {}
			this.interval = null;
		}
	}

	togglePlay() {
		const progress = document.getElementById('play-progress');
		if( progress ) {
			if( this.play ) {
				// [+] Show other card option
				progress.classList.add('bg-warning');
				this.stopProgress();
			} else {
				progress.classList.remove('bg-warning');
				this.interval = setInterval(() => { this.updateProgress() }, 300);
			}
		}

		this.play = !this.play;
	}

	updateProgress() {
		const progress = document.getElementById('play-progress');
		const width = parseFloat(progress.style.width);
		const step = ( 300 * 100 ) / ( this.timer * 1000 );

		if( width < 100 ) {
			if( width > 79 ) {
				progress.classList.add('bg-danger');
			}
			progress.style.width = ( width + step ) + '%';
		} else {
			progress.style.width = '100%';
			this.stopProgress();

			// [+] Play sound
			console.log('[+] Play sound');
		}
	}

	getNewCard(removeCard = false) {
		if( removeCard && !Util.isEmpty(this.card) ) {
			const playedcards = Util.getCookie('playedcards');
			playedcards.push( this.card.id );
			Util.setCookie('playedcards', playedcards);
		}

		this.play = false;
		this.completeButtons('play');

		this.card = Util.getCard();

		const number = document.getElementById('card-number');
		number.innerHTML = this.card.id;

		this.setMode();
		this.setCommon();
		this.setWord();
	}

	toggleWord() {
		if( this.play ) {
			let word = this.card.word.split("").map((c, i) => {
				if( [" ", "-", "!", "?"].indexOf(c) !== -1 ) {
					return c;
				} else {
					return "*";
				}
			});

			document.getElementById('card-word').innerHTML = word.join("");
		} else {
			this.setWord();
		}
	}

	setWord() {
		const word = document.getElementById('card-word');
		word.innerHTML = this.card.word;
	}

	setMode() {
		let options = [];
		Util.each(['draw', 'say', 'show'], (o, i) => {
			if( parseInt(this.card[o]) ) {
				options.push(o);
			}
		});

		const mode = options[Util.getRandomInt(0, options.length)];

		this.timer = this.settings.timer[mode];

		const image = document.getElementById('mode-image');
		image.src = `./app/img/${mode}.png`;

		const title = document.getElementById('mode-title');
		const titles = {
			draw: 'Нарисовать слово',
			say: 'Объяснить слово',
			show: 'Показать слово' };
		title.innerHTML = titles[mode];
	}

	setCommon() {
		const content = document.querySelector('.card-view');
		const image = document.getElementById('common-image');
		const title = document.getElementById('common-title');

		const common = Util.getRandomInt(0, 4);
		this.common = Boolean( common === 0 );
		if( common === 0 ) {
			content.classList.add('common');
			image.classList.remove('hidden');
			title.classList.remove('hidden');
		} else {
			content.classList.remove('common');
			image.classList.add('hidden');
			title.classList.add('hidden');
		}
	}

	completeButtons(mode) {
		const target = document.getElementById('card-actions');

		// Clean up footer content
		while (target.firstChild) {
			target.removeChild(target.firstChild);
		}

		switch(mode) {
			case 'play':
				let play = document.createElement('button');
				play.innerHTML = 'Играть';
				play.classList = 'btn btn-success mx-2';

				play.addEventListener('click', e => {
					this.startPlay();
				});

				let other = document.createElement('button');
				other.innerHTML = 'Выбрать другую';
				other.classList = 'btn btn-default mx-2';

				other.addEventListener('click', e => {
					other.parentNode.removeChild(other);
					this.getNewCard();
				});

				target.appendChild(play);
				target.appendChild(other);
				break;
			case 'start':
				let ready = document.createElement('button');
				ready.innerHTML = 'Карточка отгадана';
				ready.classList = 'btn btn-info';

				ready.addEventListener('click', e => {
					this.stopProgress();
					this.completeButtons('commands');
				});

				if( !this.common ) {
					let progress = document.createElement('div');
					progress.classList = 'progress';

					progress.addEventListener('click', e => {
						this.togglePlay();
					});

					let progressBar = document.createElement('div');
					progressBar.id = 'play-progress';
					progressBar.classList = 'progress-bar progress-bar-striped progress-bar-animated progress-bar-success';
					progressBar.style.width = '0';

					progress.appendChild(progressBar);
					target.appendChild(progress);
				}

				target.appendChild(ready);
				break;
			case 'commands':
				let group = document.createElement('div');

				const commands = Util.getCookie('commands');
				Util.each(commands, (c, i) => {
					let cbtn = document.createElement('button');
					cbtn.classList = 'btn btn-primary mx-2 mb-3 p-relative';
					cbtn.innerHTML = c.name;

					cbtn.addEventListener('click', e => {
						commands[i].count++;
						Util.setCookie('commands', commands);
						this.completeButtons('next');
					});

					if( this.settings.count ) {
						let count = document.createElement('span');
						count.classList = 'p-absolute command-count';
						count.innerHTML = c.count;

						cbtn.appendChild(count);
					}

					group.appendChild(cbtn);
				});

				let other2 = document.createElement('button');
				other2.innerHTML = 'Выбрать другую карточку';
				other2.classList = 'btn btn-sm btn-default';

				other2.addEventListener('click', e => {
					this.getNewCard();
				});

				target.appendChild(group);
				target.appendChild(other2);
				break;
			case 'next':
				let next = document.createElement('button');
				next.innerHTML = 'Новая карточка';
				next.classList = 'btn btn-lg btn-success font-weight-bold btn-block';

				next.addEventListener('click', e => {
					this.getNewCard(true);
				});

				target.appendChild(next);
				break;
		}
	}
}