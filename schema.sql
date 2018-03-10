use bamazon;

create table products ( 
	item_id int auto_increment,
    product_name varchar(255),
    department_name varchar(255),
    price int,
    stock_quantity int,
    Primary Key (item_id)
)

