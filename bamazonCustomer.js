
//var Table = require('cli-table');
var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");
//attempted to hide the password, just removed it 
//var hiddenpassword = process.env.Database_PW;

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  database: "bamazon",
  password: ""
});


connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
  }
  show_tabel();
});

function show_tabel() {
  
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // tried using npm cli-table, didn't work so well here had to look for another npm package
    // var table = new Table({
    //   head: ['product_name', 'department_name', 'price', 'stock_quantity'],
    //   colWidths: [100,100]
    // });
    // table.push(JSON.stringify(res))yy;
    console.table(res);
    // console.log(table.toString(res));
    // Then prompt the customer for their choice of product, pass all the products to promptCustomerForItem
    whatitemtobuy(res);
  });
}

// Prompt the customer for a product ID
function whatitemtobuy(products) {
  // Prompts user for what they would like to purchase
  inquirer
    .prompt([
      {
        type: "input",
        name: "choice",
        message: "What is the ID of the item you would you like to purchase? "
        }
    ])
    .then(function(val) {
    
      var item = parseInt(val.choice);
      var product = dowehaveenough(item, products);

    
      if (product) {
        // Pass the chosen product to promptCustomerForQuantity
        howmany(product);
      }
      else {
        // Otherwise let them know the item is not in the inventory, re-run loadProducts
        console.log("\nSorry we don't carry that item.\n");
        show_tabel();
      }
    });
}

// Prompt the customer for a product quantity
function howmany(product) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "quantity",
        message: "How many" + " "+ product.product_name+ "'s " + "would you like?"
      }
    ])
    .then(function(val) {
      // Check if the user wants to quit the program
      var quantity = parseInt(val.quantity);

      // If there isn't enough of the chosen product and quantity, let the user know and re-run loadProducts
      if (quantity > product.stock_quantity) {
        console.log("\nSorry we don't have that many.\n");
        show_tabel();
      }
      else {
        // Otherwise run makePurchase, give it the product information and desired quantity to purchase
       buysomething(product, quantity);
      }
    });
}

// Purchase the desired quanity of the desired item
function buysomething(product, quantity) {
  connection.query(
    "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
    [quantity, product.item_id],
    function(err, res) {
      // Let the user know the purchase was successful, re-run loadProducts
      console.log("\nYou purchased " + quantity + " " + product.product_name + "'s for $" + quantity * product.price + ".\n");
      show_tabel();
    }
  );
}

// Check to see if the product the user chose exists in the inventory
function dowehaveenough(item, products) {
  for (var i = 0; i < products.length; i++) {
    if (products[i].item_id === item) {
      // If a matching product is found, return the product
      return products[i];
    }  
  }return null;
 
}

