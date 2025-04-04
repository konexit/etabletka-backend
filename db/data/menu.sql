toc.dat                                                                                             0000600 0004000 0002000 00000006762 14634244736 0014467 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        PGDMP       0                |        	   etabletka    16.2    16.3     *           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false         +           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false         ,           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false         -           1262    16394 	   etabletka    DATABASE     �   CREATE DATABASE etabletka WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LC_COLLATE = 'C' LC_CTYPE = 'C.UTF-8';
    DROP DATABASE etabletka;
                postgres    false         �            1259    365661    menus    TABLE     '  CREATE TABLE public.menus (
    id integer NOT NULL,
    title json NOT NULL,
    slug character varying NOT NULL,
    description character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.menus;
       public         heap 	   etabletka    false         �            1259    365660    menus_id_seq    SEQUENCE     �   CREATE SEQUENCE public.menus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.menus_id_seq;
       public       	   etabletka    false    240         .           0    0    menus_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.menus_id_seq OWNED BY public.menus.id;
          public       	   etabletka    false    239         �           2604    365664    menus id    DEFAULT     d   ALTER TABLE ONLY public.menus ALTER COLUMN id SET DEFAULT nextval('public.menus_id_seq'::regclass);
 7   ALTER TABLE public.menus ALTER COLUMN id DROP DEFAULT;
       public       	   etabletka    false    240    239    240         '          0    365661    menus 
   TABLE DATA           U   COPY public.menus (id, title, slug, description, created_at, updated_at) FROM stdin;
    public       	   etabletka    false    240       3879.dat /           0    0    menus_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.menus_id_seq', 1, false);
          public       	   etabletka    false    239         �           2606    365670 $   menus PK_3fec3d93327f4538e0cbd4349c4 
   CONSTRAINT     d   ALTER TABLE ONLY public.menus
    ADD CONSTRAINT "PK_3fec3d93327f4538e0cbd4349c4" PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.menus DROP CONSTRAINT "PK_3fec3d93327f4538e0cbd4349c4";
       public         	   etabletka    false    240         �           2606    365672 $   menus UQ_478abfb63bdfce389d94d5d9323 
   CONSTRAINT     a   ALTER TABLE ONLY public.menus
    ADD CONSTRAINT "UQ_478abfb63bdfce389d94d5d9323" UNIQUE (slug);
 P   ALTER TABLE ONLY public.menus DROP CONSTRAINT "UQ_478abfb63bdfce389d94d5d9323";
       public         	   etabletka    false    240         �           2606    365674 $   menus UQ_86e5e83ebda22635b093a57d85b 
   CONSTRAINT     h   ALTER TABLE ONLY public.menus
    ADD CONSTRAINT "UQ_86e5e83ebda22635b093a57d85b" UNIQUE (description);
 P   ALTER TABLE ONLY public.menus DROP CONSTRAINT "UQ_86e5e83ebda22635b093a57d85b";
       public         	   etabletka    false    240                      3879.dat                                                                                            0000600 0004000 0002000 00000000334 14634244736 0014301 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	{"ru": "Header", "uk": "Header"}	header	Шапка сайту	2022-02-23 10:54:18	2022-02-23 10:54:18
9	{"ru": "Меню", "uk": "Меню"}	sidebar	Сайдбар меню	2022-02-23 10:54:18	2022-02-23 10:54:18
\.


                                                                                                                                                                                                                                                                                                    restore.sql                                                                                         0000600 0004000 0002000 00000006505 14634244736 0015407 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        --
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
-- Name: menus; Type: TABLE; Schema: public; Owner: etabletka
--

CREATE TABLE public.menus (
    id integer NOT NULL,
    title json NOT NULL,
    slug character varying NOT NULL,
    description character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.menus OWNER TO etabletka;

--
-- Name: menus_id_seq; Type: SEQUENCE; Schema: public; Owner: etabletka
--

CREATE SEQUENCE public.menus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.menus_id_seq OWNER TO etabletka;

--
-- Name: menus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: etabletka
--

ALTER SEQUENCE public.menus_id_seq OWNED BY public.menus.id;


--
-- Name: menus id; Type: DEFAULT; Schema: public; Owner: etabletka
--

ALTER TABLE ONLY public.menus ALTER COLUMN id SET DEFAULT nextval('public.menus_id_seq'::regclass);


--
-- Data for Name: menus; Type: TABLE DATA; Schema: public; Owner: etabletka
--

COPY public.menus (id, title, slug, description, created_at, updated_at) FROM stdin;
\.
COPY public.menus (id, title, slug, description, created_at, updated_at) FROM '$$PATH$$/3879.dat';

--
-- Name: menus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: etabletka
--

SELECT pg_catalog.setval('public.menus_id_seq', 1, false);


--
-- Name: menus PK_3fec3d93327f4538e0cbd4349c4; Type: CONSTRAINT; Schema: public; Owner: etabletka
--

ALTER TABLE ONLY public.menus
    ADD CONSTRAINT "PK_3fec3d93327f4538e0cbd4349c4" PRIMARY KEY (id);


--
-- Name: menus UQ_478abfb63bdfce389d94d5d9323; Type: CONSTRAINT; Schema: public; Owner: etabletka
--

ALTER TABLE ONLY public.menus
    ADD CONSTRAINT "UQ_478abfb63bdfce389d94d5d9323" UNIQUE (slug);


--
-- Name: menus UQ_86e5e83ebda22635b093a57d85b; Type: CONSTRAINT; Schema: public; Owner: etabletka
--

ALTER TABLE ONLY public.menus
    ADD CONSTRAINT "UQ_86e5e83ebda22635b093a57d85b" UNIQUE (description);


--
-- PostgreSQL database dump complete
--

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           