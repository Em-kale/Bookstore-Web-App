-- -- --registering new user
-- -- --registering employee
-- insert into users values ('username', 'name', 'password', TRUE)
-- -- -- --registering non-employee
-- insert into users values ("username", "name", "password", FALSE)

-- -- -- getting user data to verify login
-- select username, pass, is_employee
-- from users
-- where username = <username>;

-- -- --search by title
-- select *
-- from books,
-- where book_name = <bookname>

-- -- --search by genre
-- select *
-- from books
-- where genre = <genre>

-- --search by author
-- select *
-- from books
-- where author = <author>

 --add to basket
--insert into basket_item values ('<uer>', '<isbn>')

--get cart items
select * from book 
inner join basket_item
on book.isbn = basket_item.isbn
where username = 'testingcustomer';

--select * from book