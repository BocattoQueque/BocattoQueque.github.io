-- Ejecutar una vez en el SQL Editor de un proyecto Supabase nuevo.
-- Las reseñas son públicas; los datos de contacto solo son visibles al administrador.
begin;
create table public.resenas (
  id bigint generated always as identity primary key,
  nombre text not null check (char_length(trim(nombre)) between 1 and 80),
  calificacion integer not null check (calificacion between 1 and 5),
  comentario text not null check (char_length(trim(comentario)) between 1 and 1000),
  fecha timestamptz not null default now()
);
alter table public.resenas enable row level security;
revoke all on public.resenas from anon, authenticated;
grant select on public.resenas to anon, authenticated;
grant insert (nombre, calificacion, comentario) on public.resenas to anon, authenticated;
grant usage on sequence public.resenas_id_seq to anon, authenticated;
create policy "Lectura publica de resenas" on public.resenas
  for select to anon, authenticated using (true);
create policy "Publicacion de resenas" on public.resenas
  for insert to anon, authenticated with check (
    char_length(trim(nombre)) between 1 and 80 and
    char_length(trim(comentario)) between 1 and 1000 and calificacion between 1 and 5
  );
create index resenas_fecha_idx on public.resenas (fecha desc, id desc);

create table public.interesados (
  id bigint generated always as identity primary key,
  nombre text not null check (char_length(trim(nombre)) between 1 and 80),
  email text not null check (char_length(email) between 3 and 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  consentimiento boolean not null check (consentimiento = true),
  fecha timestamptz not null default now()
);
alter table public.interesados enable row level security;
revoke all on public.interesados from anon, authenticated;
grant insert (nombre, email, consentimiento) on public.interesados to anon, authenticated;
grant usage on sequence public.interesados_id_seq to anon, authenticated;
create policy "Registro privado de interes" on public.interesados
  for insert to anon, authenticated with check (consentimiento = true);
-- No hay políticas SELECT, UPDATE ni DELETE para visitantes sobre interesados.
commit;
