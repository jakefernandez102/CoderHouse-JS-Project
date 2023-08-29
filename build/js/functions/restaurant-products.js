import { printAlert } from "../helpers/alert.js";
import { formatMoney } from "../helpers/formater.js";
import { generateNewId } from "../helpers/idGenerator.js";

let restaurantForm = null;
let productForm = null;
let restaurantInput = '';
let selectRestaurantInput = '';
let deleteButton = '';
let editButton = '';

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
        addProductToRestaurant( e );

    }, false );
}

function generateTableContent ( deleteProduct = false )
{
    const tableElement = document.querySelector( '.table-products' );
    const tableHead = document.createElement( 'THEAD' );
    const tableBody = document.createElement( 'TBODY' );
    tableHead.classList.add( 'table-head' );
    tableBody.classList.add( 'table-body' );
    if ( tableElement && deleteProduct )
    {
        const tableHeadElement = document.querySelector( '.table-head' );
        const tableBodyElement = document.querySelector( '.table-body' );

        tableElement.removeChild( tableHeadElement );
        tableElement.removeChild( tableBodyElement );
    }
    const productsTable = document.querySelector( '#products-table' );

    let tr = null;
    let td = null;

    tableHead.innerHTML = `
        <tr>

            <th scope="col">Product Name</th>
            <th scope="col">Product Price</th>
            <th scope="col">Product Quantity</th>
            <th scope="col">Restaurant</th>
            <th scope="col">Actions</th>
        </tr>
    `;

    user.restaurants.forEach( ( restaurant ) =>
    {
        restaurant.products.forEach( ( product, idx ) =>
        {
            tr = document.createElement( 'TR' );
            tr.innerHTML = `

                <td>
                    ${ product.name }
                    <span class="fs-6 fw-lighter d-block">${ product.detail }</span>
                </td>
                <td>${ formatMoney( parseInt( product.price ) ) }</td>
                <td>${ product.quantity }</td>
                <td>${ restaurant.name }</td>
                <td class="flex gap-2">
                    <button class=" delete-button text-danger bg-transparent"  type="button" data-product-id="${ product.id }" data-restaurant-id="${ restaurant.id }">Delete </button>  
                    <button class=" edit-button text-warning  bg-transparent" data-bs-toggle="collapse" data-bs-target="#multiCollapseExample2" aria-expanded="false" aria-controls="multiCollapseExample2" type="button" data-product-id="${ product.id }" data-restaurant-id="${ restaurant.id }">Edit </button>  
                </td>
            `;
            tableBody.appendChild( tr );
            tr.addEventListener( 'click', deleteEditProduct, false );
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

        setTimeout( () =>
        {
            window.location.href = '/user-restaurant';
        }, 3000 );

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


};


async function addProductToRestaurant ( e )
{

    let productNameInput = document.querySelector( '#product-name' );
    let productDetailInput = document.querySelector( '#product-detail' );
    let productPriceInput = document.querySelector( '#product-price' );
    let productQuantityInput = document.querySelector( '#product-quantity' );

    if ( [productNameInput.value, productDetailInput.value, productPriceInput.value, productQuantityInput.value].includes( '' ) || selectRestaurantInput.value === '0' )
    {
        printAlert( 'product-form', 'All fields are required' );
        return;
    }
    if ( user.restaurants.some( restaurant => restaurant.products.some( product => product.name === productNameInput.value ) ) )
    {
        printAlert( 'product-form', 'Product already exists in the restaurant' );
        return;
    };
    const restaurantToAddProduct = user?.restaurants?.filter( restaurant => restaurant.id === selectRestaurantInput.value )[0];
    restaurantToAddProduct.products.push( { id: generateNewId(), name: productNameInput.value, detail: productDetailInput.value, price: productPriceInput.value, quantity: productQuantityInput.value } );
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
        printAlert( 'product-form', 'Product added successfully!!', false );

        generateTableContent( true );
        e.target.reset();
    } catch ( error )
    {
        console.log( error );
    }
};

function deleteEditProduct ( e )
{
    if ( e.target.classList.contains( 'delete-button' ) )
    {
        deleteProduct( {
            productId: e.target.attributes['data-product-id'].value,
            restaurantId: e.target.attributes['data-restaurant-id'].value
        } );
    } else
    {
        editProduct( {
            productId: e.target.attributes['data-product-id'].value,
            restaurantId: e.target.attributes['data-restaurant-id'].value
        } );
    }
};

async function deleteProduct ( { productId, restaurantId } )
{
    let restaurantSelected = user?.restaurants?.find( restaurant => restaurant.id === restaurantId );
    user?.restaurants?.forEach( ( restaurant ) =>
    {
        if ( restaurant.id === restaurantSelected.id )
        {
            const updatedProducts = restaurantSelected?.products?.filter( product => product.id !== productId );
            console.log( updatedProducts );
            restaurant.products = [...updatedProducts];
        }
    } );

    try
    {
        await fetch( `${ "https://db-coderhouse-project.onrender.com" }/users/${ user.id }`, {
            method: 'PUT',
            body: JSON.stringify( user ), // data can be `string` or {object}!
            headers: {
                "Content-Type": "application/json",
            },
            redirect: 'manual'
        } ).then( ( res ) => res.json() )
            .catch( ( error ) => console.error( "Error:", error ) )
            .then( ( response ) => console.log( "Success:", response ) );
        generateTableContent( true );
    } catch ( error )
    {
        console.log( error );
    }


}
function editProduct ( { productId, restaurantId } )
{

    const fullNameSignUpInput = document.querySelector( '#name' );
    const phoneNumberSignUpInput = document.querySelector( '#phone' );
    const rolSignUpInput = document.querySelector( '#customer-rol' );
    const emailSignUpInput = document.querySelector( '#email' );
    const passwordSignUpInput = document.querySelector( '#password' );

    let restaurantSelected = user?.restaurants?.find( restaurant => restaurant.id === restaurantId );
    console.log( restaurantSelected );
    user?.restaurants?.forEach( ( restaurant ) =>
    {
        if ( restaurant.id === restaurantSelected.id )
        {
            const updatedProducts = restaurantSelected?.products?.find( product => product.id !== productId );
            console.log( updatedProducts );
        }
    } );
}
