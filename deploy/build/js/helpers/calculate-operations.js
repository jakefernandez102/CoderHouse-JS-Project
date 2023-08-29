export function calculateSubTotal ( price, quantity )
{
    let subTotal = price * quantity;
    console.log( subTotal );
    return subTotal;
}
export function calculateTaxes ( subtotal )
{
    const taxes = 0.1;
    let total = subtotal * taxes;
    console.log( total );

    return total;
}
