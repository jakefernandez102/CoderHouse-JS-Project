import { showUl } from "../app.js";
import { printAlert } from "../helpers/alert.js";
import { generateUserToken } from "../helpers/idGenerator.js";

let users = [];
let user = {};

console.log( users );
export function validateUser ( user, requestedForm )
{
    switch ( requestedForm )
    {
        case '.form-signIn':
            validateSignIn( user, requestedForm );
            break;
        case '.form-signUp':
            validateSignUp( user, requestedForm );
            break;
        default:
            break;
    }
}

export async function getUsersList ()
{
    try
    {
        const response = await fetch( `${ process.env.DB_USERS_URL }/users` );
        const data = await response.json();
        users = await data;

        return users;
    } catch ( error )
    {
        console.log( error );
    }
}


const validateSignIn = ( user, requestedForm ) =>
{
    if ( user.email === '' || user.password === '' )
    {
        const formUsed = document.querySelector( requestedForm ).classList[0];
        printAlert( formUsed, 'Email and password fields are required' );
        return false;
    }
};

const validateSignUp = async ( user, requestedForm ) =>
{
    users = await getUsersList();
    const {
        fullName,
        phoneNumer,
        rol,
        email,
        password } = user;

    if ( fullName === '' || phoneNumer === '' || rol === '' || email === '' || password === '' )
    {
        const formUsed = document.querySelector( requestedForm ).classList[0];
        printAlert( formUsed, 'All fields are required' );
        return false;
    }

    const userExist = users.some( user => user.email === email );
    if ( !userExist )
    {
        createUser( {
            fullName,
            phoneNumer,
            rol: parseInt( rol ),
            email,
            password
        }, requestedForm );
    } else
    {
        printAlert( document.querySelector( requestedForm ).classList[0], 'User already exists' );
    }

};

const createUser = async ( user, requestedForm ) =>
{
    const formUsed = document.querySelector( requestedForm ).classList[0];
    const token = generateUserToken();
    let userToCreate = {};
    if ( user.rol === 1 )
    {
        userToCreate = { ...user, token, restaurants: [] };
    } else
    {
        userToCreate = { ...user, token, orders: [] };
    }
    try
    {
        await fetch( `${ process.env.DB_USERS_URL }/users`, {
            method: 'POST',
            body: JSON.stringify( userToCreate ), // data can be `string` or {object}!
            headers: {
                "Content-Type": "application/json",
            }
        } ).then( ( res ) => res.json() )
            .catch( ( error ) => console.error( "Error:", error ) )
            .then( ( response ) => console.log( "Success:", response ) );

        printAlert( formUsed, 'User added successfully!!', false );

        localStorage.setItem( 'userToken', JSON.stringify( token ) );

        setTimeout( () =>
        {
            window.location.href = '/';
        }, 3000 );
    } catch ( error )
    {
        console.log( error );
    }
};

const fromSignInButton = document.querySelector( '.form-signIn' );

fromSignInButton.addEventListener( 'submit', signInAccount, false );

async function signInAccount ( e )
{
    e.preventDefault();

    users = await getUsersList();
    const emailInput = document.querySelector( '#signIn-email' ).value;
    const passwordInput = document.querySelector( '#signIn-password' ).value;

    if ( [emailInput, passwordInput].includes( '' ) )
    {
        printAlert( fromSignInButton.classList[0], 'All fields are required' );
    }
    if ( !users.some( user => user.email === emailInput && user.password === passwordInput ) )
    {
        printAlert( fromSignInButton.classList[0], 'Email or password are wrong!!!' );
    } else
    {
        user = users.filter( _user => _user.email === emailInput );
        localStorage.setItem( 'userToken', JSON.stringify( user[0].token ) );
        showUl();
        window.location.pathname = '/';

    };


}


