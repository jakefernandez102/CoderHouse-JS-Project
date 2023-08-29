import { formatMoney } from "../helpers/formater.js";
import { generateNewId } from "../helpers/idGenerator.js";
import { showContentToBuyer } from "./home-user.js";

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
        const response = await fetch( `${ "https://db-coderhouse-project.onrender.com" }/users` );
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
                h2RestaurantName.classList.add( 'restaurant-name', 'text-center' );
                h2Underline.textContent = restaurant.name;
                h2RestaurantName.appendChild( h2Underline );

                divrestaurantProductContainer = document.createElement( 'DIV' );
                divrestaurantProductContainer.classList.add( 'restaurant-products-container', 'mb-5' );

                const divProductGrid = document.createElement( 'DIV' );
                divProductGrid.classList.add( 'product-grid' );

                restaurant?.products?.forEach( ( product ) =>
                {
                    divProductItem = document.createElement( 'DIV' );
                    divProductItem.classList.add( 'product-item', 'shadow' );
                    divProductItem.setAttribute( 'data-product-id', product.id );

                    divProductItem.innerHTML = `
                    <img src="https://c8.alamy.com/compes/2f4nkpn/fotografia-profesional-de-la-comida-diseno-de-la-vista-de-la-mesa-perfecto-para-su-sitio-web-revista-blog-de-la-comida-o-cualquier-cosa-que-usted-pueda-pensar-en-necesitarlo-para-2f4nkpn.jpg" alt="Producto 1">
                    <h3 class="product-title">${ product.name }</h3>
                    <p class="fs-6 fw-light d-block">${ product.detail }</p>
                    <p>Price: ${ formatMoney( parseInt( product.price ) ) }</p>
                    <div class="d-flex gap-3 align-items-center">
                        <p>Quantity:</p>
                        <input class="product-quantity-order form-control text-center text-4" type="number" min="1" max="${ product.quantity }" value="1" />
                    </div>
                    <button class="order-btn d-block mx-auto mt-3" data-product-id="${ product.id }" data-restaurant-id="${ restaurant.id }">Add Product</button>
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
            const response = await fetch( `${ "https://db-coderhouse-project.onrender.com" }/users/?token=${ token }` );
            const actualUser = await response.json();

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
    const quantityInput = document.querySelector( '.product-quantity-order' ).value;

    users.forEach( async ( user ) =>
    {
        if ( user.rol == 1 )
        {
            const restaurantSelected = user?.restaurants?.filter( restaurant => restaurant.id === restaurantId );
            if ( restaurantSelected !== undefined )
            {
                const productToAdd = user?.restaurants?.find( res => res?.name === restaurantSelected[0]?.name ).products?.find( product => product?.id === productId );

                const order = { ...productToAdd, id: generateNewId(), restaurantId, quantityOrder: quantityInput };
                actualUser.orders.push( order );
                try
                {
                    await fetch( `${ "https://db-coderhouse-project.onrender.com" }/users/${ actualUser.id }`, {
                        method: 'PUT',
                        body: JSON.stringify( actualUser ), // data can be `string` or {object}!
                        headers: {
                            "Content-Type": "application/json",
                        },
                        redirect: "manual"
                    } ).then( ( res ) => res.json() )
                        .catch( ( error ) => console.error( "Error:", error ) )
                        .then( ( response ) => console.log( "Success:", response ) );

                    const cart = document.querySelector( '.cart-number' );
                    cart.textContent = actualUser?.orders?.length;
                    fillCart( actualUser, true );

                } catch ( error )
                {
                    console.log( error );
                }
            }
        }
    } );
};

export function fillCart ( actualUser, ulExists = false )
{
    const cartBody = document.querySelector( '.cart-products' );
    const cartList = document.querySelector( '.cart-ul' );
    if ( cartBody && ulExists )
    {
        let elementToDelete = cartList.lastChild;
        while ( elementToDelete )
        {
            cartList.removeChild( elementToDelete );
            elementToDelete = cartList.lastChild;
        }
    }

    actualUser.orders.forEach( ( product ) =>
    {
        const liCart = document.createElement( 'LI' );
        liCart.classList.add( 'cart-li' );

        liCart.innerHTML = `
                <div class="cart-img">
                    <img src="https://c8.alamy.com/compes/2f4nkpn/fotografia-profesional-de-la-comida-diseno-de-la-vista-de-la-mesa-perfecto-para-su-sitio-web-revista-blog-de-la-comida-o-cualquier-cosa-que-usted-pueda-pensar-en-necesitarlo-para-2f4nkpn.jpg" alt="">
                </div>
                <div>
                    <p>${ product.name }</p>
                    <span class="fs-6 ">${ product.detail }</span>
                </div>
                <div>
                    <p>${ formatMoney( parseInt( product.price ) ) }</p>
                </div>
                <div>
                    <p>${ product.quantityOrder }</p>
                </div>
                <div>
                    <button class="bg-transparent border-0 text-danger text-3 delete-product-cart" data-productId="${ product.id }">Delete</button>
                </div>
        `;
        cartList.appendChild( liCart );
        liCart.addEventListener( 'click', ( e ) => deleteProductCart( e, actualUser ), false );
    } );
    cartBody.appendChild( cartList );
};

async function deleteProductCart ( e, actualUser )
{
    if ( e.target.classList.contains( 'delete-product-cart' ) )
    {
        const productSelected = e.target.attributes['data-productId'].value;
        const updatedOrders = actualUser?.orders?.filter( product => product.id !== productSelected );
        actualUser.orders = [...updatedOrders];
        console.log( actualUser );

        try
        {
            await fetch( `${ "https://db-coderhouse-project.onrender.com" }/users/${ actualUser.id }`, {
                method: 'PUT',
                body: JSON.stringify( actualUser ), // data can be `string` or {object}!
                headers: {
                    "Content-Type": "application/json",
                },
                redirect: "manual"
            } ).then( ( res ) => res.json() )
                .catch( ( error ) => console.error( "Error:", error ) )
                .then( ( response ) => console.log( "Success:", response ) );

            const cart = document.querySelector( '.cart-number' );
            cart.textContent = actualUser?.orders?.length;


            fillCart( actualUser, true );
            showContentToBuyer( actualUser );

        } catch ( error )
        {
            console.log( error );
        }
    }
};