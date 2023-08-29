export function formatMoney ( quantity )
{
    let moneyQuantitY = quantity.toLocaleString( 'es-CR', {
        style: 'currency',
        currency: 'CRC'
    } );
    return moneyQuantitY;
}

export function formatDate ( date )
{
    const newDate = new Date( date );
    return newDate.toLocaleDateString( 'en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    } );
}