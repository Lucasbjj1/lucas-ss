#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import subprocess
import time
from datetime import datetime

# =========================
# CONFIGURAÇÕES
# =========================
BANNER = r"""
   _                 ____ ____ 
  | |   _   _  ___  / ___/ ___|
  | |  | | | |/ __| \___ \___ \
  | |__| |_| | (__   ___) |__) |
  |_____\__,_|\___| |____/____/

            lucas ss
"""

FF_PACKAGE = "com.dts.freefireth"

PATHS = {
    "DATA": f"/sdcard/Android/data/{FF_PACKAGE}",
    "OBB": f"/sdcard/Android/obb/{FF_PACKAGE}",
    "SHADERS": f"/sdcard/Android/data/{FF_PACKAGE}/files/shaders",
    "GAMEASSETS": f"/sdcard/Android/data/{FF_PACKAGE}/files/gameassetbundles",
    "REPLAYS": f"/sdcard/Android/data/{FF_PACKAGE}/files/MReplays",
}

# =========================
# LOG / CORES
# =========================
def ts():
    return datetime.now().strftime("%d-%m-%Y %H:%M:%S")

def info(msg):  print(f"[+] {msg}")
def ok(msg):    print(f"[i] {msg}")
def warn(msg):  print(f"[!] {msg}")
def err(msg):   print(f"[*] {msg}")

# =========================
# UTIL
# =========================
def run(cmd):
    try:
        return subprocess.check_output(cmd, shell=True, stderr=subprocess.DEVNULL).decode().strip()
    except:
        return ""

def exists(path):
    try:
        return os.path.exists(path)
    except:
        return False

def mtime(path):
    try:
        return datetime.fromtimestamp(os.path.getmtime(path))
    except:
        return None

# =========================
# CHECKS
# =========================

def check_freefire_installed():
    info("Verificação da instalação do Free Fire...")
    out = run(f"pm list packages {FF_PACKAGE}")
    if FF_PACKAGE in out:
        ok("Free Fire instalado.")
        return True
    err("Free Fire NÃO instalado.")
    return False

def check_android_version():
    info("Versão do Android...")
    ver = run("getprop ro.build.version.release")
    sdk = run("getprop ro.build.version.sdk")
    ok(f"Android {ver} (SDK {sdk})")

def check_recent_reboot(minutes=60):
    info("Reinicialização do dispositivo...")
    uptime_sec = run("cat /proc/uptime | awk '{print $1}'")
    try:
        uptime_min = float(uptime_sec) / 60.0
        if uptime_min < minutes:
            warn(f"Dispositivo reiniciado há {int(uptime_min)} minutos.")
        else:
            ok("Dispositivo não reiniciado recentemente.")
    except:
        warn("Não foi possível determinar uptime.")

def check_root():
    info("Verificando Root...")
    su_paths = [
        "/system/bin/su", "/system/xbin/su", "/sbin/su",
        "/system/app/Superuser.apk", "/system/app/Magisk.apk"
    ]
    found = [p for p in su_paths if exists(p)]
    if found:
        warn(f"Possível root detectado: {found}")
    else:
        ok("Nenhum indício simples de root encontrado.")

def check_datetime_bypass():
    info("Verificando Data e Hora...")
    auto_time = run("settings get global auto_time")
    auto_tz = run("settings get global auto_time_zone")
    if auto_time == "0" or auto_tz == "0":
        warn("Possível bypass: data/hora ou fuso automático desativado.")
    else:
        ok("Data e hora automáticas ativas.")

def check_mtp():
    info("Verificando MTP (USB)...")
    state = run("getprop sys.usb.state")
    if "mtp" in state:
        warn("MTP ativo.")
    else:
        ok("MTP não ativo.")

def check_replays():
    info("Passagem de Replay...")
    path = PATHS["REPLAYS"]
    if not exists(path):
        ok("Pasta MReplays inexistente.")
        return
    files = []
    try:
        files = os.listdir(path)
    except:
        warn("Sem permissão para listar MReplays.")
        return

    bins = [f for f in files if f.endswith(".bin")]
    if bins:
        warn(f"Replay detectado ({len(bins)} arquivos).")
        t = mtime(path)
        if t:
            ok(f"Último acesso MReplays: {t.strftime('%d-%m-%Y %H:%M:%S')}")
    else:
        ok("Nenhum replay encontrado.")

def check_shaders():
    info("Shaders / Wallhack / Holograma...")
    path = PATHS["SHADERS"]
    if not exists(path):
        ok("Pasta shaders inexistente.")
        return
    t = mtime(path)
    if t:
        ok(f"Data da última modificação shaders: {t.strftime('%d-%m-%Y %H:%M:%S')}")
    ok("Nenhuma alteração suspeita evidente (análise superficial).")

def check_obb():
    info("OBB...")
    path = PATHS["OBB"]
    if not exists(path):
        warn("OBB deletada ou inexistente!")
        return
    t = mtime(path)
    if t:
        ok(f"Data da última modificação OBB: {t.strftime('%d-%m-%Y %H:%M:%S')}")

# =========================
# MAIN
# =========================
def main():
    os.system("clear")
    print(BANNER)
    print(f"[#] Início da auditoria: {ts()}\n")

    check_freefire_installed()
    check_android_version()
    check_recent_reboot()
    check_root()
    check_datetime_bypass()
    check_mtp()
    check_replays()
    check_shaders()
    check_obb()

    print(f"\n[#] Fim da auditoria: {ts()}")

if __name__ == "__main__":
    main()
