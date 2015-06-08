
===============================================================================
                             CSE134B THE END USERS
                               COINFLIP - HW4
===============================================================================

CoinFlip
Coinflip is a web app that allows a user to manage their coin/bullion inventory. Users can track prices for a metal while adding to their own inventory. The aim of the web app is to assist in mitigating the asymmetrical information faced by bullion investors. The app helps users be aware of pricing information and possible resale opportunities.

CoinFlip can be viewed online at:  https://rawgit.com/GaretWebster/TheEndUsersCoinFlip/master/wire2.html

Functionality
The web is built to run on both desktop-size windows and mobile. This allows users to have easy access to the information on the app while on the go without having to navigate a desktop site on a mobile device. Users can login or create an account using their email, Facebook accounts, or Google accounts. Once logged on, they will have access to the current prices for Gold American Eagle, Silver Engelhard industrial bullion, and Platinum Engelhard fabricated products as well as the pricing for the past 20 days. They can navigate through the metals and see their inventory as well as the total value of their individual metals and total value of their inventory. When adding to their inventory, the user is presented with options of metal and the form it is in. They will be able to enter the unit price of the new item, the quantity, and premium to calculate the total value of the items being added. An image of the item(s) being added can also be added by upload from user. If a user sells an item they can delete it from their inventory. The app has account management options of changing email or password.

Navigation
All users start with index.html as the login/signup page if they are not logged in. Even if they navigate to another page they are sent back to the login/signup page. After logging in they are able to navigate to any of the other pages by using the nav bar in the top left corner (or by adding a new coin or logging out). Our navigation system uses the system of one page to one state, which is good. On the My Gold, My Silver or My Platinum page, the user has the option to add an item by clicking the “+” icon. The user can also view added items and click on them to see further details or update the item. At anytime, the user can click on the cog icon at the top right to update their email/password or to log out.

index.html - Login/signup page with demo. After logging out(top right corner), the user is sent back to this page)
wire2.html - Home page with Total Coin Value and graphs for all coins
wire3.html - My Gold page with details on owned gold coins
wire4.html - Gold Item page that looks at a specific gold coin
wire5.html - New Item page that is the mock-up for adding a new coin
wire6.html - My Silver page with details on owned gold coins
wire7.html - My Platinum page with details on owned gold coins


Responsive Design: The design switches to a mobile version if the screen’s width size drops below 1000px.


Technical Specifications
Backend Service - Firebase
We decided to use one of the tools the professor mentioned called Firebase. Firebase handles both our user management and persistence of our data, mainly a user’s stack of gold/silver/platinum. We implemented the user management part by following a tutorial on firebase and using oauth to authenticate a user. Mainly, we had to setup a new application on facebook and google to create an APP ID and SECRET ACCESS KEY so that any user who wishes to register with our application using facebook or google can do so. Logging out uses Firebase’s unauth() method. The CRUD operations were handles using Firebase's API methods, mainly push and update. When the user adds an item, the fields of the item is pushed to the database under the user’s key using Firebase’s push() method so that every added item will have a unique key. When the user updates an item, the fields of that item are updated in the database using Firebase’s update() method. In the My Gold, My Silver and My Platinum pages, the user’s gold, silver and platinum items are queried from the database and then a row containing brief info about the item is added to the table near the bottom of the pages. When the user clicks on an entry in the table, the item’s key from the database is appended to the URL of the item detail page so that the key can be used to retrieve all of the item’s fields from the database. When an item is deleted, the entry is removed from the database. The user can change their email or password. This is done by using Firebase’s changeEmail() and changePassword() methods. A feature that was later added is the function to upload an image when adding an item. An input field was added to the Add Item page where the user can browse for an image on their computer. When the user selects an image, the image’s data is hashed using SHA-256 to create a key for the entry in the database. Then the image’s data is added under the hashed key to a section of the database for images. The hashed key is also added as one of the item’s fields so that it can later be used to retrieve the image’s data.

Gold/Silver/Platinum Dataset - Quandl
We used Quandl to get real time data for the current prices of gold, silver, and platinum. Data for the graphs was taken from the Quandl databases for Gold American Eagle, Silver Engelhard industrial bullion, and Platinum Engelhard fabricated products. The prices of the past 30 days are displayed from these sources in a graph, however since Quandl does not provide prices on the weekend, out application is limited by Quandl’s database. This data is used to display the current bid price of the metals.

Analytics - Mixpanel
For analytics we used Mixpanel. We decided to use Mixpanel over Google Analytics for two reasons; first Google Analytics has a high potential to be biased because it is also the distribution platform for most online advertising; Second Google Analytics offers a “smorgasbord” of statistics, when we only wanted specific information about the site. The information we thought would be relevant was most managed metal type, login type, page views, total log-ins, registration information, all data of items being added in from collection. This would allow us to see what is most important aspects of our application, and focus on those features rather than working on something that is not used much. Low usability can also indicate to us that it may not be as intuitive in our application than we thought it was when we designed it.

Minification/compression - 
For compression we used htmlcompressor.com. Compression had really good results. Most files were 30-50% smaller than their original sizes. Since we used very few image assets minifying our HTML, CSS, and Javascript removed substantial amount of data from the website. Even so, over half of our website was composed of resources we have to import and fonts, so reducing those would be the best way to make the website smaller. The size of the website was so small to begin with that I don’t think compression had a significant effect on load times, but we will have to do more conclusive testing before we know for sure.

Obstacles 
After implementing authentication some of our members had trouble getting logged in to view changes to the app.
There is also a problem with logging in with Facebook/Google when viewing the app locally. This is due to a problem with how browsers handle file:// redirects. So we had to view the app online to get past authenticating with Facebook/Google.
We also had some problems with the graphs not appearing for some users. A light color version was not included as an option to the app as lighter colors were deemed to cause more stress on the eyes. If a user wants to resize the page on their desktop, they will end up with the mobile version of the app which some users might not want but this remained unchanged, see analytic results.
The graph representation on the home page displays the three metals together. Since silver is valued at a fraction of gold and platinum, the graph is not scaled very well but when users go to individual metal pages they are able to see a more proper graph.
Users can only view inventory for individual metals, unable to see entire inventory.

Analytics results
Our main goals with the analytics software was to find out what kind of users visit our site? Do they use it daily? Do they frequent the inventory feature? After answering some of these questions we decided to expand our statistics gathering and gathered the information below.


- Do users use our app daily?
Most users do not use our app daily. While a good portion of the people who visited the app had been previous visitors very few of them were daily users. This means it is probably not worth it for us to add a dedicated phone app, but we will keep gathering data to make sure.

- Many users never navigate away from homepage
There are a few reasons why this could be true:
1: Our homepage is so good that it provides all information that most users require (likely)
2: Users don’t understand the navigation system as it is topleft-down instead of topleft-right.
3: A high portion of our viewers are bots or crawlers that don’t visit the page
4: Some of our users don’t have cookies enabled, so they navigate directly to every page
5: Since a good portion of our users are repeat users they have no need to “explore” the site.

- Hardly any users use the platinum page
We may drop it as it is probably not worth the time and effort to include. Alternatively we might be able to change the last page to just contain the prices of a bunch of different metals or investment information our users might be interested in. It’s worth noting that not even one user(other than our testers) added a platinum item to the inventory.

- The inventory features were rarely used
We are not sure if the reason few use the inventory system is because it doesn’t have enough features or if it’s because it’s too hard to use, but we suspect the main reason is because users don’t need to keep an online inventory when they have a physical one. One way to improve usage of the inventory system might be to hook it to facebook, allowing users to share when they add or remove pieces along with other information about transactions. This would have to be an opt in rather than an opt out feature as buying and selling bullion tends to be a private transaction.

- A high percentage of users are mobile
This is good, because it means our reactive design was worth the time to make. We might want to test offline caching of the app (it really only needs to be updated once per day) to better allow users who are on the move to not have to find an internet connection or spend data. Since desktop users with small screens or resized windows also count as mobile users it may be inflating these statistics a bit.

Shortcomings
1: We do not accommodate a large enough database of different types of coins for users to use our application as their sole solution for keep track of their collection. This forces users to use our application to find out current prices but use a secondary application to log their purchases. However, this can be easily remedied by just adding more coin options.
2: Our application is a one size fits all type of application. One of the problems with that is that we alienate those who are colorblind, by not taking that into account when we chose our colors, and by not having an invert the colors button.
3. Since we are American, all our prices are using USD, which makes international users have to use some sort of secondary currency converter in order to get accurate prices on the coin they are trying to purchase, rather than having prices displayed in the currency of choice.

