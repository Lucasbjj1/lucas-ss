// Variables
const APP = "lucas.exe"
const VERSION = "1.0"

// ------------------- CONFIGURAÇÕES -------------------
const DEVICE_LANG = (Device.language() || "pt").toLowerCase().substring(0, 2)
const SPEECH = {
  pt: {
    start:    "Iniciando análise completa. Isso pode levar alguns segundos.",
    ips:      "Extraindo endereços IP e domínios.",
    lookup:   "Consultando infraestrutura de rede.",
    bundles:  "Verificando aplicativos suspeitos.",
    done:     "Análise concluída. Verifique o relatório salvo.",
  },
  en: {
    start:    "Starting full analysis. This may take a few seconds.",
    ips:      "Extracting IP addresses and domains.",
    lookup:   "Querying network infrastructure.",
    bundles:  "Checking for suspicious applications.",
    done:     "Analysis complete. Check the saved report.",
  },
  es: {
    start:    "Iniciando análisis completo. Puede tomar unos segundos.",
    ips:      "Extrayendo direcciones IP y dominios.",
    lookup:   "Consultando infraestructura de red.",
    bundles:  "Verificando aplicaciones sospechosas.",
    done:     "Análisis completado. Revise el informe guardado.",
  },
}
const S = SPEECH[DEVICE_LANG] || SPEECH["pt"]

// ------------------- LISTAS DE DETECÇÃO -------------------
const CHEAT_APPS = {
  "com.touchingapp.potatsolite":      "PotatsoLite — proxy iOS (mitmproxy cheat)",
  "com.touchingapp.potatso":          "Potatso — proxy iOS",
  "com.monite.proxyff":               "ProxyFF — proxy iOS (cheat confirmado)",
  "com.nssurge.inc.surge-ios":        "Surge — proxy/MITM iOS",
  "com.luo.quantumultx":              "Quantumult X — proxy iOS",
  "group.com.luo.quantumult":         "Quantumult — proxy iOS",
  "com.shadowrocket.Shadowrocket":    "Shadowrocket — proxy iOS",
  "com.liguangming.Shadowrocket":     "Shadowrocket (alt) — proxy iOS",
  "com.github.shadowsocks":           "Shadowsocks",
  "com.netease.trojan":               "Trojan proxy",
  "com.hiddify.app":                  "Hiddify — proxy",
  "com.karing.app":                   "Karing — proxy",
  "com.metacubex.ClashX":             "ClashX — proxy",
  "com.ssrss.Ssrss":                  "SSR iOS proxy",
  "com.adguard.ios.AdguardPro":       "AdGuard Pro (proxy MITM)",
  "com.privateinternetaccess.ios":    "PIA VPN",
  "com.anonymousiphone.detoxme":      "Detox — proxy iOS",
  "com.futureland.vpnmaster":         "VPN Master",
  "com.cloudflare.1dot1dot1dot1":     "Cloudflare 1.1.1.1 (WARP proxy)",
  "com.opa334.dopamine":              "Dopamine — Jailbreak",
  "org.coolstar.sileo":               "Sileo — package manager JB",
  "org.coolstar.odyssey":             "Odyssey — Jailbreak",
  "com.electrateam.unc0ver":          "unc0ver — Jailbreak",
  "com.tihmstar.checkra1n":           "checkra1n — Jailbreak",
  "org.taurine.jailbreak":            "Taurine — Jailbreak",
  "xyz.palera1n.palera1n":            "palera1n — Jailbreak",
  "com.opa334.TrollStore":            "TrollStore — sideload sem JB",
  "com.opa334.TrollStoreHelper":      "TrollStoreHelper",
  "com.opa334.trolldecrypt":          "TrollDecrypt — decifrar IPAs",
  "com.opa334.trollfools":            "TrollFools — injetor de tweaks",
  "xyz.willy.Zebra":                  "Zebra — package manager JB",
  "com.cydia.Cydia":                  "Cydia — package manager JB",
  "com.rileytestut.AltStore":         "AltStore — sideload",
  "com.altstore.altstoreclassic":     "AltStore Classic — sideload",
  "com.sideloadly.sideloadly":        "Sideloadly — sideload",
  "com.esign.ios":                    "ESign — sideload/IPA installer",
  "com.esign.esign":                  "ESign (alt) — sideload",
  "com.iosgods.iosgods":              "iOSGods — cheat app store",
  "com.gbox.pubg":                    "GBox — cheat mod pubg/ff",
  "com.tigisoftware.Filza":           "Filza — file manager root",
  "com.tigisoftware.FilzaFree":       "Filza Free — file manager root",
  "app.ish.iSH":                      "iSH — shell Linux no iOS",
  "com.septudio.SSHClientLite":       "SSH Client Lite — shell remoto",
  "live.cclerc.geranium":             "Geranium — tweak manager JB",
  "com.apple.dt.Xcode":               "Xcode — IDE Apple (suspeito em contexto de jogo)",
  "com.apple.Preferences.Developer":  "Preferências de Desenvolvedor (ativas)",
  "com.apple.developer":              "Perfil de desenvolvedor Apple",
  "com.shpion.cleaner":               "Spion Cleaner — limpeza de rastros suspeita",
  "com.ifunbox.ifunbox":              "iFunBox — gerenciador de arquivos iOS",
  "com.limneos.adprivacy":            "AdPrivacy — bloqueio/manipulação de rede",
  "com.jjcm.nomoread":                "NoMoreAd — bloqueio de rede (MITM possível)",
}

const CHEAT_PROXY_ASN = {
  "AS35916": "Multacom Corporation (cheat proxy LA)",
  "AS47583": "Hostinger International (cheat proxy BR)",
  "AS60781": "LeaseWeb Netherlands",
  "AS28753": "LeaseWeb Deutschland",
  "AS16276": "OVH SAS",
  "AS14061": "DigitalOcean",
  "AS20473": "Choopa / Vultr",
  "AS8100":  "QuadraNet",
  "AS40065": "Cnservers / FDC Servers",
  "AS53667": "FranTech Solutions",
  "AS395954": "Leaseweb USA",
  "AS13335": "Cloudflare (CDN/Proxy — comum em cheats)",
  "AS209": "CenturyLink / Lumen",
  "AS7203": "Sharktech",
}

const RDNS_HOSTING_PATTERNS = [
  "hstgr.cloud",
  "staticip",
  "srv.",
  "vps.",
  "cloud.",
  "host.",
  "server.",
  "dedicated.",
  ".kinghost.net",
  ".locaweb.com.br",
  ".umbler.net",
  ".hostgator.com.br",
  ".digitalocean.com",
  ".vultr.com",
  ".linode.com",
  ".hetzner.com",
  ".contabo.net",
]

const SUSPICIOUS_TLDS = [
  ".site", ".store", ".netlify.app", ".netlify", ".xyz", ".pw",
  ".top", ".click", ".bid", ".win", ".stream", ".download",
  ".icu", ".gq", ".cf", ".ml", ".ga", ".tk",
  ".monster", ".fun", ".rest", ".bar", ".lol",
]

const SUSPICIOUS_DOMAIN_WORDS = [
  "proxy", "cheat", "hack", "bypass", "mitm", "inject",
  "spoof", "crack", "exploit", "payload", "tunnel",
  "vpn", "socks", "relay", "forward", "gate",
]

const KNOWN_CHEAT_INFRA = {
  "46.202.145.85":      "Fatality Cheats — servidor confirmado",
  "fatalitycheats.xyz": "Fatality Cheats — domínio oficial do cheat",
  "anubisw.online":     "Servidor de cheat confirmado — Free Fire",
  "api.baontq.xyz":     "API de cheat confirmado — Free Fire",
  "version.ffmax.purplevioleto.com": "Versão modificada Free Fire MAX — cheat confirmado",
  "version.ggwhitehawk.com":         "White Hawk cheat — servidor confirmado",
  "loginbp.ggpolarbear.com":         "Polar Bear cheat — servidor confirmado",
}

const FALSE_POSITIVE_IPS = new Set([
  "104.29.152.79",  "104.29.152.107", "92.223.118.254",  "23.221.214.168",
  "23.192.36.217",  "54.69.69.125",   "104.29.152.189",  "104.29.137.146",
  "104.29.155.56",  "104.29.137.203", "104.29.155.129",  "104.29.137.125",
  "104.29.158.97",  "104.29.152.95",  "104.29.153.53",   "104.29.159.185",
  "104.29.157.123", "104.29.152.27",  "104.29.157.107",  "104.29.137.16",
  "104.29.152.164", "104.29.137.53",  "104.29.135.227",  "104.29.158.139",
  "104.29.152.157", "104.29.156.174", "104.29.156.24",   "104.29.154.91",
  "104.29.155.27",  "104.29.156.120", "104.29.137.112",
])

const IPS_CHEAT_EXACT = new Set(Object.keys(CHEAT_APPS))

// ------------------- FUNÇÕES AUXILIARES -------------------
async function progress(text, p) {
  let n = new Notification()
  n.title = APP
  n.body = text + " " + p + "%"
  await n.schedule()
}

async function speak(text) {
  if (Device.isPhone()) {
    Speech.speak(text)
  }
}

async function pickFile() {
  try {
    let path = await DocumentPicker.openFile()
    let fm = FileManager.local()
    return { path, content: fm.readString(path), fm }
  } catch (e) {
    return null
  }
}

// ------------------- DETECÇÃO DE TIPO DE ARQUIVO -------------------
function detectType(content) {
  if (!content) return "unknown"
  if (content.includes("networkActivity") && content.includes("bundleID")) return "privacyreport"
  if (content.includes("xp_amp_app_usage") || content.includes("sysdiagnose")) return "sysdiagnose"
  if (content.includes("sysdiagnose") || content.includes("Date/Time:")) return "sysdiagnose"
  return "unknown"
}

// ------------------- PARSERS -------------------
function parseNdjson(content) {
  let trimmed = content.trim()
  if (trimmed.startsWith("[")) {
    try { return JSON.parse(trimmed) } catch (e) { }
  }
  return trimmed
    .split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 0)
    .map(l => { try { return JSON.parse(l) } catch (e) { return null } })
    .filter(Boolean)
}

function validateReport(entries) {
  if (!entries || entries.length === 0)
    return { ok: false, reason: "Arquivo vazio ou sem entradas válidas." }

  let hasNet = entries.some(e => e.type === "networkActivity")
  let hasAccess = entries.some(e => e.type === "access")
  let hasBundleID = entries.some(e => e.bundleID || (e.accessor && e.accessor.identifier))
  let hasTimestamp = entries.some(e => e.timeStamp)

  if (!hasNet && !hasAccess)
    return { ok: false, reason: "Nenhuma entrada de rede ou acesso encontrada.\nEste não parece ser um App Privacy Report válido." }
  if (!hasBundleID)
    return { ok: false, reason: "Nenhum bundleID encontrado.\nO arquivo pode estar corrompido ou foi modificado." }
  if (!hasTimestamp)
    return { ok: false, reason: "Nenhum timestamp encontrado.\nO arquivo pode estar corrompido ou foi modificado." }

  return { ok: true }
}

// ------------------- EXTRAÇÃO DE IPs E DOMÍNIOS DE TEXTO BRUTO -------------------
function extractIPs(content) {
  let r = content.match(/\b\d{1,3}(?:\.\d{1,3}){3}\b/g)
  if (!r) return []
  return [...new Set(r)]
}

function extractDomains(content) {
  let r = content.match(/[a-zA-Z0-9.-]+\.[a-z]{2,}/g)
  if (!r) return []
  return [...new Set(r)]
}

// ------------------- ANÁLISE DE BUNDLE IDs (APENAS PRIVACY REPORT) -------------------
function analyzeBundles(entries) {
  let results = []
  let seen = new Set()

  for (let e of entries) {
    let bid = e.bundleID || (e.accessor && e.accessor.identifier) || ""
    if (!bid || seen.has(bid)) continue
    seen.add(bid)

    let reason = null
    let category = "info"

    if (IPS_CHEAT_EXACT.has(bid)) {
      reason = CHEAT_APPS[bid] || bid
      category = "critical"
    } else {
      let bidLower = bid.toLowerCase()
      // Palavras-chave genéricas
      const keywords = ["filza", "esign", "gbox", "sideload", "dopamine", "sileo",
        "trollstore", "trolldecrypt", "trollfools", "trollhelper",
        "spoofer", "cleaner", "unc0ver", "checkra1n", "jailbreak",
        "cydia", "zebra", "altstore", "iosgods", "geranium",
        "potatso", "shadowrocket", "surge", "quantumult", "hiddify",
        "shadowsocks", "trojan", "karing", "proxyff"]
      for (let kw of keywords) {
        if (bidLower.includes(kw)) {
          reason = "Palavra suspeita: \"" + kw + "\" no bundle ID"
          category = "warning"
          break
        }
      }
    }

    // Detectar cópias modificadas do Free Fire
    if (!reason) {
      const FF_LEGIT = ["com.dts.freefireth", "com.dts.freefiremax"]
      const bidLower = bid.toLowerCase()
      if (!FF_LEGIT.includes(bid) && (bidLower.includes("freefire") || bidLower.includes("free.fire"))) {
        reason = "Cópia suspeita do Free Fire — bundle ID modificado"
        category = "critical"
      }
    }

    if (reason) {
      results.push({
        bundleId: bid,
        version: e.shortAppVersion || e.version || "?",
        reason: reason,
        category: category
      })
    }
  }
  return results
}

// ------------------- CONSULTA BATCH IP -------------------
const FIELDS = "status,country,city,isp,org,hosting,proxy,query,reverse,as"

async function lookupBatch(targets) {
  try {
    let req = new Request(`http://ip-api.com/batch?fields=${FIELDS}`)
    req.method = "POST"
    req.body = Data.fromString(JSON.stringify(targets))
    req.headers = { "Content-Type": "application/json" }
    req.timeoutInterval = 15
    let results = await req.loadJSON()
    if (!Array.isArray(results)) return []
    return results
  } catch (e) {
    return []
  }
}

// ------------------- CLASSIFICAÇÃO DE IP -------------------
function classifyIP(info, ip) {
  if (!info || info.status !== "success") return { severity: null, reasons: [] }

  let reasons = []
  let severity = null

  // 1. Verificar se é IP falso-positivo conhecido
  if (FALSE_POSITIVE_IPS.has(ip)) {
    return { severity: "ignore", reasons: ["IP em lista de falsos positivos"] }
  }

  // 2. Verificar infraestrutura conhecida
  if (KNOWN_CHEAT_INFRA[ip]) {
    severity = "critical"
    reasons.push(`Infraestrutura de cheat conhecida: ${KNOWN_CHEAT_INFRA[ip]}`)
  }

  // 3. Verificar ASN suspeito
  let asn = (info.as || "").split(" ")[0].toUpperCase()
  if (CHEAT_PROXY_ASN[asn]) {
    // Cloudflare só é suspeito se o IP for acessado diretamente (não via domínio)
    // mas aqui vamos considerar como alerta se estiver em contexto de rede
    severity = severity || "high"
    reasons.push(`ASN de proxy conhecido: ${asn} — ${CHEAT_PROXY_ASN[asn]}`)
  }

  // 4. Verificar flag hosting/proxy da API
  if (info.hosting) {
    severity = severity || "high"
    reasons.push(`VPS/Hosting detectado — ISP: ${info.isp}`)
  }
  if (info.proxy) {
    severity = severity || "high"
    reasons.push(`Proxy/VPN detectado`)
  }

  // 5. Verificar rDNS
  let rdns = (info.reverse || "").toLowerCase()
  if (rdns) {
    for (let pattern of RDNS_HOSTING_PATTERNS) {
      if (rdns.includes(pattern)) {
        severity = severity || "medium"
        reasons.push(`rDNS de servidor: ${info.reverse}`)
        break
      }
    }
  }

  return { severity, reasons }
}

// ------------------- ANÁLISE DE DOMÍNIOS -------------------
function analyzeDomain(domain) {
  let low = domain.toLowerCase()
  let reasons = []
  let severity = null

  // Domínio conhecido
  if (KNOWN_CHEAT_INFRA[domain]) {
    severity = "critical"
    reasons.push(`Domínio de cheat conhecido: ${KNOWN_CHEAT_INFRA[domain]}`)
  }

  // TLD suspeito
  for (let tld of SUSPICIOUS_TLDS) {
    if (low.endsWith(tld)) {
      severity = severity || "high"
      reasons.push(`TLD suspeito: ${tld}`)
      break
    }
  }

  // Palavras suspeitas no domínio
  for (let word of SUSPICIOUS_DOMAIN_WORDS) {
    if (low.includes(word)) {
      severity = severity || "high"
      reasons.push(`Palavra suspeita: "${word}"`)
      break
    }
  }

  return { severity, reasons }
}

// ------------------- DETECÇÃO EM LOGS DE SYSDIAGNOSE -------------------
function detectInSysdiagnose(content) {
  let findings = []

  // Padrões de linhas que indicam proxy, VPN, tun, etc.
  let lines = content.split("\n")
  for (let line of lines) {
    let l = line.toLowerCase()
    if (l.includes("shadowrocket") ||
      l.includes("quantumult") ||
      l.includes("surge") ||
      l.includes("hiddify") ||
      l.includes("shadowsocks") ||
      l.includes("trojan") ||
      l.includes("vpn") ||
      l.includes("tun") ||
      l.includes("utun") ||
      l.includes("p p p") ||
      l.includes("ipsec") ||
      l.includes("ikev2")) {
      findings.push(line.trim())
    }
  }
  return findings.slice(0, 20) // limitar
}

// ------------------- RELATÓRIO FINAL -------------------
async function saveReport(reportText) {
  let fm = FileManager.local()
  let date = new Date()
  let filename = `lucas_scan_${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}.txt`
  let path = fm.joinPath(fm.documentsDirectory(), filename)
  fm.writeString(path, reportText)
  return path
}

// ------------------- FUNÇÃO PRINCIPAL -------------------
async function scan() {
  await speak(S.start)
  await progress("Preparando", 5)

  // 1. Selecionar arquivo
  let file = await pickFile()
  if (!file || !file.content) {
    let a = new Alert()
    a.title = APP
    a.message = "Nenhum arquivo selecionado ou arquivo vazio."
    a.addAction("OK")
    await a.present()
    return
  }

  let { content, path } = file
  await progress("Identificando tipo", 10)

  let type = detectType(content)
  let reportSections = []
  reportSections.push(`=== RELATÓRIO DE ANÁLISE ===`)
  reportSections.push(`Arquivo: ${path}`)
  reportSections.push(`Tipo detectado: ${type}`)
  reportSections.push(`Data: ${new Date().toLocaleString()}`)
  reportSections.push("")

  let suspiciousBundles = []
  let ipList = []
  let domainList = []
  let sysdiagnoseHits = []

  if (type === "privacyreport") {
    await progress("Parseando relatório", 20)
    let entries = parseNdjson(content)

    let validation = validateReport(entries)
    if (!validation.ok) {
      reportSections.push("⚠️ ARQUIVO INVÁLIDO OU CORROMPIDO")
      reportSections.push(validation.reason)
    } else {
      await progress("Analisando bundles", 30)
      suspiciousBundles = analyzeBundles(entries)

      // Extrair IPs e domínios das entradas (mais preciso que regex)
      let ipsFromEntries = new Set()
      let domainsFromEntries = new Set()
      for (let e of entries) {
        if (e.type === "networkActivity" && e.domain) {
          // Se o domínio for IP, extrair
          if (/^(\d{1,3}\.){3}\d{1,3}$/.test(e.domain)) {
            ipsFromEntries.add(e.domain)
          } else {
            domainsFromEntries.add(e.domain)
          }
        }
        if (e.ipAddress) ipsFromEntries.add(e.ipAddress)
      }
      ipList = Array.from(ipsFromEntries)
      domainList = Array.from(domainsFromEntries)
    }
  } else if (type === "sysdiagnose") {
    await progress("Analisando sysdiagnose", 30)
    // Extrair IPs/domínios via regex
    ipList = extractIPs(content)
    domainList = extractDomains(content)
    sysdiagnoseHits = detectInSysdiagnose(content)
  } else {
    await progress("Formato desconhecido", 30)
    ipList = extractIPs(content)
    domainList = extractDomains(content)
  }

  // 2. Resumo inicial
  reportSections.push(`📊 RESUMO:`)
  reportSections.push(`IPs encontrados: ${ipList.length}`)
  reportSections.push(`Domínios encontrados: ${domainList.length}`)
  reportSections.push(`Apps suspeitos: ${suspiciousBundles.length}`)
  if (sysdiagnoseHits.length > 0) reportSections.push(`Linhas suspeitas em logs: ${sysdiagnoseHits.length}`)
  reportSections.push("")

  // 3. Analisar domínios
  await progress("Analisando domínios", 50)
  let domainResults = []
  for (let d of domainList) {
    let res = analyzeDomain(d)
    if (res.severity) {
      domainResults.push({ domain: d, severity: res.severity, reasons: res.reasons })
    }
  }

  if (domainResults.length > 0) {
    reportSections.push(`🌐 DOMÍNIOS SUSPEITOS (${domainResults.length}):`)
    for (let d of domainResults) {
      reportSections.push(`- ${d.domain} [${d.severity.toUpperCase()}]`)
      for (let r of d.reasons) reportSections.push(`    → ${r}`)
    }
    reportSections.push("")
  }

    // 4. Consultar IPs (batch)
  await progress("Consultando IPs", 70)
  await speak(S.lookup)
  let ipResults = []
  if (ipList.length > 0) {
    // Limitar a 100 IPs para não sobrecarregar
    let ipsToQuery = ipList.slice(0, 100)
    let batchResults = await lookupBatch(ipsToQuery)
    // Mapear resultados por IP
    let ipMap = {}
    for (let res of batchResults) {
      if (res.query) ipMap[res.query] = res
    }
    for (let ip of ipsToQuery) {
      let info = ipMap[ip]
      let classification = classifyIP(info, ip)
      if (classification.severity && classification.severity !== "ignore") {
        ipResults.push({
          ip,
          severity: classification.severity,
          reasons: classification.reasons,
          info: info ? `${info.isp || ''} ${info.country || ''}`.trim() : "Sem informação"
        })
      }
    }
  }

  if (ipResults.length > 0) {
    reportSections.push(`🖧 IPS SUSPEITOS (${ipResults.length}):`)
    for (let i of ipResults) {
      reportSections.push(`- ${i.ip} [${i.severity.toUpperCase()}] ${i.info}`)
      for (let r of i.reasons) reportSections.push(`    → ${r}`)
    }
    reportSections.push("")
  }

  // 5. Apps suspeitos
  if (suspiciousBundles.length > 0) {
    reportSections.push(`📱 APPS SUSPEITOS (${suspiciousBundles.length}):`)
    for (let a of suspiciousBundles) {
      reportSections.push(`- ${a.bundleId} v${a.version} [${a.category.toUpperCase()}]`)
      reportSections.push(`    → ${a.reason}`)
    }
    reportSections.push("")
  }

  // 6. Linhas suspeitas de sysdiagnose
  if (sysdiagnoseHits.length > 0) {
    reportSections.push(`📋 LINHAS SUSPEITAS EM LOGS (primeiras 20):`)
    for (let line of sysdiagnoseHits) {
      reportSections.push(`  ${line}`)
    }
    reportSections.push("")
  }

  // 7. Conclusão e score
  let totalIssues = domainResults.length + ipResults.length + suspiciousBundles.length + sysdiagnoseHits.length
  let verdict = totalIssues === 0 ? "Nenhum indicador de cheat encontrado." :
    totalIssues < 5 ? "Baixo número de indicadores. Possível falso positivo ou uso leve de proxy." :
      totalIssues < 15 ? "Médio número de indicadores. Provável uso de ferramentas de cheat/proxy." :
        "Alto número de indicadores. Forte suspeita de cheat."

  reportSections.push(`🔍 VEREDITO FINAL:`)
  reportSections.push(`Total de alertas: ${totalIssues}`)
  reportSections.push(verdict)

  // 8. Salvar
  let reportText = reportSections.join("\n")
  let savedPath = await saveReport(reportText)

  await progress("Concluído", 100)
  await speak(S.done)

  // 9. Mostrar alerta com resumo
  let a = new Alert()
  a.title = APP
  a.message = `Análise concluída!\nTotal de alertas: ${totalIssues}\nRelatório salvo em:\n${savedPath}`
  a.addAction("OK")
  await a.present()
}

// Executar
await scan()
```
