

import { validateUser, getUsersList } from "./Auth/auth.js";
import { fillCart } from "./functions/food-store.js";
import { addProductToRestaurant, validateRestaurant } from "./functions/restaurant-products.js";
import { printAlert } from "./helpers/alert.js";
import { formatMoney } from "./helpers/formater.js";
import { generateNewId } from "./helpers/idGenerator.js";
import { route } from "./router/router.js";

export let widget_cloudinary;

window.onbeforeunload = function ()
{
    window.setTimeout( function ()
    {
        window.location = '/';
    }, 0 );
    window.onbeforeunload = null; // necessary to prevent infinite loop, that kills your browser 
};

document.addEventListener( 'DOMContentLoaded', () =>
{

    showUl();
    getUsersList();
}, false );

let users = [];
let actualUser = {};
let userToken = '';
const fromSignInButton = document.querySelector( '.form-signIn' );
const fromSignUpButton = document.querySelector( '.form-signUp' );

export async function showUl () 
{
    userToken = localStorage.getItem( 'userToken' ).toString().split( '"' )[1];
    users = await getUsersList();
    actualUser = await getActualUser( userToken );

    if ( userToken )
    {
        createMainPageToDisplayUserSections();

        addScriptingForSignInSignUPSignOutButtons();

        createNewUserSectionsButtons();

    }
};

fromSignInButton.addEventListener( 'submit', ( e ) =>
{
    e.preventDefault();

    const emailSignInInput = document.querySelector( '#signIn-email' );
    const passwordInInput = document.querySelector( '#signIn-password' );

    const user = {
        email: emailSignInInput.value,
        password: passwordInInput.value,
    };
    validateUser( user, '.form-signIn' );

} );


fromSignUpButton.addEventListener( 'submit', ( e ) =>
{
    e.preventDefault();

    const fullNameSignUpInput = document.querySelector( '#name' );
    const phoneNumberSignUpInput = document.querySelector( '#phone' );
    const rolSignUpInput = document.querySelector( '#customer-rol' );
    const emailSignUpInput = document.querySelector( '#email' );
    const passwordSignUpInput = document.querySelector( '#password' );

    if ( passwordSignUpInput.value.length <= 6 )
    {
        printAlert( 'form-signUp', 'Password must be longer than 6 characters' );
        return;
    }

    const user = {
        fullName: fullNameSignUpInput.value,
        phoneNumer: phoneNumberSignUpInput.value,
        rol: rolSignUpInput.value,
        email: emailSignUpInput.value,
        password: passwordSignUpInput.value,
    };
    validateUser( user, '.form-signUp' );

} );

export const signOut = ( e ) =>
{

    const signOutElement = document.querySelector( '#sign-out' );
    const token = localStorage.getItem( 'userToken' );

    if ( token )
    {
        localStorage.removeItem( 'userToken' );
        window.location.pathname = '/';
    }
};

async function getActualUser ( userToken ) 
{
    try
    {
        const response = await fetch( `${ "https://db-coderhouse-project.onrender.com" }/users/?token=${ userToken }` );
        actualUser = await response.json();

        return actualUser;
    } catch ( error )
    {
        console.log( error );
    }
};

function createMainPageToDisplayUserSections ()
{
    const mainPageElement = document.createElement( 'DIV' );
    mainPageElement.classList.add( 'main-page' );
    const bodyElement = document.querySelector( 'body' );
    bodyElement.appendChild( mainPageElement );
};

function addScriptingForSignInSignUPSignOutButtons ()
{
    console.log( actualUser );
    if ( actualUser[0].rol === 2 )
    {
        fillCart( actualUser[0] );
    }
    const ulNavElement = document.querySelector( '.nav' );

    const liSignOutElement = document.createElement( 'LI' );

    const aSignOutElement = document.createElement( 'A' );
    liSignOutElement.classList.add( 'nav__item' );

    aSignOutElement.classList.add( 'nav__link' );
    aSignOutElement.textContent = 'Sign Out';
    aSignOutElement.setAttribute( 'href', `/delete` );
    aSignOutElement.setAttribute( 'id', 'sign-out' );
    aSignOutElement.setAttribute( 'onclick', ' route()' );

    liSignOutElement.appendChild( aSignOutElement );
    ulNavElement.appendChild( liSignOutElement );
};

function createNewUserSectionsButtons ()
{
    const ulNavElement = document.querySelector( '.nav' );

    const liSignInNavElement = document.querySelector( '#sign-in-a' );
    const liSignUpNavElement = document.querySelector( '#sign-up-a' );

    const headerNavElement = document.createElement( 'NAV' );
    headerNavElement.classList.add( 'header__nav' );

    const headerBarraElement = document.querySelector( '.header__barra' );
    const ulElement = document.createElement( 'UL' );
    ulElement.classList.add( 'nav' );

    const liElement = document.createElement( 'LI' );
    liElement.classList.add( 'nav__item' );

    const liElement2 = document.createElement( 'LI' );
    liElement2.classList.add( 'nav__item' );

    const liElement3 = document.createElement( 'LI' );
    liElement3.classList.add( 'nav__item' );

    const aElement = document.createElement( 'A' );
    aElement.classList.add( 'nav__link' );

    const aElement2 = document.createElement( 'A' );
    aElement2.classList.add( 'nav__link' );

    const aElement3 = document.createElement( 'A' );
    aElement3.classList.add( 'nav__link' );

    aElement.setAttribute( 'href', '/user-home' );
    aElement.setAttribute( 'onclick', `route()` );
    aElement.textContent = 'Home';

    if ( actualUser[0].rol === 1 )
    {

        aElement2.setAttribute( 'href', '/user-restaurant' );
        aElement2.setAttribute( 'onclick', `route()` );
        aElement2.textContent = 'Restaurant';
        aElement2.addEventListener( 'click', () =>
        {
            let productImageInput;
            setTimeout( () =>
            {
                productImageInput = document.querySelector( '#product-image' );
                let productimage = document.querySelector( '#product-image-img' );

                console.log( productimage );
                widget_cloudinary = cloudinary.createUploadWidget( {
                    cloudName: "dhjfwuuol",
                    uploadPreset: 'preset_jake'

                }, ( err, result ) =>
                {
                    if ( !err && result && result.event === 'success' )
                    {
                        addProductToRestaurant( false, result.info.secure_url );
                        productimage.src = result.info.secure_url;
                    }
                } );
                productImageInput.addEventListener( 'click', () =>
                {
                    console.log( 'click en boton imagen' );
                    widget_cloudinary.open();
                } );
            }, 500 );

        } );

        liElement2.appendChild( aElement2 );
        ulElement.appendChild( liElement2 );
    } else
    {

        aElement3.setAttribute( 'href', '/food-store' );
        aElement3.setAttribute( 'onclick', `route()` );
        aElement3.textContent = 'Food Store';
        liElement3.appendChild( aElement3 );
        ulElement.appendChild( liElement3 );
    }

    liElement.appendChild( aElement );
    ulElement.appendChild( liElement );

    if ( actualUser[0].rol === 2 )
    {
        const liCartElement = document.createElement( 'LI' );
        liCartElement.classList.add( 'nav__item', 'li-Cart' );

        const aCartElement = document.createElement( 'A' );
        aCartElement.classList.add( 'a-Cart' );
        aCartElement.setAttribute( "data-bs-toggle", "modal" );
        aCartElement.setAttribute( "href", "#exampleModalToggle" );
        aCartElement.setAttribute( 'role', "button" );

        const divCart = document.createElement( 'DIV' );
        divCart.classList.add( 'cart-number' );
        divCart.textContent = '0';

        const imgCartElement = document.createElement( 'IMG' );
        imgCartElement.src = 'build/img/cart.svg';
        imgCartElement.classList.add( 'cart' );

        aCartElement.appendChild( imgCartElement );
        liCartElement.appendChild( aCartElement );
        liCartElement.appendChild( divCart );
        ulElement.appendChild( liCartElement );
    }

    headerNavElement.appendChild( ulElement );
    headerBarraElement.insertBefore( headerNavElement, headerBarraElement.firstChild.nextSibling.nextSibling );

    ulNavElement.removeChild( liSignInNavElement );
    ulNavElement.removeChild( liSignUpNavElement );

    const cart = document.querySelector( '.cart-number' );
    cart.textContent = actualUser[0]?.orders?.length;
};

