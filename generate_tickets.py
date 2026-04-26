import qrcode
import os
import uuid

# Configuration
OUTPUT_DIR = "tickets_qr"
MAPPING_FILE = "ticket_secrets.txt"
SQL_FILE = "upload_to_supabase.sql"

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

try:
    count_str = input("How many tickets do you want to generate? ")
    count = int(count_str)
except ValueError:
    print("Invalid number. Using 10 as default.")
    count = 10

print(f"Generating {count} secure tickets...")

with open(MAPPING_FILE, "w") as f_map, open(SQL_FILE, "w") as f_sql:
    f_map.write("REF | SECRET_TOKEN\n" + "-"*30 + "\n")
    f_sql.write("-- COPY AND RUN THIS IN SUPABASE SQL EDITOR\n")
    f_sql.write("INSERT INTO public.tickets (reference, secret_token) VALUES\n")
    
    for i in range(1, count + 1):
        ref = f"TKW-{i:03d}"
        secret_token = str(uuid.uuid4())
        
        # QR Code
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(secret_token)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        img.save(os.path.join(OUTPUT_DIR, f"{ref}.png"))
        
        # File Mappings
        f_map.write(f"{ref} | {secret_token}\n")
        
        # SQL Values
        comma = "," if i < count else ";"
        f_sql.write(f"('{ref}', '{secret_token}'){comma}\n")

print(f"\n✅ SUCCESS!")
print(f"1. QR Images: Check the '{OUTPUT_DIR}' folder.")
print(f"2. Database: Copy the code from '{SQL_FILE}' into Supabase SQL Editor and click RUN.")
print(f"3. Private Records: '{MAPPING_FILE}' contains the secrets.")
