var gulp = require('gulp'),
	less = require('gulp-less'),
	coffee = require('gulp-coffee'),
	gulpif = require('gulp-if'),
	useref = require('gulp-useref'),
	uglify = require('gulp-uglify'),
	minifyCSS = require('gulp-minify-css'),
	minifyHTML = require('gulp-minify-html'),
	rev = require('gulp-rev'),
	revReplace = require('gulp-rev-replace');

gulp.task('update_dependencies', function(){
	return gulp.src('./bower_components/**/*.js')
				.pipe(gulp.dest('./public/scripts/lib'));
});

gulp.task('update_assets', function(){
	return gulp.src('./assets/**/*')
				.pipe(gulp.dest('./public'));
});

gulp.task('update_source', function(){
	return gulp.src('./src/**/*')
				.pipe(gulpif('*.coffee', coffee()))
				.pipe(gulpif('*.less', less()))
				.pipe(gulpif('*.jade', gulp.dest('./views'), gulp.dest('./public')));
});

gulp.task('update_all', function(){
	gulp.start('update_dependencies', 'update_assets', 'update_source');
})

gulp.task('bundle', function(){
	var assets = useref.assets({searchPath: './public'});
	return gulp.src('./views/**/*.jade')
				.pipe(assets)
				.pipe(gulpif('*.js', uglify()))
				.pipe(gulpif('*.css', minifyCSS()))
				.pipe(rev())
				.pipe(assets.restore())
				.pipe(useref())
				.pipe(revReplace({replaceInExtensions:['.js', '.css', '.html', '.jade']}))
				.pipe(gulpif('*.jade', gulp.dest('./views/dist'), gulp.dest('./public')))
});

gulp.task('watch', function(){
	gulp.watch(['src/**/*' , 'assets/**/*', 'bower_components/**/*'], ['update_all']);
})

gulp.task('dist', function(){
	gulp.start('update_all');
	setTimeout(function(){
		gulp.start('bundle');
	}, 3000);
})

gulp.task('clean', function(){
	var exec = require('child_process').exec, child;
	child = exec('rm -rf public/* views/*',
		function (error, stdout, stderr) {
			console.log(stdout);
		}
	);
});
