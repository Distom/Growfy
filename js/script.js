'use strict';

let themeSwitcher = document.querySelector('.header__theme-switcher');
let menuIcon = document.querySelector('.header__menu-icon');
let menu = document.querySelector('.header__menu-list');
let wrapper = document.querySelector('.wrapper');
let btnCollors = ['#5CC97B', '#FF6D35', '#3D96F4', '#FFCD1D'];
let btnAnimationDuration = 300;

addStars();
updateTheme();

document.addEventListener('click', toggleMenu);
document.addEventListener('mouseover', changeBtnColor);
document.addEventListener('click', toggleTheme);

addScrollInto();
window.onresize = function () {
	addScrollInto();
}

function addScrollInto() {
	let width = document.documentElement.clientWidth;
	let position = width < 1200 ? 'start' : 'center';

	let menuLinks = document.querySelectorAll('.header__menu-link');
	menuLinks.forEach(link => {
		link.onclick = function (event) {
			let href = this.getAttribute('href');
			if (!href || href == '#') return;

			let target = document.querySelector(href);
			if (!target) return;
			target.scrollIntoView({ behavior: 'smooth', block: position });
			event.preventDefault();
		}
	});
}

function updateTheme() {
	let theme = localStorage.getItem('theme');
	if (theme != 'lite-theme') return;

	let toggler = document.querySelector('.header__theme-label');
	toggler.classList.add('transition-after-off');
	themeSwitcher.checked = true;
	setTimeout(() => toggler.classList.remove('transition-after-off'), 0);

	document.body.classList.remove('dark-theme');
	document.body.classList.add('lite-theme');
}

function saveTheme() {
	let isDark = document.body.classList.contains('dark-theme');
	let theme = isDark ? 'dark-theme' : 'lite-theme';
	localStorage.setItem('theme', theme);
}

function toggleTheme(e) {
	if (e.target != themeSwitcher) return;
	let body = document.body;
	body.classList.add('transition-all');
	setTimeout(() => body.classList.remove('transition-all'), 300);
	body.classList.toggle('dark-theme');
	body.classList.toggle('lite-theme');
	saveTheme();
}

function toggleMenu(e) {
	if (!e.target.closest('.header__menu-icon')) return;
	menuIcon.classList.toggle('header__menu-icon_active');
	menu.classList.toggle('header__menu-list_active');
	wrapper.classList.toggle('wrapper_menu-active');
}

function changeBtnColor(e) {
	let btn = e.target;
	if (!btn) return;
	if (!btn.classList.contains('button')) return;

	if (btn.animation) {
		btn.animation.commitStyles();
		btn.animation.cancel();
	}

	let newColor;
	let originalColor;
	let oldColor = getComputedStyle(btn).background;

	while (true) {
		newColor = btnCollors[randInt(0, btnCollors.length - 1)];
		btn.style.background = newColor;
		let newColorFormated = getComputedStyle(btn).background;
		btn.style.background = '';
		originalColor = getComputedStyle(btn).background;

		if (oldColor !== newColorFormated && newColorFormated != originalColor) {
			btn.animation = btn.animate([
				{ background: oldColor },
				{ background: newColorFormated }
			],
				{
					duration: btnAnimationDuration,
					fill: 'forwards'
				});

			break;
		}
	}

	btn.addEventListener('mouseout', function mouseOut(e) {
		if (!e.target.closest('.button')) return;
		if (!btn.animation) return;

		let runTime = btn.animation.currentTime;
		btn.animation.commitStyles();
		btn.animation.cancel();

		let pausedColor = getComputedStyle(btn).background;
		btn.style.cssText = `background: ${pausedColor}`;


		btn.animation = btn.animate([
			{ background: pausedColor },
			{ background: originalColor }
		], {
			duration: runTime,
			fill: 'forwards'
		});

		btn.animation.addEventListener('finish', onFinish);

		function onFinish() {
			btn.style.background = '';
			btn.animation.removeEventListener('cancel', onCancel);
			btn.animation.cancel();
			btn.animation.removeEventListener('finish', onFinish);
			btn.animation = null;
		}

		btn.animation.addEventListener('cancel', onCancel);

		function onCancel() {
			btn.animation.removeEventListener('finish', onFinish);
			btn.animation.removeEventListener('cancel', onCancel);
		}

		btn.removeEventListener('mouseout', mouseOut);
	});
}

function randInt(min, max) {
	return Math.floor(min + Math.random() * (max + 1 - min));
}

function addStars() {
	let starsElems = document.querySelectorAll('.card-comment__stars');

	starsElems.forEach(elem => {
		let count = elem.dataset.stars;
		for (let i = count; i > 0; i--) {
			let star = document.createElement('span');
			star.className = 'star';
			elem.append(star);
		}
	});
}

/* function changeBtnColorTransition(e) {
	let btn = e.target;
	if (!btn) return;
	if (!btn.classList.contains('button')) return;
	let newColor;
	while (true) {
		let oldColor = getComputedStyle(btn).background;
		newColor = btnCollors[randInt(0, btnCollors.length - 1)];
		btn.style.transition = 'none'; // !!!!!
		btn.style.background = newColor;
		let cache = getComputedStyle(btn).background;
		btn.style.background = '';
		if (oldColor !== cache) {
			setTimeout(() => {
				btn.style.transition = 'background 0.3s';
				btn.style.background = newColor;
			}, 0);
			break;
		}
	}
	
	btn.addEventListener('mouseout', function mouseOut(e) {
		if (!e.target.closest('.button')) return;
		btn.style.background = '';
		btn.removeEventListener('mouseout', mouseOut);
	});
} */