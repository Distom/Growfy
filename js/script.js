'use strict';

let themeSwitcher = document.querySelector('.header__theme-switcher');
let menuIcon = document.querySelector('.header__menu-icon');
let menu = document.querySelector('.header__menu-list');
let btnCollors = ['#5CC97B', '#FF6D35', '#3D96F4', '#FFCD1D'];
let btnAnimationDuration = 300;

addStars();
updateTheme();

document.addEventListener('click', menuOnClick);
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

			if (menu.classList.contains('header__menu-list_active')) {
				toggleMenu();
			}
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

function menuOnClick(e) {
	if (!e.target.closest('.header__menu-icon')) return;
	toggleMenu();
}

function toggleMenu() {
	menuIcon.classList.toggle('header__menu-icon_active');
	menu.classList.toggle('header__menu-list_active');
	document.body.classList.toggle('body_menu-active');
}



function changeBtnColor(e) {
	let btn = e.target;
	if (!btn) return;
	if (!btn.classList.contains('button')) return;

	if (btn.animation) stopAnimation();

	let originalColor;
	let oldColor = getComputedStyle(btn).background;

	while (true) {
		btn.style.background = btnCollors[randInt(0, btnCollors.length - 1)];
		let newColor = getComputedStyle(btn).background;

		btn.style.background = '';
		originalColor = getComputedStyle(btn).background;

		if (oldColor !== newColor && newColor != originalColor) {
			btn.animation = btn.animate([
				{ background: oldColor },
				{ background: newColor }
			],
				{
					duration: btnAnimationDuration,
					fill: 'forwards'
				});

			break;
		}
	}

	btn.addEventListener('mouseout', reverseAnimation);

	function reverseAnimation(e) {
		if (!e.target.closest('.button')) return;
		if (!btn.animation) return;

		let animationDuration = btn.animation.currentTime;
		stopAnimation();

		let pausedColor = getComputedStyle(btn).background;
		btn.style.cssText = `background: ${pausedColor}`;

		btn.animation = btn.animate([
			{ background: pausedColor },
			{ background: originalColor }
		], {
			duration: animationDuration,
			fill: 'forwards'
		});

		btn.animation.addEventListener('finish', finishAnimation);
		btn.animation.addEventListener('cancel', removeListeners);
		btn.removeEventListener('mouseout', reverseAnimation);
	}

	function finishAnimation() {
		btn.style.background = '';
		btn.animation.cancel();
		removeListeners();
		btn.animation = null;
	}

	function removeListeners() {
		btn.animation.removeEventListener('finish', finishAnimation);
		btn.animation.removeEventListener('cancel', removeListeners);
	}

	function stopAnimation() {
		btn.animation.commitStyles();
		btn.animation.cancel();
	}
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