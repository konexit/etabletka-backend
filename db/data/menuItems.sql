toc.dat                                                                                             0000600 0004000 0002000 00000006607 14634252176 0014462 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        PGDMP   0    !                |        	   etabletka    16.2    16.3     )           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false         *           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false         +           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false         ,           1262    16394 	   etabletka    DATABASE     �   CREATE DATABASE etabletka WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LC_COLLATE = 'C' LC_CTYPE = 'C.UTF-8';
    DROP DATABASE etabletka;
                postgres    false         �            1259    365676 
   menu_items    TABLE     x  CREATE TABLE public.menu_items (
    id integer NOT NULL,
    menu_id integer NOT NULL,
    title json NOT NULL,
    slug character varying(200) NOT NULL,
    "position" integer DEFAULT 0 NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.menu_items;
       public         heap 	   etabletka    false         �            1259    365675    menu_items_id_seq    SEQUENCE     �   CREATE SEQUENCE public.menu_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.menu_items_id_seq;
       public       	   etabletka    false    242         -           0    0    menu_items_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.menu_items_id_seq OWNED BY public.menu_items.id;
          public       	   etabletka    false    241         �           2604    365679    menu_items id    DEFAULT     n   ALTER TABLE ONLY public.menu_items ALTER COLUMN id SET DEFAULT nextval('public.menu_items_id_seq'::regclass);
 <   ALTER TABLE public.menu_items ALTER COLUMN id DROP DEFAULT;
       public       	   etabletka    false    241    242    242         &          0    365676 
   menu_items 
   TABLE DATA           j   COPY public.menu_items (id, menu_id, title, slug, "position", active, created_at, updated_at) FROM stdin;
    public       	   etabletka    false    242       3878.dat .           0    0    menu_items_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.menu_items_id_seq', 1, false);
          public       	   etabletka    false    241         �           2606    365687 )   menu_items PK_57e6188f929e5dc6919168620c8 
   CONSTRAINT     i   ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT "PK_57e6188f929e5dc6919168620c8" PRIMARY KEY (id);
 U   ALTER TABLE ONLY public.menu_items DROP CONSTRAINT "PK_57e6188f929e5dc6919168620c8";
       public         	   etabletka    false    242         �           2606    365937 )   menu_items FK_ba71edc684a901b4bc9d9228f42    FK CONSTRAINT     �   ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT "FK_ba71edc684a901b4bc9d9228f42" FOREIGN KEY (menu_id) REFERENCES public.menus(id);
 U   ALTER TABLE ONLY public.menu_items DROP CONSTRAINT "FK_ba71edc684a901b4bc9d9228f42";
       public       	   etabletka    false    242                                                                                                                                 3878.dat                                                                                            0000600 0004000 0002000 00000003551 14634252176 0014301 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	1	{"ru": "Аптеки", "uk": "Аптеки"}	stores	0	t	2022-02-23 10:54:18	2022-02-23 10:54:18
7	1	{"ru": "Блог", "uk": "Блог"}	blog	3	t	2022-02-23 10:54:18	2022-08-24 13:31:51
63	9	{"uk": "Про компанію"}	about	0	t	2022-02-23 10:54:18	2022-02-23 10:54:18
65	9	{"uk": "Доставка та оплата"}	shipping-payment	1	t	2022-02-23 10:54:18	2022-02-23 10:54:18
71	9	{"uk": "Контакти"}	contacts	4	f	2022-02-23 10:54:18	2022-05-19 16:31:53
73	9	{"uk": "Відгуки про компанію"}	review-etabletka	5	f	2022-02-23 10:54:18	2022-05-19 16:31:55
75	9	{"uk": "Умови повернення"}	return	6	t	2022-02-23 10:54:18	2022-02-23 10:54:18
77	9	{"ru": null, "uk": "Популярні запитання та відповіді"}	faq	7	t	2022-02-23 10:54:18	2023-06-02 16:41:43
67	9	{"uk": "Наша команда"}	nasa-komanda	2	f	2022-02-23 10:54:18	2022-05-19 16:31:51
69	9	{"uk": "Медичні експерти"}	medicni-eksperti	3	f	2022-02-23 10:54:18	2022-05-19 16:31:50
79	9	{"uk": "Ліцензії"}	licenziyi	8	f	2022-02-23 10:54:18	2022-05-19 16:31:57
81	9	{"uk": "Соціальні програми"}	socialni-programi	9	f	2022-02-23 10:54:18	2022-05-19 16:31:58
83	9	{"uk": "Редакційна політика"}	redakciina-politika	10	f	2022-02-23 10:54:18	2022-05-19 16:31:59
85	9	{"uk": "Маркетингова політика"}	martektingova-politika	11	f	2022-02-23 10:54:18	2022-05-19 16:32:01
87	9	{"uk": "Правила публікації відгуків"}	pravila-publikaciyi-vidgukiv	12	f	2022-02-23 10:54:18	2022-02-23 10:54:18
3	1	{"ru": "Доставка и оплата", "uk": "Доставка та оплата"}	page/shipping-payment	1	t	2022-02-23 10:54:18	2022-02-23 10:54:18
5	1	{"ru": "О компании", "uk": "Про компанію"}	page/about	2	t	2022-02-23 10:54:18	2022-02-23 10:54:18
\.


                                                                                                                                                       restore.sql                                                                                         0000600 0004000 0002000 00000006556 14634252176 0015412 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        --
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
-- Name: menu_items; Type: TABLE; Schema: public; Owner: etabletka
--

CREATE TABLE public.menu_items (
    id integer NOT NULL,
    menu_id integer NOT NULL,
    title json NOT NULL,
    slug character varying(200) NOT NULL,
    "position" integer DEFAULT 0 NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.menu_items OWNER TO etabletka;

--
-- Name: menu_items_id_seq; Type: SEQUENCE; Schema: public; Owner: etabletka
--

CREATE SEQUENCE public.menu_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.menu_items_id_seq OWNER TO etabletka;

--
-- Name: menu_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: etabletka
--

ALTER SEQUENCE public.menu_items_id_seq OWNED BY public.menu_items.id;


--
-- Name: menu_items id; Type: DEFAULT; Schema: public; Owner: etabletka
--

ALTER TABLE ONLY public.menu_items ALTER COLUMN id SET DEFAULT nextval('public.menu_items_id_seq'::regclass);


--
-- Data for Name: menu_items; Type: TABLE DATA; Schema: public; Owner: etabletka
--

COPY public.menu_items (id, menu_id, title, slug, "position", active, created_at, updated_at) FROM stdin;
\.
COPY public.menu_items (id, menu_id, title, slug, "position", active, created_at, updated_at) FROM '$$PATH$$/3878.dat';

--
-- Name: menu_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: etabletka
--

SELECT pg_catalog.setval('public.menu_items_id_seq', 1, false);


--
-- Name: menu_items PK_57e6188f929e5dc6919168620c8; Type: CONSTRAINT; Schema: public; Owner: etabletka
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT "PK_57e6188f929e5dc6919168620c8" PRIMARY KEY (id);


--
-- Name: menu_items FK_ba71edc684a901b4bc9d9228f42; Type: FK CONSTRAINT; Schema: public; Owner: etabletka
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT "FK_ba71edc684a901b4bc9d9228f42" FOREIGN KEY (menu_id) REFERENCES public.menus(id);


--
-- PostgreSQL database dump complete
--

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  