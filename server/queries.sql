CREATE DATABASE "AccentureApp"
CREATE ROLE "accentureUser" WITH SUPERUSER CREATEDB CREATEROLE LOGIN ENCRYPTED PASSWORD '1234';

SELECT * FROM USER
DROP ROLE accentureUser

CREATE USER accentureUser WITH password '1234'



CREATE TABLE  IF NOT EXISTS public.user (
	fullname VARCHAR(50),
	email VARCHAR(50),
	password VARCHAR(50),
	PRIMARY KEY (email)
);

CREATE TABLE  IF NOT EXISTS public.event (
    id INT,
    name VARCHAR(50),
    duedate VARCHAR(50),
    description VARCHAR(250),
    PRIMARY KEY (id)
);

CREATE TABLE  IF NOT EXISTS public.lesson (
    id INT,
    title VARCHAR(50),
    description VARCHAR(250),
    PRIMARY KEY (id)
);

CREATE TABLE  IF NOT EXISTS public.eventranking (
	eventid INT REFERENCES public.event (id) ON DELETE CASCADE,
	item VARCHAR(250)
);