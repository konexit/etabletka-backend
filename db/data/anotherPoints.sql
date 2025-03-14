toc.dat                                                                                             0000600 0004000 0002000 00000006400 14646424143 0014447 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        PGDMP   !    0                |        	   etabletka    16.2    16.3     9           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false         :           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false         ;           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false         <           1262    16394 	   etabletka    DATABASE     �   CREATE DATABASE etabletka WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LC_COLLATE = 'C' LC_CTYPE = 'C.UTF-8';
    DROP DATABASE etabletka;
                postgres    false                    1259    394932    another_points    TABLE     %  CREATE TABLE public.another_points (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    cdn_data json,
    active boolean DEFAULT false NOT NULL,
    main_color character varying(7) DEFAULT '#ff0000'::character varying NOT NULL,
    back_color character varying(7) DEFAULT '#ffffff'::character varying NOT NULL,
    num_color character varying(7) DEFAULT '#000000'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);
 "   DROP TABLE public.another_points;
       public         heap 	   etabletka    false                    1259    394931    another_points_id_seq    SEQUENCE     �   CREATE SEQUENCE public.another_points_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.another_points_id_seq;
       public       	   etabletka    false    270         =           0    0    another_points_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.another_points_id_seq OWNED BY public.another_points.id;
          public       	   etabletka    false    269         �           2604    394935    another_points id    DEFAULT     v   ALTER TABLE ONLY public.another_points ALTER COLUMN id SET DEFAULT nextval('public.another_points_id_seq'::regclass);
 @   ALTER TABLE public.another_points ALTER COLUMN id DROP DEFAULT;
       public       	   etabletka    false    269    270    270         6          0    394932    another_points 
   TABLE DATA              COPY public.another_points (id, name, cdn_data, active, main_color, back_color, num_color, created_at, updated_at) FROM stdin;
    public       	   etabletka    false    270       3894.dat >           0    0    another_points_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.another_points_id_seq', 2, true);
          public       	   etabletka    false    269         �           2606    394945 -   another_points PK_802099968b5533199ede4447a8b 
   CONSTRAINT     m   ALTER TABLE ONLY public.another_points
    ADD CONSTRAINT "PK_802099968b5533199ede4447a8b" PRIMARY KEY (id);
 Y   ALTER TABLE ONLY public.another_points DROP CONSTRAINT "PK_802099968b5533199ede4447a8b";
       public         	   etabletka    false    270                                                                                                                                                                                                                                                                        3894.dat                                                                                            0000600 0004000 0002000 00000000670 14646424143 0014274 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	Cluster	{"url": "https://cdn.konex.com.ua/file/etabletka/another_points/1/point-02.png","path": "/another_points/1","filename": "point-02.png"}	f	#ff0000	#ffffff	#000000	2024-07-19 11:44:17.231663	2024-07-19 11:44:17.231663
2	Me	{"url": "https://cdn.konex.com.ua/file/etabletka/another_points/3/me.png","path": "/another_points/3","filename": "me.png"}	t	#ff0000	#ffffff	#000000	2024-07-19 11:44:35.998442	2024-07-19 11:44:35.998442
\.


                                                                        restore.sql                                                                                         0000600 0004000 0002000 00000006607 14646424143 0015405 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        --
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
-- Name: another_points; Type: TABLE; Schema: public; Owner: etabletka
--

CREATE TABLE public.another_points (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    cdn_data json,
    active boolean DEFAULT false NOT NULL,
    main_color character varying(7) DEFAULT '#ff0000'::character varying NOT NULL,
    back_color character varying(7) DEFAULT '#ffffff'::character varying NOT NULL,
    num_color character varying(7) DEFAULT '#000000'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.another_points OWNER TO etabletka;

--
-- Name: another_points_id_seq; Type: SEQUENCE; Schema: public; Owner: etabletka
--

CREATE SEQUENCE public.another_points_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.another_points_id_seq OWNER TO etabletka;

--
-- Name: another_points_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: etabletka
--

ALTER SEQUENCE public.another_points_id_seq OWNED BY public.another_points.id;


--
-- Name: another_points id; Type: DEFAULT; Schema: public; Owner: etabletka
--

ALTER TABLE ONLY public.another_points ALTER COLUMN id SET DEFAULT nextval('public.another_points_id_seq'::regclass);


--
-- Data for Name: another_points; Type: TABLE DATA; Schema: public; Owner: etabletka
--

COPY public.another_points (id, name, cdn_data, active, main_color, back_color, num_color, created_at, updated_at) FROM stdin;
\.
COPY public.another_points (id, name, cdn_data, active, main_color, back_color, num_color, created_at, updated_at) FROM '$$PATH$$/3894.dat';

--
-- Name: another_points_id_seq; Type: SEQUENCE SET; Schema: public; Owner: etabletka
--

SELECT pg_catalog.setval('public.another_points_id_seq', 2, true);


--
-- Name: another_points PK_802099968b5533199ede4447a8b; Type: CONSTRAINT; Schema: public; Owner: etabletka
--

ALTER TABLE ONLY public.another_points
    ADD CONSTRAINT "PK_802099968b5533199ede4447a8b" PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         