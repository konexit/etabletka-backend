toc.dat                                                                                             0000600 0004000 0002000 00000006414 14650173020 0014442 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        PGDMP   '    '                |        	   etabletka    16.2    16.3     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false         �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false         �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false         �           1262    16394 	   etabletka    DATABASE     �   CREATE DATABASE etabletka WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LC_COLLATE = 'C' LC_CTYPE = 'C.UTF-8';
    DROP DATABASE etabletka;
                postgres    false         �            1259    396815    users    TABLE     �  CREATE TABLE public.users (
    id integer NOT NULL,
    phone character varying(15) NOT NULL,
    email character varying(50),
    password character varying(250) NOT NULL,
    first_name character varying(50),
    last_name character varying(50),
    is_active boolean DEFAULT false NOT NULL,
    code character varying(10),
    role_id integer DEFAULT 2 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.users;
       public         heap 	   etabletka    false         �            1259    396814    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public       	   etabletka    false    216         �           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public       	   etabletka    false    215                    2604    396818    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public       	   etabletka    false    215    216    216         �          0    396815    users 
   TABLE DATA                 public       	   etabletka    false    216       3755.dat �           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 3, true);
          public       	   etabletka    false    215                    2606    396824 $   users PK_a3ffb1c0c8416b9fc6f907b7433 
   CONSTRAINT     d   ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.users DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433";
       public         	   etabletka    false    216                    2606    396826 $   users UQ_a000cca60bcf04454e727699490 
   CONSTRAINT     b   ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE (phone);
 P   ALTER TABLE ONLY public.users DROP CONSTRAINT "UQ_a000cca60bcf04454e727699490";
       public         	   etabletka    false    216                                                                                                                                                                                                                                                            3755.dat                                                                                            0000600 0004000 0002000 00000002234 14650173020 0014254 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        INSERT INTO public.users (id, phone, email, password, first_name, last_name, is_active, code, role_id, created_at, updated_at) VALUES (3, '+380500000003', NULL, 'f6bc99026a6d78c58f5d373da782f27d6c24869da8e032626454e41adc2ec249e836784b0f10b1574b586ff2134d43e13cae867864960de44c4ffcb84013bd52', 'Blog', 'Super', false, '712905', 2, '2024-07-24 10:40:47.662194', '2024-07-24 10:40:47.662194');
INSERT INTO public.users (id, phone, email, password, first_name, last_name, is_active, code, role_id, created_at, updated_at) VALUES (1, '+380500000001', 'etabletka.ua@gmail.com', 'f6bc99026a6d78c58f5d373da782f27d6c24869da8e032626454e41adc2ec249e836784b0f10b1574b586ff2134d43e13cae867864960de44c4ffcb84013bd52', 'Admin', 'Adminich', true, NULL, 1, '2022-06-28 13:32:55', '2024-06-12 17:55:25');
INSERT INTO public.users (id, phone, email, password, first_name, last_name, is_active, code, role_id, created_at, updated_at) VALUES (2, '+380500000002', 'etabletka.ua@gmail.com', 'f6bc99026a6d78c58f5d373da782f27d6c24869da8e032626454e41adc2ec249e836784b0f10b1574b586ff2134d43e13cae867864960de44c4ffcb84013bd52', 'Lol', 'Admin', true, NULL, 1, '2022-06-28 13:32:55', '2024-05-29 10:47:43');


                                                                                                                                                                                                                                                                                                                                                                    restore.sql                                                                                         0000600 0004000 0002000 00000005573 14650173020 0015374 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        --
-- NOTE:
--
-- File paths need to be edited. Search for $$PATH$$ and
-- replace it with the path to the directory containing
-- the extracted data files.
--
--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE etabletka;
--
-- Name: etabletka; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE etabletka WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LC_COLLATE = 'C' LC_CTYPE = 'C.UTF-8';


\connect etabletka

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    phone character varying(15) NOT NULL,
    email character varying(50),
    password character varying(250) NOT NULL,
    first_name character varying(50),
    last_name character varying(50),
    is_active boolean DEFAULT false NOT NULL,
    code character varying(10),
    role_id integer DEFAULT 2 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

\i $$PATH$$/3755.dat

--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: users UQ_a000cca60bcf04454e727699490; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE (phone);


--
-- PostgreSQL database dump complete
--

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     