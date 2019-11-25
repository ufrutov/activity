import Home from '../html/Home.js'
import Start from '../html/Start.js'
import Card from '../html/Card.js'
import Settings from '../html/Settings.js'
import cards from './data.js'

export default class {
	static request() {
		console.log('[request]');
	}

	static each(set, callback) {
		if( set.hasOwnProperty('length') ) {
			for (var i = 0; i < set.length; i++) {
				if( i === set.length-1 ) {
					callback(set[i], i, true);
				} else {
					callback(set[i], i, false);
				}
			}
		} else if( typeof set === 'object' ) {
			const keys = Object.keys(set);
			for (var j = 0; j < keys.length; j++) {
				callback(keys[j], set[keys[j]], j);
			}
		}
	}

	static isEmpty(object) {
		switch( typeof(object) ) {
			case 'object':
				if( object === null ) return true;
				return Object.keys(object).length === 0;
			case 'array':
			case 'string':
				return object.length === 0;
			case 'undefined':
				return true;
			default:
				return false;
		}
	}

	static getCookie(name) {
		const output = localStorage.getItem(name);

		if( !this.isEmpty(output) ) {
			return JSON.parse(output);
		} else {
			switch(name) {
				case 'commands':
					return [{
						name: 'Котята-утята',
						count: 0
					}, {
						name: 'Мальчики-зайчики',
						count: 0
					}];
					break;
				case 'settings':
					return {
						count: true,
						sound: true,
						timer: {
							draw: 120,
							say: 60,
							show: 60
						}
					};
					break;
				case 'playedcards':
					return [];
					break;
				default:
					return null;
			}
		}
	}

	static setCookie(name, data) {
		if( !this.isEmpty(name) ) {
			localStorage.setItem(name, JSON.stringify(data));
		} else {
			console.warn('[Util:setCookie] Error on setCookie - empty name/data provided');
		}
	}

	static loadTemplate(tmp) {
		const main = document.getElementById('main');
		while (main.firstChild) {
			main.removeChild(main.firstChild);
		}

		switch( tmp ) {
			case 'start':
				new Start();
				break;
			case 'card':
				new Card();
				break;
			case 'settings':
				new Settings();
				break;
			default:
				new Home();
		}
	}

	static getCard() {
		if( !this.isEmpty(cards.data) ) {
			const ammount = cards.data.length;
			const playedcards = this.getCookie('playedcards');

			const index = this.getRandomInt(0, ammount);
			if( playedcards.indexOf(index) === -1 ) {
				cards.data[index]['id'] = index;
				return cards.data[index];
			} else {
				if( playedcards.length >= ammount ) {
					return {
						id: "-1",
						word: "No cards left",
						draw: "0",
						say: "1",
						show: "0"
					};
				} else {
					return this.getCard();
				}
			}
		} else {
			return {
				id: "-1",
				word: "No card",
				draw: "0",
				say: "1",
				show: "0"
			};
		}
	}

	static getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);

		//The maximum is exclusive and the minimum is inclusive
		return Math.floor(Math.random() * (max - min)) + min;
	}
}