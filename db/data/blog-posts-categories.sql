toc.dat                                                                                             0000600 0004000 0002000 00000006260 14650134705 0014450 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        PGDMP                       |        	   etabletka    16.2    16.3     5           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false         6           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false         7           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false         8           1262    16394 	   etabletka    DATABASE     �   CREATE DATABASE etabletka WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LC_COLLATE = 'C' LC_CTYPE = 'C.UTF-8';
    DROP DATABASE etabletka;
                postgres    false                    1259    397066    blog_posts_categories    TABLE     n   CREATE TABLE public.blog_posts_categories (
    post_id integer NOT NULL,
    category_id integer NOT NULL
);
 )   DROP TABLE public.blog_posts_categories;
       public         heap 	   etabletka    false         2          0    397066    blog_posts_categories 
   TABLE DATA                 public       	   etabletka    false    283       3890.dat �           2606    397070 4   blog_posts_categories PK_4f367a538a1669744725b3e9686 
   CONSTRAINT     �   ALTER TABLE ONLY public.blog_posts_categories
    ADD CONSTRAINT "PK_4f367a538a1669744725b3e9686" PRIMARY KEY (post_id, category_id);
 `   ALTER TABLE ONLY public.blog_posts_categories DROP CONSTRAINT "PK_4f367a538a1669744725b3e9686";
       public         	   etabletka    false    283    283         �           1259    397071    IDX_a2b76678db1607f0ea83149ea6    INDEX     e   CREATE INDEX "IDX_a2b76678db1607f0ea83149ea6" ON public.blog_posts_categories USING btree (post_id);
 4   DROP INDEX public."IDX_a2b76678db1607f0ea83149ea6";
       public         	   etabletka    false    283         �           1259    397072    IDX_b6eab84b4c3e20428c8c00782d    INDEX     i   CREATE INDEX "IDX_b6eab84b4c3e20428c8c00782d" ON public.blog_posts_categories USING btree (category_id);
 4   DROP INDEX public."IDX_b6eab84b4c3e20428c8c00782d";
       public         	   etabletka    false    283         �           2606    397198 4   blog_posts_categories FK_a2b76678db1607f0ea83149ea66    FK CONSTRAINT     �   ALTER TABLE ONLY public.blog_posts_categories
    ADD CONSTRAINT "FK_a2b76678db1607f0ea83149ea66" FOREIGN KEY (post_id) REFERENCES public.blog_posts(id) ON UPDATE CASCADE ON DELETE CASCADE;
 `   ALTER TABLE ONLY public.blog_posts_categories DROP CONSTRAINT "FK_a2b76678db1607f0ea83149ea66";
       public       	   etabletka    false    283         �           2606    397203 4   blog_posts_categories FK_b6eab84b4c3e20428c8c00782d4    FK CONSTRAINT     �   ALTER TABLE ONLY public.blog_posts_categories
    ADD CONSTRAINT "FK_b6eab84b4c3e20428c8c00782d4" FOREIGN KEY (category_id) REFERENCES public.blog_categories(id);
 `   ALTER TABLE ONLY public.blog_posts_categories DROP CONSTRAINT "FK_b6eab84b4c3e20428c8c00782d4";
       public       	   etabletka    false    283                                                                                                                                                                                                                                                                                                                                                        3890.dat                                                                                            0000600 0004000 0002000 00000000524 14650134705 0014263 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        INSERT INTO public.blog_posts_categories VALUES (1, 3);
INSERT INTO public.blog_posts_categories VALUES (3, 13);
INSERT INTO public.blog_posts_categories VALUES (2, 3);
INSERT INTO public.blog_posts_categories VALUES (2, 13);
INSERT INTO public.blog_posts_categories VALUES (4, 5);
INSERT INTO public.blog_posts_categories VALUES (4, 9);


                                                                                                                                                                            restore.sql                                                                                         0000600 0004000 0002000 00000005660 14650134705 0015400 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        --
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
-- Name: blog_posts_categories; Type: TABLE; Schema: public; Owner: etabletka
--

CREATE TABLE public.blog_posts_categories (
    post_id integer NOT NULL,
    category_id integer NOT NULL
);


ALTER TABLE public.blog_posts_categories OWNER TO etabletka;

--
-- Data for Name: blog_posts_categories; Type: TABLE DATA; Schema: public; Owner: etabletka
--

\i $$PATH$$/3890.dat

--
-- Name: blog_posts_categories PK_4f367a538a1669744725b3e9686; Type: CONSTRAINT; Schema: public; Owner: etabletka
--

ALTER TABLE ONLY public.blog_posts_categories
    ADD CONSTRAINT "PK_4f367a538a1669744725b3e9686" PRIMARY KEY (post_id, category_id);


--
-- Name: IDX_a2b76678db1607f0ea83149ea6; Type: INDEX; Schema: public; Owner: etabletka
--

CREATE INDEX "IDX_a2b76678db1607f0ea83149ea6" ON public.blog_posts_categories USING btree (post_id);


--
-- Name: IDX_b6eab84b4c3e20428c8c00782d; Type: INDEX; Schema: public; Owner: etabletka
--

CREATE INDEX "IDX_b6eab84b4c3e20428c8c00782d" ON public.blog_posts_categories USING btree (category_id);


--
-- Name: blog_posts_categories FK_a2b76678db1607f0ea83149ea66; Type: FK CONSTRAINT; Schema: public; Owner: etabletka
--

ALTER TABLE ONLY public.blog_posts_categories
    ADD CONSTRAINT "FK_a2b76678db1607f0ea83149ea66" FOREIGN KEY (post_id) REFERENCES public.blog_posts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blog_posts_categories FK_b6eab84b4c3e20428c8c00782d4; Type: FK CONSTRAINT; Schema: public; Owner: etabletka
--

ALTER TABLE ONLY public.blog_posts_categories
    ADD CONSTRAINT "FK_b6eab84b4c3e20428c8c00782d4" FOREIGN KEY (category_id) REFERENCES public.blog_categories(id);


--
-- PostgreSQL database dump complete
--

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                