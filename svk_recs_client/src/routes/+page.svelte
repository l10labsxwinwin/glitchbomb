<script>
	import { resolve } from '$app/paths';
</script>

<div class="flex min-h-screen flex-col items-center justify-center gap-8 bg-black">
	<h1 class="m-0 text-6xl font-bold tracking-widest text-white">GLITCHBOMB</h1>
	<a
		href={resolve('/players')}
		class="border-2 border-white bg-white px-8 py-4 font-bold tracking-widest text-black no-underline transition-all duration-300 hover:bg-black hover:text-white"
		>VIEW PLAYERS</a
	>
</div>
