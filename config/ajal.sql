-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-06-2020 a las 06:09:17
-- Versión del servidor: 10.4.11-MariaDB
-- Versión de PHP: 7.4.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

--
-- Base de datos: ajal
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla empleados
--

CREATE TABLE empleados (
  idEmpleado int(11) NOT NULL,
  nombre varchar(45) NOT NULL,
  apellidos varchar(45) NOT NULL,
  telefono varchar(20) DEFAULT NULL,
  email varchar(40) DEFAULT NULL,
  direccion varchar(60) DEFAULT NULL,
  estado tinyint(4) NOT NULL,
  admin tinyint(4) NOT NULL,
  password varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla empleados
--

INSERT INTO empleados (idEmpleado, nombre, apellidos, telefono, email, direccion, estado, admin, password) VALUES
(1, 'name', 'lastname', '00000000', 'admin@admin.com', 'admins house', 1, 1, '1f3165d9c0f355332fd86dfd7c1ce5b7a65bd9ca6406c8a445ec1da83ac0bda8b4570713d114adae84a53e6b4d5e19c4631f30e42a146ba75630995a3801b994');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla tokens
--

CREATE TABLE tokens (
  idToken int(11) NOT NULL,
  token varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla empleados
--
ALTER TABLE empleados
  ADD PRIMARY KEY (idEmpleado);

--
-- Indices de la tabla tokens
--
ALTER TABLE tokens
  ADD PRIMARY KEY (idToken);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla empleados
--
ALTER TABLE empleados
  MODIFY idEmpleado int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla tokens
--
ALTER TABLE tokens
  MODIFY idToken int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
