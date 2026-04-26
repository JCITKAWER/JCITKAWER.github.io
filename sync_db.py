import requests
import re
import os

URL = "https://zafngjvhbtrytoeahzcc.supabase.co/rest/v1/tickets"
KEY = "sb_publishable__EhVlw40Om9Xg2rosA3nIg_LFvbvaAL"

headers = {
    "apikey": KEY,
    "Authorization": f"Bearer {KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

try:
    with open("upload_to_supabase.sql", "r") as f:
        sql = f.read()

    # Extract ('TKW-001', '...')
    matches = re.findall(r"\('([^']+)',\s*'([^']+)'\)", sql)

    payload = []
    for ref, token in matches:
        payload.append({
            "reference": ref,
            "secret_token": token,
            "status": "VALID"
        })

    print(f"Direct Linking: Feeding {len(payload)} tickets...")
    r = requests.post(URL, headers=headers, json=payload)

    if r.status_code in [200, 201]:
        print("DATABASE SYNCHRONIZED: All 50 tickets are now scannable.")
    else:
        print(f"SYNC FAILED: {r.status_code}")
        print(r.text)
        print("\nNOTE: If you get 404, please run the SQL schema first in Supabase Dashboard.")

except Exception as e:
    print(f"Script Error: {e}")
