'use strict';

let themeSwitcher = document.querySelector('.header__theme-switcher');
let menuIcon = document.querySelector('.header__menu-icon');
let menu = document.querySelector('.header__menu-list');
let header = document.querySelector('.header');
let btnCollors = ['#5CC97B', '#FF6D35', '#3D96F4', '#FFCD1D'];
let btnAnimationDuration = 300;
let menuBurgerActive = false;
let prevScrollY = scrollY;
let headerTop = 0;
let firstScrollRead = true;
let slideMenuAdded = false;

addStars();
updateTheme();
addScrollInto();
if (window.innerWidth < 870) {
	window.addEventListener('scroll', slideMenu);
	slideMenuAdded = true;
}

window.addEventListener('resize', () => addScrollInto());
window.addEventListener('resize', closeMenuBurger);
window.addEventListener('resize', addSlideMenu);
document.addEventListener('click', menuOnClick);
document.addEventListener('mouseover', changeBtnColor);
document.addEventListener('click', toggleTheme);
document.addEventListener('focusin', changeBtnColor);

function closeMenuBurger() {
	if (window.innerWidth > 870 && menuBurgerActive) {
		toggleMenu();
	}
}

function addSlideMenu() {
	requestAnimationFrame(() => {
		if (window.innerWidth < 870 && !slideMenuAdded) {
			window.addEventListener('scroll', slideMenu);
			slideMenuAdded = true;
		} else if (window.innerWidth > 870 && slideMenuAdded) {
			removeSlideMenu();
		}
	});
}

function removeSlideMenu() {
	window.removeEventListener('scroll', slideMenu);
	header.style.top = '';
	slideMenuAdded = false;
	firstScrollRead = true;
}

function hideHeader() {
	header.style.top = `-${header.offsetHeight}px`;
	headerTop = -header.offsetHeight;
}

function slideMenu() {
	let diff = scrollY - prevScrollY;

	if (firstScrollRead) {
		diff = 0;
		firstScrollRead = false;
	}

	setHeaderTop(headerTop - diff);
	prevScrollY = scrollY;
}

function setHeaderTop(value) {
	headerTop = Math.max(value, -header.offsetHeight);
	headerTop = Math.min(headerTop, 0);
	header.style.top = headerTop + 'px';
}

function addScrollInto() {
	requestAnimationFrame(() => {
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
				let interval = setInterval(resetHeaderVisible, 16);

				if (width < 870) {
					removeSlideMenu();
					hideHeader();
					scrollEnd()
						.then(addSlideMenu)
						.then(() => clearInterval(interval));
				}

				if (menu.classList.contains('header__menu-list_active')) {
					toggleMenu();
				}

				event.preventDefault();
			}
		});
	});
}

function resetHeaderVisible() {
	requestAnimationFrame(() => {
		if (-scrollY < header.offsetHeight && header.getBoundingClientRect().top < -scrollY) {
			setHeaderTop(-scrollY);
		}
	});
}

function scrollEnd() {
	return new Promise(resolve => {
		let prevScrollY = 0;
		let interval = setInterval(() => {
			if (scrollY - prevScrollY != 0) {
				prevScrollY = scrollY;
				return;
			}
			resolve();
			clearInterval(interval);
		}, 20)
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