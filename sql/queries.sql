--registering new user
--registering employee
insert into users values ('username', 'name', 'password', TRUE)
-- --registering non-employee
insert into users values ("username", "name", "password", FALSE)

-- getting user data to verify login
select username, pass, is_employee
from users
where username = <username>;

--select * from users
