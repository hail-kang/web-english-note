drop table if exists post;
drop table if exists user;

create table user(
    userid int not null auto_increment,
    username varchar(30) not null,
    primary key(userid),
    unique key(username)
);

create table post(
    postid int not null auto_increment,
    title varchar(30) not null,
    userid int not null,
    videolink varchar(3000),
    korean text(65535),
    english text(65535),
    memo text(65535),
    primary key(postid),
    foreign key(userid) references user(userid)
);