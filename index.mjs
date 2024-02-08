import fs from 'fs'
import getData from './crawler/getData.mjs';

const productsData = await getData()

// Check if productsData and if productsData.length not equal 0
if(productsData && productsData.length > 0){
  const productListObject = productsData.reduce((acc, item) => {
    acc[item.position] = item;
    return acc;
  }, {});
  
  // Convert Object to String
  const jsonContent = JSON.stringify(productListObject, null, 2);

  // Create JSON file
  fs.writeFile('productList.json', jsonContent, 'utf8', (err) => {
      if (err) {
          console.error('Something went wrong the list of  products:', err);
          return;
      }
      console.error('The file was successfully saved as productList.json');
  });
}

