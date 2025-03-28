toc.dat                                                                                             0000600 0004000 0002000 00000006543 14646424525 0014463 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        PGDMP   #    4                |        	   etabletka    16.2    16.3     7           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false         8           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false         9           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false         :           1262    16394 	   etabletka    DATABASE     �   CREATE DATABASE etabletka WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LC_COLLATE = 'C' LC_CTYPE = 'C.UTF-8';
    DROP DATABASE etabletka;
                postgres    false         
           1259    394906    delivery_statuses    TABLE     �   CREATE TABLE public.delivery_statuses (
    id integer NOT NULL,
    title json NOT NULL,
    code smallint NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);
 %   DROP TABLE public.delivery_statuses;
       public         heap 	   etabletka    false         	           1259    394905    delivery_statuses_id_seq    SEQUENCE     �   CREATE SEQUENCE public.delivery_statuses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.delivery_statuses_id_seq;
       public       	   etabletka    false    266         ;           0    0    delivery_statuses_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.delivery_statuses_id_seq OWNED BY public.delivery_statuses.id;
          public       	   etabletka    false    265         �           2604    394909    delivery_statuses id    DEFAULT     |   ALTER TABLE ONLY public.delivery_statuses ALTER COLUMN id SET DEFAULT nextval('public.delivery_statuses_id_seq'::regclass);
 C   ALTER TABLE public.delivery_statuses ALTER COLUMN id DROP DEFAULT;
       public       	   etabletka    false    265    266    266         4          0    394906    delivery_statuses 
   TABLE DATA           T   COPY public.delivery_statuses (id, title, code, created_at, updated_at) FROM stdin;
    public       	   etabletka    false    266       3892.dat <           0    0    delivery_statuses_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.delivery_statuses_id_seq', 1, false);
          public       	   etabletka    false    265         �           2606    394915 0   delivery_statuses PK_9879904dd0e500b28523986648a 
   CONSTRAINT     p   ALTER TABLE ONLY public.delivery_statuses
    ADD CONSTRAINT "PK_9879904dd0e500b28523986648a" PRIMARY KEY (id);
 \   ALTER TABLE ONLY public.delivery_statuses DROP CONSTRAINT "PK_9879904dd0e500b28523986648a";
       public         	   etabletka    false    266         �           2606    394917 0   delivery_statuses UQ_0b40f97cb25ea95d071b4870b23 
   CONSTRAINT     m   ALTER TABLE ONLY public.delivery_statuses
    ADD CONSTRAINT "UQ_0b40f97cb25ea95d071b4870b23" UNIQUE (code);
 \   ALTER TABLE ONLY public.delivery_statuses DROP CONSTRAINT "UQ_0b40f97cb25ea95d071b4870b23";
       public         	   etabletka    false    266                                                                                                                                                                     3892.dat                                                                                            0000600 0004000 0002000 00000000704 14646424525 0014274 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	{"ru": null, "uk": "Очікує відвантаження"}	0	2024-07-19 11:52:08.275187	2024-07-19 11:52:08.275187
3	{"ru": null, "uk": "Передано в службу доставки"}	1	2024-07-19 11:52:08.275187	2024-07-19 11:52:08.275187
5	{"ru": null, "uk": "В дорозі"}	2	2024-07-19 11:52:08.275187	2024-07-19 11:52:08.275187
7	{"ru": null, "uk": "Доставлено"}	3	2024-07-19 11:52:08.275187	2024-07-19 11:52:08.275187
\.


                                                            restore.sql                                                                                         0000600 0004000 0002000 00000006437 14646424525 0015412 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        --
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
-- Name: delivery_statuses; Type: TABLE; Schema: public; Owner: etabletka
--

CREATE TABLE public.delivery_statuses (
    id integer NOT NULL,
    title json NOT NULL,
    code smallint NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.delivery_statuses OWNER TO etabletka;

--
-- Name: delivery_statuses_id_seq; Type: SEQUENCE; Schema: public; Owner: etabletka
--

CREATE SEQUENCE public.delivery_statuses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.delivery_statuses_id_seq OWNER TO etabletka;

--
-- Name: delivery_statuses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: etabletka
--

ALTER SEQUENCE public.delivery_statuses_id_seq OWNED BY public.delivery_statuses.id;


--
-- Name: delivery_statuses id; Type: DEFAULT; Schema: public; Owner: etabletka
--

ALTER TABLE ONLY public.delivery_statuses ALTER COLUMN id SET DEFAULT nextval('public.delivery_statuses_id_seq'::regclass);


--
-- Data for Name: delivery_statuses; Type: TABLE DATA; Schema: public; Owner: etabletka
--

COPY public.delivery_statuses (id, title, code, created_at, updated_at) FROM stdin;
\.
COPY public.delivery_statuses (id, title, code, created_at, updated_at) FROM '$$PATH$$/3892.dat';

--
-- Name: delivery_statuses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: etabletka
--

SELECT pg_catalog.setval('public.delivery_statuses_id_seq', 1, false);


--
-- Name: delivery_statuses PK_9879904dd0e500b28523986648a; Type: CONSTRAINT; Schema: public; Owner: etabletka
--

ALTER TABLE ONLY public.delivery_statuses
    ADD CONSTRAINT "PK_9879904dd0e500b28523986648a" PRIMARY KEY (id);


--
-- Name: delivery_statuses UQ_0b40f97cb25ea95d071b4870b23; Type: CONSTRAINT; Schema: public; Owner: etabletka
--

ALTER TABLE ONLY public.delivery_statuses
    ADD CONSTRAINT "UQ_0b40f97cb25ea95d071b4870b23" UNIQUE (code);


--
-- PostgreSQL database dump complete
--

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 