-- -- -- -- --registering new user
-- -- -- -- --registering employee
-- insert into users values ('username', 'name', 'password', TRUE)
-- -- -- -- -- --registering non-employee
-- insert into users values ("username", "name", "password", FALSE)

-- -- -- -- -- getting user data to verify login
-- select username, pass, is_employee
-- from users
-- where username = <username>;

-- -- -- -- --search by title
-- select *
-- from books,
-- where book_name = <bookname>

-- -- -- -- --search by genre
-- select *
-- from books
-- where genre = <genre>

-- -- -- --search by author
-- select *
-- from books
-- where author = <author>

-- --  --add to basket
-- insert into basket_item values ('<uer>', '<isbn>')

-- -- --get cart items
-- select * from book 
-- inner join basket_item
-- on book.isbn = basket_item.isbn
-- where username = 'testingcustomer';

-- -- --get max order number to increment following one
-- select max(order_num) from orders

-- -- --add new order
-- insert into orders values(<orderNum>, <username>, <billing_address>, <shipping_address>, <current_location>, <amount>);

-- -- --add order_book realtionship
-- insert into order_book values (<orderNum>, <isbn>)

-- --get a user's orders
-- select * from orders where username = <username>

-- --get book associated with order and order together
-- select * 
-- from book
-- inner join order_book 
-- on book.isbn = order_book.isbn 
-- full join orders
-- on orders.order_num = order_book.order_num 
-- where order_book.order_num = <order_num>;

select * from orders 