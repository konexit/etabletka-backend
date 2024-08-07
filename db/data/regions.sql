toc.dat                                                                                             0000600 0004000 0002000 00000006360 14626314732 0014454 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        PGDMP       #                |           eTab    16.3 (Debian 16.3-1.pgdg120+1)    16.1     \           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false         ]           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false         ^           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false         _           1262    16384    eTab    DATABASE     q   CREATE DATABASE "eTab" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';
    DROP DATABASE "eTab";
                test    false         �            1259    16642    regions    TABLE     ~  CREATE TABLE public.regions (
    id integer NOT NULL,
    lat character varying,
    lng character varying,
    country_id integer NOT NULL,
    name json NOT NULL,
    slug character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    short_name character varying NOT NULL
);
    DROP TABLE public.regions;
       public         heap    test    false         �            1259    16641    regions_id_seq    SEQUENCE     �   CREATE SEQUENCE public.regions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.regions_id_seq;
       public          test    false    246         `           0    0    regions_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.regions_id_seq OWNED BY public.regions.id;
          public          test    false    245         �           2604    16645 
   regions id    DEFAULT     h   ALTER TABLE ONLY public.regions ALTER COLUMN id SET DEFAULT nextval('public.regions_id_seq'::regclass);
 9   ALTER TABLE public.regions ALTER COLUMN id DROP DEFAULT;
       public          test    false    246    245    246         Y          0    16642    regions 
   TABLE DATA           k   COPY public.regions (id, lat, lng, country_id, name, slug, created_at, updated_at, short_name) FROM stdin;
    public          test    false    246       3417.dat a           0    0    regions_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.regions_id_seq', 1, false);
          public          test    false    245         �           2606    16651 &   regions PK_4fcd12ed6a046276e2deb08801c 
   CONSTRAINT     f   ALTER TABLE ONLY public.regions
    ADD CONSTRAINT "PK_4fcd12ed6a046276e2deb08801c" PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.regions DROP CONSTRAINT "PK_4fcd12ed6a046276e2deb08801c";
       public            test    false    246         �           2606    16653 &   regions UQ_53cf784f23cbf14bb7717e969d4 
   CONSTRAINT     c   ALTER TABLE ONLY public.regions
    ADD CONSTRAINT "UQ_53cf784f23cbf14bb7717e969d4" UNIQUE (slug);
 R   ALTER TABLE ONLY public.regions DROP CONSTRAINT "UQ_53cf784f23cbf14bb7717e969d4";
       public            test    false    246                                                                                                                                                                                                                                                                                        3417.dat                                                                                            0000600 0004000 0002000 00000011563 14626314732 0014266 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	45.34274400	34.05744400	1	{"uk": "Автономна Республіка Крим область"}	avtonomna-respublika-krim-oblast	2022-02-23 15:49:54	2022-02-23 15:49:54	Автономна Республіка Крим
2	49.2176	28.49304	1	{"ru": "Винницкая область", "uk": "Вінницька область"}	vinnicka-oblast	2022-02-23 15:49:54	2024-04-16 11:19:06	Вінницька
3	50.74720000	25.32540000	1	{"ru": "Волынская область", "uk": "Волинська область"}	volinska-oblast	2022-02-23 15:49:54	2022-02-23 16:01:55	Волинська
4	48.45000100	34.98333400	1	{"uk": "Дніпропетровська область"}	dnipropetrovska-oblast	2022-02-23 15:49:54	2022-02-23 15:49:54	Дніпропетровська
5	48.01590000	37.80280000	1	{"ru": "Донецкая область", "uk": "Донецька область"}	donecka-oblast	2022-02-23 15:49:54	2022-02-23 16:01:57	Донецька
6	50.26000000	28.66000000	1	{"ru": "Житомирская область", "uk": "Житомирська область"}	zitomirska-oblast	2022-02-23 15:49:54	2022-02-23 16:02:04	Житомирська
7	48.03330000	24.18330000	1	{"ru": "Закарпатская область", "uk": "Закарпатська область"}	zakarpatska-oblast	2022-02-23 15:49:54	2022-02-23 16:02:05	Закарпатська
8	47.85830000	35.17890000	1	{"ru": "Запорожская область", "uk": "Запорізька область"}	zaporizka-oblast	2022-02-23 15:49:54	2022-02-23 16:02:05	Запорізька
9	48.92000000	24.70000000	1	{"ru": "Ивано-Франковская область", "uk": "Івано-Франківська область"}	ivano-frankivska-oblast	2022-02-23 15:49:54	2022-02-23 16:02:18	Івано-Франківська
10	50.40152	30.52002	1	{"ru": "Киевская область", "uk": "Київська область"}	kiyivska-oblast	2022-02-23 15:49:54	2024-04-16 10:42:04	Київська
11	48.51297	32.24762	1	{"ru": "Кировоградская область", "uk": "Кіровоградська область"}	kirovogradska-oblast	2022-02-23 15:49:54	2024-04-16 10:41:36	Кіровоградська
12	48.34000000	39.30000000	1	{"ru": "Луганская область", "uk": "Луганська область"}	luganska-oblast	2022-02-23 15:49:54	2022-02-23 16:02:40	Луганська
13	49.84220000	24.02850000	1	{"ru": "Львовская область", "uk": "Львівська область"}	lvivska-oblast	2022-02-23 15:49:54	2022-02-23 16:02:43	Львівська
14	47.51670000	31.96670000	1	{"ru": "Николаевская область", "uk": "Миколаївська область"}	mikolayivska-oblast	2022-02-23 15:49:54	2022-02-23 16:02:46	Миколаївська
15	46.47759	30.70129	1	{"ru": "Одесская область", "uk": "Одеська область"}	odeska-oblast	2022-02-23 15:49:54	2024-04-16 10:41:02	Одеська
16	49.36000000	34.35000000	1	{"ru": "Полтавская область", "uk": "Полтавська область"}	poltavska-oblast	2022-02-23 15:49:54	2022-02-23 16:02:48	Полтавська
17	50.54834	26.25732	1	{"ru": "Ровенская область", "uk": "Рівненська область"}	rivnenska-oblast	2022-02-23 15:49:54	2024-04-16 10:42:39	Рівненська
18	51.13000000	34.08000000	1	{"ru": "Сумская область", "uk": "Сумська область"}	sumska-oblast	2022-02-23 15:49:54	2022-02-23 16:02:52	Сумська
19	49.49667	25.60913	1	{"ru": "Тернопольская область", "uk": "Тернопільська область"}	ternopilska-oblast	2022-02-23 15:49:54	2024-04-16 10:44:43	Тернопільська
20	49.99350000	36.23040000	1	{"ru": "Харьковская область", "uk": "Харківська область"}	xarkivska-oblast	2022-02-23 15:49:54	2022-02-23 16:02:55	Харківська
21	46.35000000	32.38000000	1	{"ru": "Херсонская область", "uk": "Херсонська область"}	xersonska-oblast	2022-02-23 15:49:54	2022-02-23 16:02:57	Херсонська
22	49.41000000	26.96000000	1	{"ru": "Хмельницкая область", "uk": "Хмельницька область"}	xmelnicka-oblast	2022-02-23 15:49:54	2022-02-23 16:02:58	Хмельницька
23	49.27000000	31.44000000	1	{"ru": "Черкасская область", "uk": "Черкаська область"}	cerkaska-oblast	2022-02-23 15:49:54	2022-02-23 16:02:59	Черкаська
24	48.29830000	25.92220000	1	{"ru": "Черновицкая область", "uk": "Чернівецька область"}	cernivecka-oblast	2022-02-23 15:49:54	2022-02-23 16:03:09	Чернівецька
25	51.49020000	31.30390000	1	{"ru": "Черниговская область", "uk": "Чернігівська область"}	cernigivska-oblast	2022-02-23 15:49:54	2022-02-23 16:03:03	Чернігівська
\.


                                                                                                                                             restore.sql                                                                                         0000600 0004000 0002000 00000006330 14626314732 0015376 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        --
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
-- Name: regions; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE public.regions (
    id integer NOT NULL,
    lat character varying,
    lng character varying,
    country_id integer NOT NULL,
    name json NOT NULL,
    slug character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    short_name character varying NOT NULL
);


ALTER TABLE public.regions OWNER TO test;

--
-- Name: regions_id_seq; Type: SEQUENCE; Schema: public; Owner: test
--

CREATE SEQUENCE public.regions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.regions_id_seq OWNER TO test;

--
-- Name: regions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test
--

ALTER SEQUENCE public.regions_id_seq OWNED BY public.regions.id;


--
-- Name: regions id; Type: DEFAULT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.regions ALTER COLUMN id SET DEFAULT nextval('public.regions_id_seq'::regclass);


--
-- Data for Name: regions; Type: TABLE DATA; Schema: public; Owner: test
--

COPY public.regions (id, lat, lng, country_id, name, slug, created_at, updated_at, short_name) FROM stdin;
\.
COPY public.regions (id, lat, lng, country_id, name, slug, created_at, updated_at, short_name) FROM '$$PATH$$/3417.dat';

--
-- Name: regions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: test
--

SELECT pg_catalog.setval('public.regions_id_seq', 1, false);


--
-- Name: regions PK_4fcd12ed6a046276e2deb08801c; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.regions
    ADD CONSTRAINT "PK_4fcd12ed6a046276e2deb08801c" PRIMARY KEY (id);


--
-- Name: regions UQ_53cf784f23cbf14bb7717e969d4; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.regions
    ADD CONSTRAINT "UQ_53cf784f23cbf14bb7717e969d4" UNIQUE (slug);


--
-- PostgreSQL database dump complete
--

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        