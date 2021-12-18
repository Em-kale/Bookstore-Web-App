--registering new user
--registering employee
insert into users values (<username>, <name>,  <password>, TRUE)
--registering non-employee
insert into users values (<username>, <name>, <password>, FALSE)

-- getting user data to verify login
select username, pass, is_employee
from users
where username = <username>;

--search by title
select *
from books,
where book_name = <bookname>;

--search by genre
select *
from books
where genre = <genre>;

--search by author
select *
from books
where author = <author>;

--search by publisher
select *
from books
where publisher_name = <publisher_name>;

--add to basket
insert into basket_item values (<username>, <isbn>);

-- -- --get cart items
select * from book 
inner join basket_item
on book.isbn = basket_item.isbn
where username = <username>;

--get max order number to increment following one
select max(cast(order_num as int)) from orders;

--add new order
insert into orders values(<orderNum>, <username>, <billing_address>, <shipping_address>, <current_location>, <amount>);

--add order_book realtionship
insert into order_book values (<orderNum>, <isbn>);

--get a user's orders
select * from orders where username = <username>;

--get book associated with order and order together
select * 
from book
inner join order_book 
on book.isbn = order_book.isbn 
full join orders
on orders.order_num = order_book.order_num 
where order_book.order_num = <order_num>;

--get all books associated with an order
select *
from book 
inner join order_book 
on book.isbn = order_book.isbn
where order_book.order_num = <order_num>;

--get number of copies of a book
select num_of_copies
from book
where book_name = <book_name>;

--set number of copies for a book
update book
set num_of_copies = <numOfCopies>
where book_name = <book_name>;

--add book to database
insert into book values (<isbn>,<publisher_name>,<book_name>,<author>,<genre>, <num_of_pages>, <percent_take>, <price>, <num_of_copies>)

--get expense/revenue report information
--gets either all orders with positive maounts 
--or all orders with negative amounts, dependent on type
    --expense
select * 
from orders 
where cast(amount as int) < 0

    --revenue
select * 
from orders 
where cast(amount as int) > 0
