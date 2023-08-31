import { calculateSubTotal, calculateTaxes } from "../helpers/calculate-operations.js";
import { formatDate, formatMoney } from "../helpers/formater.js";


let user = {};
let users = [];
let customers = [];
let token = '';

export async function validateWichContentToDisplay ()
{
    token = localStorage.getItem( 'userToken' ).split( '"' )[1];
    try
    {
        const response = await fetch( `${ "https://db-coderhouse-project.onrender.com" }/users` );
        users = await response.json();

        const responseUser = await fetch( `${ "https://db-coderhouse-project.onrender.com" }/users/?token=${ token }` );
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


    users.forEach( _user =>
    {
        if ( _user.rol === 2 )
        {
            customers.push( _user );
            console.log( customers );
        }
    } );
    const ulBuyer = document.querySelector( '.ul-buyer' );

    let elementToDelete = ulBuyer.lastChild;
    while ( elementToDelete )
    {
        ulBuyer.removeChild( elementToDelete );
        elementToDelete = ulBuyer.lastChild;
    }
    customers.forEach( customer =>
    {
        customer?.orders?.forEach( async ( product, idx ) =>
        {
            const liBuyer = document.createElement( 'LI' );
            liBuyer.innerHTML = `
                <li class="order-item">
                    <span>OrderItem #${ idx + 1 }</span>
                    <span>Date: ${ formatDate( new Date() ) }</span>
                    <span>Unit Price: ${ formatMoney( product.price ) }</span>
                    <span>Quantity Ordered: ${ product.quantityOrder }</span>
                    <span>Total of this product: ${ formatMoney( calculateSubTotal( product.price, product.quantityOrder ) ) }</span>
                    <span>Customer: ${ customer.fullName }</span>
                </li>
            `;
            ulBuyer.appendChild( liBuyer );
        } );
        submitBill( customer );
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
                <span>Unit Price: ${ formatMoney( product.price ) }</span>
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
        const response = await fetch( `${ "https://db-coderhouse-project.onrender.com" }/users` );
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

function submitBill ( user )
{
    const h2SubTotal = document.querySelector( '.last-subtotal-pay' );
    const h2Taxes = document.querySelector( '.last-taxes-pay' );
    const h2Total = document.querySelector( '.last-total-pay' );

    let subtotal = 0;
    let taxes = 0;
    let total = 0;

    if ( customers.length !== 0 )
    {
        customers.forEach( customer =>
        {
            customer?.orders?.forEach( product =>
            {
                console.log( product );
                subtotal += calculateSubTotal( product?.price, product?.quantityOrder );
            } );
        } );
    } else
    {
        user?.orders?.forEach( product =>
        {
            console.log( product );
            subtotal += calculateSubTotal( product?.price, product?.quantityOrder );
        } );
    }
    taxes = calculateTaxes( subtotal );
    total = subtotal + taxes;

    h2SubTotal.textContent = subtotal;
    h2Taxes.textContent = taxes;
    h2Total.textContent = total;

};
