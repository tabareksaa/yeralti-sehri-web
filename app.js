const authScreen = document.getElementById("authScreen");
const appScreen = document.getElementById("appScreen");
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("usernameInput");
const operatorChip = document.getElementById("operatorChip");
const logoutButton = document.getElementById("logoutButton");
const liveClock = document.getElementById("liveClock");
const viewButtons = document.querySelectorAll("[data-view-target]");
const panels = document.querySelectorAll("[data-view]");
const sensorList = document.getElementById("sensorList");
const sensorHotspots = document.getElementById("sensorHotspots");
const sensorModal = document.getElementById("sensorModal");
const sensorModalTitle = document.getElementById("sensorModalTitle");
const sensorModalDescription = document.getElementById("sensorModalDescription");
const sensorModalMeta = document.getElementById("sensorModalMeta");
const sensorModalClose = document.getElementById("sensorModalClose");
const mapStage = document.getElementById("mapStage");
const mapCanvas = document.getElementById("mapCanvas");
const mapImage = document.querySelector(".map-image");
const zoomInButton = document.getElementById("zoomInButton");
const zoomOutButton = document.getElementById("zoomOutButton");
const zoomResetButton = document.getElementById("zoomResetButton");
const zoomLevel = document.getElementById("zoomLevel");

const sensors = [
  {
    id: "pir",
    title: "PIR Hareket Sensörü",
    short: "Koridor ve odalarda hareket takibi",
    description:
      "Geçiş alanlarındaki insan hareketini pasif kızılötesi algı ile izler. Yetkisiz giriş, kullanım yoğunluğu ve boşluk durumu bu veriye göre değerlendirilir.",
    meta: [
      ["Konum", "Üst kat oda girişleri ve ana koridor hattı"],
      ["Görev", "Hareket var/yok bilgisini panele aktarmak"],
      ["Çıktı", "Doluluk - güvenlik uyarısı"]
    ],
    hotspot: { left: 1.2, top: 24.4, width: 14.5, height: 8.4 }
  },
  {
    id: "ldr",
    title: "LDR Işık Sensörü",
    short: "Ortam aydınlatma düzeyi",
    description:
      "Işık seviyesini lux karşılığına çevirmek için kullanılır. Aydınlatma otomasyonu, enerji tasarrufu ve karanlık alan tespiti bu sensör ile yapılır.",
    meta: [
      ["Konum", "Orta kat yaşam alanları"],
      ["Görev", "Doğal ve yapay ışık düzeyini izlemek"],
      ["Çıktı", "Lux değeri - aydınlatma durumu"]
    ],
    hotspot: { left: 1.2, top: 38.0, width: 12.8, height: 7.2 }
  },
  {
    id: "temperature",
    title: "Sıcaklık Sensörü",
    short: "Ortam sıcaklığı izlemesi",
    description:
      "Yeraltı odalarındaki ısıl konforu izler. Havalandırma ve uyarı senaryoları için sıcaklık verisi doğrudan dijital ikiz paneline aktarılır.",
    meta: [
      ["Konum", "Alt kat yaşam ve teknik alanlar"],
      ["Görev", "Anlık ortam sıcaklığını izlemek"],
      ["Çıktı", "Sıcaklık değeri ve kararlılık bilgisi"]
    ],
    hotspot: { left: 1.1, top: 51.4, width: 12.2, height: 7.2 }
  },
  {
    id: "humidity",
    title: "Nem Sensörü",
    short: "Rutubet ve nem takibi",
    description:
      "Rutubet kaynaklı konfor kaybını ve malzeme bozulmasını önlemek için bağıl nem takibi yapar. Fan senaryolarını destekleyen ana çevresel sensörlerden biridir.",
    meta: [
      ["Konum", "Düşük hava sirkülasyonlu alt hacimler"],
      ["Görev", "Bağıl nem oranını ölçmek"],
      ["Çıktı", "Nem yüzdesi - rutubet uyarısı"]
    ],
    hotspot: { left: 1.1, top: 62.9, width: 12.4, height: 7.2 }
  },
  {
    id: "water-level",
    title: "Su Seviye Sensörü",
    short: "Baskın ve birikme kontrolü",
    description:
      "Su birikintisi veya seviye yükselmesini izleyerek kritik taşma riskini erkenden haber verir. Zemin kuru/ıslak değerlendirmesinde temel girdidir.",
    meta: [
      ["Konum", "Sarnıç, zemin çukuru ve alt kat su hattı"],
      ["Görev", "Seviye artışını algılamak"],
      ["Çıktı", "Su baskını riski ve alarm durumu"]
    ],
    hotspot: { left: 1.1, top: 74.6, width: 12.6, height: 7.6 }
  },
  {
    id: "door",
    title: "Manyetik Kapı Sensörü",
    short: "Giriş kapısı açık/kapalı durumu",
    description:
      "Kapı kanadının konumunu manyetik kontak ile takip eder. Ana giriş ve acil çıkış kapılarının güvenli durumda olup olmadığı bu sensör ile izlenir.",
    meta: [
      ["Konum", "Ana giriş ve üst seviye kapı hattı"],
      ["Görev", "Kapı konum bilgisini iletmek"],
      ["Çıktı", "Açık / kapalı - izinsiz giriş uyarısı"]
    ],
    hotspot: { left: 24.2, top: 10.4, width: 16.2, height: 7.4 }
  },
  {
    id: "fan",
    title: "Havalandırma Fanı",
    short: "Hava sirkülasyonu kontrolü",
    description:
      "Gaz, CO2 ve nem seviyesi yükseldiğinde iç ortam havasını yenilemek için devreye alınan aktüatördür. Fan hızı ve çalışma durumu panelde izlenir.",
    meta: [
      ["Konum", "Üst servis katı ve ana havalandırma hattı"],
      ["Görev", "Kirli havayı tahliye etmek"],
      ["Çıktı", "Pasif / aktif / maksimum çalışma bilgisi"]
    ],
    hotspot: { left: 53.0, top: 10.7, width: 15.2, height: 7.0 }
  },
  {
    id: "alarm",
    title: "Alarm Sireni",
    short: "Kritik durumda sesli uyarı",
    description:
      "Gaz kaçağı, duman, baskın veya güvenlik ihlali gibi kritik durumlarda yeraltı yapısında sesli alarm üretir. Tahliye senaryosunun görünür parçasıdır.",
    meta: [
      ["Konum", "Üst dış çevre ve giriş çevresi"],
      ["Görev", "Sesli uyarı ve tahliye tetiklemek"],
      ["Çıktı", "Kritik alarm bildirimi"]
    ],
    hotspot: { left: 78.0, top: 10.6, width: 13.3, height: 7.2 }
  },
  {
    id: "gas",
    title: "Gaz / Duman Sensörü",
    short: "Zararlı gaz ve duman algılama",
    description:
      "Kapalı alanlarda birikebilecek yanıcı ve zararlı gazları takip eder. Hava kalitesini bozan duman veya gaz artışı tespit edildiğinde erken uyarı üretir.",
    meta: [
      ["Konum", "Kapalı oda kümeleri ve orta katlar"],
      ["Görev", "Gaz yoğunluğu ve duman varlığını izlemek"],
      ["Çıktı", "Hava kalitesi - kritik seviye uyarısı"]
    ],
    hotspot: { left: 87.4, top: 29.9, width: 12.3, height: 7.9 }
  },
  {
    id: "co2",
    title: "CO2 Sensörü",
    short: "Karbondioksit yoğunluğu takibi",
    description:
      "Havadaki karbondioksit yoğunluğunu izleyerek havasızlık riskini ölçer. Kalabalık kullanım veya yetersiz havalandırma durumlarını belirlemede kullanılır.",
    meta: [
      ["Konum", "Sağ orta kat kapalı yaşam alanları"],
      ["Görev", "CO2 yoğunluğunu ölçmek"],
      ["Çıktı", "ppm değeri - fan tetikleme desteği"]
    ],
    hotspot: { left: 87.5, top: 41.8, width: 12.1, height: 7.5 }
  },
  {
    id: "smoke",
    title: "Duman Dedektörü",
    short: "Yangın başlangıcı kontrolü",
    description:
      "Yangın başlangıcına işaret eden duman parçacıklarını algılar. Gaz sensörüyle birlikte kullanılarak güvenlik alarmını daha güvenilir hale getirir.",
    meta: [
      ["Konum", "Sağ iç kat geçişleri ve oda tavanları"],
      ["Görev", "Duman artışını algılamak"],
      ["Çıktı", "Yangın ön uyarısı"]
    ],
    hotspot: { left: 87.4, top: 53.4, width: 12.2, height: 7.4 }
  },
  {
    id: "camera",
    title: "Kamera Modülü",
    short: "Görsel doğrulama noktası",
    description:
      "Alarm durumlarında operatöre görsel kontrol sağlar. Sensörlerden gelen uyarının gerçek sahadaki karşılığını uzaktan doğrulamak için kullanılır.",
    meta: [
      ["Konum", "Su hattı ve kritik geçiş bölgeleri"],
      ["Görev", "Canlı görüntü almak"],
      ["Çıktı", "Operatör doğrulama desteği"]
    ],
    hotspot: { left: 87.4, top: 64.6, width: 12.2, height: 7.4 }
  },
  {
    id: "leak",
    title: "Su Kaçak Sensörü",
    short: "Boru ve yüzey sızıntısı takibi",
    description:
      "Su hattı çevresindeki istenmeyen sızıntıları tespit eder. Erken müdahale ile yapısal hasarı ve kritik baskın riskini azaltmak için kullanılır.",
    meta: [
      ["Konum", "Su kanalı, şelale ve teknik hat çevresi"],
      ["Görev", "Yüzeyde kaçak varlığını algılamak"],
      ["Çıktı", "Sızıntı uyarısı - bakım bildirimi"]
    ],
    hotspot: { left: 87.3, top: 77.0, width: 12.4, height: 7.5 }
  },
  {
    id: "emergency-light",
    title: "Acil Aydınlatma Sensörü",
    short: "Kesinti anı aydınlatma takibi",
    description:
      "Enerji kaybı veya aşırı karanlık durumunda acil yönlendirme aydınlatmalarının devreye girme bilgisini doğrular. Tahliye hattı görünürlüğünü destekler.",
    meta: [
      ["Konum", "Alt merkez teknik kontrol bölgesi"],
      ["Görev", "Acil ışık senaryosunu doğrulamak"],
      ["Çıktı", "Aydınlatma hazır / devrede bilgisi"]
    ],
    hotspot: { left: 26.0, top: 87.1, width: 13.0, height: 7.6 }
  },
  {
    id: "vibration",
    title: "Titreşim Sensörü",
    short: "Yapısal hareket izleme",
    description:
      "Beklenmeyen titreşim, darbe veya mekanik hareketleri takip eder. Yeraltı yapısının güvenliği ve ekipman titreşim analizi için destek verisi sağlar.",
    meta: [
      ["Konum", "Merkez teknik çekirdek"],
      ["Görev", "Anormal titreşimi algılamak"],
      ["Çıktı", "Yapısal takip ve uyarı desteği"]
    ],
    hotspot: { left: 41.2, top: 87.1, width: 12.1, height: 7.8 }
  },
  {
    id: "esp32",
    title: "ESP32 Kontrol Birimi",
    short: "Sensör verilerinin ana toplama noktası",
    description:
      "Tüm sensörlerden gelen veriyi toplayan ve kablosuz ağ üzerinden dijital ikiz paneline ileten ana kontrol birimidir. Sistem senaryoları bu kart üzerinden koordine edilir.",
    meta: [
      ["Konum", "Alt merkez kontrol odası"],
      ["Görev", "Veri toplama ve haberleşme yönetimi"],
      ["Çıktı", "MQTT / Wi-Fi ile panel aktarımı"]
    ],
    hotspot: { left: 55.0, top: 87.0, width: 13.2, height: 7.9 }
  }
];

const sensorById = new Map(sensors.map((sensor) => [sensor.id, sensor]));
let activeSensorId = null;

const zoomState = {
  scale: 1,
  x: 0,
  y: 0,
  min: 1,
  max: 2.8
};

const panState = {
  active: false,
  startX: 0,
  startY: 0
};

function formatClock() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");
  return `${day}.${month}.${year} | ${hour}:${minute}:${second}`;
}

function updateClock() {
  liveClock.textContent = formatClock();
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function clampPan() {
  const width = mapCanvas.offsetWidth;
  const height = mapCanvas.offsetHeight;
  const maxX = Math.max(0, (width * (zoomState.scale - 1)) / 2);
  const maxY = Math.max(0, (height * (zoomState.scale - 1)) / 2);
  zoomState.x = clamp(zoomState.x, -maxX, maxX);
  zoomState.y = clamp(zoomState.y, -maxY, maxY);
}

function applyZoom() {
  clampPan();
  mapCanvas.style.transform = `translate(${zoomState.x}px, ${zoomState.y}px) scale(${zoomState.scale})`;
  zoomLevel.textContent = `${Math.round(zoomState.scale * 100)}%`;
  mapStage.classList.toggle("can-pan", zoomState.scale > 1.01);
}

function setZoom(nextScale) {
  zoomState.scale = clamp(Number(nextScale.toFixed(2)), zoomState.min, zoomState.max);

  if (zoomState.scale === 1) {
    zoomState.x = 0;
    zoomState.y = 0;
  }

  applyZoom();
}

function setActiveSensor(sensorId) {
  activeSensorId = sensorId;

  document.querySelectorAll("[data-sensor-id]").forEach((element) => {
    element.classList.toggle("is-active", element.dataset.sensorId === sensorId);
  });
}

function openSensorModal(sensorId) {
  const sensor = sensorById.get(sensorId);

  if (!sensor) {
    return;
  }

  setActiveSensor(sensorId);
  sensorModalTitle.textContent = sensor.title;
  sensorModalDescription.textContent = sensor.description;
  sensorModalMeta.innerHTML = sensor.meta
    .map(
      ([label, value]) =>
        `<div class="sensor-modal-chip"><strong>${label}</strong><span>${value}</span></div>`
    )
    .join("");
  sensorModal.classList.remove("is-hidden");
  sensorModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeSensorModal() {
  sensorModal.classList.add("is-hidden");
  sensorModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function renderSensors() {
  sensors.forEach((sensor) => {
    const listButton = document.createElement("button");
    listButton.className = "sensor-list-button";
    listButton.type = "button";
    listButton.dataset.sensorId = sensor.id;
    listButton.innerHTML = `<div><strong>${sensor.title}</strong><span>${sensor.short}</span></div>`;
    listButton.addEventListener("click", () => openSensorModal(sensor.id));
    sensorList.appendChild(listButton);

    const hotspot = document.createElement("button");
    hotspot.className = "map-hotspot";
    hotspot.type = "button";
    hotspot.dataset.sensorId = sensor.id;
    hotspot.setAttribute("aria-label", sensor.title);
    hotspot.style.left = `${sensor.hotspot.left}%`;
    hotspot.style.top = `${sensor.hotspot.top}%`;
    hotspot.style.width = `${sensor.hotspot.width}%`;
    hotspot.style.height = `${sensor.hotspot.height}%`;
    hotspot.addEventListener("click", () => openSensorModal(sensor.id));
    sensorHotspots.appendChild(hotspot);
  });
}

function setView(viewName) {
  viewButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.viewTarget === viewName);
  });

  panels.forEach((panel) => {
    panel.classList.toggle("is-hidden", panel.dataset.view !== viewName);
  });

  if (viewName === "map") {
    window.requestAnimationFrame(applyZoom);
  }

  window.scrollTo(0, 0);
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  operatorChip.textContent = usernameInput.value.trim() || "Operatör";
  authScreen.classList.add("is-hidden");
  appScreen.classList.remove("is-hidden");
  setView("dashboard");
});

logoutButton.addEventListener("click", () => {
  closeSensorModal();
  appScreen.classList.add("is-hidden");
  authScreen.classList.remove("is-hidden");
  loginForm.reset();
  operatorChip.textContent = "Operatör";
  setView("dashboard");
});

viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setView(button.dataset.viewTarget);
  });
});

zoomInButton.addEventListener("click", () => {
  setZoom(zoomState.scale + 0.2);
});

zoomOutButton.addEventListener("click", () => {
  setZoom(zoomState.scale - 0.2);
});

zoomResetButton.addEventListener("click", () => {
  setZoom(1);
});

mapStage.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();
    setZoom(zoomState.scale + (event.deltaY < 0 ? 0.12 : -0.12));
  },
  { passive: false }
);

mapStage.addEventListener("pointerdown", (event) => {
  if (zoomState.scale <= 1 || event.target.closest(".map-hotspot")) {
    return;
  }

  panState.active = true;
  panState.startX = event.clientX - zoomState.x;
  panState.startY = event.clientY - zoomState.y;
  mapStage.classList.add("is-grabbing");
  mapStage.setPointerCapture(event.pointerId);
});

mapStage.addEventListener("pointermove", (event) => {
  if (!panState.active) {
    return;
  }

  zoomState.x = event.clientX - panState.startX;
  zoomState.y = event.clientY - panState.startY;
  applyZoom();
});

function stopPan() {
  panState.active = false;
  mapStage.classList.remove("is-grabbing");
}

mapStage.addEventListener("pointerup", stopPan);
mapStage.addEventListener("pointercancel", stopPan);
mapStage.addEventListener("pointerleave", stopPan);

sensorModalClose.addEventListener("click", closeSensorModal);

sensorModal.addEventListener("click", (event) => {
  if (event.target instanceof HTMLElement && event.target.dataset.closeModal === "true") {
    closeSensorModal();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSensorModal();
  }
});

window.addEventListener("resize", applyZoom);

if (mapImage.complete) {
  applyZoom();
} else {
  mapImage.addEventListener("load", applyZoom);
}

renderSensors();
updateClock();
window.setInterval(updateClock, 1000);
