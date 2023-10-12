let list  = document.getElementsByClassName('historyPage_historyListBodyRow__BcGp_');
let table = list[0].parentNode

let filter_param_set;

let data = {
  "Legendary": [
    "Green April Anaak",
    "Khun Ran",
    "Sachi Faker",
    "Verdi",
    "Yuri Ha",
    "Hunter Rak",
    "Bong Bong Endorsi",
    "Hansung Yu",
    "Hwaryun",
    "Daniel Hatchid",
    "Xiaxia",
    "Urek Mazino",
    "Reflejo",
    "Beta",
    "Cassano",
    "Evan",
    "Green April (Transformed)",
    "Black March",
    "Blue Lightning Nucleus",
    "Hairpin of Noble Power",
    "White Heavenly Mirror",
    "Exploding Knuckle Blade",
    "Mad Shocker",
    "Bong Bong",
    "Thorn",
    "Hairpin of Shinsu Control",
    "Red Twin Blades",
    "Black Rabbit Bomb",
    "Mazino Wing Tree",
    "Frog Fisher",
    "Dark Shinsu's Reaper",
    "Living Ignition Weapon_Proto Type",
    "Cassano's Left Arm",
    "Necromance",
    "Crimson Rose",
    "Cosmic Pure Octopus",
    "Jahad Laevateinn",
    "FUG Wand",
    "Guardian Bow",
    "Blue Rune Angelic Spear",
    "Yihwa Yeon"
  ],
  "Epic": [
    "Endorsi",
    "Hatz",
    "Horyang",
    "Miseng",
    "Khun A. A.",
    "Lo Po Bia Ren",
    "Rachel",
    "Wangnan Ja",
    "Laure",
    "Love",
    "Novick",
    "Quant Blitz",
    "Shibisu",
    "Varagav",
    "Mini Rak",
    "Boro",
    "Redeye Needle",
    "Donghae",
    "Shinsu Gauntlet",
    "Suspicious Messenger Bag",
    "Ren's Flail",
    "Yellow Lighthouse",
    "Cozy Blanket",
    "Ignition Gauntlet",
    "Rabbit Doll",
    "Blue Gloves",
    "Antimatter Bomb",
    "Twin Circle Boomerang",
    "Quick Gloves",
    "Super Lethal King Of Majesty Observer",
    "Rassen Kunai",
    "Pink Kukri",
    "Attract Blade",
    "Angelic Blade",
    "Dark Chaser Book",
    "Crown Bow"
  ],
  "Rare": [
    "Chaos Dagger",
    "Wide Spear",
    "Chain Sword",
    "Gyro Sword",
    "Gyro Spear",
    "Rainbow Sword",
    "Rainbow Spear",
    "Bone Dagger",
    "Bone Blade",
    "Bone Stick",
    "Bone Rod",
    "Extreme Wave Stick",
    "Extreme Wave Twin Blades",
    "Angel Stick",
    "Meow Meow Mace",
    "Meow Meow Blade",
    "Magically-Engineered Claymore",
    "Magically-Engineered Spear",
    "Magically-Engineered Axe",
    "Redpoint Bow",
    "Blue Shinsu Rod",
    "Shinheuh Cutlass",
    "Golden Rapier",
    "Bluepoint Lance"
  ],
  "Uncommon": [
    "Blue Rune Bow",
    "Pink Rune Stick",
    "Blue Rune Hammer",
    "Red Knuckles",
    "Blue Rune Axe",
    "Red Rune Sword",
    "Rapier",
    "Weak Shinsu's Claymore",
    "Red-Marked Kunai",
    "Black Iron Claymore",
    "Purple Rune Rod",
    "Blue Rune Stick"
  ]
}

let colours = {
	"Legendary" : '#ffea89',
	"Epic" : '#c9bcef',
	"Rare" : '#a4c8ff',
	"Uncommon" : '#cdeaba',

} 

let item_per_rarity = {
	"Legendary" : [],
	"Epic" : [],
	"Rare" : [],
	"Uncommon" : [],
}

let counter = new Map();	
counter.set('Legendary', 0);
counter.set('Epic', 0);
counter.set('Rare', 0);
counter.set('Uncommon', 0);
counter.set('Total', 0);

MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function(mutations, observer) {
  console.log(1)
  editTable();
  if(filter_param_set){
    resetFilterTable()
    filterTable(filter_param_set)
  }
});

// define what element should be observed by the observer
// and what types of mutations trigger the callback
observer.observe(document, {
  subtree: true,
  attributes: true
});

// setInterval(function() { editTable(); }, 1000);

function editTable(event) {
  if(table.innerText !== 'You have no summon result yet.'){
		for (const list_key of Object.keys(list)) {
      let row = list[list_key];
  		let text = row.childNodes[1].outerText;
			for (const data_key of Object.keys(data)) {
				if (data[data_key].filter(function(e) { return e === text; }).length > 0) {
          if (item_per_rarity[data_key].filter(function(e) { return e === row; }).length > 0){
            continue; 
          } else {
            let i = counter.get(data_key);
            counter.set(data_key, ++i);
            let colour = colours[data_key];
            row.childNodes[1].parentNode.style.backgroundColor = colour;
            row.classList.add(data_key);
            item_per_rarity[data_key].push(row);
          }
        break;
	  	  }
		  };
  	}
  }
}


function filterTable(event, data){
  filter_param = 'Epic'
  for (const list_key of Object.keys(list)) {
    let element = list[list_key]
    if (!element.classList.contains('Epic')) {
      element.style.display = "none";
    }
  }
}

function resetFilterTable(event, data){
  filter_param = '';
  for (const list_key of Object.keys(list)) {
    let element = list[list_key]
    element.style.display = null;
  }
}

editTable();