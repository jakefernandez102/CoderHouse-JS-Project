export function validateUser ( user = [] )
{

    let validated = false;
    if ( !user.length === 0 )
    {
        return validated;
    }

    const emailInput = prompt( 'Please insert the email you have used while signing up.' );
    const passwordInput = prompt( 'Please insert the password you have used while signing up.' );

    const validatedUser = user.filter( _user => _user.email === emailInput );
    console.log( JSON.stringify( validatedUser ) );
    const { email, password } = validatedUser[0];

    if ( !validatedUser )
    {
        alert( 'User does not exists' );
        validateUser( user );

    } else if ( [emailInput, passwordInput].includes( '' ) )
    {
        alert( 'All the fields are required' );
        validateUser( user );
    } else if ( emailInput !== email || password !== passwordInput )
    {
        alert( 'email or password does not exist' );
        validateUser( user );
    }

    return validatedUser[0];

}
