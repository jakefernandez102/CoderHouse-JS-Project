import { printAlert } from "../helpers/alert.js";
import { formatMoney } from "../helpers/formater.js";
import { generateNewId } from "../helpers/idGenerator.js";
import { showContentToBuyer } from "./home-user.js";

let user = {};
let users = [];
let token = '';


let divProductItem = null;
let divrestaurantProductContainer = null;
let generateOrderButton = document.querySelector( '#generate-order' );
generateOrderButton.setAttribute( "data-bs-toggle", "modal" );
generateOrderButton.setAttribute( "href", "#exampleModalToggle" );
generateOrderButton.addEventListener( 'click', () =>
{
    Toastify( {
        text: "Visit Home to view your order details",
        className: "info",
        style: {
            background: "linear-gradient(to right, #96c93d, #96c93d)",
        }
    } ).showToast();
} );


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
                    <img src="${ product.image }" alt="Producto 1">
                    <h3 class="product-title">${ product.name }</h3>
                    <p class="fs-6 fw-light d-block">${ product.detail }</p>
                    <p>Price: ${ formatMoney( parseInt( product.price ) ) }</p>
                    <div class="d-flex gap-3 align-items-center">
                        <p>Quantity:</p>
                        <input class="product-quantity-order form-control text-center text-4" type="number" value="1" min="1" max="${ product.quantity }"/>
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
    const quantityInput = document.querySelector( '.product-quantity-order' );

    users.forEach( async ( user ) =>
    {
        if ( user.rol === 1 )
        {
            const restaurantSelected = user?.restaurants?.filter( restaurant => restaurant.id === restaurantId );
            if ( restaurantSelected !== undefined )
            {

                let productToAdd = user?.restaurants?.find( res => res?.name === restaurantSelected[0]?.name ).products?.find( product => product?.id === productId );
                console.log( productToAdd );
                let order = { ...productToAdd, id: generateNewId(), productId: productId, restaurantId, quantityOrder: parseInt( quantityInput.value ) };
                console.log( order );

                if ( actualUser.orders.some( product => product.productId === productToAdd.id ) )
                {
                    let updatedOrders = actualUser.orders.map( ( product ) =>
                    {
                        if ( product.productId === productToAdd.id )
                        {
                            product.quantityOrder = product.quantityOrder + 1;
                        }
                        return product;
                    } );
                    actualUser.orders = [...updatedOrders];
                } else
                {
                    actualUser.orders.push( order );
                }
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

                    Toastify( {
                        text: "Product added to cart!!!",
                        className: "info",
                        style: {
                            background: "linear-gradient(to right, #96c93d, #96c93d)",
                        }
                    } ).showToast();
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
                    <img src="${ product.image }" alt="">
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
    const confirmDelete = confirm( 'You are about delete a product from cart. \n\n Do you want to continue?' );
    if ( confirmDelete )
    {
        if ( e.target.classList.contains( 'delete-product-cart' ) )
        {
            const productSelected = e.target.attributes['data-productId'].value;
            const updatedOrders = actualUser?.orders?.filter( product => product?.id !== productSelected );
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
                Toastify( {
                    text: "Product deleted from cart!!!",
                    offset: {
                        x: 50, // horizontal axis - can be a number or a string indicating unity. eg: '2em'
                        y: 10 // vertical axis - can be a number or a string indicating unity. eg: '2em'
                    },
                    style: {
                        background: "red",
                    }
                } ).showToast();

                const cart = document.querySelector( '.cart-number' );
                cart.textContent = actualUser?.orders?.length;


                fillCart( actualUser, true );
                showContentToBuyer( actualUser );
            } catch ( error )
            {
                console.log( error );
            }
        }
    }

};