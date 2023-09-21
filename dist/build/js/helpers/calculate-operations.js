export function calculateSubTotal ( price, quantity )
{
    let subTotal = price * quantity;
    return subTotal;
}
export function calculateTaxes ( subtotal )
{
    const taxes = 0.1;
    let total = subtotal * taxes;

    return total;
}
