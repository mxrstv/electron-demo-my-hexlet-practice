CREATE TABLE org_types (
	id serial PRIMARY KEY,
	name varchar(10) NOT NULL UNIQUE
);

INSERT INTO org_types (id, name) VALUES
	(1, 'ЗАО'),
	(2, 'ООО'),
	(3, 'ПАО'),
	(4, 'ОАО');

CREATE TABLE partners (
	id serial PRIMARY KEY,
	name text NOT NULL UNIQUE,
	director text,
	email text,
	phone text,
	inn varchar(12) NOT NULL UNIQUE,
	address text,
	rating integer,
	org_type_id integer NOT NULL REFERENCES	org_types (id)		
);

INSERT INTO partners (org_type_id, id, name, director, email, phone, address, inn, rating) VALUES 
	(1, 1, 'База Строитель', 'Иванова Александра Ивановна', 'aleksandraivanova@ml.ru', '493 123 45 67', '652050, Кемеровская область, город Юрга, ул. Лесная, 15', '2222455179', 7),
	(2, 2, 'Паркет 29', 'Петров Василий Петрович', 'vppetrov@vl.ru', '987 123 56 78', '164500, Архангельская область, город Северодвинск, ул. Строителей, 18', '3333888520', 7),
	(3, 3, 'Стройсервис', 'Соловьев Андрей Николаевич', 'ansolovev@st.ru', '812 223 32 00', '188910, Ленинградская область, город Приморск, ул. Парковая, 21', '4440391035', 7),
	(4, 4, 'Ремонт и отделка','Воробьева Екатерина Валерьевна', 'ekaterina.vorobeva@ml.ru', '444 222 33 11', '143960, Московская область, город Реутов, ул. Свободы, 51', '1111520857', 5),
	(1, 5, 'МонтажПро','Степанов Степан Сергеевич', 'stepanov@stepan.ru', '912 888 33 33', '309500, Белгородская область, город Старый Оскол, ул. Рабочая, 122', '5552431140', 10);

select setval('partners_id_seq', 5);

CREATE TABLE product_types (
	id serial PRIMARY KEY,
	name text NOT NULL UNIQUE,
	rate numeric(10,2) NOT NULL
);

INSERT INTO product_types (id, name, rate) VALUES
	(1, 'Ламинат', 2.35),
	(2, 'Массивная доска', 5.15),
	(3, 'Паркетная доска', 4.34),
	(4, 'Пробковое покрытие', 1.5);
	
CREATE TABLE products (
	id serial PRIMARY KEY,
	name text NOT NULL UNIQUE,
	code text NOT NULL UNIQUE,
	price numeric(10,2) NOT NULL,
	product_type_id integer NOT NULL REFERENCES product_types (id)
);

INSERT INTO products (id, product_type_id, name, code, price) VALUES
	(1, 3, 'Паркетная доска Ясень темный однополосная 14 мм', '8758385', 4456.90),
	(2, 3, 'Инженерная доска Дуб Французская елка однополосная 12 мм', '8858958', 7330.99),
	(3, 1, 'Ламинат Дуб дымчато-белый 33 класс 12 мм', '7750282', 1799.33),
	(4, 1, 'Ламинат Дуб серый 32 класс 8 мм с фаской', '7028748', 3890.41),
	(5, 4, 'Пробковое напольное клеевое покрытие 32 класс 4 мм', '5012543', 5450.59);


CREATE TABLE orders (
	product_id integer NOT NULL REFERENCES products (id),
	partner_id integer NOT NULL REFERENCES partners (id),
	kolio numeric(10,2) NOT NULL,
	"date" date NOT NULL
);

INSERT INTO orders (product_id, partner_id, kolio, date) VALUES
	(1, 2, 35000, '02.12.2022'),
	(1, 3, 2500, '05.07.2024'),
	(1, 5, 25000, '12.06.2024'),
	(2, 1, 12350, '18.12.2023'),
	(2, 2, 1000, '07.06.2024'),
	(2, 4, 37200, '12.03.2024'),
	(2, 5, 50000, '19.09.2023'),
	(3, 1, 37400, '07.06.2024'),
	(3, 4, 59050, '20.03.2023'),
	(3, 5, 670000, '10.11.2023'),
	(4, 1, 15500, '23.03.2023'),
	(4, 2, 7550, '01.07.2024'),
	(4, 3, 7250, '22.01.2023'),
	(4, 5, 35000, '15.04.2024'),
	(5, 2, 1250, '17.05.2023'),
	(5, 4, 4500, '14.05.2024');

