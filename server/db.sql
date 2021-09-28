CREATE DATABASE passmanager;

CREATE TABLE public.accounts
(
    username text NOT NULL,
    password text NOT NULL,
    id bigserial NOT NULL,
    email text NOT NULL,
    created_date text NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE public.data
(
    id bigserial NOT NULL,
    user_id bigserial NOT NULL,
    email text,
    password text,
    website text,
    notes text,
    folder text,
    created_date text NOT NULL,
    name text,
    CONSTRAINT fk_account FOREIGN KEY (user_id)
        REFERENCES public.accounts (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
);
