alert( `
Hello! \n 
Welcome to Mon-Key Restaurant! 
        
Here you will be able to sell your delicious food or buy our tasty and different products.`);

const name = prompt( 'Please introduce your FULL name here:' );

let userRoll = '';
let restaurantName = '';
let phoneNumber = '';
let email = '';
let password = '';

let productName = '';
let productPrice = '';
let productQuantity = '';

const setRoll = function ( name = '' )
{
    const roll = prompt( `
Hello ${ name } \n
We are so happy having you here in our app. 

We would like to know what are your expectations about us, please tell us what do you want to do in Mon-key Restaurant App by adding the option number: \n
    1. Sell
    2. Buy`);

    switch ( roll )
    {
        case '1':
            alert( 'Excellent, so we are going to SELL products' );
            break;
        case '2':
            alert( 'Excellent, so we are going to BUY products' );
            break;

        default:
            alert( 'Please select a valid option' );
            setRoll( name );
            break;
    }
    userRoll = roll;
    return roll;
};



const acceptContract = () =>
{
    const acceptTerm = prompt( `
    Now that you are a member of us, we would like to introduce our fee plan: 
    
    ${ setRoll( name ) === '1'
            ? 'Seller plan: We will charge 10% of all sells as part of our business contract'
            : 'Buyer plan: We will charge 5% to the grand total of your order as part of our business contract' }
    Do you agree with this term in order to continue with your profile creation?
        Y. Yes
        N. No` ).toLowerCase();
    let answer;
    switch ( acceptTerm )
    {
        case 'y':
            answer = true;
            break;
        case 'n':
            answer = false;
            break;
        default:
            alert( 'Please insert a valid option (Y or N)' );
            acceptContract();
            break;
    }
    return answer;
};

if ( acceptContract() )
{
    alert( `
Great!!
Awesome, you have accepted the term, now we are going to create your profile`);
    createProfile();
} else
{
    alert( `
What a pity!!
Well, it is a shame that you do not want to continue with the process,

However, we would like you to know that you can come with us whenever you want in case you change your thoughts about this.
We are here for and with you every time :), good luck.`);

}

function createProfile ()
{

    if ( userRoll === '1' )
    {
        restaurantName = prompt( "Insert your restaurant's name:" ).toLowerCase();
    }
    phoneNumber = prompt( 'Insert your phone number:' ).toLowerCase();
    email = prompt( 'Insert your email:' ).toLowerCase();
    password = prompt( 'Insert your password:' ).toLowerCase();

    alert( `
    Excellent, your profile has been created successfully as:
    Full Name: ${ name }
    Restaurant Name: ${ restaurantName }
    Phone Number: ${ phoneNumber }
    Email: ${ email }` );
}


if ( userRoll === '1' )
{
    let addProductOption = prompt( 'Do you want to add product \n Y. Yes \n N. No' ).toLowerCase();
    while ( addProductOption !== 'y' && addProductOption !== 'n' )
    {
        alert( "Add a valid option" );
        addProductOption = prompt( 'Do you want to add product \n Y. Yes \n N. No' ).toLowerCase();
    }
    addProductOption === 'y' ? addProduct() : alert( 'You can come whenever you want :)' );
}

function addProduct ()
{
    let addOther = 'y';

    while ( addOther === 'y' )
    {
        productName = prompt( "Insert the product's name:" ).toLowerCase();
        productPrice = prompt( "Insert the product's price:" ).toLowerCase();
        productQuantity = prompt( "Insert the product's quantity:" ).toLowerCase();
        if ( isNaN( productPrice ) || isNaN( productQuantity ) )
        {
            alert( 'Product name and Product quantity must be number' );
            addProduct();
            return;
        }
        printCalculation( productPrice, productQuantity );
        addOther = prompt( "Do you want to add another product? \n Y.Yes \n N.No" ).toLowerCase();
        if ( addOther === 'n' )
        {
            alert( 'Thank you for visiting us!' );
        } else
        {
            addOther = prompt( "Do you want to add another product? \n Y.Yes \n N.No" ).toLowerCase();
        }
    }
}

function printCalculation ( productPrice, productQuantity )
{
    const totalCharged = ( ( productPrice * productQuantity ) * 1.1 ) - ( productPrice * productQuantity );
    const totalToSell = ( productPrice * productQuantity );
    const finalRevenue = ( productPrice * productQuantity ) - totalCharged;
    alert( `
Please remember that we will charge 10% of every sell:
i.e if you sell the whole stock of your product this will be the calculation:

Our fee (10%) = ₡${ totalCharged }
Total to Sell= ₡${ totalToSell }
Total Revenue = ₡${ finalRevenue }
` );

};