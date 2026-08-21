// ============================================================
// CONFIG
// ============================================================
const SUPABASE_URL = 'https://rlhnxoanjpfiyzqiesvn.supabase.co';
// ຮອງຮັບຫຼາຍຮູບແບບຂອງ bcryptjs CDN global (ບາງ build ໃຊ້ window.dcodeIO.bcrypt,
// ບາງ build ໃຊ້ window.bcrypt ໂດຍກົງ)
const bc = (typeof dcodeIO !== 'undefined' && dcodeIO.bcrypt) ? dcodeIO.bcrypt : (typeof bcrypt !== 'undefined' ? bcrypt : null);
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsaG54b2FuanBmaXl6cWllc3ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NTE0ODksImV4cCI6MjA5NzEyNzQ4OX0.IytzfVUaTgIPDGPtM7fQovIYU39MJcu_UUUFF1gsntU';
// Admin credentials managed in Supabase companies table (is_admin=true)
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const MONTHS_LAO = ['','ມັງກອນ','ກຸມພາ','ມີນາ','ເມສາ','ພຶດສະພາ','ມິຖຸນາ','ກໍລະກົດ','ສິງຫາ','ກັນຍາ','ຕຸລາ','ພະຈິກ','ທັນວາ'];

const LAO_PROVINCES = [
  {name:'ນະຄອນຫຼວງວຽງຈັນ',code:1},{name:'ແຂວງຜົ້ງສາລີ',code:2},
  {name:'ແຂວງຫຼວງນ້ຳທາ',code:3},{name:'ແຂວງອຸດົມໄຊ',code:4},
  {name:'ແຂວງບໍ່ແກ້ວ',code:5},{name:'ແຂວງຫຼວງພະບາງ',code:6},
  {name:'ແຂວງໄຊຍະບູລີ',code:7},{name:'ແຂວງຫົວພັນ',code:8},
  {name:'ແຂວງຊຽງຂວາງ',code:9},{name:'ແຂວງວຽງຈັນ',code:10},
  {name:'ແຂວງບໍລິຄຳໄຊ',code:11},{name:'ແຂວງຄຳມ່ວນ',code:12},
  {name:'ແຂວງສະຫວັນນະເຂດ',code:13},{name:'ແຂວງໄຊສົມບູນ',code:18},
  {name:'ແຂວງສາລະວັນ',code:14},{name:'ແຂວງເຊກອງ',code:16},
  {name:'ແຂວງຈຳປາສັກ',code:15},{name:'ແຂວງອັດຕະປື',code:17}
];

const LAO_EDUCATION = ['ບໍ່ຮູ້ໜັງສື','ປະຖົມ','ມັດທະຍົມຕົ້ນ','ມັດທະຍົມປາຍ',
  'ຊັ້ນຕົ້ນ','ຊັ້ນສູງ','ຊັ້ນກາງ','ປະລິຍາຕີ','ປະລິນຍາໂທ','ປະລິນຍາເອກ'];

// ✅ Lao date formatter: DD ເດືອນ YYYY
function laoDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const dd = String(d.getDate()).padStart(2,'0');
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

// ✅ Calculate duration from start date to today
function calcDuration(startDate) {
  if (!startDate) return '-';
  const start = new Date(startDate);
  const now   = new Date();
  const days  = Math.floor((now - start) / 86400000);
  if (days < 0) return '0 ວັນ';
  const yrs  = Math.floor(days / 365);
  const mons = Math.floor((days % 365) / 30);
  const rem  = days % 30;
  let r = '';
  if (yrs  > 0) r += `${yrs} ປີ `;
  if (mons > 0) r += `${mons} ເດືອນ `;
  if (rem  > 0 || (!yrs && !mons)) r += `${rem} ວັນ`;
  return r.trim() || '0 ວັນ';
}
const NATIONALITIES = [
  'ໄທ','ວຽດນາມ','ຈີນ','ມຽນມາ','ກຳປູເຈຍ','ຟີລິປີນ','ອິນໂດເນເຊຍ','ມາເລເຊຍ','ສິງກະໂປ','ບຣູໄນ','ຕີມໍຕາເວັນອອກ',
  'ຍີ່ປຸ່ນ','ເກົາຫຼີໃຕ້','ເກົາຫຼີເໜືອ','ໄຕ້ຫວັນ','ມົງໂກລີ','ຮົງກົງ','ມາກາວ',
  'ອິນເດຍ','ປາກີສະຖານ','ບັງກະລາເທດ','ສີລັງກາ','ເນປານ','ພູຖານ','ອັຟການິສຖານ','ມັນດີຟ',
  'ຣັດເຊຍ','ຄາຊັກສະຖານ','ອຸສເບກິສະຖານ','ຕາຈິກິສະຖານ','ເຕີກເມນິສະຖານ','ກີກກິສະຖານ',
  'ອາເມລິກາ','ການາດາ','ເມັກຊິໂກ','ບຣາຊິລ','ອາເຈນຕິນາ','ຊິລີ','ໂຄລົມເບຍ','ເປຣູ','ເວເນຊູເອລາ',
  'ອັງກິດ','ຝຣັ່ງ','ເຢຍລະມັນ','ອິຕາລີ','ສະເປນ','ປອກຕຸຍການ','ເນເທີແລນ','ເບວຢຽມ','ສະວິດເຊີແລນ','ອອສເຕຣຍ',
  'ສະວີເດັນ','ນອກແວ','ເດນມາກ','ຟິນແລນ','ໂປແລນ','ສາທາລະນະລັດເຊັກ','ຮົງກາຣີ','ກຣີສ','ໂລມາເນຍ','ບຸນກາລີ','ຢູເຄຣນ',
  'ໄອແລນ','ໄອສແລນ',
  'ອົດສະຕຣາລີ','ນິວຊີແລນ',
  'ອັງກິດ','ອານຸລາ','ສະຫະລັດອາຣັບເອມິເຣດ','ຊາອຸດິອາຣະເບຍ','ກາຕາ','ຄູເວດ','ບາເຣນ','ໂອມານ','ອິສຣາແອລ','ຈໍແດນ','ເລບານອນ','ຕວນກີ','ອີຣ່ານ','ອີຣັກ',
  'ອີຢິບ','ໂມລັອກໂກ','ໄນຈີເຣຍ','ແອັບຟຣິກາໃຕ້','ເຄນຢາ','ການາ','ເອທິໂອເປຍ',
  'ອື່ນໆ'
];
const NATIONALITY_EN = {'ລາວ':'Lao','ໄທ':'Thai','ວຽດນາມ':'Vietnamese','ຈີນ':'Chinese','ຟີລິປີນ':'Filipino','ມຽນມາ':'Myanmar','ກຳປູເຈຍ':'Cambodian','ອິນໂດເນເຊຍ':'Indonesian','ມາເລເຊຍ':'Malaysian','ສິງກະໂປ':'Singaporean','ຍີ່ປຸ່ນ':'Japanese','ເກົາຫຼີ':'Korean','ອິນເດຍ':'Indian','ອາເມລິກາ':'American','ອັງກິດ':'British','ຝຣັ່ງ':'French','ເຢຍລະມັນ':'German','ອົດສະຕຣາລີ':'Australian','ອື່ນໆ':'Other'};

