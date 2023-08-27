


export function printAlert ( formUsed, msg, error = true )
{
    const form = document.querySelector( `.${ formUsed }` );

    const alertText = document.createElement( 'P' );
    alertText.classList.add( 'text-white', error ? 'bg-danger' : 'bg-success', 'text-center', 'py-3' );
    alertText.innerText = msg;

    form.appendChild( alertText );

    setTimeout( () =>
    {
        form.removeChild( alertText );
    }, 3000 );

}