-- Table: public.jobs_raw

-- DROP TABLE IF EXISTS public.jobs_raw;

CREATE TABLE IF NOT EXISTS public.jobs_raw
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    title text COLLATE pg_catalog."default" NOT NULL,
    source_type text COLLATE pg_catalog."default" NOT NULL,
    is_valid boolean,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT jobs_raw_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.jobs_raw
    OWNER to postgres;