-- stress_seed.sql
-- Appends a large, realistic dataset without truncating existing data.
-- Requires pgcrypto (gen_random_uuid), enabled by default on Supabase.

DO $$
DECLARE
  -- ================================
  -- TUNABLES (adjust to your needs)
  -- ================================
  v_org_count                INT := 100;     -- how many orgs to create
  v_users_per_org            INT := 6;     -- users per org (admin/tech/installer/dispatcher/etc.)
  v_clients_per_org          INT := 200;   -- clients per org (↑ this to 500+ to really stress UI)
  v_max_leads_per_client     INT := 2;     -- 0..N leads per client
  v_max_estimates_per_client INT := 3;     -- 0..N estimates per client
  v_job_prob_from_estimate   NUMERIC := 0.7;  -- chance an estimate spawns a job
  v_invoice_prob_from_job    NUMERIC := 0.9;  -- chance a job spawns an invoice
  v_payment_full_prob        NUMERIC := 0.7;  -- chance an invoice gets paid in full
  v_payment_partial_prob     NUMERIC := 0.15; -- chance an invoice gets a partial payment
  v_price_book_items_per_org INT := 20;    -- random items per price book
  v_inventory_items_per_org  INT := 25;    -- inventory SKUs per org
  v_stock_moves_per_item     INT := 3;     -- stock movements per inventory item
  v_now TIMESTAMP := now();

  -- helpers
  i INT; j INT; k INT; m INT;
  org_id UUID;
  wh_id UUID;
  price_book_id UUID;
  sp1 UUID; sp2 UUID;

  user_ids UUID[];         -- users for this org
  client_id UUID;
  lead_source_ids UUID[];
  client_city TEXT;
  client_state TEXT;
  client_zip TEXT;

  estimate_id UUID;
  job_id UUID;
  invoice_id UUID;

  subtotal NUMERIC;
  tax NUMERIC;
  total NUMERIC;

  -- pools
  first_names TEXT[] := ARRAY[
    'Alex','Jordan','Taylor','Casey','Morgan','Riley','Avery','Parker','Reese','Quinn',
    'Jamie','Cameron','Drew','Rowan','Kendall','Sydney','Logan','Hayden','Skyler','Sawyer'
  ];
  last_names TEXT[] := ARRAY[
    'McDaniel','Cameron','Brooks','Ramirez','Nguyen','Patel','Jackson','Reed','Foster','Carter',
    'Miller','Diaz','Howard','Bennett','Rivera','Cruz','Cooper','Barnes','Hughes','Murphy'
  ];
  cities TEXT[] := ARRAY['Texarkana','Dallas','Plano','Frisco','Little Rock','Shreveport','Garland','Irving','McKinney','Arlington'];
  states TEXT[] := ARRAY['TX','AR','LA','OK'];
  zips   TEXT[] := ARRAY['75501','75503','75204','75023','75034','72201','71101','75040','75038','76010'];

  lead_source_names TEXT[] := ARRAY['Facebook Ads','Referral','Google/SEO','Door Hanger','Yard Sign','Repeat Customer'];
  item_names TEXT[] := ARRAY[
    'Residential Diagnostic','Run Capacitor 45/5 µF','Evaporator Coil Clean','Fall Furnace Tune-Up',
    'Condensing Fan Motor','Blower Motor','Contactors','Hard Start Kit','TXV Replacement',
    'Refrigerant Top-Off (R410A)','Duct Repair (minor)','Filter Dryer Replacement','Acid Flush',
    'Float Switch Install','Surge Protector','Pan Treatment','Thermostat Replacement','Heat Exchanger Clean',
    'Heat Strip Replacement','Mini-Split Service'
  ];
  units TEXT[] := ARRAY['ea','hr','lb','ft','gal'];
  methods TEXT[] := ARRAY['card','cash','check','ach'];
  job_statuses TEXT[] := ARRAY['scheduled','in_progress','completed','canceled'];
  estimate_statuses TEXT[] := ARRAY['draft','sent','approved','declined'];
  inv_statuses TEXT[] := ARRAY['draft','sent','paid','partial'];

  -- simple helpers
  FUNCTION pick1(arr ANYARRAY) RETURNS anyelement LANGUAGE plpgsql AS $f$
  BEGIN
    RETURN arr[1 + floor(random() * array_length(arr,1))::INT];
  END $f$;

  FUNCTION rand_phone() RETURNS TEXT LANGUAGE plpgsql AS $f$
  BEGIN
    RETURN '+1-'|| (200+floor(random()*700))::INT || '-' ||
           lpad((floor(random()*1000))::INT::TEXT,3,'0') || '-' ||
           lpad((floor(random()*10000))::INT::TEXT,4,'0');
  END $f$;

  FUNCTION rand_email(first TEXT, last TEXT) RETURNS TEXT LANGUAGE plpgsql AS $f$
  DECLARE
    domains TEXT[] := ARRAY['example.com','mail.com','inbox.com','email.net'];
  BEGIN
    RETURN lower(first||'.'||last||'@'||pick1(domains));
  END $f$;

  FUNCTION money_between(lo NUMERIC, hi NUMERIC) RETURNS NUMERIC LANGUAGE plpgsql AS $f$
  BEGIN
    RETURN round( (lo + (hi-lo)*random())::numeric, 2);
  END $f$;

  FUNCTION sku_like(name TEXT) RETURNS TEXT LANGUAGE plpgsql AS $f$
  BEGIN
    RETURN regexp_replace(upper(name), '[^A-Z0-9]+','-','g') || '-' || (10+floor(random()*90))::INT;
  END $f$;

BEGIN
  FOR i IN 1..v_org_count LOOP
    -- ORG
    org_id := gen_random_uuid();
    INSERT INTO organizations (id, name, created_at)
    VALUES (org_id, 'Stress Org '||i, v_now - (i||' days')::INTERVAL);

    -- USERS (no users table; we just create UUIDs for user_orgs/timesheets/attachments)
    user_ids := ARRAY[]::UUID[];
    FOR j IN 1..v_users_per_org LOOP
      user_ids := user_ids || gen_random_uuid();
      INSERT INTO user_orgs (user_id, org_id, role)
      VALUES (user_ids[array_length(user_ids,1)], org_id,
              CASE j
                WHEN 1 THEN 'admin'
                WHEN 2 THEN 'tech'
                WHEN 3 THEN 'installer'
                WHEN 4 THEN 'dispatcher'
                ELSE 'member'
              END);
    END LOOP;

    -- WAREHOUSE
    wh_id := gen_random_uuid();
    INSERT INTO warehouses (id, org_id, name, location)
    VALUES (wh_id, org_id, 'Main Warehouse', pick1(cities)||', '||pick1(states));

    -- PRICE BOOK
    price_book_id := gen_random_uuid();
    INSERT INTO price_books (id, org_id, name, description)
    VALUES (price_book_id, org_id, 'Standard Book '||i, 'Auto-generated stress book');

    -- PRICE BOOK ITEMS
    FOR j IN 1..v_price_book_items_per_org LOOP
      PERFORM 1;
      INSERT INTO price_book_items (id, price_book_id, sku, name, description, unit, base_cost, sell_price)
      VALUES (
        gen_random_uuid(),
        price_book_id,
        sku_like(pick1(item_names)),
        pick1(item_names),
        'Auto-generated item',
        pick1(units),
        money_between(10,120),
        money_between(60,600)
      );
    END LOOP;

    -- SERVICE PLANS
    sp1 := gen_random_uuid();
    sp2 := gen_random_uuid();
    INSERT INTO service_plans (id, org_id, name, description, interval, price) VALUES
      (sp1, org_id, 'Home Comfort Basic '||i, '1 tune-up / year', 'annual', money_between(99,149)),
      (sp2, org_id, 'Home Comfort Plus '||i,  '2 tune-ups / year','annual', money_between(159,249));

    -- LEAD SOURCES
    lead_source_ids := ARRAY[]::UUID[];
    FOREACH j IN ARRAY ARRAY[1,2,3,4] LOOP
      lead_source_ids := lead_source_ids || gen_random_uuid();
      INSERT INTO lead_sources (id, org_id, name)
      VALUES (lead_source_ids[array_length(lead_source_ids,1)], org_id, pick1(lead_source_names));
    END LOOP;

    -- INVENTORY
    FOR j IN 1..v_inventory_items_per_org LOOP
      DECLARE inv_id UUID := gen_random_uuid();
      BEGIN
        INSERT INTO inventory_items (id, org_id, sku, name, description, unit, qty, warehouse_id)
        VALUES (
          inv_id, org_id,
          sku_like(pick1(item_names)),
          pick1(item_names),
          'Inventory item',
          pick1(units),
          (10 + floor(random()*90))::INT,
          wh_id
        );

        -- Stock movements (init load, a few random uses)
        INSERT INTO stock_movements (id, inventory_item_id, change, reason, created_at)
        VALUES (gen_random_uuid(), inv_id, + (10 + floor(random()*50))::INT, 'Initial load', v_now - (7||' days')::INTERVAL);

        FOR m IN 1..v_stock_moves_per_item-1 LOOP
          INSERT INTO stock_movements (id, inventory_item_id, change, reason, created_at)
          VALUES (gen_random_uuid(), inv_id, - (1 + floor(random()*5))::INT, 'Usage', v_now - (floor(random()*6)::INT||' days')::INTERVAL);
        END LOOP;
      END;
    END LOOP;

    -- CLIENTS (+ addresses, contacts, leads, estimates/items, jobs, invoices/items, payments, plans)
    FOR j IN 1..v_clients_per_org LOOP
      DECLARE
        fn TEXT := pick1(first_names);
        ln TEXT := pick1(last_names);
        nm TEXT := fn||' '||ln;
        email TEXT := rand_email(fn, ln);
        phone TEXT := rand_phone();
        contact_chance NUMERIC := random();
        lead_count INT := floor(random() * (v_max_leads_per_client+1))::INT;
        est_count  INT := floor(random() * (v_max_estimates_per_client+1))::INT;
        plan_pick  NUMERIC := random();
        address_id UUID := gen_random_uuid();
        contact_id UUID;
      BEGIN
        client_id := gen_random_uuid();
        INSERT INTO clients (id, org_id, name, email, phone, notes, created_at)
        VALUES (client_id, org_id, nm, email, phone, NULL, v_now - (floor(random()*30)::INT||' days')::INTERVAL);

        -- address
        client_city  := pick1(cities);
        client_state := pick1(states);
        client_zip   := pick1(zips);
        INSERT INTO addresses (id, client_id, label, line1, city, state, postal_code, created_at)
        VALUES (address_id, client_id, 'Home', (100 + floor(random()*9000))::INT || ' ' || pick1(last_names) || ' St',
                client_city, client_state, client_zip, v_now - (floor(random()*30)::INT||' days')::INTERVAL);

        -- optional extra contact
        IF contact_chance > 0.7 THEN
          contact_id := gen_random_uuid();
          INSERT INTO client_contacts (id, client_id, name, email, phone)
          VALUES (contact_id, client_id, pick1(first_names)||' '||pick1(last_names), rand_email('contact', ln), rand_phone());
        END IF;

        -- leads
        FOR k IN 1..lead_count LOOP
          INSERT INTO leads (id, org_id, client_id, source_id, status, notes, created_at)
          VALUES (gen_random_uuid(), org_id, client_id, pick1(lead_source_ids),
                  pick1(ARRAY['new','contacted','qualified','lost']),
                  'Auto-generated lead', v_now - (floor(random()*20)::INT||' days')::INTERVAL);
        END LOOP;

        -- estimates & items; maybe jobs; maybe invoices & items; maybe payments
        FOR k IN 1..est_count LOOP
          estimate_id := gen_random_uuid();
          -- random financials via 1-3 line items
          subtotal := 0;
          FOR m IN 1..(1 + floor(random()*3))::INT LOOP
            subtotal := subtotal + money_between(79, 650);
          END LOOP;
          tax := round(subtotal * 0.0825, 2);
          total := round(subtotal + tax, 2);

          INSERT INTO estimates (id, org_id, client_id, created_by, title, status, valid_until, subtotal, tax, total, notes, created_at)
          VALUES (
            estimate_id, org_id, client_id, pick1(user_ids),
            'Estimate #'||estimate_id::TEXT,
            pick1(estimate_statuses),
            (v_now + (14||' days')::INTERVAL)::DATE,
            subtotal, tax, total,
            'Auto-generated estimate',
            v_now - (floor(random()*15)::INT||' days')::INTERVAL
          );

          -- 1–3 estimate items
          FOR m IN 1..(1 + floor(random()*3))::INT LOOP
            DECLARE
              label TEXT := pick1(item_names);
              up NUMERIC := money_between(79, 450);
              q NUMERIC := (1 + floor(random()*3))::INT;
            BEGIN
              INSERT INTO estimate_items (id, estimate_id, label, unit, qty, unit_price, subtotal, created_at)
              VALUES (gen_random_uuid(), estimate_id, label, 'ea', q, up, round(q*up,2), v_now - (floor(random()*15)::INT||' days')::INTERVAL);
            END;
          END LOOP;

          -- sometimes spawn a job
          IF random() < v_job_prob_from_estimate THEN
            job_id := gen_random_uuid();
            INSERT INTO jobs (id, org_id, client_id, estimate_id, scheduled_at, status, assigned_to, notes, created_at)
            VALUES (
              job_id, org_id, client_id, estimate_id,
              v_now + ((1 + floor(random()*10))::INT||' days')::INTERVAL,
              pick1(job_statuses),
              pick1(user_ids),
              'Auto-generated job',
              v_now - (floor(random()*10)::INT||' days')::INTERVAL
            );

            -- sometimes spawn an invoice
            IF random() < v_invoice_prob_from_job THEN
              invoice_id := gen_random_uuid();

              INSERT INTO invoices (id, org_id, client_id, job_id, status, issue_date, due_date, subtotal, tax, total, notes, created_at)
              VALUES (
                invoice_id, org_id, client_id, job_id,
                pick1(inv_statuses),
                (v_now - (floor(random()*5)::INT||' days')::INTERVAL)::DATE,
                (v_now + (15||' days')::INTERVAL)::DATE,
                subtotal, tax, total, 'Auto-generated invoice',
                v_now - (floor(random()*5)::INT||' days')::INTERVAL
              );

              -- invoice items (mirror 1–3 lines)
              FOR m IN 1..(1 + floor(random()*3))::INT LOOP
                DECLARE
                  lbl TEXT := pick1(item_names);
                  up2 NUMERIC := money_between(79, 450);
                  q2 NUMERIC := (1 + floor(random()*3))::INT;
                BEGIN
                  INSERT INTO invoice_items (id, invoice_id, label, unit, qty, unit_price, subtotal, created_at)
                  VALUES (gen_random_uuid(), invoice_id, lbl, 'ea', q2, up2, round(q2*up2,2), v_now - (floor(random()*5)::INT||' days')::INTERVAL);
                END;
              END LOOP;

              -- payments (maybe full, maybe partial, maybe none)
              IF random() < v_payment_full_prob THEN
                INSERT INTO payments (id, invoice_id, amount, method, received_at, notes)
                VALUES (gen_random_uuid(), invoice_id, total, pick1(methods), v_now - (floor(random()*3)::INT||' days')::INTERVAL, 'Paid in full');
              ELSIF random() < v_payment_partial_prob THEN
                INSERT INTO payments (id, invoice_id, amount, method, received_at, notes)
                VALUES (gen_random_uuid(), invoice_id, round(total * money_between(0.2, 0.8), 2), pick1(methods), v_now - (floor(random()*3)::INT||' days')::INTERVAL, 'Partial payment');
              END IF;

              -- attachments on some invoices/estimates
              IF random() < 0.2 THEN
                INSERT INTO attachments (id, org_id, related_type, related_id, url, uploaded_by, created_at)
                VALUES (gen_random_uuid(), org_id, 'invoice', invoice_id, 'https://picsum.photos/seed/'||substring(invoice_id::text,1,6)||'/800/600', pick1(user_ids), v_now);
              END IF;
              IF random() < 0.2 THEN
                INSERT INTO attachments (id, org_id, related_type, related_id, url, uploaded_by, created_at)
                VALUES (gen_random_uuid(), org_id, 'estimate', estimate_id, 'https://picsum.photos/seed/'||substring(estimate_id::text,1,6)||'/800/600', pick1(user_ids), v_now);
              END IF;
            END IF;
          END IF; -- job/invoice
        END LOOP; -- estimates

        -- optional plan subscription
        IF plan_pick > 0.7 THEN
          INSERT INTO plan_subscriptions (id, plan_id, client_id, start_date, end_date, active)
          VALUES (gen_random_uuid(), CASE WHEN random() < 0.5 THEN sp1 ELSE sp2 END, client_id,
                  (v_now - (floor(random()*300)::INT||' days')::INTERVAL)::DATE, NULL, true);
        END IF;

      END;
    END LOOP; -- clients

    -- timesheets for users (one recent entry each)
    FOREACH org_id IN ARRAY ARRAY[org_id] LOOP
      FOR k IN 1..array_length(user_ids,1) LOOP
        INSERT INTO timesheets (id, user_id, org_id, clock_in, clock_out, created_at)
        VALUES (
          gen_random_uuid(),
          user_ids[k],
          org_id,
          v_now - (8||' hours')::INTERVAL,
          v_now - (1||' hours')::INTERVAL,
          v_now
        );
      END LOOP;
    END LOOP;

  END LOOP; -- org loop
END $$;
