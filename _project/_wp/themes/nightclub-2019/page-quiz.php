<?php

/* Template Name: Quiz */

get_header();

$page_data = get_fields();






?>

<div class="canvas-container">
	<canvas id="fx"></canvas>
</div>

<div id="container">
	
	<div id="intro" class="scene">
		<h1 class="text-center text-yellow" data-field="title"></h1>
		<div class="panel text-black m-5 p-5 bg-yellow flex flex-col justify-center items-center">
			<h2 class="text-center mb-5" data-field="subtitle"></h2>
			<button class="bg-black text-yellow" data-action="showPreamble">
				<span class="tracking-widest" data-field="button"></span>
				<svg class="fill-current w-3 h-3 ml-2" viewBox="0 0 100 100"><use xlink:href="#svg_arrow"/></svg>
			</button>
		</div>
	</div>

	<div id="preamble" class="scene">
		<div class="panel text-black m-5 p-5 bg-yellow flex flex-col justify-center items-center">
			<h2 class="text-center mb-5" data-field="title"></h2>
			<p class="text-center mb-5 text-lg leading-snug" data-field="text"></p>
			<button class="bg-black text-yellow" data-action="startQuiz">
				<span class="tracking-widest" data-field="button"></span>
				<svg class="fill-current w-3 h-3 ml-2" viewBox="0 0 100 100"><use xlink:href="#svg_arrow"/></svg>
			</button>
		</div>
	</div>

	<div id="question" class="scene">
		<div class="panel text-black m-5 mb-0 p-5 bg-yellow flex flex-col justify-center items-center">
			<div class="flex">
				<h1 class="q">Q</h1>
				<p class="text-lg leading-snug" data-field="question"></p>
			</div>
			<button class="answer" data-action="answer" data-answer="0"><span data-field="answer0"></span></button>
			<button class="answer" data-action="answer" data-answer="1"><span data-field="answer1"></span></button>
			<button class="answer" data-action="answer" data-answer="2"><span data-field="answer2"></span></button>
			<button class="answer" data-action="answer" data-answer="3"><span data-field="answer3"></span></button>
			<button class="answer" data-action="answer" data-answer="4"><span data-field="answer4"></span></button>
			<button class="answer" data-action="answer" data-answer="5"><span data-field="answer5"></span></button>
		</div>
		<div class="panel m-5 p-5 bg-yellow text-black flex flex-row justify-center items-center">
			<button class="px-1 mt-0 text-black" data-action="quizBack">
				<svg class="fill-current w-3 h-3 mr-2 flip-x" viewBox="0 0 100 100"><use xlink:href="#svg_arrow"/></svg>
				<span data-field="">BACK</span>
			</button>
			<h3 class="text-center mx-4" data-field="num"></h3>
			<button class="px-1 mt-0 text-black" data-action="abandonQuiz">
				<span data-field="">RESTART</span>
				<svg class="fill-current w-3 h-3 ml-2" viewBox="0 0 100 100"><use xlink:href="#svg_x"/></svg>
			</button>
		</div>
	</div>

	<div id="results" class="scene">
		<div class="panel m-5 p-5 bg-yellow text-black flex flex-col justify-center items-center">
			<svg id="result_lark" class="result-icon fill-current" viewBox="0 0 100 100"><use xlink:href="#svg_lark"/></svg>
			<svg id="result_owl" class="result-icon fill-current" viewBox="0 0 100 100"><use xlink:href="#svg_owl"/></svg>
			<h2 class="my-3 text-center uppercase" data-field="title"></h2>
			<p class="text-black text-center mb-5 mt-2 text-base leading-snug" data-field="text"></p>
			<button class="bg-black text-yellow" data-action="finishQuiz">
				<span class="tracking-widest">FINISH</span>
			</button>
		</div>
	</div>

	<div id="timeout" class="scene modal">
		<div class="panel m-5 p-5 bg-yellow text-black flex flex-col justify-center items-center">
			<h2 class="mb-3 mt-0" data-field="title">Anybody there?</h2>
			<h4 class="text-center mb-5 mt-2" data-field="text">
				This quiz will restart<br>in 10 seconds
			</h4>
			<div class="flex">
				<button class="bg-black text-yellow mr-5" data-action="stillHere">
					<span data-field="">I'M STILL HERE</span>
				</button>
				<button class="bg-black text-yellow" data-action="timeoutNow">
					<span data-field="">RESTART</span>
				</button>
			</div>
		</div>
	</div>
	
</div>


<script>

	quizData = <?= json_encode($page_data); ?>;
	
	App.init('quiz');

</script>

<?php





get_footer();
