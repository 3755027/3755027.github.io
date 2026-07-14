/* ============================================================
   家的味道年菜網站｜每年更新只需修改「網站設定」與「年菜品項」
   ============================================================ */
const SITE = {
  year: "115",
  kicker: "家傳的年味・團圓上桌",
  title: "家的味道 鴻運年菜",
  subtitle: "115 年外帶單點及套餐｜示範資料",
  orderDeadline: "即日起至 115/02/02 止",
  pickupMethod: "到店自取；外送請先洽詢",
  depositNote: "預付 5 成訂金或全額付清",
  importantNote: "本頁送出的內容為訂購意願。完成付款並收到店家回條後，才算正式完成訂購。",
  phones: ["0910278677（阿桃）", "0960805321（阿賢）"],
  mainPhone: "0910278677",
  address: "高雄市仁武區鳳仁路21之31號",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("高雄市仁武區鳳仁路21之31號")
};

const MENU = [
  {name:"鴻運團圓整套年菜",price:6600,type:"套餐",image:"images/011.jpg",tag:"豪華套餐",details:"鴻運四喜大拼盤\n山珍錦繡魚翅羹\n長紅蒜蓉粉絲蝦\n富貴筍香大蹄膀\n蒲燒鯛魚鑲米糕\n清蒸甘露龍虎斑\n花鑲洋芋焗百菇\n魚翅首烏全雞湯\n蘋果芋丸甜在心\n萬兩金磚蜜蛋糕"},
  {name:"小資族精選套餐",price:3680,type:"套餐",image:"images/022.jpg",tag:"精選套餐",details:"精美四拼盤\n蟹肉蝦仁羹\n蒲燒鯛米糕\n糖醋鮮鱸魚\n橙排花枝餅"},
  {name:"鮑翅佛跳牆（含盅）",price:1200,image:"images/21.jpg",tag:"人氣推薦"},
  {name:"清蒸龍虎斑",price:750,image:"images/12.jpg"},
  {name:"秘製豬肋排",price:650,image:"images/16.jpg"},
  {name:"筍香大蹄膀",price:600,image:"images/15.jpg"},
  {name:"蒲燒鯛米糕",price:650,image:"images/023.jpg"},
  {name:"錦繡魚翅羹",price:600,image:"images/11.jpg"},
  {name:"古法八寶丸",price:450,image:"images/22.jpg"},
  {name:"陳香紹醉雞",price:550,image:"images/18.jpg"},
  {name:"魚翅燉全雞",price:1150,image:"images/19.jpg"},
  {name:"橙汁蜜排骨",price:480,image:"images/14.jpg"},
  {name:"手工芋頭丸",price:380,image:"images/20.jpg"},
  {name:"糖醋鮮鱸魚",price:650,image:"images/13.jpg"},
  {name:"泰式花枝餅",price:400,image:"images/17.jpg"}
];

const state = MENU.map(() => ({checked:false, qty:1}));
const $ = (id) => document.getElementById(id);
const money = (n) => `NT$ ${Number(n).toLocaleString("zh-TW")}`;

function fillSiteInfo(){
  $("hero-kicker").textContent = SITE.kicker;
  $("site-title").textContent = SITE.title;
  $("site-subtitle").textContent = SITE.subtitle;
  $("order-deadline").textContent = SITE.orderDeadline;
  $("pickup-method").textContent = SITE.pickupMethod;
  $("deposit-note").textContent = SITE.depositNote;
  $("important-note").textContent = SITE.importantNote;
  $("phone-list").textContent = SITE.phones.join("／");
  $("store-address").textContent = SITE.address;
  $("call-button").href = `tel:${SITE.mainPhone}`;
  $("map-button").href = SITE.mapUrl;
  $("item-count").textContent = `共 ${MENU.length} 項`;
  document.title = `${SITE.title}｜${SITE.year} 年年菜訂購`;
}

function renderMenu(){
  $("menu-list").innerHTML = MENU.map((item,i)=>{
    const disabled = item.soldOut ? "disabled" : "";
    return `<article class="menu-card ${item.type === "套餐" ? "package" : ""} ${item.soldOut ? "soldout" : ""}">
      ${item.soldOut ? '<span class="soldout-badge">已售完</span>' : ''}
      <div class="menu-info">
        ${item.tag ? `<span class="tag">${item.tag}</span>` : ""}
        <div class="menu-title"><input id="check-${i}" type="checkbox" ${disabled}><label for="check-${i}">${item.name}</label></div>
        ${item.details ? `<div class="details">${item.details}</div>` : ""}
        <div class="price">${money(item.price)}</div>
        <div class="qty"><button type="button" data-action="minus" data-index="${i}" ${disabled}>−</button><strong id="qty-${i}">1</strong><button type="button" data-action="plus" data-index="${i}" ${disabled}>＋</button></div>
        <div class="subtotal">小計：<span id="subtotal-${i}">${money(item.price)}</span></div>
      </div>
      <img class="menu-photo" src="${item.image}" alt="${item.name}" loading="lazy">
    </article>`;
  }).join("");

  MENU.forEach((_,i)=>$("check-"+i).addEventListener("change",e=>{state[i].checked=e.target.checked;updateTotal();}));
  $("menu-list").addEventListener("click",e=>{
    const btn=e.target.closest("button[data-index]"); if(!btn) return;
    const i=Number(btn.dataset.index); const delta=btn.dataset.action==="plus"?1:-1;
    state[i].qty=Math.max(1,state[i].qty+delta); state[i].checked=true;
    $("check-"+i).checked=true; $("qty-"+i).textContent=state[i].qty;
    $("subtotal-"+i).textContent=money(MENU[i].price*state[i].qty); updateTotal();
  });
}

function getTotal(){return MENU.reduce((sum,item,i)=>sum+(state[i].checked?item.price*state[i].qty:0),0)}
function updateTotal(){$("total-price").textContent=money(getTotal())}
function showMessage(text){$("toast").innerHTML=`<div class="toast__box"><strong>${text}</strong><br><button type="button" id="toast-close">確定</button></div>`;$("toast").classList.add("show");$("toast-close").onclick=()=>$("toast").classList.remove("show")}

function sendOrder(){
  const name=$("customer-name").value.trim(), phone=$("customer-phone").value.trim(), pickup=$("pickup-time").value.trim();
  if(!name||!phone||!pickup){showMessage("請填寫姓名、電話與取餐日期時間。");return}
  const chosen=MENU.map((item,i)=>state[i].checked?`✅ ${item.name} × ${state[i].qty}（${money(item.price*state[i].qty)}）`:null).filter(Boolean);
  if(!chosen.length){showMessage("請先選擇至少一項年菜。");return}
  const message=`【家的味道 ${SITE.year} 年年菜訂單】\n👤 姓名：${name}\n📞 電話：${phone}\n📅 取餐：${pickup}\n💳 付款：${$("payment-method").value}\n\n--- 訂購清單 ---\n${chosen.join("\n")}\n\n💰 總計：${money(getTotal())}\n\n⚠️ ${SITE.importantNote}\n\n謝謝您，請店家協助確認訂單與付款資訊。`;
  location.href=`https://line.me/R/msg/text/?${encodeURIComponent(message)}`;
}

fillSiteInfo(); renderMenu(); updateTotal(); $("send-order-btn").addEventListener("click",sendOrder);
