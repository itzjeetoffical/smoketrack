const brandInput = document.getElementById("brand");
const costInput = document.getElementById("cost");
const qtyInput = document.getElementById("qty");
const addBtn = document.getElementById("addBtn");

const todayCountEl = document.getElementById("todayCount");
const todayCostEl = document.getElementById("todayCost");
const weekCountEl = document.getElementById("weekCount");
const weekCostEl = document.getElementById("weekCost");
const monthCountEl = document.getElementById("monthCount");
const monthCostEl = document.getElementById("monthCost");

const brandTodayEl = document.getElementById("brandToday");
const brandWeekEl = document.getElementById("brandWeek");
const brandMonthEl = document.getElementById("brandMonth");

let data = JSON.parse(localStorage.getItem("smokeData")) || [];

function todayDate() {
  return new Date().toISOString().split("T")[0];
}

addBtn.addEventListener("click", () => {
  const brand = brandInput.value.trim();
  const cost = Number(costInput.value);
  const qty = Number(qtyInput.value);

  if (!brand || cost <= 0 || qty <= 0) {
    alert("Please enter valid brand, cost and quantity");
    return;
  }

  data.push({
    date: todayDate(),
    brand,
    cost,
    qty
  });

  localStorage.setItem("smokeData", JSON.stringify(data));
  updateStats();
});

function updateStats() {
  const now = new Date();

  let todayCount = 0, todayCost = 0;
  let weekCount = 0, weekCost = 0;
  let monthCount = 0, monthCost = 0;

  let brandToday = {};
  let brandWeek = {};
  let brandMonth = {};

  data.forEach(item => {
    const entryDate = new Date(item.date);
    const diffDays = (now - entryDate) / (1000 * 60 * 60 * 24);
    const totalCost = item.qty * item.cost;

    // TODAY
    if (item.date === todayDate()) {
      todayCount += item.qty;
      todayCost += totalCost;
      brandToday[item.brand] = (brandToday[item.brand] || 0) + item.qty;
    }

    // WEEK
    if (diffDays <= 7) {
      weekCount += item.qty;
      weekCost += totalCost;
      brandWeek[item.brand] = (brandWeek[item.brand] || 0) + item.qty;
    }

    // MONTH
    if (
      entryDate.getMonth() === now.getMonth() &&
      entryDate.getFullYear() === now.getFullYear()
    ) {
      monthCount += item.qty;
      monthCost += totalCost;
      brandMonth[item.brand] = (brandMonth[item.brand] || 0) + item.qty;
    }
  });

  todayCountEl.textContent = todayCount;
  todayCostEl.textContent = todayCost;

  weekCountEl.textContent = weekCount;
  weekCostEl.textContent = weekCost;

  monthCountEl.textContent = monthCount;
  monthCostEl.textContent = monthCost;

  renderBrandStats(brandTodayEl, brandToday);
  renderBrandStats(brandWeekEl, brandWeek);
  renderBrandStats(brandMonthEl, brandMonth);
}

function renderBrandStats(container, dataObj) {
  container.innerHTML = "";

  const sorted = Object.entries(dataObj).sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) {
    container.innerHTML = "<li>No data</li>";
    return;
  }

  sorted.forEach(([brand, qty]) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${brand}</span><span>${qty}</span>`;
    container.appendChild(li);
  });
}

updateStats();
