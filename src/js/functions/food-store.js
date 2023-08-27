import { formatMoney } from "../helpers/formater.js";
import { generateNewId } from "../helpers/idGenerator.js";

let user = {};
let users = [];
let token = '';


let divProductItem = null;
let divrestaurantProductContainer = null;

export async function showProductsByRestaurant ()
{
    token = localStorage.getItem( 'userToken' ).split( '"' )[1];
    try
    {
        const response = await fetch( `${ process.env.DB_USERS_URL }/users` );
        users = await response.json();
        printProductsToDOM();

    } catch ( error )
    {
        console.log( error );
    }
}

function printProductsToDOM ()
{

    const divProductsContainer = document.querySelector( '.products-container' );


    users?.forEach( ( user ) =>
    {
        if ( user.rol === 1 )
        {
            user?.restaurants?.forEach( restaurant =>
            {

                const h2RestaurantName = document.createElement( 'H2' );
                const h2Underline = document.createElement( 'U' );
                h2RestaurantName.classList.add( 'underline', 'fw-bold', 'text-center', 'fs-2' );
                h2Underline.textContent = restaurant.name;
                h2RestaurantName.appendChild( h2Underline );

                divrestaurantProductContainer = document.createElement( 'DIV' );
                divrestaurantProductContainer.classList.add( 'restaurant-products-container', 'mb-5' );

                const divProductGrid = document.createElement( 'DIV' );
                divProductGrid.classList.add( 'product-grid' );

                restaurant?.products?.forEach( ( product ) =>
                {
                    divProductItem = document.createElement( 'DIV' );
                    divProductItem.classList.add( 'product-item' );
                    divProductItem.setAttribute( 'data-product-id', product.id );

                    divProductItem.innerHTML = `
                    <img src="https://c8.alamy.com/compes/2f4nkpn/fotografia-profesional-de-la-comida-diseno-de-la-vista-de-la-mesa-perfecto-para-su-sitio-web-revista-blog-de-la-comida-o-cualquier-cosa-que-usted-pueda-pensar-en-necesitarlo-para-2f4nkpn.jpg" alt="Producto 1">
                    <h3 class="product-title">${ product.name }</h3>
                    <p>Descripción del producto 1.</p>
                    <p>Price: ${ formatMoney( parseInt( product.price ) ) }</p>
                    <button class="order-btn" data-product-id="${ product.id }" data-restaurant-id="${ restaurant.id }">Add Product</button>
                `;
                    divProductGrid.appendChild( divProductItem );
                    divProductItem.addEventListener( 'click', addProductToOrder, false );
                } );
                divrestaurantProductContainer.appendChild( h2RestaurantName );
                divrestaurantProductContainer.appendChild( divProductGrid );
                divProductsContainer.appendChild( divrestaurantProductContainer );
            } );
        }
    } );

};




async function addProductToOrder ( e )
{
    if ( e.target.classList.contains( 'order-btn' ) )
    {
        token = localStorage.getItem( 'userToken' ).split( '"' )[1];
        try
        {
            const response = await fetch( `${ process.env.DB_USERS_URL }/users/?token=${ token }` );
            const actualUser = await response.json();
            ;
            addOrderToUser(
                {
                    actualUser: actualUser[0],
                    productId: e.target.attributes['data-product-id'].value,
                    restaurantId: e.target.attributes['data-restaurant-id'].value
                }
            );

        } catch ( error )
        {
            console.log( error );
        }
    }


};

function addOrderToUser ( { actualUser, productId, restaurantId } )
{
    users.forEach( async ( user ) =>
    {
        if ( user.rol == 1 )
        {
            const restaurantSelected = user?.restaurants?.filter( restaurant => restaurant.id === restaurantId );
            if ( restaurantSelected !== undefined )
            {
                console.log( user.restaurants.find( res => res.name === restaurantSelected[0].name ) );

                const productToAdd = user.restaurants.find( res => res.name === restaurantSelected[0].name ).products.find( product => product.id === productId );
                console.log( productToAdd );

                const order = { ...productToAdd, id: generateNewId() };
                actualUser.orders.push( order );
                console.log( actualUser );
                try
                {
                    await fetch( `${ process.env.DB_USERS_URL }/users/${ actualUser.id }`, {
                        method: 'PUT',
                        body: JSON.stringify( actualUser ), // data can be `string` or {object}!
                        headers: {
                            "Content-Type": "application/json",
                        },
                        redirect: "manual"
                    } ).then( ( res ) => res.json() )
                        .catch( ( error ) => console.error( "Error:", error ) )
                        .then( ( response ) => console.log( "Success:", response ) );
                    printAlert( 'restaurantForm', 'Restaurant added successfully!!', false );
                } catch ( error )
                {
                    console.log( error );
                }
            }

        }
    } );
};