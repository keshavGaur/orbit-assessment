-- Table: public.system_status

-- DROP TABLE IF EXISTS public.system_status;

CREATE TABLE IF NOT EXISTS public.system_status
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    time_stamp time without time zone NOT NULL,
    is_system_up boolean NOT NULL,
    CONSTRAINT system_status_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.system_status
    OWNER to postgres;