import Util from '../js/Util.js'

export default class Start {
	constructor() {
		let view = document.createElement('div');
		view.classList = 'play-view d-flex align-items-stretch';

		let content = document.createElement('div');
		content.classList = 'card-view flex-fill p-4 d-flex flex-column justify-content-between';

		let close = document.createElement('div');
		close.classList = 'close-play';

		close.addEventListener('click', e => {
			Util.loadTemplate('main');
		});

		let image = document.createElement('img');
		image.src = 'app/img/cards.png';
		image.classList = 'mt-4 mx-auto d-block img-fluid';

		let play = document.createElement('div');
		play.classList = 'btn btn-lg btn-success mx-auto mb-4 px-4';
		play.innerHTML = 'Начать игру!';

		play.addEventListener('click', e => {
			Util.loadTemplate('card');
		});

		content.appendChild(close);
		content.appendChild(image);
		content.appendChild(play);
		view.appendChild(content);

		document.getElementById('main').appendChild(view);
	}
}