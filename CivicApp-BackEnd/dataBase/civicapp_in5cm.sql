create database if not exists civicapp_in5cm;
use civicapp_in5cm;

create table usuario (
    id_usuario int auto_increment primary key,
    correo varchar(150) not null unique,
    contrasenia varchar(255) not null,
    rol varchar(50) not null
);

create table ciudadano (
    id_ciudadano int auto_increment primary key,
    id_usuario int not null,
    nombre varchar(100) not null,
    telefono varchar(20),
    foreign key (id_usuario) references usuario(id_usuario) on delete cascade
);

create table institucion (
    id_institucion int auto_increment primary key,
    id_usuario int not null,
    nombre_institucion varchar(150) not null,
    foreign key (id_usuario) references usuario(id_usuario) on delete cascade
);

create table categoria (
    id_categoria int auto_increment primary key,
    nombre_categoria varchar(100) not null unique
);

create table estado (
    id_estado int auto_increment primary key,
    nombre_estado varchar(50) not null unique
);

create table denuncia (
    id_denuncia int auto_increment primary key,
    id_ciudadano int not null,
    id_categoria int not null,
    id_estado int not null,
    descripcion text not null,
    latitud decimal(10, 8) not null,
    longitud decimal(11, 8) not null,
    fecha_creacion timestamp default current_timestamp,
    foreign key (id_ciudadano) references ciudadano(id_ciudadano) on delete cascade,
    foreign key (id_categoria) references categoria(id_categoria),
    foreign key (id_estado) references estado(id_estado)
);

create table evidencia (
    id_evidencia int auto_increment primary key,
    id_denuncia int not null,
    ruta_archivo varchar(255) not null,
    foreign key (id_denuncia) references denuncia(id_denuncia) on delete cascade
);

create table comentario (
    id_comentario int auto_increment primary key,
    id_denuncia int not null,
    id_usuario int not null,
    texto_comentario text not null,
    fecha_comentario timestamp default current_timestamp,
    foreign key (id_denuncia) references denuncia(id_denuncia) on delete cascade,
    foreign key (id_usuario) references usuario(id_usuario) on delete cascade
);

create table seguimiento (
    id_seguimiento int auto_increment primary key,
    id_denuncia int not null,
    id_estado_anterior int,
    id_estado_nuevo int not null,
    fecha_cambio timestamp default current_timestamp,
    foreign key (id_denuncia) references denuncia(id_denuncia) on delete cascade,
    foreign key (id_estado_anterior) references estado(id_estado),
    foreign key (id_estado_nuevo) references estado(id_estado)
);

create table notificacion (
    id_notificacion int auto_increment primary key,
    id_usuario int not null,
    mensaje_notificacion varchar(255) not null,
    leido tinyint(1) default 0,
    fecha_envio timestamp default current_timestamp,
    foreign key (id_usuario) references usuario(id_usuario) on delete cascade
);