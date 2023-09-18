import { calculateSubTotal, calculateTaxes } from "../helpers/calculate-operations.js";
import { formatDate, formatMoney } from "../helpers/formater.js";


let user = {};
let users = [];
let customers = [];
let token = '';
let sellerSignInCounter = 1;

export async function validateWichContentToDisplay ()
{
    token = localStorage.getItem( 'userToken' ).split( '"' )[1];
    try
    {
        const response = await fetch( `${ process.env.DB_USERS_URL }/users` );
        users = await response.json();

        const responseUser = await fetch( `${ process.env.DB_USERS_URL }/users/?token=${ token }` );
        user = await responseUser.json();
        showUserRolContent( user[0], users );
    } catch ( error )
    {
        console.log( error );
    }
}

function showUserRolContent ( user, users )
{
    switch ( parseInt( user.rol ) )
    {
        case 1:
            showContentToSeller( users );
            break;
        case 2:
            showContentToBuyer( user );
            break;

        default:
            break;
    }
};


export function showContentToSeller ( users )
{

    const ulBuyer = document.querySelector( '.ul-buyer' );

    let elementToDelete = ulBuyer.lastChild;
    while ( elementToDelete )
    {
        ulBuyer.removeChild( elementToDelete );
        elementToDelete = ulBuyer.lastChild;
    }

    users.forEach( ( _user, idx ) =>
    {

        if ( sellerSignInCounter === 1 && _user.rol === 2 )
        {
            _user.orders.forEach( ( product ) =>
            {
                fillCustomersPerRestaurant( _user, product );
            } );
        }
    } );
    ++sellerSignInCounter;
    buyInRestaurant.forEach( async ( product, idx ) =>
    {
        const liBuyer = document.createElement( 'LI' );
        liBuyer.innerHTML = `
                <li class="order-item">
                    <span>OrderItem #${ idx + 1 }</span>
                    <span>Date: ${ formatDate( new Date() ) }</span>
                    <span>Unit Name: ${ product.name }</span>
                    <span>Unit Price: ${ formatMoney( parseInt( product.price ) ) }</span>
                    <span>Quantity Ordered: ${ product.quantityOrder }</span>
                    <span>Total of this product: ${ formatMoney( calculateSubTotal( product.price, product.quantityOrder ) ) }</span>
                    <span>Customer: ${ product.fullName }</span>
                </li>
            `;
        ulBuyer.appendChild( liBuyer );
        submitBill( product );
    } );

}

let updatedOrders = [];
let buyInRestaurant = [];
function fillCustomersPerRestaurant ( _user, product )
{
    user[0].restaurants.forEach( ( restaurant ) =>
    {
        if ( restaurant.id === product.restaurantId )
        {
            buyInRestaurant = [...buyInRestaurant, { ...product, fullName: _user.fullName }];
            console.log( buyInRestaurant );
        }
    } );

}

export function showContentToBuyer ( user )
{
    const ulBuyer = document.querySelector( '.ul-buyer' );

    let elementToDelete = ulBuyer.lastChild;
    while ( elementToDelete )
    {
        ulBuyer.removeChild( elementToDelete );
        elementToDelete = ulBuyer.lastChild;
    }

    user?.orders?.forEach( async ( product, idx ) =>
    {
        const restaurantName = await getRestaurantName( product.restaurantId );

        const liBuyer = document.createElement( 'LI' );
        liBuyer.innerHTML = `
            <li class="order-item">
                <span>OrderItem #${ idx + 1 }</span>
                <span>Date: ${ formatDate( new Date() ) }</span>
                <span>Unit Name: ${ product.name }</span>
                <span>Unit Price: ${ formatMoney( parseInt( product.price ) ) }</span>
                <span>Quantity Ordered: ${ product.quantityOrder }</span>
                <span>Total of this product: ${ formatMoney( calculateSubTotal( product.price, product.quantityOrder ) ) }</span>
                <span>Restaurant: ${ restaurantName }</span>
            </li>
        `;
        ulBuyer.appendChild( liBuyer );
    } );
    submitBill( user );
}

async function getRestaurantName ( restaurantId )
{

    try
    {
        const response = await fetch( `${ process.env.DB_USERS_URL }/users` );
        const users = await response.json();
        let restaurant = [];

        users.forEach( ( user ) =>
        {
            if ( user.rol === 1 )
            {
                user.restaurants.forEach( _restaurant =>
                {
                    if ( _restaurant.id === restaurantId )
                    {
                        restaurant.push( _restaurant );
                    }
                } );
            }
        } );
        return restaurant[0].name;
    } catch ( error )
    {
        console.log( error );
    }

};

function submitBill ( _user )
{
    const h2SubTotal = document.querySelector( '.last-subtotal-pay' );
    const h2Taxes = document.querySelector( '.last-taxes-pay' );
    const h2Total = document.querySelector( '.last-total-pay' );

    let subtotal = 0;
    let taxes = 0;
    let total = 0;

    if ( buyInRestaurant.length !== 0 && user[0].rol === 1 )
    {
        console.log( _user );
        buyInRestaurant.forEach( product =>
        {
            subtotal += calculateSubTotal( product?.price, product?.quantityOrder );
            taxes = calculateTaxes( subtotal );
            total = subtotal + taxes;
        } );


        h2SubTotal.textContent = formatMoney( subtotal );
        h2Taxes.textContent = formatMoney( taxes );
        h2Total.textContent = formatMoney( total );
    } else
    {
        _user?.orders?.forEach( product =>
        {
            console.log( product );
            subtotal += calculateSubTotal( product?.price, product?.quantityOrder );
        } );
        taxes = calculateTaxes( subtotal );
        total = subtotal + taxes;

        h2SubTotal.textContent = formatMoney( subtotal );
        h2Taxes.textContent = formatMoney( taxes );
        h2Total.textContent = formatMoney( total );
    }

};
