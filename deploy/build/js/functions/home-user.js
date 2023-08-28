

let user = {};
let users = [];
let token = '';

export async function validateWichContentToDisplay ()
{
    token = localStorage.getItem( 'userToken' ).split( '"' )[1];
    try
    {
        const response = await fetch( `${ "https://db-coderhouse-project.onrender.com" }/users/?token=${ token }` );
        user = await response.json();
        showUserRolContent();
    } catch ( error )
    {
        console.log( error );
    }
}

function showUserRolContent ()
{
    switch ( parseInt( user.rol ) )
    {
        case 1:
            showContentToSeller();
            break;
        case 2:
            showContentToBuyer();
            break;

        default:
            break;
    }
};

function showContentToSeller ()
{

}

function showContentToBuyer ()
{

}