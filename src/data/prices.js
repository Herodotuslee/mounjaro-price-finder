// src/data/prices.js
export const CITY_LABELS = {
  taipei: "台北",
  new_taipei: "新北",
  taoyuan: "桃園",
  taichung: "台中",
  tainan: "台南",
  kaohsiung: "高雄",
  keelung: "基隆",
  hsinchu: "新竹",
  miaoli: "苗栗國",
  changhua: "彰化",
  nantou: "南投",
  yunlin: "雲林",
  chiayi: "嘉義",
  pingtung: "屏東",
  taitung: "台東",
  hualien: "花蓮",
  yilan: "宜蘭",
  penghu: "澎湖",
  kinmen: "金門",
  lienchiang: "馬祖",
};

// 類型英文 → 中文顯示
export const TYPE_LABELS = {
  clinic: "診所",
  hospital: "醫院",
  pharmacy: "藥局",
};

// 城市 filter（還是以「各大主要城市」為主）
export const CITIES = [
  "all",
  "taipei",
  "new_taipei",
  "taoyuan",
  "taichung",
  "tainan",
  "kaohsiung",
  "keelung",
  "hsinchu",
  "hsinchu_county",
  "miaoli",
  "changhua",
  "nantou",
  "yunlin",
  "chiayi",
  "chiayi_county",
  "pingtung",
  "taitung",
  "hualien",
  "yilan",
  "penghu",
  "kinmen",
  "lienchiang",
];

// 類型 filter
export const TYPES = ["all", "clinic", "hospital", "pharmacy"];
