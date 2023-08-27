import { signOut } from '../app.js';
import { showProductsByRestaurant } from '../functions/food-store.js';
import { validateWichContentToDisplay } from '../functions/home-user.js';
import { generateScript, validateRestaurant } from '../functions/restaurant-products.js';
export const route = ( e ) =>
{
    e = event || window.event;
    e.preventDefault();
    window.history.pushState( null, "", e.target.href );
    handleLocation();
};

export const routes = {
    404: "../../../build/pages/404.html",
    "/": '../../../build/pages/userHome.html',
    "/delete": '../../../build/pages/userHome.html',
    "/user-home": '../../../build/pages/userHome.html',
    "/user-restaurant": '../../../build/pages/userRestaurant.html',
    "/food-store": '../../../build/pages/foodStore.html',
};

export const handleLocation = async () =>
{
    const path = window.location.pathname;
    const route = routes[path] || routes[404];
    if ( path === '/delete' )
    {
        signOut();
        window.location.pathname = '/';
        return;
    }
    if ( path === '/user-restaurant' )
    {
        setTimeout( () =>
        {
            generateScript();
        }, 500 );
    }
    if ( path === '/user-home' )
    {
        setTimeout( () =>
        {
            validateWichContentToDisplay();
        }, 500 );
    }
    if ( path === '/food-store' )
    {
        setTimeout( () =>
        {
            showProductsByRestaurant();
        }, 500 );
    }
    const html = await fetch( route ).then( ( data ) => data.text() );
    document.querySelector( '.main-page' ).innerHTML = html;
};


window.onpopstate = handleLocation;
window.route = route;


handleLocation();