toc.dat                                                                                             0000600 0004000 0002000 00000006225 14646421355 0014456 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        PGDMP                       |        	   etabletka    16.2    16.3     7           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false         8           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false         9           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false         :           1262    16394 	   etabletka    DATABASE     �   CREATE DATABASE etabletka WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LC_COLLATE = 'C' LC_CTYPE = 'C.UTF-8';
    DROP DATABASE etabletka;
                postgres    false         �            1259    394646    badges    TABLE       CREATE TABLE public.badges (
    id integer NOT NULL,
    title json NOT NULL,
    slug character varying NOT NULL,
    color character varying(8),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.badges;
       public         heap 	   etabletka    false         �            1259    394645    badges_id_seq    SEQUENCE     �   CREATE SEQUENCE public.badges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.badges_id_seq;
       public       	   etabletka    false    232         ;           0    0    badges_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.badges_id_seq OWNED BY public.badges.id;
          public       	   etabletka    false    231         �           2604    394649 	   badges id    DEFAULT     f   ALTER TABLE ONLY public.badges ALTER COLUMN id SET DEFAULT nextval('public.badges_id_seq'::regclass);
 8   ALTER TABLE public.badges ALTER COLUMN id DROP DEFAULT;
       public       	   etabletka    false    232    231    232         4          0    394646    badges 
   TABLE DATA           P   COPY public.badges (id, title, slug, color, created_at, updated_at) FROM stdin;
    public       	   etabletka    false    232       3892.dat <           0    0    badges_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.badges_id_seq', 6, true);
          public       	   etabletka    false    231         �           2606    394655 %   badges PK_8a651318b8de577e8e217676466 
   CONSTRAINT     e   ALTER TABLE ONLY public.badges
    ADD CONSTRAINT "PK_8a651318b8de577e8e217676466" PRIMARY KEY (id);
 Q   ALTER TABLE ONLY public.badges DROP CONSTRAINT "PK_8a651318b8de577e8e217676466";
       public         	   etabletka    false    232         �           2606    394657 %   badges UQ_a6118739404276dfeb86e349acf 
   CONSTRAINT     b   ALTER TABLE ONLY public.badges
    ADD CONSTRAINT "UQ_a6118739404276dfeb86e349acf" UNIQUE (slug);
 Q   ALTER TABLE ONLY public.badges DROP CONSTRAINT "UQ_a6118739404276dfeb86e349acf";
       public         	   etabletka    false    232                                                                                                                                                                                                                                                                                                                                                                                   3892.dat                                                                                            0000600 0004000 0002000 00000000677 14646421355 0014303 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        4	{"ru": "Новинка", "uk": "Новинка"}	new	#27AE60	2022-01-04 14:27:39	2022-01-04 14:27:39
5	{"ru": "Хит продаж", "uk": "Хіт продажу"}	bestseller	#4BC2C6	2022-01-04 14:27:39	2022-01-04 14:27:39
6	{"ru": "Ціна тижня", "uk": "Ціна тижня"}	week-price	#ec0e0e	2024-03-14 15:43:13	2024-03-14 15:43:13
3	{"ru": "Акция", "uk": "Акція"}	sale	##f2994a	2022-01-04 14:27:39	2022-01-04 14:27:39
\.


                                                                 restore.sql                                                                                         0000600 0004000 0002000 00000006156 14646421355 0015406 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        --
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
-- Name: badges; Type: TABLE; Schema: public; Owner: etabletka
--

CREATE TABLE public.badges (
    id integer NOT NULL,
    title json NOT NULL,
    slug character varying NOT NULL,
    color character varying(8),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.badges OWNER TO etabletka;

--
-- Name: badges_id_seq; Type: SEQUENCE; Schema: public; Owner: etabletka
--

CREATE SEQUENCE public.badges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.badges_id_seq OWNER TO etabletka;

--
-- Name: badges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: etabletka
--

ALTER SEQUENCE public.badges_id_seq OWNED BY public.badges.id;


--
-- Name: badges id; Type: DEFAULT; Schema: public; Owner: etabletka
--

ALTER TABLE ONLY public.badges ALTER COLUMN id SET DEFAULT nextval('public.badges_id_seq'::regclass);


--
-- Data for Name: badges; Type: TABLE DATA; Schema: public; Owner: etabletka
--

COPY public.badges (id, title, slug, color, created_at, updated_at) FROM stdin;
\.
COPY public.badges (id, title, slug, color, created_at, updated_at) FROM '$$PATH$$/3892.dat';

--
-- Name: badges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: etabletka
--

SELECT pg_catalog.setval('public.badges_id_seq', 6, true);


--
-- Name: badges PK_8a651318b8de577e8e217676466; Type: CONSTRAINT; Schema: public; Owner: etabletka
--

ALTER TABLE ONLY public.badges
    ADD CONSTRAINT "PK_8a651318b8de577e8e217676466" PRIMARY KEY (id);


--
-- Name: badges UQ_a6118739404276dfeb86e349acf; Type: CONSTRAINT; Schema: public; Owner: etabletka
--

ALTER TABLE ONLY public.badges
    ADD CONSTRAINT "UQ_a6118739404276dfeb86e349acf" UNIQUE (slug);


--
-- PostgreSQL database dump complete
--

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  