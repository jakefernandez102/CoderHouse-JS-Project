export function validateUser ( user = [] )
{

    let validated = false;
    if ( !user.length === 0 )
    {
        return validated;
    }

    const emailInput = prompt( 'Please insert the email you have used while signing up.' );
    const passwordInput = prompt( 'Please insert the password you have used while signing up.' );

    const validatedUser = user?.filter( _user => _user.email === emailInput );
    console.log( JSON.stringify( validatedUser ) );

    if ( !validatedUser )
    {
        const exit = prompt( 'User does not exists \n X to exit' ).toLocaleLowerCase();
        if ( exit === 'x' )
        {
            return;
        }
        validateUser( user );

    } else if ( [emailInput, passwordInput].includes( '' ) )
    {
        const exit = prompt( 'All the fields are required \n X to exit' ).toLocaleLowerCase();
        if ( exit === 'x' )
        {
            return;
        }
        validateUser( user );
    } else if ( emailInput !== validatedUser[0]?.email || validatedUser[0]?.password !== passwordInput )
    {
        const exit = prompt( 'email or password does not exist \n X to exit' ).toLocaleLowerCase();
        if ( exit === 'x' )
        {
            return;
        }
        validateUser( user );
    }

    return validatedUser[0];

}
