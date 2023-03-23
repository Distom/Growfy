'use strict';

let themeSwitcher = document.querySelector('.header__theme-switcher');
let menuIcon = document.querySelector('.header__menu-icon');
let menu = document.querySelector('.header__menu-list');
let btnCollors = ['#5CC97B', '#FF6D35', '#3D96F4', '#FFCD1D'];
let btnAnimationDuration = 300;
let menuBurgerActive = false;

addStars();
updateTheme();
addScrollInto();

window.addEventListener('resize', () => addScrollInto());
window.addEventListener('resize', closeMenuBurger);
document.addEventListener('click', menuOnClick);
document.addEventListener('mouseover', changeBtnColor);
document.addEventListener('click', toggleTheme);
document.addEventListener('focusin', changeBtnColor);
document.addEventListener('scroll', updateCssScrollY);

function closeMenuBurger() {
	if (window.innerWidth > 870 && menuBurgerActive) {
		toggleMenu();
	}
}

function updateCssScrollY() {
	document.documentElement.style.setProperty('--scrollY', scrollY + 'px');
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
	menuBurgerActive = !menuBurgerActive
}

function changeBtnColor(e) {
	let btn = e.target;
	if (!btn) return;
	if (!btn.classList.contains('button')) return;

	if (btn.animation) stopAnimation();

	let reverseListenerType = e.type == 'mouseover' ? 'mouseout' : 'focusout';
	let originalColor;
	let oldColor = getComputedStyle(btn).background;
	let maxIterationCount = 20;

	while (true) {
		if (maxIterationCount-- == 0) return; //sometimes the loop freezes
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

	btn.addEventListener(reverseListenerType, reverseAnimation);

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

		btn.animation?.addEventListener('finish', finishAnimation);
		btn.animation?.addEventListener('cancel', removeListeners);
		btn.removeEventListener(reverseListenerType, reverseAnimation);
	}

	function finishAnimation() { // ?. becouse sometimes !btn.animation
		btn.style.background = ''; // focus and mouse event conflicts
		btn.animation?.cancel();
		removeListeners();
		btn.animation = null;
	}

	function removeListeners() {
		btn.animation?.removeEventListener('finish', finishAnimation);
		btn.animation?.removeEventListener('cancel', removeListeners);
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