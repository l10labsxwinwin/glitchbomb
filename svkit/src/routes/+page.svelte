<script>
	import { resolve } from '$app/paths';
</script>

<div class="flex min-h-screen items-center justify-center">
	<div class="text-center">
		<h1 class="mb-8 text-6xl font-bold">GLITCHBOMB</h1>
		<div class="grid grid-cols-2 gap-4">
			<a
				href={resolve('/data')}
				class="border border-white p-6 transition-colors hover:bg-white hover:text-black"
			>
				DATA VIEW
			</a>
			<a
				href={resolve('/singleplayer')}
				class="border border-white p-6 transition-colors hover:bg-white hover:text-black"
			>
				SINGLE PLAYER VIEW
			</a>
		</div>
	</div>
</div>
