export function validateUser ( user )
{
    const { email, password } = user;

    const emailInput = prompt( 'Please insert the email you have used while signing up.' );
    const passwordInput = prompt( 'Please insert the password you have used while signing up.' );


    if ( [emailInput, passwordInput].includes( '' ) )
    {
        alert( 'All the fields are required' );
        validateUser( user );
    } else if ( emailInput !== email || password !== passwordInput )
    {
        alert( 'email or password does not exist' );
        validateUser( user );
    }
    return true;

}
