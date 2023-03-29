const gulp   = require('gulp');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const clean  = require('gulp-clean');
const postcss = require('gulp-postcss');



// SOURCES
// ----------------------------------------------------------------------------

const styles = [
	// 'node_modules/swiper/dist/css/swiper.min.css',
	'app/css/style.css'
	];

const libs = [
	'node_modules/axios/dist/axios.min.js',
	// 'node_modules/jquery/dist/jquery.min.js',
	// 'node_modules/swiper/dist/js/swiper.min.js',
	// 'node_modules/three/build/three.min.js',
	// 'node_modules/js-cookie/src/js.cookie.js',
	];

const script = [
	'app/js/**/*'
	];

const assets = 'app/assets';

// const destination = '../_demo/';
const destination = '../_public/wp-content/themes/nightclub-2019/assets/'






// NUKE
// ----------------------------------------------------------------------------

gulp.task('delete', function() {
	return gulp.src(destination, {read: false})
		.pipe(clean({force: true}))
});


// CSS
// ----------------------------------------------------------------------------

gulp.task('css', function() {
	return gulp.src(styles)
		.pipe(postcss([
			require('tailwindcss'),
			require('cssnano'),
		]))
		.pipe(gulp.dest(destination+'css/'))
});


// LIBS
// ----------------------------------------------------------------------------

gulp.task('libs', function() {
	return gulp.src(libs)
		.pipe(concat('libs.js'))
		.pipe(minify({ ext: { min: '.js' }, noSource: true }))
		.pipe(gulp.dest(destination+'js/'))
});


// JS
// ----------------------------------------------------------------------------

gulp.task('js', function() {
	return gulp.src(script)
		.pipe(concat('script.js'))
		// .pipe(minify({ ext: { min: '.js' }, noSource: true }))
		.pipe(gulp.dest(destination+'js/'))
});


// ASSETS
// ----------------------------------------------------------------------------

gulp.task('files', function() {
	return gulp.src(assets+'/**/*', {base:assets})
		.pipe(gulp.dest(destination))
});







// ----------------------------------------------------------------------------


gulp.task('watch', function() {
	gulp.watch('tailwind.config.js', gulp.series('css'));
	gulp.watch(styles, gulp.series('css'));
	gulp.watch(script, gulp.series('libs'));
	gulp.watch(script, gulp.series('js'));
	gulp.watch(assets+'**/*', gulp.series('files'));
});

gulp.task('default', gulp.series('css', 'libs', 'js', 'files', 'watch'));

gulp.task('build', gulp.series('css', 'libs', 'js', 'files'));

gulp.task('clean', gulp.series('delete'));



