const { src, dest, watch, series } = require( 'gulp' );

//css y sass
const sass = require( 'gulp-sass' )( require( 'sass' ) );
const postcss = require( 'gulp-postcss' );
const autoprefixer = require( 'autoprefixer' );
const plumber = require( 'gulp-plumber' );
const sourcemaps = require( 'gulp-sourcemaps' );
const cssnano = require( 'gulp-nano' );
const htmlmin = require( 'gulp-htmlmin' );
//imagenes
const imagemin = require( 'gulp-imagemin' );
const webp = require( 'gulp-webp' );
const avif = require( 'gulp-avif' );
//js
const replace = require( 'gulp-replace' );
const dotenv = require( 'dotenv' );

dotenv.config();

function html ( done )
{
    src( './*.html' )
        .pipe( htmlmin( { collapseWhitespace: true } ) ) // Opcional: minificar el HTML
        .pipe( dest( 'dist' ) );

    done();
}

function css ( done )
{

    src( './src/scss/**/*.scss' )
        .pipe( plumber() )
        .pipe( sourcemaps.init() )
        .pipe( sass() )
        .pipe( postcss( [autoprefixer()] ) )
        .pipe( sourcemaps.write( '.' ) )
        .pipe( dest( 'dist/build/css' ) );

    done();
}

function imagenes ()
{
    return src( './src/img/**/*' )
        .pipe( imagemin( { optimizationLevel: 3 } ) )
        .pipe( dest( 'dist/build/img' ) );
}

function pages ()
{
    return src( './src/pages/**/*.html' )
        .pipe( dest( 'dist/build/pages' ) );
}

function versionWebp ()
{
    return src( './src/img/**/*.{jpg,png,PNG}' )
        .pipe( webp() )
        .pipe( dest( 'dist/build/img' ) );
}
function versionAvif ()
{
    return src( './src/img/**/*.{jpg,png,PNG}' )
        .pipe( avif() )
        .pipe( dest( 'dist/build/img' ) );
}

const envConfig = {
    usersUrl: process.env.DB_USERS_URL || '',
    cloudName: process.env.CLOUD_NAME || '',
    apiKey: process.env.API_KEY || '',
    apiSecret: process.env.API_SECRET || '',
};

function replaceEnvVariables ()
{
    return src( 'src/**/*.js' )
        .pipe( replace( 'process.env.DB_USERS_URL', JSON.stringify( envConfig.usersUrl ) ) )
        .pipe( replace( 'process.env.CLOUD_NAME', JSON.stringify( envConfig.cloudName ) ) )
        .pipe( replace( 'process.env.API_KEY', JSON.stringify( envConfig.apiKey ) ) )
        .pipe( replace( 'process.env.API_SECRET', JSON.stringify( envConfig.apiSecret ) ) )
        .pipe( dest( 'dist/build' ) );
}

function dev ( done )
{

    watch( 'src/scss/**/*.scss', css );
    watch( 'src/js/**/*.js', replaceEnvVariables );
    watch( 'src/**/*.html', pages );
    done();
}

exports.html = html;
exports.pages = pages;
exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.replaceEnvVariables = replaceEnvVariables;
exports.default = series( imagenes, versionWebp, versionAvif, css, pages, html, replaceEnvVariables, dev );
exports.build = series( imagenes, versionWebp, versionAvif, css, pages, html, replaceEnvVariables );