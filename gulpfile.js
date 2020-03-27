//start with requiring gulp and sass
const gulp = require('gulp');
const sass = require('gulp-sass');

//then begin defining the task which takes everything from our scss and compresses 
//it and pipes it into the css folder
gulp.task('sass', function() {
    return gulp
        .src('./sass/**/*.scss')
        .pipe(sass({ outputStyle: "compressed" }))
        .pipe(gulp.dest('./public/css'))
})
//this defines the default task that happens when you run the gulp command
//telling gulp that by default, i want it to watch the scss file for changes, 
//refer back to the sass task and compress the scss and pipe it into the public folder to be updated

gulp.task("watch", function () {
    gulp.watch("./sass/**/*.scss", gulp.series("sass"));
});

//this defines the default task for gulp to continuously update when stylizing
gulp.task("default", gulp.parallel("watch"));
