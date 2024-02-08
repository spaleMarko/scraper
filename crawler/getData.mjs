import puppeteer from 'puppeteer';

const getData = async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto(
    'https://www.idealo.de/preisvergleich/OffersOfProduct/201846460_-aspirin-plus-c-forte-800-mg-480-mg-brausetabletten-bayer.html'
  );

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  // Get list with all products
  let productList;
  try {
    productList = await page.$('.productOffers-list');
  } catch (e) {
    productList = null;
  }

  const listOfProducts = [];

  // Check list of products
  if (productList) {
    const productItems = await productList.$$('li.productOffers-listItem');

    for (const productItem of productItems) {
      let response;
      try {
        // Get single product
        response = await productItem.$eval('a', (element) =>
          element.getAttribute('data-gtm-payload')
        );
      } catch (e) {
        response = null;
      }

      if (response) {
        // Parse product to get data
        const jsonResponse = JSON.parse(response);

        // Create needed element
        const price = +jsonResponse.product_price;
        const shopName = jsonResponse.shop_name;
        const position = +jsonResponse.position;

        // Create single object
        const productObject = {
          price,
          shop_name: shopName,
          position,
        };
        if (price && shopName && position) {
          // Add product to the list
          listOfProducts.push(productObject);
        } else {
          console.error('The product data is not valid');
        }
      } else {
        console.error(
          'The product not found check the selector for the product'
        );
      }
    }
  } else {
    console.error('The list not found check the selector for the list');
  }

  await browser.close();
  return listOfProducts;
};

export default getData;
