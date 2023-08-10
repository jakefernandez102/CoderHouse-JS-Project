import { validateUser } from "./Auth/auth.js";
import { formatMoney } from "./helpers/formater.js";
import { generateNewId } from "./helpers/idGenerator.js";

alert( `
Hello! \n 
Welcome to Mon-Key Restaurant! 
        
Here you will be able to sell your delicious food or buy our tasty and different products.`);


let name = '';

let userRoll = '';
let restaurantName = '';
let phoneNumber = '';
let email = '';
let password = '';

let productName = '';
let productPrice = '';
let productQuantity = '';

let userProfiles = [];
let userProfile = {};

let productsPerUser = [];
let productPerUser = {};

login();

function login ()
{

    let hasAccount = prompt( 'Do you already have an account with us? \n Y. Yes \n N. No' ).toLocaleLowerCase();

    switch ( hasAccount )
    {
        case 'y':
            !validateUser( userProfiles ) ? alert( "There are no users registered. \n Let's create an account" ) : signIn();
            break;
        case 'n':
            alert( "Les's sign up!" );
            validateContract();
            break;

        default:
            alert( 'Type a valid Option (Y or N)' );
            login();
            break;
    }

}

function setRoll ( name = '' )
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



function acceptContract () 
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

function validateContract ()
{

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
}
validateContract();

function createProfile ()
{
    name = prompt( 'Please introduce your FULL name here:' );
    phoneNumber = prompt( 'Insert your phone number:' );
    if ( userRoll === '1' )
    {
        restaurantName = prompt( "Insert your restaurant's name:" );

    }
    email = prompt( 'Insert your email:' );
    password = prompt( 'Insert your password:' );

    userProfile = {
        ...userProfile,
        id: generateNewId(),
        userRoll,
        name,
        phoneNumber,
        restaurantName,
        email,
        password
    };

    if ( userProfile )
    {
        userProfiles = [...userProfiles, userProfile];
    }

    alert( `
    Excellent, your profile has been created successfully as:
    Full Name: ${ name }
    Restaurant Name: ${ restaurantName }
    Phone Number: ${ phoneNumber }
    Email: ${ email }` );

    signIn();
}

function signIn ()
{
    alert( `Now let's SigIn` );
    let actualUser = validateUser( userProfiles );
    userProfile = actualUser;
    if ( actualUser.name !== '' )
    {
        alert( 'You are signed in.' );

        if ( actualUser.userRoll === '1' )
        {
            let addProductOption = prompt( 'Do you want to add product \n Y. Yes \n N. No' ).toLowerCase();
            while ( addProductOption !== 'y' && addProductOption !== 'n' )
            {
                alert( "Add a valid option" );
                addProductOption = prompt( 'Do you want to add product \n Y. Yes \n N. No' ).toLowerCase();
                continue;
            }
            addProductOption === 'y' ? addProduct() : alert( 'You can come whenever you want :)' );
        } else if ( actualUser.userRoll === '2' )
        {
            addOrder();
        }
    };
}


function addProduct ()
{
    let addOther = 'y';


    while ( addOther === 'y' )
    {
        productName = prompt( "Insert the product's name:" );
        productPrice = prompt( "Insert the product's price:" );
        productQuantity = prompt( "Insert the product's quantity:" );
        if ( isNaN( productPrice ) || isNaN( productQuantity ) )
        {
            alert( 'Product price and Product quantity must be a number' );
            addProduct();
            return;
        }

        productPerUser = {
            id: generateNewId(),
            productName,
            productPrice,
            productQuantity,
            userId: userProfile.id
        };

        productsPerUser = [...productsPerUser, productPerUser];

        printCalculation();

        addOther = prompt( "Do you want to add another product? \n Y.Yes \n N.No" ).toLowerCase();
        while ( addOther !== 'y' || addOther !== 'n' )
        {
            if ( addOther === 'n' )
            {
                const goMainMenu = prompt( 'Do you want to go to the main menu? \n Y. Yes \n N. No' ).toLocaleLowerCase();
                if ( goMainMenu === 'n' )
                {
                    return;
                } else
                {
                    login();
                }
                return;
            } else if ( addOther === 'y' )
            {
                addProduct();
                return;
            } else
            {
                alert( 'Please add a valid option' );
                addOther = prompt( "Do you want to add another product? \n Y.Yes \n N.No" ).toLowerCase();
                continue;
            }
        }
    }
}

function printCalculation ()
{
    let totalCharged;
    let totalToSell;
    let finalRevenue;

    alert( 'You will see the list of products and calculations' );
    productsPerUser.forEach( product =>
    {
        totalCharged = ( ( product.productPrice * product.productQuantity ) * 1.1 ) - ( product.productPrice * product.productQuantity );
        totalToSell = ( product.productPrice * product.productQuantity );
        finalRevenue = ( product.productPrice * product.productQuantity ) - totalCharged;



        if ( userProfile.id === product.userId )
        {

            alert( `
            product: ${ JSON.stringify( product ) }
            
            Please remember that we will charge 10% of every sell:
            i.e if you sell the whole stock of your product this will be the calculation:
            
            Our fee (10%) = ${ formatMoney( totalCharged ) }
            Total to Sell= ${ formatMoney( totalToSell ) }
            Total Revenue = ${ formatMoney( finalRevenue ) }
            ` );
        }
    } );
    console.log( productsPerUser );
};


function addOrder ()
{
    if ( productsPerUser.length === 0 )
    {
        const wantToSell = prompt( 'We are sorry, there are no products to sell yet, if you want to be the first selling with us please type Y to create a new account as seller if not, type N' ).toLowerCase();
        if ( wantToSell === 'y' )
        {
            validateContract();
            return;
        } else if ( wantToSell === 'n' )
        {
            alert( 'Well, see you soon!' );
            return;
        } else
        {
            addOrder();
            return;
        }
    }


    alert( "let's buy some delicious food!" );

    showRestaurants();
    return;

}

function showRestaurants ()
{
    const users = userProfiles.filter( user => user.userRoll === '1' );

    const selectedRestaurantName = prompt( `Please select the restaurant where you want to buy food. \n Type restaurant's Name: \n ${ JSON.stringify( users ) }` );
    const selectedRestaurant = userProfiles.find( user => user.restaurantName === selectedRestaurantName );
    if ( selectedRestaurant )
    {

        console.log( userProfile.id );
        console.log( JSON.stringify( productsPerUser ) );
        const productsOfSelectedRestaurant = productsPerUser.filter( product => product.userId === selectedRestaurant.id );
        console.log( productsOfSelectedRestaurant );
        showProductsOfRestaurant( productsOfSelectedRestaurant );
    } else
    {
        alert( "Please right the Restauran's name correctly" );
        showRestaurants();
    }


};

function showProductsOfRestaurant ( productsOfSelectedRestaurant )
{
    alert( 'Here are all the options that this restaurant offers: \n ' + JSON.stringify( productsOfSelectedRestaurant ) );
};