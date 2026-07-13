// --- 게임 데이터 기획 ---
let game = {
    gold: 0,              // 플레이어 보유 골드
    mineStorage: 0,       // 광산 창고에 쌓인 임시 골드
    
    // 1. 곡괭이 (수동 채굴 -> 창고로 적재)
    pickaxeLevel: 1,
    pickaxeCost: 50,
    clickPower: 1,

    // 2. 광부 (자동 채굴 -> 창고로 적재)
    minerCount: 0,
    minerCost: 10,
    minerGps: 1,

    // 3. 광산 창고
    storageLevel: 1,
    storageCost: 30,
    baseStorageMax: 100,

    // 4. 바구니 (수동 수거)
    basketLevel: 1,
    basketCost: 80,
    baseBasketPower: 10,  // 레벨 1일 때 기본 수거량

    // 5. 자동 운반기 (창고 -> 내 인벤토리 자동이동)
    conveyorCount: 0,
    conveyorCost: 500,
    conveyorGps: 15,

    // 무기 정보
    weaponLevel: 0,
    enhanceCost: 100
};

const weaponNames = ["훈련용 목검", "녹슨 철검", "강철 장검", "은빛 기사검", "명검 엑스칼리버", "신검 레바테인"];

// --- DOM 엘리먼트 가져오기 ---
const goldCountEl = document.getElementById('gold-count');
const clickPowerEl = document.getElementById('click-power');
const mineBtn = document.getElementById('mine-btn');
const collectBtn = document.getElementById('collect-btn');
const basketPowerEl = document.getElementById('basket-power');

const storageCurrentEl = document.getElementById('storage-current');
const storageMaxEl = document.getElementById('storage-max');
const storageBarEl = document.getElementById('storage-bar');

const upgradePickaxeBtn = document.getElementById('upgrade-pickaxe');
const pickaxeCostEl = document.getElementById('pickaxe-cost');
const pickaxeLevelEl = document.getElementById('pickaxe-level');

const buyMinerBtn = document.getElementById('buy-miner');
const minerCostEl = document.getElementById('miner-cost');
const minerCountEl = document.getElementById('miner-count');

const upgradeStorageBtn = document.getElementById('upgrade-storage');
const storageCostEl = document.getElementById('storage-cost');
const storageLevelEl = document.getElementById('storage-level');

const upgradeBasketBtn = document.getElementById('upgrade-basket');
const basketCostEl = document.getElementById('basket-cost');
const basketLevelEl = document.getElementById('basket-level');

const buyConveyorBtn = document.getElementById('buy-conveyor');
const conveyorCostEl = document.getElementById('conveyor-cost');
const conveyorCountEl = document.getElementById('conveyor-count');

const weaponNameEl = document.getElementById('weapon-name');
const weaponLevelEl = document.getElementById('weapon-level');
const enhanceBtn = document.getElementById('enhance-btn');
const enhanceCostEl = document.getElementById('enhance-cost');
const enhanceChanceEl = document.getElementById('enhance-chance');
const logMessageEl = document.getElementById('log-message');

// --- 실시간 스펙 계산 함수 ---
function getMaxStorage() {
    return game.storageLevel * game.baseStorageMax;
}

function getBasketPower() {
    // 바구니 레벨당 수거 능력치 증가
    return game.baseBasketPower + ((game.basketLevel - 1) * 20);
}

function getEnhanceChance() {
    if (game.weaponLevel < 3) return 100;
    if (game.weaponLevel < 7) return 80;
    if (game.weaponLevel < 12) return 50;
    if (game.weaponLevel < 17) return 30;
    return 15;
}

// --- 화면 갱신 함수 ---
function updateUI() {
    let maxStorage = getMaxStorage();
    let basketPower = getBasketPower();

    goldCountEl.innerText = Math.floor(game.gold);
    clickPowerEl.innerText = game.clickPower;
    basketPowerEl.innerText = basketPower;

    // 창고 UI
    storageCurrentEl.innerText = Math.floor(game.mineStorage);
    storageMaxEl.innerText = maxStorage;
    let percentage = (game.mineStorage / maxStorage) * 100;
    storageBarEl.style.width = Math.min(percentage, 100) + "%";
    storageBarEl.style.backgroundColor = percentage >= 100 ? "#ff3d00" : "#00ffcc";

    // 장비 정보 상점
    pickaxeCostEl.innerText = game.pickaxeCost;
    pickaxeLevelEl.innerText = "Lv." + game.pickaxeLevel;

    minerCostEl.innerText = game.minerCost;
    minerCountEl.innerText = game.minerCount + "명";

    storageCostEl.innerText = game.storageCost;
    storageLevelEl.innerText = "Lv." + game.storageLevel;

    basketCostEl.innerText = game.basketCost;
    basketLevelEl.innerText = "Lv." + game.basketLevel;

    conveyorCostEl.innerText = game.conveyorCost;
    conveyorCountEl.innerText = game.conveyorCount + "개";

    // 대장간 무기 세팅
    let nameIndex = Math.min(Math.floor(game.weaponLevel / 5), weaponNames.length - 1);
    weaponNameEl.innerText = weaponNames[nameIndex];
    weaponLevelEl.innerText = game.weaponLevel;
    
    game.enhanceCost = 100 + (game.weaponLevel * 150);
    enhanceCostEl.innerText = game.enhanceCost;
    enhanceChanceEl.innerText = getEnhanceChance();
}

// --- 이벤트 리스너 ---

// 1. 수동 채굴 (이제 '내 보유 골드'가 아니라 '창고'로 들어감)
mineBtn.addEventListener('click', () => {
    let maxStorage = getMaxStorage();
    if (game.mineStorage < maxStorage) {
        game.mineStorage = Math.min(game.mineStorage + game.clickPower, maxStorage);
        updateUI();
    }
});

// 2. 바구니 수거 (창고에 있는 골드를 퍼서 내 인벤토리로 이동)
collectBtn.addEventListener('click', () => {
    if (game.mineStorage > 0) {
        let bp = getBasketPower();
        let transferAmount = Math.min(game.mineStorage, bp);
        
        game.mineStorage -= transferAmount;
        game.gold += transferAmount;
        updateUI();
    }
});

// 3. 곡괭이 강화
upgradePickaxeBtn.addEventListener('click', () => {
    if (game.gold >= game.pickaxeCost) {
        game.gold -= game.pickaxeCost;
        game.pickaxeLevel++;
        game.clickPower = game.pickaxeLevel + Math.floor(game.weaponLevel * 1.4);
        game.pickaxeCost = Math.floor(game.pickaxeCost * 1.5);
        updateUI();
    } else { alert("골드가 부족합니다!"); }
});

// 4. 광부 고용
buyMinerBtn.addEventListener('click', () => {
    if (game.gold >= game.minerCost) {
        game.gold -= game.minerCost;
        game.minerCount++;
        game.minerCost = Math.floor(game.minerCost * 1.1);
        updateUI();
    } else { alert("골드가 부족합니다!"); }
});

// 5. 광산 창고 확장
upgradeStorageBtn.addEventListener('click', () => {
    if (game.gold >= game.storageCost) {
        game.gold -= game.storageCost;
        game.storageLevel++;
        game.storageCost = Math.floor(game.storageCost * 1.4);
        updateUI();
    } else { alert("골드가 부족합니다!"); }
});

// 6. 바구니 강화
upgradeBasketBtn.addEventListener('click', () => {
    if (game.gold >= game.basketCost) {
        game.gold -= game.basketCost;
        game.basketLevel++;
        game.basketCost = Math.floor(game.basketCost * 1.4);
        updateUI();
    } else { alert("골드가 부족합니다!"); }
});

// 7. 자동 운반기 구매
buyConveyorBtn.addEventListener('click', () => {
    if (game.gold >= game.conveyorCost) {
        game.gold -= game.conveyorCost;
        game.conveyorCount++;
        game.conveyorCost = Math.floor(game.conveyorCost * 1.4);
        updateUI();
    } else { alert("골드가 부족합니다!"); }
});

// 8. 무기 강화
enhanceBtn.addEventListener('click', () => {
    if (game.gold >= game.enhanceCost) {
        game.gold -= game.enhanceCost;
        
        let chance = getEnhanceChance();
        let roll = Math.random() * 100;

        if (roll < chance) {
            game.weaponLevel++;
            logMessageEl.innerText = `✨ 무기 강화 성공! [ +${game.weaponLevel} ] 이(가) 되었습니다.`;
            logMessageEl.style.color = "#ffea00";
            game.clickPower = game.pickaxeLevel + Math.floor(game.weaponLevel * 1.5);
        } else {
            if (game.weaponLevel % 5 !== 0 && game.weaponLevel > 0) {
                game.weaponLevel--;
                logMessageEl.innerText = `💥 대장간 실패! 단계가 미끄러졌습니다. [ +${game.weaponLevel} ]`;
            } else {
                logMessageEl.innerText = `💥 대장간 실패! (안전 구간으로 레벨 유지) [ +${game.weaponLevel} ]`;
            }
            logMessageEl.style.color = "#ff3d00";
        }
        updateUI();
    } else { alert("강화 비용이 부족합니다!"); }
});

// --- 게임 루프 (0.1초 마다 계산) ---
setInterval(() => {
    let maxStorage = getMaxStorage();

    // A. 광부 자동 채굴 -> 창고 적재
    if (game.mineStorage < maxStorage) {
        let minedAmount = (game.minerCount * game.minerGps) / 10;
        game.mineStorage = Math.min(game.mineStorage + minedAmount, maxStorage);
    }

    // B. 자동 운반기 작동 (자동운반기만 실시간으로 창고에서 골드 수거)
    if (game.mineStorage > 0 && game.conveyorCount > 0) {
        let transportAmount = (game.conveyorCount * game.conveyorGps) / 10;
        let actualTransport = Math.min(game.mineStorage, transportAmount);
        
        game.mineStorage -= actualTransport;
        game.gold += actualTransport;
    }

    updateUI();
}, 100);

updateUI();