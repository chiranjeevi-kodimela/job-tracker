create DATABASE if not exists job_tracker;

use job_tracker;

create table users (
    id int auto_increment primary key,
    name varchar(100) not null,
    email varchar(100) not null unique,
    password_hash varchar(255) not null,
    created_at timestamp default current_timestamp
);