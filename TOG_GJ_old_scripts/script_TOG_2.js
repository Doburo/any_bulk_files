	let table  = document.getElementsByClassName('historyPage_historyList___iObH')[0];
	let table_tbody = document.getElementsByClassName('historyPage_historyListBody__WeZjB')[0];
	let gachaSelector = document.getElementsByClassName('historyPage_gachaSelectorWrapper__Rg3jT')[0];


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

	let table_row_data = ['itemType','itemName','gachaName','logTime'];

	let gachaType = [['0', 'All']];

	let checkbox_selections = []


	table_tbody.innerHTML = '';
	gachaSelector.innerHTML = '';

	

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


	let json_parsed = JSON.parse(document.getElementById('__NEXT_DATA__').outerText).props.pageProps;

	for(const data of json_parsed.histories){
		let tr = document.createElement('tr');
		tr.setAttribute("gachaType", data.gachaType)
		if(gachaType.indexOf(data.gachaType) == -1){
			gachaType.push([data.gachaType, data.gachaName])
			gachaType.sort()
		}
		tr.classList.add('historyPage_historyListBodyRow__BcGp_');

		for (const data_key of table_row_data){
			let content = data[data_key];
			var cell = document.createElement("td");
			cell.classList.add('historyPage_historyListBodyCol___et1p');
			if(data_key == 'itemType' &&  data[data_key] < 4000000){
				content = 'Ignition Weapon'
			}else if(data_key == 'itemType' &&  data[data_key] >= 4000000){
				content = 'Character'
			}			

			if(data_key == 'logTime'){
				date = new Date(data[data_key]).toLocaleString('en-GB');
				content = date;
			}

			if(data_key == 'itemName'){
				for (const data_key_rarity of Object.keys(rarity_per_name)) {
					if (rarity_per_name[data_key_rarity].filter(function(e) { return e === data[data_key]; }).length > 0) {
				        let colour = colours[data_key_rarity];
				        tr.style.backgroundColor = colour;
				        tr.classList.add(data_key_rarity);
				        item_per_rarity[data_key_rarity].push(tr)
					}
				}
			}

			
			cell.textContent = content;
    		tr.appendChild(cell);
		}

		table_tbody.appendChild(tr)
	}

let map_gacha_type = new Map(gachaType);
for(const [option_value, text_value] of map_gacha_type){
	let option = document.createElement('option');
	option.value = option_value;
	option.textContent = text_value;
	select.appendChild(option)
	option.addEventListener('click', filterByTypeGacha, false);
}
gachaSelector.appendChild(select)
gachaSelector.appendChild(div)





function filterByTypeGacha() {
	let list = document.querySelectorAll('[gachaType]');
	for(let i = list.length; i--; i >= 0){
		if(this.value == 0){
			list[i].style.display = null;
		}else if(list[i].getAttribute('gachaType') != this.value){
			list[i].style.display = 'none';
		}else {
			list[i].style.display = null;
		}
	}
}


function additionalFilter(e) {
	if (e.target.checked) {
	    checkbox_selections.push(e.target.value)
	  } 
	  else {
	  	console.log(checkbox_selections.indexOf(e.target.id))
	    delete checkbox_selections.indexOf(e.target.id);
	  }

	let list = document.querySelectorAll('.historyPage_historyListBodyRow__BcGp_');
	for(const key of Object.keys(checkbox_selections)){
		for(let i = list.length; i--; i >= 0){
			let item_class_names = list[i].classList.value.split(' ');

			if(item_class_names[1] == checkbox_selections[key].value){
				list[i].style.display = null;	
			}else{
				list[i].style.display = "none";
			}
		}
	}

}