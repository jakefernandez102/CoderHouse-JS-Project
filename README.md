<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top" id="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![GitHub][github-shield]][github-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://coderhousejakefernandezproject.netlify.app">
    <img src="./public/img/Logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">CoderHouse Final ReactJS Project</h3>

  <p align="center">
    Let me introduce you to JK'Store!
    <br />
    <a href="https://github.com/jakefernandez102/CoderHouse-React-Vite-Project"><strong>Explore the repocitory »</strong></a>
    <br />
    <br />
    <a href="https://coderhousejakefernandezproject.netlify.app">View Demo</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

JK'Store is a simulation of an e-commerce website where you can see bunch of different products and filter them by category.
You can view the product details and if you like the product, you are able to add it to the shopping cart, however, to complete the purchase, you will need to register as one of our clients for us to have a certain metrics and follow up you and your interests.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

This section should list any major frameworks/libraries used to bootstrap your project. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.


* [![React][React.js]][React-url]
* [![Firebase][Firebase]][Firebase-url]
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]
* [![Tailwind][Tailwind.com]][Tailwind-url]


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is a little guide of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple steps.

### Prerequisites

This is how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

Below you will read how you can install and set up this app.

1. Clone the repo
   ```sh
   git clone https://github.com/jakefernandez102/JakeFernandez-React-Project-CoderHouse
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter FireBase variables in `.env`
   ```js
    VITE_API_PRODUCTS_URL=https://fakestoreapi.com/products
    VITE_FIREBASE_APIKEY= "AIzaSyA7koI6f8C-wgETV7micMe7EYvqXX8cWd8"
    VITE_FIREBASE_AUTHDOMAIN= "coderhouse-reactjs-project.firebaseapp.com"
    VITE_FIREBASE_PROJECTID= "coderhouse-reactjs-project"
    VITE_FIREBASE_STORAGEBUCKET= "coderhouse-reactjs-project.appspot.com"
    VITE_FIREBASE_MESSAGINSENDERID= "429258425471"
    VITE_FIREBASE_APPID= "1:429258425471:web:29246d602d86b71d73eb4a"
   ```
5. Now you can go to the console prompt and execute the command
   ```cmd
    npm run dev
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

1. You will see all products at the first instance, you will be able to see the product details and also you can add the product to the shopping cart, but you won't be able to complete the purchase until you register into out website.

<div align="center">
    <img src="./public/img/screenshot-usage1.png" alt="Logo">
</div>

2. To register, you have to click on Sign In button at top-right of the site.

<div align="center">
    <img src="./public/img/screenshot-usage-signIn.png" alt="Logo">
</div>

3. It will be a modal with the SignIn form, you will need to click on `Do not have an account? Sign Up` link

<div align="center">
    <img src="./public/img/screenshot-usageSignIn-Modal.png" alt="Logo">
</div>

3. It will be a modal with the SignUp form.

<div align="center">
    <img src="./public/img/screenshot-usage-SignUp-Modal.png" alt="Logo">
</div>

4. After those both (Sign In or Sign Up) you will be redirect to the user informacion.

<div align="center">
    <img src="./public/img/Screenshot-usage-user-Info.png" alt="Logo">
</div>

4. Here you will be able to change any user info or change the foto.

<div align="center">
    <img src="./public/img/screenshot-usage-change-picture.png" alt="Logo">
    <img src="./public/img/screenshot-usage-updateUser.png" alt="Logo">
</div>

5. From here now you can add products to the cart and buy as you wish.

<div align="center">
    <img src="./public/img/screenshot-usage-ProductDetail.png" alt="Logo">
    <img src="./public/img/screenshot-usage-CartUpdated-status.png" alt="Logo">
    <img src="./public/img/screenshot-usage-cartInventory.png" alt="Logo">
</div>

6. Once you have all the desired products in the cart, you can click on `Buy Now` button, you will be redirect to your purchase summary.

<div align="center">
    <img src="./public/img/screenshot-usage-purchaseSumary2.png" alt="Logo">
</div>


7. Finally, if you have purchased some other products from our site, you will be able to see your Order History

<div align="center">
    <img src="./public/img/screenshot-usage-Order-History.png" alt="Logo">
    <img src="./public/img/screenshot-usage-Order-HistorySummary.png" alt="Logo">
</div>

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [x] Auth
- [x] List Product
- [x] Add Product to Cart
- [x] CRUD functionality
- [x] FireBase functionality and resources
    - [x] Read
    - [x] Write


<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

Jake Fernandez Brizuela - [Jake Fernandez Brizuela](https://www.linkedin.com/in/jake-fernandez-brizuela-73572222a/) - jake.fernandezbrizuela@outlook.com

Project Link: [https://github.com/jakefernandez102/CoderHouse-React-Vite-Project](https://github.com/jakefernandez102/CoderHouse-React-Vite-Project)

Portfolio: [https://portfoliojakefernandez.netlify.app](https://portfoliojakefernandez.netlify.app)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [GitHub Emoji Cheat Sheet](https://www.webpagefx.com/tools/emoji-cheat-sheet)
* [Img Shields](https://shields.io)
* [GitHub Pages](https://pages.github.com)
* [HeroIcons](https://heroicons.com)
* [React Icons](https://react-icons.github.io/react-icons/search)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[github-shield]: https://img.shields.io/badge/-GitHub-black.svg?style=for-the-badge&logo=github&colorB=555
[linkedin-url]: https://www.linkedin.com/in/jake-fernandez-brizuela-73572222a/
[github-url]: https://github.com/jakefernandez102
[product-screenshot]: ./public/img/Screenshot-site.png
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Bootstrap.com]: https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[Tailwind.com]: https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com
[Firebase]: https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase
[Firebase-url]: https://console.firebase.google.com/
