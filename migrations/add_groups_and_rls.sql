-- 1. Crear tabla de grupos
create table if not exists groups (
  id          uuid            default uuid_generate_v4() primary key,
  name        text            not null,
  owner_id    uuid            references auth.users(id)   on delete set null,
  created_at  timestamptz     default now()
);

-- 2. Tabla pivote usuarios ↔ grupos
create table if not exists group_users (
  group_id    uuid            references groups(id)        on delete cascade,
  user_id     uuid            references auth.users(id)    on delete cascade,
  role        text            check (role in ('member','admin')) default 'member',
  joined_at   timestamptz     default now(),
  primary key (group_id, user_id)
);

-- 3. Extender tabla ideas para apuntar a un grupo (null = idea privada)
alter table ideas
  add column if not exists group_id uuid references groups(id) on delete set null;

-- 4. Activar RLS en ideas
alter table ideas enable row level security;

-- 5. Políticas RLS

-- SELECT: propio o de grupo
drop policy if exists "ideas_select_own_or_group" on ideas;
create policy "ideas_select_own_or_group" on ideas
  for select using (
       auth.uid() = user_id
    or (
        group_id   is not null
     and exists(
           select 1
             from group_users
            where group_id = ideas.group_id
              and user_id  = auth.uid()
        )
    )
  );

-- INSERT: privados o en tu grupo
drop policy if exists "ideas_insert_own_or_group" on ideas;
create policy "ideas_insert_own_or_group" on ideas
  for insert with check (
       auth.uid() = user_id
    and (
         group_id is null
      or exists(
             select 1
               from group_users
              where group_id = ideas.group_id
                and user_id  = auth.uid()
         )
    )
  );

-- UPDATE: propio o de grupo, sin cambiar owner
drop policy if exists "ideas_update_own_or_group" on ideas;
create policy "ideas_update_own_or_group" on ideas
  for update using (
       auth.uid() = user_id
    or (
        group_id   is not null
     and exists(
           select 1
             from group_users
            where group_id = ideas.group_id
              and user_id  = auth.uid()
        )
    )
  )
  with check (user_id = user_id);

-- DELETE: propio o de grupo
drop policy if exists "ideas_delete_own_or_group" on ideas;
create policy "ideas_delete_own_or_group" on ideas
  for delete using (
       auth.uid() = user_id
    or (
        group_id   is not null
     and exists(
           select 1
             from group_users
            where group_id = ideas.group_id
              and user_id  = auth.uid()
        )
    )
  );
