<?php

/* Template Name: Feedback */

get_header();

$questions = get_fields();






?>

<div class="canvas-container">
	<canvas id="fx"></canvas>
</div>

<div id="container">
	
	<div id="intro" class="scene">
		<h1 class="text-center text-pink" data-field="title">NIGHT<br>CLUB</h1>
		<div class="panel text-black m-6 p-6 bg-pink flex flex-col justify-center items-center">
			<h2 class="text-center italic mb-4" data-field="subtitle">How was<br>your visit?</h2>
			<button class="pink bg-black text-pink" data-action="showPreamble">
				<span class="tracking-widest" data-field="button">START SURVEY</span>
				<svg class="fill-current w-3 h-3 ml-2" viewBox="0 0 100 100"><use xlink:href="#svg_arrow"/></svg>
			</button>
		</div>
	</div>

	<div id="preamble" class="scene">
		<div class="panel text-black m-6 p-6 bg-pink flex flex-col justify-center items-center">
			<h2 class="text-center mb-5" data-field="title"></h2>
			<p class="text-center mb-5 text-lg leading-snug" data-field="text"></p>
			<button class="pink bg-black text-pink" data-action="startQuiz">
				<span class="tracking-widest" data-field="button"></span>
				<svg class="fill-current w-3 h-3 ml-2" viewBox="0 0 100 100"><use xlink:href="#svg_arrow"/></svg>
			</button>
		</div>
	</div>

	<div id="question" class="scene">
		<div class="panel text-black m-6 mb-0 p-6 bg-pink flex flex-col justify-center items-center">
			<div class="flex">
				<h1 class="q">Q</h1>
				<p class="text-lg leading-snug" data-field="question"></p>
			</div>
			<button class="answer pink" data-action="answer" data-answer="0"><span data-field="answer0"></span></button>
			<button class="answer pink" data-action="answer" data-answer="1"><span data-field="answer1"></span></button>
			<button class="answer pink" data-action="answer" data-answer="2"><span data-field="answer2"></span></button>
			<button class="answer pink" data-action="answer" data-answer="3"><span data-field="answer3"></span></button>
			<button class="answer pink" data-action="answer" data-answer="4"><span data-field="answer4"></span></button>
			<button class="answer pink" data-action="answer" data-answer="5"><span data-field="answer5"></span></button>
		</div>
		<div class="panel m-6 p-5 bg-pink text-black flex flex-row justify-center items-center">
			<button class="pink px-1 mt-0 text-black" data-action="quizBack">
				<svg class="fill-current w-3 h-3 mr-2 flip-x" viewBox="0 0 100 100"><use xlink:href="#svg_arrow"/></svg>
				<span data-field="">BACK</span>
			</button>
			<h3 class="text-center mx-4" data-field="num"></h3>
			<button class="pink px-1 mt-0 text-black" data-action="abandonQuiz">
				<span data-field="">RESTART</span>
				<svg class="fill-current w-3 h-3 ml-2" viewBox="0 0 100 100"><use xlink:href="#svg_x"/></svg>
			</button>
		</div>
	</div>

	<div id="results" class="scene">
		<div class="panel m-6 p-6 bg-pink text-black flex flex-col justify-center items-center">
			<h2 class="my-3 uppercase text-center" data-field="title"></h2>
			<p class="text-black text-center mb-5 mt-2 text-base leading-snug" data-field="text"></p>
			<button class="pink bg-black text-pink" data-action="finishQuiz">
				<span class="tracking-widest">FINISH</span>
			</button>
		</div>
	</div>

	<div id="timeout" class="scene modal">
		<div class="panel m-6 p-6 bg-pink text-black flex flex-col justify-center items-center">
			<h2 class="mb-3 mt-0" data-field="title">Anybody there?</h2>
			<h4 class="text-center mb-5 mt-2" data-field="text">
				This quiz will restart<br>in 10 seconds
			</h4>
			<div class="flex">
				<button class="pink bg-black text-pink mr-5" data-action="stillHere">
					<span data-field="">I'M STILL HERE</span>
				</button>
				<button class="pink bg-black text-pink" data-action="timeoutNow">
					<span data-field="">RESTART</span>
				</button>
			</div>
		</div>
	</div>
	
</div>


<script>

	quizData = <?= json_encode($questions); ?>;
	
	App.init('feedback');

</script>

<?php






get_footer();
