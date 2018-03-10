var db = require('./config/config.js');
var products = require('./models/products.js');

function show_tabel() {
  db.connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.table(res);
   wanttopurchase(res);
  });
}

function wanttopurchase(inventory) {
  db.inquirer
    .prompt([
      {
        type: "input",
        name: "choice",
        message: "What is the ID of the item you would you like to purchase?"
      }
    ])
    .then(function(val) {
      var choiceId = parseInt(val.choice);
      var product = checkInventory(choiceId, inventory);

      // If there is a product with the id the user chose, prompt the customer for a desired quantity
      if (product) {
        // Pass the chosen product to promptCustomerForQuantity
        left(product);
      }
      else {
        // Otherwise let them know the item is not in the inventory, re-run loadProducts
        console.log("\nThat item is not in the inventory.");
        show_tabel ();
      }
    });
}

// Prompt the customer for a product quantity
function left(product) {
  db.inquirer
    .prompt([
      {
        type: "input",
        name: "quantity",
        message: "How many would you like?"
      }
    ])
    .then(function(val) {
  
      var quantity = parseInt(val.quantity);

      // If there isn't enough of the chosen product and quantity, let the user know and re-run loadProducts
      if (quantity > product.stock_quantity) {
        console.log("\nInsufficient quantity!");
        show_tabel();
      }
      else {
        // Otherwise run makePurchase, give it the product information and desired quantity to purchase
        makePurchase(product, quantity);
      }
    });
}

// Purchase the desired quanity of the desired item
function buysomething(product, quantity) {
  db.connection.query(
    "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
    [quantity, product.item_id],
    function(err, res) {
      // Let the user know the purchase was successful, re-run loadProducts
      console.log("\nSuccessfully purchased " + quantity + " " + product.product_name + "'s!");
      show_tabel();
    }
  );
}

// Check to see if the product the user chose exists in the inventory
function left(choiceId, inventory) {
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].item_id === choiceId) {
      // If a matching product is found, return the product
      return inventory[i];
    }
  }
  // Otherwise return null
  return null;
}


