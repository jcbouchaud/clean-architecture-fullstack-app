create table invoices (
    id uuid primary key default gen_random_uuid(),
    client_name text not null,
    date_issued date not null,
    date_of_payment date,
    vat_rate numeric not null,
    attachment text
);