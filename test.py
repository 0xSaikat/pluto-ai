import os

PASSWORD = "admin123"

def get_user(name):
    query = f"SELECT * FROM users WHERE name = '{name}'"
    return query

def run_cmd(cmd):
    os.system(cmd)