export function formatMoney ( quantity )
{
    let moneyQuantitY = quantity.toLocaleString( 'es-CR', {
        style: 'currency',
        currency: 'CRC'
    } );
    return moneyQuantitY;
}