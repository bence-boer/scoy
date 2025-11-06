<script lang="ts">
	import { onMount } from 'svelte';

	const ANIMATION_RANGE = 200;
	const IS_TOUCH_DEVICE =
		'ontouchstart' in window ||
		navigator.maxTouchPoints > 0 ||
		(navigator as any).msMaxTouchPoints > 0;

	let cursorElement: HTMLDivElement;
	let letterElements: HTMLSpanElement[] = [];
	let mouseX = 0;
	let mouseY = 0;

	function dist(x1: number, y1: number, x2: number, y2: number): number {
		return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
	}

	function map(
		value: number,
		fromFloor: number,
		fromCeil: number,
		toFloor: number,
		toCeil: number
	): number {
		return (
			toFloor +
			((toCeil - toFloor) * (Math.max(Math.min(value, fromCeil), fromFloor) - fromFloor)) /
				(fromCeil - fromFloor)
		);
	}

	function handleMovement(event: MouseEvent | Touch) {
		mouseX = event.clientX;
		mouseY = event.clientY;

		if (cursorElement) {
			cursorElement.style.left = mouseX + 'px';
			cursorElement.style.top = mouseY + 'px';
		}

		letterElements.forEach((letter) => {
			const rect = letter.getBoundingClientRect();
			const distance = dist(
				mouseX,
				mouseY,
				(rect.left + rect.right) / 2,
				(rect.top + rect.bottom) / 2
			);

			const offsetY = map(distance, 0, ANIMATION_RANGE, -0.5, 0);
			const scale = map(distance, 0, ANIMATION_RANGE, 1.1, 1);

			letter.style.transform = `translateY(${offsetY}em) scale(${scale})`;
		});
	}

	function handleTouchMove(event: TouchEvent) {
		event.preventDefault();
		const touch = event.targetTouches[0];
		handleMovement(touch);
	}

	onMount(() => {
		const handleMouseMove = (event: MouseEvent) => {
			if (cursorElement) {
				cursorElement.style.display = 'block';
			}
			handleMovement(event);
		};

		const handleMouseLeave = (event: MouseEvent) => {
			if (
				event.clientY <= 0 ||
				event.clientX <= 0 ||
				event.clientX >= window.innerWidth ||
				event.clientY >= window.innerHeight
			) {
				if (cursorElement) {
					cursorElement.style.display = 'none';
				}
			}
		};

		const handleMouseEnter = (event: MouseEvent) => {
			if (
				event.clientY >= 0 &&
				event.clientX >= 0 &&
				event.clientX <= window.innerWidth &&
				event.clientY <= window.innerHeight
			) {
				if (cursorElement) {
					cursorElement.style.display = 'block';
				}
			}
		};

		if (IS_TOUCH_DEVICE) {
			window.addEventListener('touchmove', handleTouchMove, false);
		}
		window.addEventListener('mousemove', handleMouseMove, false);
		document.addEventListener('mouseleave', handleMouseLeave);
		document.addEventListener('mouseenter', handleMouseEnter);

		return () => {
			if (IS_TOUCH_DEVICE) {
				window.removeEventListener('touchmove', handleTouchMove);
			}
			window.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseleave', handleMouseLeave);
			document.removeEventListener('mouseenter', handleMouseEnter);
		};
	});
</script>

<div class="cont">
	<h1 class="wave">
		<span bind:this={letterElements[0]}>H</span>
		<span bind:this={letterElements[1]}>e</span>
		<span bind:this={letterElements[2]}>l</span>
		<span bind:this={letterElements[3]}>l</span>
		<span bind:this={letterElements[4]}>o</span>
		&nbsp;
		<span bind:this={letterElements[5]}>W</span>
		<span bind:this={letterElements[6]}>o</span>
		<span bind:this={letterElements[7]}>r</span>
		<span bind:this={letterElements[8]}>l</span>
		<span bind:this={letterElements[9]}>d</span>
		<span bind:this={letterElements[10]}>!</span>
	</h1>
</div>
<div class="cursor" bind:this={cursorElement}></div>
