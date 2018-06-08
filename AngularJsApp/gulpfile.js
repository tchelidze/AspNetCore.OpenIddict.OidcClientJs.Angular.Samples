/// <binding AfterBuild='build-all' />

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    gutil = require('gulp-util');


var root_path = {
    webroot: "./wwwroot/"
};

//library source
root_path.nmSrc = "./bower_components/";

//library destination
root_path.package_lib = root_path.webroot + "lib/";


gulp.task("copy-lib-css",
    function () {
        gulp.src("./bower_components/bootstrap/dist/css/bootstrap.min.css")
            .pipe(gulp.dest(root_path.webroot + "/css/"));

        gulp.src("./bower_components/toastr/toastr.min.css")
            .pipe(gulp.dest(root_path.webroot + "/css/"));

        gulp.src("./bower_components/tether/dist/css/tether.min.css")
            .pipe(gulp.dest(root_path.webroot + "/css/"));
    });

gulp.task("copy-lib-js",
    function () {
        gulp.src("./node_modules/oidc-client/dist/oidc-client.js")
            .pipe(gulp.dest(root_path.package_lib + "/oidc-client/"));

        gulp.src("./bower_components/jquery/dist/jquery.min.js")
            .pipe(gulp.dest(root_path.package_lib + "/jquery/"));

        gulp.src("./bower_components/bootstrap/dist/js/bootstrap.min.js")
            .pipe(gulp.dest(root_path.package_lib + "/bootstrap/"));

        gulp.src("./bower_components/toastr/toastr.min.js")
            .pipe(gulp.dest(root_path.package_lib + "/toastr/"));

        gulp.src("./bower_components/angular/angular.min.js")
            .pipe(gulp.dest(root_path.package_lib + "angular/"));

        gulp.src("./bower_components/tether/dist/js/tether.min.js")
            .pipe(gulp.dest(root_path.package_lib + "tether/"));

        gulp.src("./bower_components/angular-ui-router/release/angular-ui-router.min.js")
            .pipe(gulp.dest(root_path.package_lib + "angular/"));
    });

gulp.task("copy-all", ["copy-lib-css", "copy-lib-js"]);
//Copy End

gulp.task("min-js",
    function () {
        gulp.src(["./app/**/*.js"])
            .pipe(concat("app.js"))
            .pipe(gulp.dest(root_path.webroot));

        gulp.src(["./wwwroot/lib/**/*.js"])
            .pipe(concat("lib.js"))
            .pipe(gulp.dest(root_path.webroot));
    });

gulp.task("copy-folder-html",
    function () {
        gulp.src("app/**/*.html")
            .pipe(gulp.dest(root_path.webroot + "views"));
    });

gulp.task("build-all", ["min-js", "copy-folder-html"]);

gulp.task("run", ["copy-all", "build-all"]);

gulp.task('watch', function () {

    gulp.watch('./app/**/*.js', ['build-all']);
    gulp.watch('./app/**/*.html', ['build-all']);
});

//Build End