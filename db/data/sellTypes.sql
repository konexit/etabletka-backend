toc.dat                                                                                             0000600 0004000 0002000 00000007077 14646421707 0014465 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        PGDMP   5                    |        	   etabletka    16.2    16.3     9           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false         :           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false         ;           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false         <           1262    16394 	   etabletka    DATABASE     �   CREATE DATABASE etabletka WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LC_COLLATE = 'C' LC_CTYPE = 'C.UTF-8';
    DROP DATABASE etabletka;
                postgres    false                    1259    395527 
   sell_types    TABLE       CREATE TABLE public.sell_types (
    id integer NOT NULL,
    name character varying NOT NULL,
    code character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.sell_types;
       public         heap 	   etabletka    false                    1259    395526    sell_types_id_seq    SEQUENCE     �   CREATE SEQUENCE public.sell_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.sell_types_id_seq;
       public       	   etabletka    false    280         =           0    0    sell_types_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.sell_types_id_seq OWNED BY public.sell_types.id;
          public       	   etabletka    false    279         �           2604    395530    sell_types id    DEFAULT     n   ALTER TABLE ONLY public.sell_types ALTER COLUMN id SET DEFAULT nextval('public.sell_types_id_seq'::regclass);
 <   ALTER TABLE public.sell_types ALTER COLUMN id DROP DEFAULT;
       public       	   etabletka    false    279    280    280         6          0    395527 
   sell_types 
   TABLE DATA           L   COPY public.sell_types (id, name, code, created_at, updated_at) FROM stdin;
    public       	   etabletka    false    280       3894.dat >           0    0    sell_types_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.sell_types_id_seq', 1, false);
          public       	   etabletka    false    279         �           2606    395536 )   sell_types PK_d234f2929c665126eb9c3f3acad 
   CONSTRAINT     i   ALTER TABLE ONLY public.sell_types
    ADD CONSTRAINT "PK_d234f2929c665126eb9c3f3acad" PRIMARY KEY (id);
 U   ALTER TABLE ONLY public.sell_types DROP CONSTRAINT "PK_d234f2929c665126eb9c3f3acad";
       public         	   etabletka    false    280         �           2606    395538 )   sell_types UQ_075b224c17914cfdb344de2f57f 
   CONSTRAINT     f   ALTER TABLE ONLY public.sell_types
    ADD CONSTRAINT "UQ_075b224c17914cfdb344de2f57f" UNIQUE (name);
 U   ALTER TABLE ONLY public.sell_types DROP CONSTRAINT "UQ_075b224c17914cfdb344de2f57f";
       public         	   etabletka    false    280         �           2606    395540 )   sell_types UQ_8b13ee0eec4b1563c9071640360 
   CONSTRAINT     f   ALTER TABLE ONLY public.sell_types
    ADD CONSTRAINT "UQ_8b13ee0eec4b1563c9071640360" UNIQUE (code);
 U   ALTER TABLE ONLY public.sell_types DROP CONSTRAINT "UQ_8b13ee0eec4b1563c9071640360";
       public         	   etabletka    false    280                                                                                                                                                                                                                                                                                                                                                                                                                                                                         3894.dat                                                                                            0000600 0004000 0002000 00000000502 14646421707 0014271 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	{"uk": "Бронь"}	reservation	2024-07-19 11:26:42.696899	2024-07-19 11:26:42.696899
3	{"uk": "Оплата онлайн"}	payment_online	2024-07-19 11:26:42.696899	2024-07-19 11:26:42.696899
5	{"uk": "Курьерская доставка"}	express_delivery	2024-07-19 11:26:42.696899	2024-07-19 11:26:42.696899
\.


                                                                                                                                                                                              restore.sql                                                                                         0000600 0004000 0002000 00000006565 14646421707 0015413 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        --
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
-- Name: sell_types; Type: TABLE; Schema: public; Owner: etabletka
--

CREATE TABLE public.sell_types (
    id integer NOT NULL,
    name character varying NOT NULL,
    code character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.sell_types OWNER TO etabletka;

--
-- Name: sell_types_id_seq; Type: SEQUENCE; Schema: public; Owner: etabletka
--

CREATE SEQUENCE public.sell_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sell_types_id_seq OWNER TO etabletka;

--
-- Name: sell_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: etabletka
--

ALTER SEQUENCE public.sell_types_id_seq OWNED BY public.sell_types.id;


--
-- Name: sell_types id; Type: DEFAULT; Schema: public; Owner: etabletka
--

ALTER TABLE ONLY public.sell_types ALTER COLUMN id SET DEFAULT nextval('public.sell_types_id_seq'::regclass);


--
-- Data for Name: sell_types; Type: TABLE DATA; Schema: public; Owner: etabletka
--

COPY public.sell_types (id, name, code, created_at, updated_at) FROM stdin;
\.
COPY public.sell_types (id, name, code, created_at, updated_at) FROM '$$PATH$$/3894.dat';

--
-- Name: sell_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: etabletka
--

SELECT pg_catalog.setval('public.sell_types_id_seq', 1, false);


--
-- Name: sell_types PK_d234f2929c665126eb9c3f3acad; Type: CONSTRAINT; Schema: public; Owner: etabletka
--

ALTER TABLE ONLY public.sell_types
    ADD CONSTRAINT "PK_d234f2929c665126eb9c3f3acad" PRIMARY KEY (id);


--
-- Name: sell_types UQ_075b224c17914cfdb344de2f57f; Type: CONSTRAINT; Schema: public; Owner: etabletka
--

ALTER TABLE ONLY public.sell_types
    ADD CONSTRAINT "UQ_075b224c17914cfdb344de2f57f" UNIQUE (name);


--
-- Name: sell_types UQ_8b13ee0eec4b1563c9071640360; Type: CONSTRAINT; Schema: public; Owner: etabletka
--

ALTER TABLE ONLY public.sell_types
    ADD CONSTRAINT "UQ_8b13ee0eec4b1563c9071640360" UNIQUE (code);


--
-- PostgreSQL database dump complete
--

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           