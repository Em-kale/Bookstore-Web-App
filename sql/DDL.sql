create table publisher
(
    publisher_name varchar(50),
    addr    varchar(100),
    email   varchar(40),
    phone_number    varchar(13),
    banking_account varchar(12),
    primary key (publisher_name)
); 

create table book
(
    ISBN   varchar(13),
    publisher_name  varchar(50),
    book_name   varchar(120),
    author  varchar(120),
    genre   varchar(40),
    num_of_pages    varchar(10),
    percent_take    varchar(5),
    price   varchar(7),
    primary key (ISBN),
    foreign key (publisher_name) references publisher on delete cascade
);

create table user
(
    username    varchar(30),
    pass    varchar(30),
    is_employee boolean, 
    primary key (username)
);

create table basket_item
(
    username    varchar(30).
    ISBN   varchar(13),
    primary key (username, ISBN),
    foreign key (username) references user on delete cascade,
    foreign key (ISBN) references book on delete set null 
);


create table order
(
    order_num   varchar(10),
    username    varchar(30),
    billing_address varchar(100),
    shipping_address    varchar(100),
    current_location    varchar(100),
    amount  varchar(8),
    primary key (order_num),
    foreign key (username) references user on delete cascade 
);

create table order_book
(
    order_num   varchar(10),
    ISBN    varchar(13),
    primary key (order_num, ISBN),
    foreign key (order_num) references order on delete cascade,
    foreign key (ISBN) references book on delete cascade
);



