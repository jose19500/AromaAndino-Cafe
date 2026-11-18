SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS coffeehouse
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE coffeehouse;

CREATE TABLE IF NOT EXISTS cafeteria (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  ciudad VARCHAR(100) NOT NULL,
  direccion VARCHAR(200) NOT NULL,
  telefono VARCHAR(50),
  horario VARCHAR(150) NOT NULL,
  historia TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS servicios (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS productos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  categoria VARCHAR(60) NOT NULL DEFAULT 'Cafés Calientes',
  descripcion VARCHAR(255) NOT NULL,
  precio DECIMAL(8, 2) NOT NULL,
  especialidad TINYINT(1) NOT NULL DEFAULT 0,
  imagen VARCHAR(255) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS multimedia (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('video', 'foto') NOT NULL,
  titulo VARCHAR(150) NOT NULL,
  descripcion VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  poster VARCHAR(255),
  fuente_url VARCHAR(500) NOT NULL
);

CREATE TABLE IF NOT EXISTS contactos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(254) NOT NULL,
  mensaje TEXT NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO cafeteria
  (id, nombre, ciudad, direccion, telefono, horario, historia)
VALUES
  (1, 'Aroma Andino Café', 'Cochabamba, Bolivia',
   'Paseo El Prado #845 esq. Chuquisaca, Zona Central', '+591 4 4529180 · +591 71784320',
   'Lunes a sábado de 07:30 a 21:30 · Domingos de 08:30 a 20:00',
   'Aroma Andino Café & Tostaduría nació en el corazón de Cochabamba para rendir homenaje a los caficultores de altura de Caranavi y los Yungas (1.650 msnm). Tostamos nuestros microlotes cada semana en el local y combinamos métodos de extracción de precisión con pastelería artesanal recién horneada.')
ON DUPLICATE KEY UPDATE
  nombre = VALUES(nombre),
  ciudad = VALUES(ciudad),
  direccion = VALUES(direccion),
  telefono = VALUES(telefono),
  horario = VALUES(horario),
  historia = VALUES(historia);

INSERT INTO servicios (id, nombre, descripcion) VALUES
  (1, 'Salón & Terraza de Especialidad', 'Ambiente cálido con música acústica para disfrutar bebidas de autor y pastelería recién horneada.'),
  (2, 'Pedidos Express & Take Away', 'Ordena tus cafés y postres favoritos en barra con empaques térmicos eco-amigables sin tiempos de espera.'),
  (3, 'Zona Coworking & Reservas', 'Mesas equipadas con enchufes, iluminación cálida y Wi-Fi fibra óptica para reuniones o trabajo remoto.'),
  (4, 'Barra de Métodos Filtrados', 'Extracción en vivo en V60, Chemex, Origami y Prensa Francesa guiada por nuestros baristas.'),
  (5, 'Venta de Café en Grano o Molido', 'Bolsas de 250 g y 500 g de café de especialidad recién tostado, molido al calibre de tu cafetera.'),
  (6, 'Catas y Talleres de Barismo', 'Sesiones semanales de degustación sensorial y arte latte para amantes del buen café.')
ON DUPLICATE KEY UPDATE
  nombre = VALUES(nombre),
  descripcion = VALUES(descripcion);

INSERT INTO productos
  (id, nombre, categoria, descripcion, precio, especialidad, imagen)
VALUES
  (1, 'Cappuccino Andino Rosetta', 'Cafés Calientes', 'Doble ristretto de altura con leche texturizada sedosa y toque de canela orgánica.', 19.00, 1, '/api/media/especialidad-1.jpg'),
  (2, 'Mocaccino Cacao Real 70%', 'Cafés Calientes', 'Espresso intenso fundido con pasta pura de cacao del Beni al 70% y espuma cremosa.', 23.00, 1, '/api/media/especialidad-2.jpg'),
  (3, 'Cold Brew Cítrico & Miel', 'Bebidas Frías', 'Extracción en frío por 18 horas con piel de naranja dulce y miel pura de los valles.', 25.00, 1, '/api/media/especialidad-3.jpg'),
  (4, 'Cheesecake Artesanal de Frutos Rojos', 'Repostería Artesanal', 'Base crocante de galleta con crema suave de queso y compota casera de frambuesa y arándano.', 22.00, 1, '/api/media/producto-7.jpg'),
  (5, 'Flat White Doble Origen', 'Cafés Calientes', 'Doble carga de espresso Caranavi con microespuma fina de leche entera.', 17.00, 0, '/api/media/producto-4.jpg'),
  (6, 'Latte Vainilla & Caramelo', 'Cafés Calientes', 'Café con leche vaporizada e infusión artesanal de vainas de vainilla y caramelo.', 20.00, 0, '/api/media/latte-vainilla.jpg'),
  (7, 'Iced Caramel Frappé', 'Bebidas Frías', 'Espresso batido con hielo, leche fría y reducción de caramelo salado de la casa.', 24.00, 0, '/api/media/affogato.jpg'),
  (8, 'Café en Grano Tueste Medio (250 g)', 'Métodos & Grano', 'Bolsa de café 100% arábica lavado con notas a chocolate, panela y frutos secos.', 48.00, 0, '/api/media/chemex.jpg'),
  (9, 'Croissant Francés de Mantequilla', 'Repostería Artesanal', 'Masa hojaldrada laminada en casa, horneada cada mañana hasta lograr una corteza dorada.', 15.00, 0, '/api/media/croissant.jpg'),
  (10, 'Torre de Brownie & Ganache', 'Repostería Artesanal', 'Brownie húmedo de chocolate amargo cubierto con ganache tibio y nueces.', 18.00, 0, '/api/media/brownie.jpg')
ON DUPLICATE KEY UPDATE
  nombre = VALUES(nombre),
  categoria = VALUES(categoria),
  descripcion = VALUES(descripcion),
  precio = VALUES(precio),
  especialidad = VALUES(especialidad),
  imagen = VALUES(imagen);

INSERT INTO multimedia
  (id, tipo, titulo, descripcion, url, poster, fuente_url)
VALUES
  (1, 'video', 'Arte y Aroma en Cada Extracción',
   'Café de altura de los Yungas tostado en casa, métodos de filtrado y repostería artesanal en el corazón de Cochabamba.',
   '/api/media/portada-cafe.mp4', '/api/media/local-1.jpg',
   'https://www.pexels.com/video/4786575/'),
  (2, 'foto', 'Estación de Espresso & Arte Latte',
   'Barra principal en madera rústica equipada con máquina profesional y molinos de especialidad.',
   '/api/media/local-1.jpg', NULL,
   'https://www.pexels.com/photo/683039/'),
  (3, 'foto', 'Salón y Mesas de Encuentro',
   'Espacio iluminado con luz natural, plantas y mesas cómodas para disfrutar o trabajar.',
   '/api/media/local-2.jpg', NULL,
   'https://www.pexels.com/photo/1307698/'),
  (4, 'foto', 'Experiencia de Filtrados y Repostería',
   'Mesa de degustación con métodos artesanales, café de origen y acompañamientos frescos.',
   '/api/media/local-3.jpg', NULL,
   'https://www.pexels.com/photo/2074130/'),
  (5, 'foto', 'Barra de Pedidos y Pizarra del Día',
   'Atención personalizada por nuestros baristas con selección diaria de granos bolivianos.',
   '/api/media/local-4.jpg', NULL,
   'https://www.pexels.com/photo/1833769/')
ON DUPLICATE KEY UPDATE
  tipo = VALUES(tipo),
  titulo = VALUES(titulo),
  descripcion = VALUES(descripcion),
  url = VALUES(url),
  poster = VALUES(poster),
  fuente_url = VALUES(fuente_url);
