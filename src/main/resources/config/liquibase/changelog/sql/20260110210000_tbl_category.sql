--liquibase formatted sql

--changeset developer:20260110210000-7-intpatient1
CREATE TABLE ods.tbl_category_intpatient1 (
    n VARCHAR(1), -- 방사선
    m VARCHAR(1), -- 미생물
    l VARCHAR(1), -- 진검
    p VARCHAR(1), -- 병리
    pt_no varchar,
    in_date varchar,
    out_date varchar
);
insert into ods.tbl_category_intpatient1 (n, m, l, p) values ('Y', 'Y', 'Y', 'Y');

--changeset developer:20260110210000-7-intpatient2
CREATE TABLE ods.tbl_category_intpatient2 (
    e VARCHAR(1), -- 영상
    f VARCHAR(1), -- 내시경
    g VARCHAR(1), -- 기능
    h VARCHAR(1), -- 핵의학
    pt_no varchar,
    in_date varchar,
    out_date varchar

);
insert into ods.tbl_category_intpatient2 (e, f, g, h) values ('Y', 'Y', 'Y', 'Y');

--changeset developer:20260110210000-7-outpatient1
CREATE TABLE ods.tbl_category_outpatient1 (
    n VARCHAR(1), -- 방사선
    m VARCHAR(1), -- 미생물
    l VARCHAR(1), -- 진검
    p VARCHAR(1), -- 병리
    pt_no varchar,
    in_date varchar,
    out_date varchar
);
insert into ods.tbl_category_outpatient1 (n, m, l, p) values ('Y', 'Y', 'Y', 'Y');

--changeset developer:20260110210000-7-outpatient2
CREATE TABLE ods.tbl_category_outpatient2 (
    e VARCHAR(1), -- 영상
    f VARCHAR(1), -- 내시경
    g VARCHAR(1), -- 기능
    h VARCHAR(1), -- 핵의학
    pt_no varchar,
    in_date varchar,
    out_date varchar

);
insert into ods.tbl_category_outpatient2 (e, f, g, h) values ('Y', 'Y', 'Y', 'Y');

--changeset developer:20260110210000-7-emergency1
CREATE TABLE ods.tbl_category_emergency1 (
    n VARCHAR(1), -- 방사선
    m VARCHAR(1), -- 미생물
    l VARCHAR(1), -- 진검
    p VARCHAR(1), -- 병리
    pt_no varchar,
    in_date varchar,
    out_date varchar
);
insert into ods.tbl_category_emergency1 (n, m, l, p) values ('Y', 'Y', 'Y', 'Y');

--changeset developer:20260110210000-7-emergency2
CREATE TABLE ods.tbl_category_emergency2 (
    e VARCHAR(1), -- 영상
    f VARCHAR(1), -- 내시경
    g VARCHAR(1), -- 기능
    h VARCHAR(1), -- 핵의학
    pt_no varchar,
    in_date varchar,
    out_date varchar

);
insert into ods.tbl_category_emergency2 (e, f, g, h) values ('Y', 'Y', 'Y', 'Y');
