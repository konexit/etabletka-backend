toc.dat                                                                                             0000600 0004000 0002000 00000006453 14634040325 0014450 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        PGDMP   '    9                |        	   etabletka    16.2    16.3     (           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false         )           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false         *           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false         +           1262    16394 	   etabletka    DATABASE     �   CREATE DATABASE etabletka WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LC_COLLATE = 'C' LC_CTYPE = 'C.UTF-8';
    DROP DATABASE etabletka;
                postgres    false                    1259    366325 	   faq_items    TABLE     3  CREATE TABLE public.faq_items (
    id integer NOT NULL,
    author_id integer NOT NULL,
    question json,
    answer json,
    published boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.faq_items;
       public         heap 	   etabletka    false                    1259    366324    faq_items_id_seq    SEQUENCE     �   CREATE SEQUENCE public.faq_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.faq_items_id_seq;
       public       	   etabletka    false    276         ,           0    0    faq_items_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.faq_items_id_seq OWNED BY public.faq_items.id;
          public       	   etabletka    false    275         �           2604    366328    faq_items id    DEFAULT     l   ALTER TABLE ONLY public.faq_items ALTER COLUMN id SET DEFAULT nextval('public.faq_items_id_seq'::regclass);
 ;   ALTER TABLE public.faq_items ALTER COLUMN id DROP DEFAULT;
       public       	   etabletka    false    276    275    276         %          0    366325 	   faq_items 
   TABLE DATA           g   COPY public.faq_items (id, author_id, question, answer, published, created_at, updated_at) FROM stdin;
    public       	   etabletka    false    276       3877.dat -           0    0    faq_items_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.faq_items_id_seq', 1, true);
          public       	   etabletka    false    275         �           2606    366335 (   faq_items PK_72fbce3e53149fa821abbf674ea 
   CONSTRAINT     h   ALTER TABLE ONLY public.faq_items
    ADD CONSTRAINT "PK_72fbce3e53149fa821abbf674ea" PRIMARY KEY (id);
 T   ALTER TABLE ONLY public.faq_items DROP CONSTRAINT "PK_72fbce3e53149fa821abbf674ea";
       public         	   etabletka    false    276         �           2606    366338 (   faq_items FK_78670b09fcadf84ceb4e528aa85    FK CONSTRAINT     �   ALTER TABLE ONLY public.faq_items
    ADD CONSTRAINT "FK_78670b09fcadf84ceb4e528aa85" FOREIGN KEY (author_id) REFERENCES public.users(id);
 T   ALTER TABLE ONLY public.faq_items DROP CONSTRAINT "FK_78670b09fcadf84ceb4e528aa85";
       public       	   etabletka    false    276                                                                                                                                                                                                                             3877.dat                                                                                            0000600 0004000 0002000 00000027023 14634040325 0014267 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	1	{\n\t"ru": null,\n\t"uk": "<p><span data-sheets-value=\\"{\\" data-sheets-userformat=\\"{\\">Як працює бронювання ліків?</span></p>"\n}	{\n\t"ru": null,\n\t"uk": "<p><span data-sheets-value=\\"{\\" data-sheets-userformat=\\"{\\">Бронювання лікарських засобів - це відбір вибраних товарів в аптеці мережі. <br />Вибрати відбір ліків в аптеці ви можете на етапі оформлення замовлення. В другому пункті \\"Спосіб і адреса доставки\\" вказати потрібне місце, вибрати спосіб отримання \\"Пункт самовивозу\\" і в списку підтвердити аптеку, з якої ви хочете відібрати ліки. <br />Також неохідно заповнити інші необхідні поля. Такі як спосіб оплати і контактні дані.<br />Після оформлення замовлення на вказаний номер телефону прийде повідомлення з підтверженням аптеки і статусом замовлення.</span></p>"\n}	t	2021-11-11 10:46:54	2024-04-05 09:40:26
2	1	{\n\t"ru": null,\n\t"uk": "<p><span data-sheets-value=\\"{\\" data-sheets-userformat=\\"{\\">Чи можна замовити ліки на іншу людину?</span></p>"\n}	{\n\t"ru": null,\n\t"uk": "<p><span data-sheets-value=\\"{\\" data-sheets-userformat=\\"{\\">Так, ви можете оформити замовлення на іншу людину. <br />Вкажіть, що отримувачем буде інша людина на етапі оформлення замовлення. Також ви можете оплатити замовлення для іншої людини онлайн. <br /><span style=\\"color: #ba372a;\\">Обов'язково вкажіть ім'я і номер телефону отримувача.&nbsp;</span><br /><span style=\\"color: #ba372a;\\">! Звертаємо увагу, за законодавством України, рецептурні лікарські засоби відпускаються лише при наданні рецепту фармацевту/провізору в аптеці. Оплата таких ліків відбувається лише при отриманні, їх не можливо оплатити онлайн.</span></span></p>"\n}	t	2023-03-09 13:28:13	2024-04-05 09:40:35
3	1	{\n\t"ru": null,\n\t"uk": "<p><span data-sheets-value=\\"{\\" data-sheets-userformat=\\"{\\">Чи можна замовити доставкою рецептурні ліки?</span></p>"\n}	{\n\t"ru": null,\n\t"uk": "<p><span data-sheets-value=\\"{\\" data-sheets-userformat=\\"{\\">Згідно законів України будь-який вид доставки рецептурних лікарських засобів заборонений.</span></p>"\n}	t	2023-04-10 10:14:35	2024-04-05 09:40:54
4	1	{\n\t"ru": null,\n\t"uk": "<p><span data-sheets-value=\\"{\\" data-sheets-userformat=\\"{\\">Мого міста немає в списку </span></p>"\n}	{\n\t"ru": null,\n\t"uk": "<p><span data-sheets-value=\\"{\\" data-sheets-userformat=\\"{\\">На даний момент на сайті відображаються лише ті населені пункти, в яких є хоча б 1 наша аптека. Якщо ваше місто відсутнє - це означає що в ньому немає аптек, з яких ви можете забрати заброньовані товари.</span></p>"\n}	t	2023-04-10 10:15:02	2024-04-05 09:58:09
5	1	{\n\t"ru": null,\n\t"uk": "<p><span data-sheets-value=\\"{\\" data-sheets-userformat=\\"{\\">Не можу знайти потрібних ліків (в потрібному дозувані, лікарській формі, кількості і т.д.)</span></p>"\n}	{\n\t"ru": null,\n\t"uk": "<p><span data-sheets-value=\\"{\\" data-sheets-userformat=\\"{\\">Якщо ви не можете знайти за допомогою пошуку потрібний товар - найбільш ймовірніше його немає в наявності на даний момент. Для отримання точної інформації по товару ви можете звернутись в нашу службу підтримки.</span></p>"\n}	t	2023-04-10 10:15:36	2024-04-05 09:39:50
6	1	{\n\t"ru": null,\n\t"uk": "<p><span data-sheets-value=\\"{\\" data-sheets-userformat=\\"{\\">Чи потрібно зразу платити за ліки при їх бронювані?</span></p>"\n}	{\n\t"ru": null,\n\t"uk": "<p><span data-sheets-value=\\"{\\" data-sheets-userformat=\\"{\\">Ви можете оплатити за замовлення трьома способами: <br />- в аптеці, при відборі замовлення;<br />- при отриманні замовлення від кур'єра чи у відділені оператора поштового зв'язку;<br />- оплатити замовлення онлайн з подальшим відбором в аптеці, у кур'єра чи оператора поштового зв'язку.</span></p>"\n}	t	2023-04-10 10:16:08	2024-04-05 09:40:14
7	1	{\n\t"ru": null,\n\t"uk": "<p>Як зв'язатися зі службою підтримки?</p>"\n}	{\n\t"ru": null,\n\t"uk": "<p>Якщо у вас виникли запитання, які стосуються замовлення: підбір товару, оплата, доставка - ви можете зателефонувати на нашу гарячу лінію за номером <a href=\\"tel:0800355050\\">0 800 35 50 50</a> (в Україні дзвінки безкоштовні).</p>\\r\\n<p>Якщо запитання стосується технічних проблем, рекомендацій чи пропозицій співпраці - надсилайте листа на <a href=\\"mailto:support@etabletka.ua\\">support@etabletka.ua</a></p>"\n}	t	2023-04-12 10:28:31	2024-04-05 09:41:23
8	1	{\n\t"ru": null,\n\t"uk": "<p><span data-sheets-value=\\"{\\" data-sheets-userformat=\\"{\\">Як відмінити замовлення?</span></p>"\n}	{\n\t"ru": null,\n\t"uk": "<p><span data-sheets-value=\\"{\\" data-sheets-userformat=\\"{\\">Замовлення автовідміняється після 48 годин з моменту оформлення.</span></p>\\r\\n<p><span data-sheets-value=\\"{\\" data-sheets-userformat=\\"{\\">У випадках, коли замовлення потрібно скасувати негайно:</span></p>\\r\\n<ul>\\r\\n<li><span data-sheets-value=\\"{\\" data-sheets-userformat=\\"{\\">якщо ви зареєстрований користувач - замовлення можна відмінити в особистому кабінеті, в розділі \\"Мої замовлення\\".</span></li>\\r\\n<li><span data-sheets-value=\\"{\\" data-sheets-userformat=\\"{\\">якщо ви не проходили реєстрацію та не маєте власного кабінету - можете зв'язатись з нашою службою підтримки, яка зможе відмінити замовлення.&nbsp;</span></li>\\r\\n</ul>"\n}	t	2023-04-12 10:29:14	2024-04-05 09:46:25
9	1	{\n\t"ru": null,\n\t"uk": "<p><span data-sheets-value=\\"{\\" data-sheets-userformat=\\"{\\">Чи можна повернути ліки після їх отримання?</span></p>"\n}	{\n\t"ru": null,\n\t"uk": "<p><span data-sheets-value=\\"{\\" data-sheets-userformat=\\"{\\" data-sheets-textstyleruns=\\"{\\" data-sheets-hyperlinkruns=\\"{\\">За законом України повернення лікарських засобів заборонено. Детальніше про це за посиланням <a class=\\"in-cell-link\\" href=\\"https://etabletka.ua/admin/page/umovi-povernennya\\" target=\\"_blank\\" rel=\\"noopener\\">Умови повернення товарів</a>.</span></p>"\n}	t	2023-04-12 10:30:19	2024-04-05 09:47:32
10	1	{\n\t"ru": null,\n\t"uk": "<p><span data-sheets-value=\\"{\\" data-sheets-userformat=\\"{\\">Не можу знайти потрібної аптеки</span></p>"\n}	{\n\t"ru": null,\n\t"uk": "<p>Зараз до eTabletka.ua підключенні аптеки мереж \\"Конекс\\", \\"БУМ\\" та \\"Фармавін\\". Рекомендуємо скористатись мапою щоб швидко знайти потрібну аптеку.</p>\\r\\n<p>Якщо ви впевнені, що поруч є одна з аптек підключених мереж, але вона відстуня на мапі - будемо вдячні, якщо ви повідомите про помилку в нашу службу підтримки. Якщо помилка буде дійсно присутня - її виправлять на протязі 1 робочого дня.</p>"\n}	t	2023-04-26 12:02:17	2024-04-05 09:53:23
11	1	{\n\t"ru": null,\n\t"uk": "<p>\\"Задай питання професійному фармацевту\\" - як це працює?</p>"\n}	{\n\t"ru": null,\n\t"uk": "<p>Ви можете скористатися нашою безкоштовною послугую \\"Консультація професійного фармацевта\\". Для цього потрібно:</p>\\r\\n<ul>\\r\\n<li>зателефонувати самостійно на нашу гарячу лінію за номером <span data-sheets-value=\\"{\\" data-sheets-userformat=\\"{\\"><a href=\\"tel:0800355050\\">0 800 35 50 50</a></span> (в Україні дзвінки безкоштовні)</li>\\r\\n<li>у верхній частині сайту де вказаний номер телефону, при наведеному курсору на номер з'являється поле для введення номера телефону. Якщо ви вкажете свій номер телефону - наш провізор вам зателефонує, щоб проконсультувати вас.</li>\\r\\n<li>зробити запит через форму на сторінках сайту, яка позначена \\"<span class=\\"hiddenSuggestion\\">Задай питання</span> професійному фармацевту\\". В ній ви можете вказати на, яке запитання хочете отримати відповідь. Також можете вибрати зручний для Вас спосіб комунікації:&nbsp;телефоном&nbsp;чи через електронну пошту.</li>\\r\\n</ul>\\r\\n<p>Наші фармацевти можуть проконсультувати вас про лікарські засоби та інші товари представлені на нашому сайті, порекомендувати товари, ознайомити з особливостями, способами застосування та з протипоказаннями. В наших спеціалістів ви можете уточнити наявність і оформити замовлення.<br /><br />Також по вказаному номеру телефону ви можете залишити відгук чи скаргу та порекомендувати, як нам стати кращими для вас!</p>"\n}	t	2023-05-10 12:02:27	2024-04-05 09:57:00
\.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             restore.sql                                                                                         0000600 0004000 0002000 00000006422 14634040325 0015371 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        --
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
-- Name: faq_items; Type: TABLE; Schema: public; Owner: etabletka
--

CREATE TABLE public.faq_items (
    id integer NOT NULL,
    author_id integer NOT NULL,
    question json,
    answer json,
    published boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.faq_items OWNER TO etabletka;

--
-- Name: faq_items_id_seq; Type: SEQUENCE; Schema: public; Owner: etabletka
--

CREATE SEQUENCE public.faq_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.faq_items_id_seq OWNER TO etabletka;

--
-- Name: faq_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: etabletka
--

ALTER SEQUENCE public.faq_items_id_seq OWNED BY public.faq_items.id;


--
-- Name: faq_items id; Type: DEFAULT; Schema: public; Owner: etabletka
--

ALTER TABLE ONLY public.faq_items ALTER COLUMN id SET DEFAULT nextval('public.faq_items_id_seq'::regclass);


--
-- Data for Name: faq_items; Type: TABLE DATA; Schema: public; Owner: etabletka
--

COPY public.faq_items (id, author_id, question, answer, published, created_at, updated_at) FROM stdin;
\.
COPY public.faq_items (id, author_id, question, answer, published, created_at, updated_at) FROM '$$PATH$$/3877.dat';

--
-- Name: faq_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: etabletka
--

SELECT pg_catalog.setval('public.faq_items_id_seq', 1, true);


--
-- Name: faq_items PK_72fbce3e53149fa821abbf674ea; Type: CONSTRAINT; Schema: public; Owner: etabletka
--

ALTER TABLE ONLY public.faq_items
    ADD CONSTRAINT "PK_72fbce3e53149fa821abbf674ea" PRIMARY KEY (id);


--
-- Name: faq_items FK_78670b09fcadf84ceb4e528aa85; Type: FK CONSTRAINT; Schema: public; Owner: etabletka
--

ALTER TABLE ONLY public.faq_items
    ADD CONSTRAINT "FK_78670b09fcadf84ceb4e528aa85" FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              