import { printAlert } from "../helpers/alert.js";
import { formatMoney } from "../helpers/formater.js";
import { generateNewId } from "../helpers/idGenerator.js";

let restaurantForm = null;
let productForm = null;
let restaurantInput = '';
let selectRestaurantInput = '';
let user = {};
let users = [];
let token = '';
export async function generateScript ()
{
    token = localStorage.getItem( 'userToken' ).split( '"' )[1];

    const response = await fetch( `${ "https://db-coderhouse-project.onrender.com" }/users` );
    users = await response.json();

    const userToAddRestaurant = users.filter( user => user.token === token )[0];
    user = userToAddRestaurant;

    restaurantForm = document.querySelector( '.restaurantForm' );
    restaurantInput = document.querySelector( '#restaurant-name' );
    selectRestaurantInput = document.querySelector( '#select-restaurant' );

    productForm = document.querySelector( '.product-form' );
    fillSelectRestaurant();

    generateTableContent();

    restaurantForm.addEventListener( 'submit', ( e ) =>
    {
        validateRestaurant( e, restaurantInput.value );
    }, false );

    productForm.addEventListener( 'submit', ( e ) =>
    {
        e.preventDefault();
        addProductToRestaurant();
    }, false );
}

function generateTableContent ()
{
    const productsTable = document.querySelector( '#products-table' );

    const tableHead = document.createElement( 'THEAD' );
    const tableBody = document.createElement( 'TBODY' );
    let tr = null;
    let td = null;

    tableHead.innerHTML = `
        <tr>

            <th scope="col">Product Name</th>
            <th scope="col">Product Price</th>
            <th scope="col">Product Quantity</th>
            <th scope="col">Restaurant</th>
        </tr>
    `;

    user.restaurants.forEach( ( restaurant ) =>
    {
        restaurant.products.forEach( ( product, idx ) =>
        {
            tr = document.createElement( 'TR' );
            tr.innerHTML = `

                <td>${ product.name }</td>
                <td>${ formatMoney( parseInt( product.price ) ) }</td>
                <td>${ product.quantity }</td>
                <td>${ restaurant.name }</td>
            `;
            tableBody.appendChild( tr );
        } );
    } );

    productsTable.appendChild( tableHead );
    productsTable.appendChild( tableBody );





}

export async function validateRestaurant ( e, restaurantInput )
{
    e.preventDefault();

    try
    {
        const userToAddRestaurant = users.filter( user => user.token === token )[0];
        if ( !userToAddRestaurant.restaurants.some( restaurant => restaurant.name === restaurantInput ) )
        {
            addRestaurant( userToAddRestaurant, restaurantInput );
        } else
        {
            printAlert( 'restaurantForm', 'Restaurant is already added' );
        }

    } catch ( error )
    {
        console.log( error );
    }
};
export async function addRestaurant ( user, restaurantInput )
{

    user.restaurants.push( { id: generateNewId(), name: restaurantInput, products: [] } );
    console.log( user );
    try
    {
        await fetch( `${ "https://db-coderhouse-project.onrender.com" }/users/${ user.id }`, {
            method: 'PUT',
            body: JSON.stringify( user ), // data can be `string` or {object}!
            headers: {
                "Content-Type": "application/json",
            }
        } ).then( ( res ) => res.json() )
            .catch( ( error ) => console.error( "Error:", error ) )
            .then( ( response ) => console.log( "Success:", response ) );
        printAlert( 'restaurantForm', 'Restaurant added successfully!!', false );
    } catch ( error )
    {
        console.log( error );
    }

}

async function fillSelectRestaurant ()
{

    console.log( user );
    user.restaurants.forEach( restaurant =>
    {
        const option = document.createElement( 'OPTION' );
        option.value = restaurant.id;
        option.textContent = restaurant.name;
        selectRestaurantInput.appendChild( option );
    } );

    console.log( selectRestaurantInput );

};


async function addProductToRestaurant ()
{

    const productNameInput = document.querySelector( '#product-name' ).value;
    const productPriceInput = document.querySelector( '#product-price' ).value;
    const productQuantityInput = document.querySelector( '#product-quantity' ).value;

    if ( [productNameInput, productPriceInput, productQuantityInput].includes( '' ) || selectRestaurantInput.value === '0' )
    {
        printAlert( 'product-form', 'All fields are required' );
        return;
    }
    if ( user?.restaurants?.products?.some( product => product?.name === productNameInput ) )
    {
        printAlert( 'product-form', 'Product already exists in the restaurant' );
        return;
    }

    const restaurantToAddProduct = user?.restaurants?.filter( restaurant => restaurant.id === selectRestaurantInput.value )[0];
    restaurantToAddProduct.products.push( { id: generateNewId(), name: productNameInput, price: productPriceInput, quantity: productQuantityInput } );

    try
    {
        await fetch( `${ "https://db-coderhouse-project.onrender.com" }/users/${ user.id }`, {
            method: 'PUT',
            body: JSON.stringify( user ), // data can be `string` or {object}!
            headers: {
                "Content-Type": "application/json",
            }
        } ).then( ( res ) => res.json() )
            .catch( ( error ) => console.error( "Error:", error ) )
            .then( ( response ) => console.log( "Success:", response ) );
        printAlert( 'restaurantForm', 'Restaurant added successfully!!', false );
    } catch ( error )
    {
        console.log( error );
    }

};