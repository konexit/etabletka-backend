toc.dat                                                                                             0000600 0004000 0002000 00000006706 14626310121 0014444 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        PGDMP   )    6                |           eTab    16.3 (Debian 16.3-1.pgdg120+1)    16.1     V           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false         W           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false         X           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false         Y           1262    16384    eTab    DATABASE     q   CREATE DATABASE "eTab" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';
    DROP DATABASE "eTab";
                test    false         �            1259    16501    banners    TABLE     ,  CREATE TABLE public.banners (
    id integer NOT NULL,
    name character varying(125) NOT NULL,
    slug character varying(125) NOT NULL,
    btn_pos character varying(125) NOT NULL,
    show_title boolean DEFAULT false NOT NULL,
    cdn_data json,
    url character varying(125),
    publish_start timestamp without time zone,
    publish_end timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    published boolean DEFAULT false NOT NULL
);
    DROP TABLE public.banners;
       public         heap    test    false         �            1259    16500    banners_id_seq    SEQUENCE     �   CREATE SEQUENCE public.banners_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.banners_id_seq;
       public          test    false    230         Z           0    0    banners_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.banners_id_seq OWNED BY public.banners.id;
          public          test    false    229         �           2604    16504 
   banners id    DEFAULT     h   ALTER TABLE ONLY public.banners ALTER COLUMN id SET DEFAULT nextval('public.banners_id_seq'::regclass);
 9   ALTER TABLE public.banners ALTER COLUMN id DROP DEFAULT;
       public          test    false    229    230    230         S          0    16501    banners 
   TABLE DATA           �   COPY public.banners (id, name, slug, btn_pos, show_title, cdn_data, url, publish_start, publish_end, created_at, updated_at, published) FROM stdin;
    public          test    false    230       3411.dat [           0    0    banners_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.banners_id_seq', 7, true);
          public          test    false    229         �           2606    16511 &   banners PK_e9b186b959296fcb940790d31c3 
   CONSTRAINT     f   ALTER TABLE ONLY public.banners
    ADD CONSTRAINT "PK_e9b186b959296fcb940790d31c3" PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.banners DROP CONSTRAINT "PK_e9b186b959296fcb940790d31c3";
       public            test    false    230         �           2606    16513 &   banners UQ_f6c61dac2ffb69440ddb067deed 
   CONSTRAINT     c   ALTER TABLE ONLY public.banners
    ADD CONSTRAINT "UQ_f6c61dac2ffb69440ddb067deed" UNIQUE (slug);
 R   ALTER TABLE ONLY public.banners DROP CONSTRAINT "UQ_f6c61dac2ffb69440ddb067deed";
       public            test    false    230                                                                  3411.dat                                                                                            0000600 0004000 0002000 00000007030 14626310121 0014236 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	call-center	call-center	d-none	f	{"url": "https://cdn.konex.com.ua/file/etabletka/banners/321/960x550-со.jpg", "path": "/banners/321", "filename": "960x550-со.jpg", "thumbnail": "https://cdn.konex.com.ua/file/etabletka/banners/321/960x550-со_1696314886.jpg", "thumbnail_path": "/banners/321", "thumbnail_filename": "960x550-со_1696314886.jpg"}	call-center	\N	\N	2023-10-03 09:34:45	2024-03-28 20:13:24	t
2	Повернись живим	povernis-zivim	center-bottom	f	{"url": "https://cdn.konex.com.ua/file/etabletka/banners/323/return-alive.jpg", "path": "/banners/323", "filename": "return-alive.jpg", "thumbnail": "https://cdn.konex.com.ua/file/etabletka/banners/323/return-alive_1696315023.jpg", "thumbnail_path": "/banners/323", "thumbnail_filename": "return-alive_1696315023.jpg"}	https://payment-page.solidgate.com/charity/Come%20Back%20Alive/dZNqJgD?traffic_source=konex	\N	\N	2023-10-03 09:37:02	2024-03-28 20:13:28	t
3	Доставка ліків	dostavka-likiv	d-none	f	{"url": "https://cdn.konex.com.ua/file/etabletka/banners/341/delivery-2023.jpg", "path": "/banners/341", "filename": "delivery-2023.jpg", "thumbnail": "https://cdn.konex.com.ua/file/etabletka/banners/341/delivery-2023_1699541409.jpg", "thumbnail_path": "banners/341", "thumbnail_filename": "delivery-2023_1699541409.jpg"}	/	\N	\N	2023-11-09 16:50:09	2023-11-09 16:50:37	t
4	До -35% на дитячі підгузки Libero	do-35-na-ditiaci-pidguzki-libero	center-bottom	f	{"url": "https://cdn.konex.com.ua/file/etabletka/banners/401/libero 960x550.jpg", "path": "/banners/401", "filename": "libero 960x550.jpg", "thumbnail": "https://cdn.konex.com.ua/file/etabletka/banners/401/libero 960x550_1714552798.jpg", "thumbnail_path": "/banners/401", "thumbnail_filename": "libero 960x550_1714552798.jpg"}	https://etabletka.ua/catalog/discount/sale-2	2024-05-01 12:00:00	2024-05-31 23:00:00	2024-05-01 11:39:57	2024-05-01 11:41:33	t
5	-25% на косметику Bioderma	25-na-kosmetiku-bioderma	center-bottom	f	{"url": "https://cdn.konex.com.ua/file/etabletka/banners/405/bioderma 960х550.jpg", "path": "/banners/405", "filename": "bioderma 960х550.jpg", "thumbnail": "https://cdn.konex.com.ua/file/etabletka/banners/405/bioderma 960х550_1715340877.jpg", "thumbnail_path": "/banners/405", "thumbnail_filename": "bioderma 960х550_1715340877.jpg"}	https://etabletka.ua/catalog/discount/sale-cosmetics	2024-05-10 12:00:00	2024-05-23 23:00:00	2024-05-10 14:34:36	2024-05-23 23:00:01	t
6	-20% на сонцезахист від SVR та Uriage	20-na-soncezaxist-vid-svr-ta-uriage	center-bottom	f	{"url": "https://cdn.konex.com.ua/file/etabletka/banners/407/svr, uriage 960х550.jpg", "path": "/banners/407", "filename": "svr, uriage 960х550.jpg", "thumbnail": "https://cdn.konex.com.ua/file/etabletka/banners/407/svr, uriage 960х550_1715340994.jpg", "thumbnail_path": "/banners/407", "thumbnail_filename": "svr, uriage 960х550_1715340994.jpg"}	https://etabletka.ua/catalog/discount/sale-cosmetics	2024-05-10 12:00:00	2024-05-15 23:00:00	2024-05-10 14:36:33	2024-05-15 23:00:01	t
7	Знижки -20% на Lactacyd	znizki-20-na-lactacyd	center-bottom	f	{"url": "https://cdn.konex.com.ua/file/etabletka/banners/403/lactacyd 960х550.jpg","path": "/banners/403","filename": "lactacyd 960х550.jpg","thumbnail": "https://cdn.konex.com.ua/file/etabletka/banners/403/lactacyd 960х550_1714553105.jpg","thumbnail_path": "/banners/403","thumbnail_filename": "lactacyd 960х550_1714553105.jpg"}	https://etabletka.ua/catalog/discount/sale-1	2024-05-01 12:00:00	2024-05-31 23:00:00	2024-05-01 11:45:04	2024-05-01 11:45:35	t
\.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        restore.sql                                                                                         0000600 0004000 0002000 00000006727 14626310121 0015374 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        --
-- NOTE:
--
-- File paths need to be edited. Search for $$PATH$$ and
-- replace it with the path to the directory containing
-- the extracted data files.
--
--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (Debian 16.3-1.pgdg120+1)
-- Dumped by pg_dump version 16.1

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

DROP DATABASE "eTab";
--
-- Name: eTab; Type: DATABASE; Schema: -; Owner: test
--

CREATE DATABASE "eTab" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE "eTab" OWNER TO test;

\connect "eTab"

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
-- Name: banners; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE public.banners (
    id integer NOT NULL,
    name character varying(125) NOT NULL,
    slug character varying(125) NOT NULL,
    btn_pos character varying(125) NOT NULL,
    show_title boolean DEFAULT false NOT NULL,
    cdn_data json,
    url character varying(125),
    publish_start timestamp without time zone,
    publish_end timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    published boolean DEFAULT false NOT NULL
);


ALTER TABLE public.banners OWNER TO test;

--
-- Name: banners_id_seq; Type: SEQUENCE; Schema: public; Owner: test
--

CREATE SEQUENCE public.banners_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.banners_id_seq OWNER TO test;

--
-- Name: banners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test
--

ALTER SEQUENCE public.banners_id_seq OWNED BY public.banners.id;


--
-- Name: banners id; Type: DEFAULT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.banners ALTER COLUMN id SET DEFAULT nextval('public.banners_id_seq'::regclass);


--
-- Data for Name: banners; Type: TABLE DATA; Schema: public; Owner: test
--

COPY public.banners (id, name, slug, btn_pos, show_title, cdn_data, url, publish_start, publish_end, created_at, updated_at, published) FROM stdin;
\.
COPY public.banners (id, name, slug, btn_pos, show_title, cdn_data, url, publish_start, publish_end, created_at, updated_at, published) FROM '$$PATH$$/3411.dat';

--
-- Name: banners_id_seq; Type: SEQUENCE SET; Schema: public; Owner: test
--

SELECT pg_catalog.setval('public.banners_id_seq', 7, true);


--
-- Name: banners PK_e9b186b959296fcb940790d31c3; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.banners
    ADD CONSTRAINT "PK_e9b186b959296fcb940790d31c3" PRIMARY KEY (id);


--
-- Name: banners UQ_f6c61dac2ffb69440ddb067deed; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.banners
    ADD CONSTRAINT "UQ_f6c61dac2ffb69440ddb067deed" UNIQUE (slug);


--
-- PostgreSQL database dump complete
--

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         