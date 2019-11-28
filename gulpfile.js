"use strict";
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const path = require('path');

const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const cleanCSS = require('gulp-clean-css'); //压缩css
const less = require('gulp-less');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const concat = require('gulp-concat');

const postcss = require('gulp-postcss');
const pxtoviewport = require('postcss-px-to-viewport');


// 静态服务器 + 监听 less/html 文件
gulp.task('serve', function () {
    browserSync.init({
        server: "./",
        port: 3030
    });
    // gulp.watch("./src/less/*.less", gulp.parallel(['less']));
    gulp.watch("./src/sass/*.scss", gulp.parallel(['sass']));
    gulp.watch("./*.html").on('change', reload);
    gulp.watch("./src/js/*.js").on('change', reload);
    gulp.watch("./assets/images/*").on('change', reload);
    gulp.watch("./assets/css/*").on('change', reload);
    gulp.watch("./assets/js/*.js").on('change', reload);
});



/* 输出样式
* 嵌套输出 nested
* 展开输出 expanded
* 紧凑输出 compact
* 压缩输出 compressed
* */
sass.compiler = require('node-sass');
const sassPath = './src/sass/main.scss';
gulp.task('sass', function () {
    return gulp.src(sassPath)
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(cleanCSS({ compatibility: 'ie9' }))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //默认true，非浏览器前缀会缩进对齐
            remove: true //默认true，去除不必要前缀
        }))
        // .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./assets/css'));
});


/*
 * 对less进行编译并压缩
 */
gulp.task('less', function () {
    return gulp.src('./src/less/*.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //默认true，非浏览器前缀会缩进对齐
            remove: true //默认true，去除不必要前缀
        }))
        .pipe(cleanCSS({ compatibility: 'ie9' }))
        // .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./assets/css'));
});


/*
 * 压缩js
 */
gulp.task('script', () => {
    gulp.src('./src/js/*.js')
        // .pipe(sourcemaps.init())
        .pipe(uglify())
        // .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./assets/js'))
})


/*
 * 图片进行压缩
 */
gulp.task('imagemin', () =>
    gulp.src('./src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./assets/images'))
    /*return gulp.src('./src/images/!**!/!*')
        .pipe(imagemin([
            imagemin.gifsicle({
                interlaced: true // 类型：Boolean 默认：false 隔行扫描gif进行渲染
            }),
            imagemin.jpegtran({
                progressive: true // 类型：Boolean 默认：false 无损压缩jpg图片
            }),
            imagemin.optipng({optimizationLevel: 7}), // 类型：Number  默认：3  取值范围：0-7（优化等级）
            imagemin.svgo({
                plugins: [
                    {
                        removeViewBox: false // 不要移除svg的viewbox属性
                    },
                    {cleanupIDs: false}
                ]
            })
        ], {
            verbose: true
        }))
        .pipe(gulp.dest('./assets/images'));*/
);


/*
 *  viewportWidth：视口宽度，这里设置为跟设计稿宽度一致；
 *  viewportHeight：视口高度，随便设置一个就可以；
 *  unitPrecision：转换后值的精度，3表示保留3位小数；
 *  viewportUnit：转换成什么视口单位，这里当然是vw；
 *  selectorBlackList：是一个选择符数组，对应声明中的像素单位不会转换；
 *  minPixelValue：最小像素值，大于等于这个值才会转换；
 *  mediaQuery：是否转换媒体查询中的像素。
 */
gulp.task('postcss', function () {
    var processors = [
        pxtoviewport({
            viewportWidth: 750,
            viewportHeight: 1334,
            unitPrecision: 3,
            viewportUnit: 'vw',
            selectorBlackList: ['.usepixel'],
            minPixelValue: 1,
            mediaQuery: false
        })
    ];

    return gulp.src(['assets/css/**/*.css'])
        .pipe(postcss(processors))
        .pipe(gulp.dest('assets/css'));
});
