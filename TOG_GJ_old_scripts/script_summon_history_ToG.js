//Full code running in 700-1300 ms

let rarity_per_name = {
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
		"Yihwa Yeon",
		"White Heavenly Mirror Khun",
		"Bong Bong Endorsi",
		"Jinsung Ha",
		"Fist of the Dragon and Tiger",
		"Bong Bong"
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
  ]}

let table  = document.getElementsByClassName('historyPage_historyList___iObH')[0];
let table_tbody = document.getElementsByClassName('historyPage_historyListBody__WeZjB')[0];
let gachaSelector = document.getElementsByClassName('historyPage_gachaSelectorWrapper__Rg3jT')[0];
let head_row = document.getElementsByClassName('historyPage_historyListHeadRow__bOMpF')[0];

let colours = {
	"Legendary" : '#ffea89',
	"Epic" : '#c9bcef',
	"Rare" : '#a4c8ff',
	"Uncommon" : '#cdeaba',
} 
let global_filter_by_type_gacha = 'historyPage_historyListBodyRow__BcGp_';


let all_items = []
let gacha_type = {
		"0":"All"
}

let checkbox_selections = []
let filtered_array = []

let item_per_rarity = {
		"Legendary" : [],
		"Epic" : [],
		"Rare" : [],
		"Uncommon" : [],
	}

let item_per_gacha_type = {}

let counter = {};

let getTime = (function getDate(string){
	let time_stamp = new Date().getTime();

	return {
		time: (string) => {
			return `${string} ${new Date().getTime() - time_stamp} ms`;
		}
	}
})();


table_tbody.innerHTML = '';
gachaSelector.innerHTML = '';




let pity = document.createElement("td");
		pity.classList.add('historyPage_historyListHeadCol__VBbXi');
		pity.textContent = 'Pity';

let gacha_type_total = document.createElement("td");
		gacha_type_total.classList.add('historyPage_historyListHeadCol__VBbXi');
		gacha_type_total.textContent = 'Total of type';

let total = document.createElement("td")
		total.classList.add('historyPage_historyListHeadCol__VBbXi');
		total.textContent = 'Total';

head_row.appendChild(pity)
head_row.appendChild(gacha_type_total)
head_row.appendChild(total)

let json_parsed = JSON.parse(document.getElementById('__NEXT_DATA__').outerText).props.pageProps;

let histories = json_parsed.histories;
let reverse_histories = json_parsed.histories.reverse();
let gacha_datas = json_parsed.gachaDatas;


console.log(getTime.time('Start:'));

for(const data of histories){
	for(const rarity of Object.keys(rarity_per_name)) {
		if(rarity_per_name[rarity].indexOf(data.itemName) > -1){

			let tr = document.createElement('tr');

			tr.classList.add('historyPage_historyListBodyRow__BcGp_');
			tr.classList.add(rarity);
			tr.setAttribute("data-gacha_type", data.gachaName) 
			tr.style.backgroundColor = colours[rarity];

			let itemType_content = data.itemType < 4000000 ? 'Ignition Weapon' : 'Character'; 
			let itemName_content = data.itemName; 
			let gachaName_content = data.gachaName; 
			let logTime_content = new Date(data.logTime).toLocaleString('en-GB'); 
			if(!counter[data.gachaType] &&
				 !counter['all'] &&
				 !counter[data.gachaType*10])
			{
				counter[data.gachaType] = 0
				counter['all'] = 0;
				counter[data.gachaType*10] = 0;
			}


			for(const value of [itemType_content, itemName_content, gachaName_content, logTime_content]){
				let cell = document.createElement("td");
				cell.classList.add('historyPage_historyListBodyCol___et1p');
				cell.textContent = value;
				tr.appendChild(cell);
			}

			if(!gacha_type[data.gachaType]){
				gacha_type[data.gachaType] = data.gachaName
			}

			item_per_rarity[rarity].push([
					data.gachaType,
					data.itemType,
					data.itemName,
					data.gachaName,
					data.logTime,
					tr
				])


			if (!item_per_gacha_type[data.gachaName]) {
				item_per_gacha_type[data.gachaName] = []
			}
			item_per_gacha_type[data.gachaName].push([
					data.gachaType,
					data.itemType,
					data.itemName,
					data.gachaName,
					data.logTime,
					tr
				])

			all_items.push([
					rarity,
					data.gachaType,
					data.itemType,
					data.itemName,
					data.gachaName,
					data.logTime,
					tr
				])
			break;
		}
	}
}
console.log(getTime.time('End:'));


for(const array of all_items){
	counter.all++;
	counter[array[1]]++;
	counter[array[1]*10]++;


	let pity_counter = document.createElement("td");
			pity_counter.classList.add('historyPage_historyListBodyCol___et1p');
			pity_counter.textContent = counter[array[1]];

	let total_counter = document.createElement("td");
			total_counter.classList.add('historyPage_historyListBodyCol___et1p');
			total_counter.textContent = counter.all;

	let gacha_type_total_counter = document.createElement("td");
			gacha_type_total_counter.classList.add('historyPage_historyListBodyCol___et1p');
			gacha_type_total_counter.textContent = counter[array[1]*10];

	let tr = array[array.length - 1]
			tr.appendChild(pity_counter);
			tr.appendChild(gacha_type_total_counter);
			tr.appendChild(total_counter);

    table_tbody.insertBefore(tr, table_tbody.children[0])

    if(array[0] == 'Legendary'){
		counter[array[1]] = 0;
	}
}


let select = document.createElement('select');
select.name = 'GachaTypeList';
select.classList.add('historyPage_gachaSelectedTitleText__USm_8');
select.style.cssText = `
	display: block;
	width: 100%;
	text-align: center;
	padding: 3px 0 3px 0;
	background-color: #a29382;
	border-readius: 6px;
`


let div = document.createElement('div')
for(const option_key of Object.keys(gacha_type)){
	
	let option = document.createElement('option');
	option.value = gacha_type[option_key];
	option.textContent = gacha_type[option_key];
	select.appendChild(option)
	gachaSelector.appendChild(select)
	
	select.addEventListener('change', filterByTypeGacha);
}


for(const checkbox_rarity of Object.keys(item_per_rarity)){
	let check_box_div = document.createElement('div');
	let checkbox_area = document.createElement('input');
	let label = document.createElement('label');
	checkbox_area.type = 'checkbox';
	checkbox_area.id = checkbox_rarity;
	checkbox_area.value = checkbox_rarity;
	
	label.htmlFor = checkbox_rarity;
	label.textContent = checkbox_rarity;
	
	check_box_div.appendChild(checkbox_area);
	check_box_div.appendChild(label);
	div.appendChild(check_box_div)
	checkbox_area.addEventListener("click", additionalFilter);
}

gachaSelector.appendChild(div)


function filterByTypeGacha(e) {
	let full_list = document.querySelectorAll('.historyPage_historyListBodyRow__BcGp_');
	filtered_array = []
	if(!e) {
		for(const e of full_list){
			e.style.display = null;
		}
		additionalFilter()
		return;
	}
	if(e.target.value == "All"){
		for(let i = full_list.length; i--; i >= 0){
			full_list[i].style.display = null;
		}
		additionalFilter()

		return;
	}

	for(const i of full_list){
		if(i.getAttribute('data-gacha_type') != e.target.value){
			i.style.display = 'none';
		}else{
			i.style.display = null;
			filtered_array.push(i)
		}
	}

	additionalFilter()

}

function additionalFilter(e) {
	if(!Object.is(e)){
		let elem = e
		if (elem.target.checked) {
		    	checkbox_selections.push(elem.target.id)
	  	} else {
	  		let i = checkbox_selections.indexOf(elem.target.id);
	    	checkbox_selections.splice(i, 1);
	    	if(checkbox_selections.length == 0){
	    		filterByTypeGacha()
	    	}
	  	}
	}

	if(checkbox_selections.length == 0) return

	let full_list = filtered_array.length > 0 ? filtered_array : document.querySelectorAll('.historyPage_historyListBodyRow__BcGp_');

	for(const item of full_list){
		let item_class_name = item.classList.value.split(' ')[1];
		if(checkbox_selections.indexOf(item_class_name) == -1){
			item.style.display = 'none';
		}else{
			item.style.display = null;
		}
	}
}