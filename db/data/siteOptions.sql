toc.dat                                                                                             0000600 0004000 0002000 00000007271 14634245042 0014452 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        PGDMP   $    1                |        	   etabletka    16.2    16.3     *           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false         +           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false         ,           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false         -           1262    16394 	   etabletka    DATABASE     �   CREATE DATABASE etabletka WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LC_COLLATE = 'C' LC_CTYPE = 'C.UTF-8';
    DROP DATABASE etabletka;
                postgres    false                    1259    365808    site_options    TABLE     l  CREATE TABLE public.site_options (
    id integer NOT NULL,
    key character varying(125) NOT NULL,
    title character varying(125) NOT NULL,
    value text,
    type character varying(125) NOT NULL,
    "primary" smallint NOT NULL,
    switchable smallint NOT NULL,
    active smallint DEFAULT '1'::smallint NOT NULL,
    editable smallint DEFAULT '1'::smallint NOT NULL,
    "position" integer NOT NULL,
    "group" character varying(125),
    group_title character varying(125),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);
     DROP TABLE public.site_options;
       public         heap 	   etabletka    false                    1259    365807    site_options_id_seq    SEQUENCE     �   CREATE SEQUENCE public.site_options_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.site_options_id_seq;
       public       	   etabletka    false    260         .           0    0    site_options_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.site_options_id_seq OWNED BY public.site_options.id;
          public       	   etabletka    false    259         �           2604    365811    site_options id    DEFAULT     r   ALTER TABLE ONLY public.site_options ALTER COLUMN id SET DEFAULT nextval('public.site_options_id_seq'::regclass);
 >   ALTER TABLE public.site_options ALTER COLUMN id DROP DEFAULT;
       public       	   etabletka    false    260    259    260         '          0    365808    site_options 
   TABLE DATA           �   COPY public.site_options (id, key, title, value, type, "primary", switchable, active, editable, "position", "group", group_title, created_at, updated_at) FROM stdin;
    public       	   etabletka    false    260       3879.dat /           0    0    site_options_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.site_options_id_seq', 1, false);
          public       	   etabletka    false    259         �           2606    365819 +   site_options PK_d274d6df319415c6e4b5ca76759 
   CONSTRAINT     k   ALTER TABLE ONLY public.site_options
    ADD CONSTRAINT "PK_d274d6df319415c6e4b5ca76759" PRIMARY KEY (id);
 W   ALTER TABLE ONLY public.site_options DROP CONSTRAINT "PK_d274d6df319415c6e4b5ca76759";
       public         	   etabletka    false    260         �           2606    365821 +   site_options UQ_979d2c76702fe3ca1dd782fd9ab 
   CONSTRAINT     g   ALTER TABLE ONLY public.site_options
    ADD CONSTRAINT "UQ_979d2c76702fe3ca1dd782fd9ab" UNIQUE (key);
 W   ALTER TABLE ONLY public.site_options DROP CONSTRAINT "UQ_979d2c76702fe3ca1dd782fd9ab";
       public         	   etabletka    false    260                                                                                                                                                                                                                                                                                                                                               3879.dat                                                                                            0000600 0004000 0002000 00000006204 14634245042 0014272 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	admin_email	Email адміна	support@etabletka.ua	string	1	0	1	1	0	common	Загальні налаштування	2022-02-22 20:15:50	2022-06-29 15:01:10
3	support_email	Email підтримки	support@etabletka.ua	string	1	0	1	1	1	common	\N	2022-02-22 20:15:50	2022-10-18 09:47:28
5	support_phone	Телефон підтримки	0 800 35 50 50	string	1	0	1	1	2	common	\N	2022-02-22 20:15:50	2022-02-22 20:15:50
9	stores_phone	Номер телефону аптек	0 800 35 50 50	string	1	0	1	1	4	common	\N	2022-02-22 20:15:50	2022-02-22 20:15:50
11	cashback	Кешбек (%)	2	integer	1	0	1	1	0	config	Налаштування сайту	2022-02-22 20:15:50	2022-02-22 20:15:50
13	sms_auth	SMS аутентифікація	1	boolean	1	0	1	1	1	config	\N	2022-02-22 20:15:50	2022-02-22 20:15:50
15	min_available	Поріг "Товар закінчується"	10	integer	1	0	1	1	2	config	\N	2022-02-22 20:15:50	2022-02-22 20:15:50
17	min_availability	Поріг "Дізнатись про наявність"	1	integer	1	0	1	1	3	config	\N	2022-02-22 20:15:50	2022-02-22 20:15:50
19	facebook_url	Facebook	https://www.facebook.com/etabletka.ua	string	1	1	1	1	0	social	Соціальні мережі	2022-02-22 20:15:50	2022-02-22 20:15:50
21	messenger_url	Messenger	\N	string	1	1	0	1	1	social	\N	2022-02-22 20:15:50	2022-04-12 09:58:24
23	twitter_url	Twitter	https://twitter.com/ETabletka	string	1	1	0	1	2	social	\N	2022-02-22 20:15:50	2022-06-02 14:55:32
25	youtube_url	Youtube	https://www.youtube.com/@etabletka_ua	string	1	1	1	1	3	social	\N	2022-02-22 20:15:50	2023-04-20 14:30:18
27	instagram_url	Инстаграме	https://www.instagram.com/etabletka_ua/	string	1	1	1	1	4	social	\N	2022-02-22 20:15:50	2022-02-22 20:15:50
29	tiktok_url	Tik Tok	https://www.tiktok.com/@etabletka	string	1	1	0	1	5	social	\N	2022-02-22 20:15:50	2023-10-11 08:59:54
31	pinterest_url	Pinterest	\N	string	1	1	0	1	6	social	\N	2022-02-22 20:15:50	2022-02-22 20:15:50
33	whatsapp_url	Whatsapp	\N	string	1	1	0	1	7	social	\N	2022-02-22 20:15:50	2022-02-22 20:15:50
35	telegram_url	Telegram	https://t.me/eTabletkaUA	string	1	1	1	1	8	social	\N	2022-02-22 20:15:50	2023-10-11 08:59:40
37	viber_url	Viber	https://invite.viber.com/?g2=AQA%2B1nZSp1rf3E2XdTTX1khwqVrRmP%2B9PBSNM%2BeeQSlc1nuVRd540wEEsWXwAAli	string	1	1	1	1	9	social	\N	2022-02-22 20:15:50	2023-10-11 08:59:40
39	linkedin_url	LinkedIn	https://www.linkedin.com/company/73227752/	string	1	1	1	1	10	social	\N	2022-02-22 20:15:50	2023-11-09 14:13:30
41	tumblr_url	Tumblr	\N	string	1	1	0	1	11	social	\N	2022-02-22 20:15:50	2022-02-22 20:15:50
43	header_banner_text	Текст	{"uk":"Знижка <span class=\\\\u0022red-1\\\\u0022>10%<\\\\/span> при замовленні <span class=\\\\u0022red-1\\\\u0022>від 400 грн<\\\\/span>","ru":null}	translatable	1	0	1	1	0	header-banner	Верхній банер	2022-02-22 20:15:50	2022-04-04 10:59:59
45	header_banner_url	Посилання	http://etabletka.test/	string	1	0	1	1	1	header-banner	\N	2022-02-22 20:15:50	2022-02-22 20:15:50
7	work_time	Графік роботи	{"uk":"з 8:00 до 20:00","'ru":"с 8:00 до 20:00"}	translatable	1	0	1	1	3	common	\N	2022-02-22 20:15:50	2022-04-12 09:54:16
\.


                                                                                                                                                                                                                                                                                                                                                                                            restore.sql                                                                                         0000600 0004000 0002000 00000007326 14634245042 0015400 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        --
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
-- Name: etabletka; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE etabletka WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LC_COLLATE = 'C' LC_CTYPE = 'C.UTF-8';


ALTER DATABASE etabletka OWNER TO postgres;

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: site_options; Type: TABLE; Schema: public; Owner: etabletka
--

CREATE TABLE public.site_options (
    id integer NOT NULL,
    key character varying(125) NOT NULL,
    title character varying(125) NOT NULL,
    value text,
    type character varying(125) NOT NULL,
    "primary" smallint NOT NULL,
    switchable smallint NOT NULL,
    active smallint DEFAULT '1'::smallint NOT NULL,
    editable smallint DEFAULT '1'::smallint NOT NULL,
    "position" integer NOT NULL,
    "group" character varying(125),
    group_title character varying(125),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.site_options OWNER TO etabletka;

--
-- Name: site_options_id_seq; Type: SEQUENCE; Schema: public; Owner: etabletka
--

CREATE SEQUENCE public.site_options_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.site_options_id_seq OWNER TO etabletka;

--
-- Name: site_options_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: etabletka
--

ALTER SEQUENCE public.site_options_id_seq OWNED BY public.site_options.id;


--
-- Name: site_options id; Type: DEFAULT; Schema: public; Owner: etabletka
--

ALTER TABLE ONLY public.site_options ALTER COLUMN id SET DEFAULT nextval('public.site_options_id_seq'::regclass);


--
-- Data for Name: site_options; Type: TABLE DATA; Schema: public; Owner: etabletka
--

COPY public.site_options (id, key, title, value, type, "primary", switchable, active, editable, "position", "group", group_title, created_at, updated_at) FROM stdin;
\.
COPY public.site_options (id, key, title, value, type, "primary", switchable, active, editable, "position", "group", group_title, created_at, updated_at) FROM '$$PATH$$/3879.dat';

--
-- Name: site_options_id_seq; Type: SEQUENCE SET; Schema: public; Owner: etabletka
--

SELECT pg_catalog.setval('public.site_options_id_seq', 1, false);


--
-- Name: site_options PK_d274d6df319415c6e4b5ca76759; Type: CONSTRAINT; Schema: public; Owner: etabletka
--

ALTER TABLE ONLY public.site_options
    ADD CONSTRAINT "PK_d274d6df319415c6e4b5ca76759" PRIMARY KEY (id);


--
-- Name: site_options UQ_979d2c76702fe3ca1dd782fd9ab; Type: CONSTRAINT; Schema: public; Owner: etabletka
--

ALTER TABLE ONLY public.site_options
    ADD CONSTRAINT "UQ_979d2c76702fe3ca1dd782fd9ab" UNIQUE (key);


--
-- PostgreSQL database dump complete
--

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          