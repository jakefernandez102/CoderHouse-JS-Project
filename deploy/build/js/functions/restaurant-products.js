import { printAlert } from "../helpers/alert.js";
import { formatMoney } from "../helpers/formater.js";
import { generateNewId } from "../helpers/idGenerator.js";
import { widget_cloudinary } from "../app.js";


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
        addProductToRestaurant();
        e.target.reset();
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

            <th scope="col">Product Image</th>
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
            console.log( product );
            tr = document.createElement( 'TR' );
            tr.innerHTML = `

                <td id='td-image'>
                    <img id="table-product-img" src="${ product?.image }" alt="${ product.name } image"/>
                </td>
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
            tr.addEventListener( 'click', ( e ) => deleteEditProduct( e ) );
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
        }, 600 );

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

export const updateProductImage = ( src = '/build/img/platillo3.webp' ) =>
{
    let productNameInput = document.querySelector( '#product-name' );
    let productDetailInput = document.querySelector( '#product-detail' );
    let productPriceInput = document.querySelector( '#product-price' );
    let productQuantityInput = document.querySelector( '#product-quantity' );
    let productimage = document.querySelector( '#product-image-img' );

    if ( user.restaurants.some( restaurant => restaurant.products.some( product => product.name === productNameInput.value ) ) )
    {
        printAlert( 'product-form', 'Product already exists in the restaurant' );
        return;
    };

    const restaurantToAddProduct = user?.restaurants?.filter( restaurant => restaurant.id === selectRestaurantInput.value )[0];
    restaurantToAddProduct.products.push( { id: generateNewId(), name: productNameInput.value, detail: productDetailInput.value, price: productPriceInput.value, quantity: productQuantityInput.value, image: src } );
    const { password, ...rest } = user;
    localStorage.setItem( 'user', JSON.stringify( rest ) );
};

export async function addProductToRestaurant ()
{

    let productNameInput = document.querySelector( '#product-name' );
    let productDetailInput = document.querySelector( '#product-detail' );
    let productPriceInput = document.querySelector( '#product-price' );
    let productQuantityInput = document.querySelector( '#product-quantity' );
    let productimage = document.querySelector( '#product-image-img' );

    if ( [productNameInput.value, productDetailInput.value, productPriceInput.value, productQuantityInput.value].includes( '' ) || selectRestaurantInput.value === '0' )
    {
        console.log( 'ya existe bro' );
        printAlert( 'product-form', 'All fields are required' );
        return;
    }



    const userLS = JSON.parse( localStorage.getItem( 'user' ) );
    if ( !userLS )
    {
        const restaurantToAddProduct = user?.restaurants?.filter( restaurant => restaurant.id === selectRestaurantInput.value )[0];
        restaurantToAddProduct.products.push( { id: generateNewId(), name: productNameInput.value, detail: productDetailInput.value, price: productPriceInput.value, quantity: productQuantityInput.value, image: './build/img/platillo3.webp' } );
        const { password, ...rest } = user;
        localStorage.setItem( 'user', JSON.stringify( rest ) );
    }
    // else
    // {
    //     if ( user.restaurants.some( restaurant => restaurant.products.some( product => product.name === productNameInput.value ) ) )
    //     {
    //         printAlert( 'product-form', 'Product already exists in the restaurant' );
    //         return;
    //     } else
    //     {
    //         const restaurantToAddProduct = user?.restaurants?.filter( restaurant => restaurant.id === selectRestaurantInput.value )[0];
    //         restaurantToAddProduct.products.push( { id: generateNewId(), name: productNameInput.value, detail: productDetailInput.value, price: productPriceInput.value, quantity: productQuantityInput.value, image: './build/img/platillo3.webp' } );
    //         const { password, ...rest } = user;
    //         localStorage.setItem( 'user', JSON.stringify( rest ) );
    //     }
    // }


    try
    {
        user = JSON.parse( localStorage.getItem( 'user' ) );
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
    } catch ( error )
    {
        console.log( error );
    }

};

function deleteEditProduct ( e )
{
    console.log( e.target.attributes['data-product-id'].value );
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
    console.log( productId, restaurantId );

    let productNameInput = document.querySelector( '#product-name' );
    let productDetailInput = document.querySelector( '#product-detail' );
    let productPriceInput = document.querySelector( '#product-price' );
    let productQuantityInput = document.querySelector( '#product-quantity' );
    let productimage = document.querySelector( '#product-image-img' );


    let restaurantSelected = user?.restaurants?.find( restaurant => restaurant.id === restaurantId );
    user?.restaurants?.forEach( ( restaurant ) =>
    {
        if ( restaurant.id === restaurantSelected.id )
        {
            const updatedProducts = restaurantSelected?.products?.find( product => product.id === productId );
            console.log( updatedProducts );
            productNameInput.value = updatedProducts.name;
            productDetailInput.value = updatedProducts.detail;
            productPriceInput.value = updatedProducts.price;
            productQuantityInput.value = updatedProducts.quantity;
            productimage.src = updatedProducts.image;
        }
    } );
}
